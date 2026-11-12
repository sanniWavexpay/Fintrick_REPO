<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\DynamicMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Ramsey\Uuid\Type\Integer;

class AdminController extends Controller
{
    //
    public function login()
    {
        return view('authentication.sign-in');
    }
    public function register()
    {
        return view('authentication.sign-up');
    }
    public function forgetPassword()
    {
        return view('authentication.forget-password');
    }
    public function otpVerification()
    {
        return view('authentication.otp-verification');
    }
    public function resetPassword()
    {
        return view('authentication.reset-password');
    }

    public function index()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // =====================
        // STATS (BASED ON REAL STATUS IDs)
        // =====================
        // Payment Success IDs: 15 (Paid), 27 (Success), 33 (Success), 36 (Success), 52 (Paid)
        // Order Status IDs: 8/14/18/26/35/38/51 (Pending), 11/21/40 (Delivered), 12/22 (Cancelled), 13/17/23/29/53/56/60/61/62 (Returned/Refunded)

        $successPaymentIds = [15, 27, 33, 36, 52];
        $pendingOrderIds   = [8, 14, 18, 26, 35, 38, 51];
        $deliveredOrderIds = [11, 21, 40];
        $cancelledOrderIds = [12, 22];
        $returnedOrderIds  = [13, 17, 23, 29, 30, 53, 56, 60, 61, 62];

        $stats = [
            'total_revenue'    => (float) DB::table('payments')->whereIn('Status', $successPaymentIds)->sum('Amount'),
            'total_orders'     => DB::table('orders')->count(),
            'pending_orders'   => DB::table('orders')->whereIn('OrderStatus', $pendingOrderIds)->count(),
            'delivered_orders' => DB::table('orders')->whereIn('OrderStatus', $deliveredOrderIds)->count(),
            'cancelled_orders' => DB::table('orders')->whereIn('OrderStatus', $cancelledOrderIds)->count(),
            'returned_orders'  => DB::table('orders')->whereIn('OrderStatus', $returnedOrderIds)->count(),
            'total_customers'  => DB::table('users')->where('RoleID', 2)->count(),
        ];

        // =====================
        // REAL MONTHLY SALES
        // =====================
        $rawSales = DB::table('payments')
            ->whereIn('Status', $successPaymentIds)
            ->select(
                DB::raw('SUM(Amount) as total'),
                DB::raw("DATE_FORMAT(CreatedDtTm, '%b') as month")
            )
            ->groupBy('month')
            ->pluck('total', 'month');

        // =====================
        // LAST 6 MONTHS
        // =====================
        $monthlySales = collect(range(5, 0))->map(function ($i) use ($rawSales) {
            $month = Carbon::now()->subMonths($i)->format('M');

            return [
                'month' => $month,
                'total' => (float) ($rawSales[$month] ?? 0),
            ];
        });

        // =====================
        // PIE CHART STATS
        // =====================
        $orderStats = [
            'delivered' => $stats['delivered_orders'],
            'pending'   => $stats['pending_orders'],
            'cancelled' => $stats['cancelled_orders'],
            'returned'  => $stats['returned_orders'],
        ];

        return view('welcome', compact('stats', 'monthlySales', 'orderStats'));
    }
    public function customers(Request $request)
    {
        if (Auth::check()) {
            $query = DB::table('users')->where('RoleID', 2);

            // Filter by Search (Name, Email, Phone)
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('Name', 'LIKE', "%{$search}%")
                        ->orWhere('Email', 'LIKE', "%{$search}%")
                        ->orWhere('Phone', 'LIKE', "%{$search}%")
                        ->orWhere('Location', 'LIKE', "%{$search}%");
                });
            }

            // Filter by Status (Active/Inactive)
            if ($request->has('status') && is_numeric($request->status)) {
                $query->where('IsActive', $request->status);
            }

            // Filter by Date Range (Single Input Range)
            if ($request->has('date_range') && !empty($request->date_range)) {
                $dates = explode(' to ', $request->date_range);
                if (count($dates) == 2) {
                    $query->whereBetween(DB::raw('DATE(CreatedDtTm)'), [trim($dates[0]), trim($dates[1])]);
                } else {
                    $query->whereDate('CreatedDtTm', trim($dates[0]));
                }
            }

            // Execute query with pagination
            $customers = $query->orderBy('ID', 'desc')->paginate(15)->withQueryString();

            // Check if AJAX request
            if ($request->ajax()) {
                return view('partials.customer_table', compact('customers'))->render();
            }

            return view('customers', compact('customers'));
        } else {
            return redirect()->route('login')->with('error', 'Please login first.');
        }
    }
    public function customersStatus(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'id' => 'required',
            'is_active' => 'required|in:0,1'
        ]);

        $updated = DB::table('users') // check karein table name 'users' hai ya 'customers'
            ->where('ID', $request->id)
            ->update(['IsActive' => $request->is_active]);

        if ($updated) {
            return response()->json(['success' => true, 'message' => "Customer Status Changed"]);
        }

        return response()->json(['success' => false, 'message' => "Something is issue"], 400);
    }
    public function logout()
    {
        Auth::logout();
        return redirect()->route('login');
    }

    public function loginUser(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);
        $user = User::where('Email', $request->email)->first();
        if ($user && Hash::check($request->password, $user->Password)) {
            if ($user->RoleID != 1) {
                return response()->json(['error' => 'Unauthorized access'], 403);
            }
            Auth::login($user);
            $request->session()->regenerate();
            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'user' => $user,
                'redirect' => route('admin.dashboard'),
            ], 200);
        }
        return response()->json(['error' => 'Invalid credentials'], 401);
    }
    public function categories(Request $request)
    {
        $searchTerm = $request->get('search');
        $status = $request->get('status');

        $query = DB::table('categories')->where('ParentID', 0);

        // 1. Search Filter
        if (!empty($searchTerm)) {
            $query->where('CategoryName', 'LIKE', "%{$searchTerm}%");
        }

        // 2. Status Filter
        if ($status !== null && $status !== '') {
            $query->where('IsActive', $status);
        }

        $categories = $query->orderBy('ID', 'desc')->paginate(10)->withQueryString();

        if ($request->ajax()) {
            return view('partials.category_table', compact('categories'))->render();
        }

        return view('category', compact('categories'));
    }
    public function CategoryUpdateStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'status' => 'required|in:0,1'
        ]);
        $category = DB::table('categories')->where('ID', $request->id)->first();
        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Category not found'
            ]);
        }
        DB::table('categories')
            ->where('ID', $request->id)
            ->update(['IsActive' => $request->status]);

        return response()->json([
            'status' => true,
            'message' => 'Category status updated successfully'
        ]);
    }
    public function CategoryAdd(Request $request)
    {
        $request->validate([
            'categoryName' => 'required|string|max:255',
            'categoryImage' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        // if ($request->hasFile('categoryImage')) {
        //     $imagePath = $request->file('categoryImage')->store('category_images', 'public/assets/images');
        // }
        if ($request->hasFile('categoryImage')) {
            $file = $request->file('categoryImage');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('assets/images/category'), $fileName);
            $imagePath = 'assets/images/category/' . $fileName;
        }
        DB::table('categories')->insert([
            'CategoryName' => $request->categoryName,
            'CategoryImg' => $imagePath,
            'Slug' => Str::slug($request->categoryName),
            'IsActive' => 0,
            'CreatedAt' => now(),
            'UpdatedAt' => now(),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Category added successfully'
        ]);
    }
    public function CategoryUpdate(Request $request)
    {
        $request->validate([
            'categoryId' => 'required|integer',
            'categoryName' => 'required|string|max:255',
            'categoryImage' => 'nullable|image|max:2048',
        ]);
        $category = DB::table('categories')->where('ID', $request->categoryId)->first();
        if (!$category) {
            return response()->json(['status' => false, 'message' => 'Category not found']);
        }
        $imagePath = $category->CategoryImg;
        if ($request->hasFile('categoryImage')) {
            $file = $request->file('categoryImage');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('assets/images/category'), $fileName);
            $imagePath = 'assets/images/category/' . $fileName;
        }

        // 4. Update Query
        DB::table('categories')->where('ID', $request->categoryId)->update([
            'CategoryName' => $request->categoryName,
            'CategoryImg'  => $imagePath,
            'Slug' => Str::slug($request->categoryName),
            'UpdatedAt'    => now(),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Category updated successfully'
        ]);
    }
    public function SubCategory($id)
    {

        // Check if user is logged in
        if (!Auth::check()) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 401);
        }
        $CategoryName = DB::table('categories')->where('ID', $id)->value('CategoryName');
        $subcategories = DB::table('categories')->where('ParentID', $id)->get();
        return view('SubCategory', compact('subcategories', 'id', 'CategoryName'));
    }

    public function SubCategoryUpdateStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'status' => 'required|in:0,1'
        ]);
        $category = DB::table('categories')->where('ID', $request->id)->first();
        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Category not found'
            ]);
        }
        DB::table('categories')
            ->where('ID', $request->id)
            ->update(['IsActive' => $request->status]);

        return response()->json([
            'status' => true,
            'message' => 'Category status updated successfully'
        ]);
    }
    public function SubCategoryAdd(Request $request)
    {
        $request->validate([
            'categoryId' => 'required|integer',
            'subcategoryName' => 'required|string|max:255',
            'subcategoryImage' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;

        if ($request->hasFile('subcategoryImage')) {
            $file = $request->file('subcategoryImage');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('assets/images/subcategory'), $fileName);
            $imagePath = 'assets/images/subcategory/' . $fileName;
        }
        DB::table('categories')->insert([
            'CategoryName' => $request->subcategoryName,
            'CategoryImg' => $imagePath,
            'Slug' => Str::slug($request->subcategoryName),
            'ParentID' => $request->categoryId,
            'IsActive' => 0,
            'CreatedAt' => now(),
            'UpdatedAt' => now(),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Category added successfully'
        ]);
    }
    public function SubCategoryUpdate(Request $request)
    {
        $request->validate([
            'categoryId' => 'required|integer',
            'subcategoryId' => 'required|integer',
            'subcategoryName' => 'required|string|max:255',
            'subcategoryImage' => 'nullable|image|max:2048',
        ]);
        $subcategory = DB::table('categories')->where('ID', $request->subcategoryId)->first();
        if (!$subcategory) {
            return response()->json(['status' => false, 'message' => 'Category not found']);
        }
        $imagePath = $subcategory->CategoryImg;
        if ($request->hasFile('subcategoryImage')) {
            $file = $request->file('subcategoryImage');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('assets/images/subcategory'), $fileName);
            $imagePath = 'assets/images/subcategory/' . $fileName;
        }

        // 4. Update Query
        DB::table('categories')->where('ID', $request->subcategoryId)->update([
            'CategoryName' => $request->subcategoryName,
            'CategoryImg'  => $imagePath,
            'Slug' => Str::slug($request->subcategoryName),
            'UpdatedAt'    => now(),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Category updated successfully'
        ]);
    }

    public function products(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 401);
        }

        $searchTerm = $request->input('search');

        // 🔒 Allowed sortable columns (frontend se jo aa sakta hai)
        $allowedSorts = [
            'ID' => 'product.ID',
            'Title' => 'product.Title',
            'HSN' => 'product.HSN',
            'CategoryID' => 'cat.CategoryName',
            'SubCategoryID' => 'subcat.CategoryName',
            'created_at' => 'product.CreatedDtTm',
            'Status' => 'product.Status'
        ];

        $sortBy = $request->input('sort_by', 'ID');
        $sortOrder = $request->input('sort_order', 'desc');

        // Safety check
        if (!array_key_exists($sortBy, $allowedSorts)) {
            $sortBy = 'ID';
        }

        if (!in_array(strtolower($sortOrder), ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }

        $productList = DB::table('product')
            ->leftJoin('product_thumbnail', 'product.ID', '=', 'product_thumbnail.PID')
            ->leftJoin('categories as cat', 'product.CategoryID', '=', 'cat.ID')
            ->leftJoin('categories as subcat', 'product.SubcategoryID', '=', 'subcat.ID')
            ->leftJoin('product_variants as pv', function ($join) {
                $join->on('product.ID', '=', 'pv.PID')
                    ->whereRaw('pv.ID = (select min(ID) from product_variants where PID = product.ID)');
            })
            ->select(
                'product.*',
                'product_thumbnail.Url as thumbnail_url',
                'cat.CategoryName as category_name',
                'subcat.CategoryName as subcategory_name',
                'pv.Price',
                'pv.SellPrice',
                'pv.Discount'
            )
            ->when($searchTerm, function ($query, $searchTerm) {
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('product.Title', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('product.HSN', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('cat.CategoryName', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('subcat.CategoryName', 'LIKE', "%{$searchTerm}%");
                });
            })
            // ✅ Dynamic sorting
            ->orderBy($allowedSorts[$sortBy], $sortOrder)
            ->paginate(10)
            ->withQueryString();

        $categories = DB::table('categories')->where('ParentID', 0)->get();
        $subCategories = DB::table('categories')->where('ParentID', '>', 0)->get();

        return view('product', compact('productList', 'categories', 'subCategories', 'searchTerm'));
    }

    // public function productStore(Request $request)
    // {
    //     // dd($request->all());
    //     $request->validate([
    //         'title' => 'required|string',
    //         'category_id' => 'required|integer',
    //         'Subcategory_id' => 'required|integer',
    //         'hsn_code' => 'required|integer',
    //         'gst' => 'required|integer',
    //         'shipping_charges' => 'required|integer',
    //         'short_description' => 'required|string',
    //         'long_description' => 'required|string',
    //         'main_image' => 'nullable|image|max:2048',
    //         'has_variant' => 'required|string',

    //     ]);

    //     if (!Auth::check()) {
    //         return response()->json(['status' => false, 'message' => 'Unauthorized'], 401);
    //     }

    //     DB::beginTransaction();

    //     try {
    //         // 1️⃣ Image upload
    //         $imagePath = null;
    //         if ($request->hasFile('main_image')) {
    //             $file = $request->file('main_image');
    //             $fileName = time() . '_' . $file->getClientOriginalName();
    //             $file->move(public_path('assets/images/product'), $fileName);
    //             $imagePath = 'assets/images/product/' . $fileName;
    //         }


    //         $productId = DB::table('product')->insertGetId([
    //             'ProductType' => $request->has_variant,
    //             'Title' => $request->title,
    //             'Slug' => Str::slug($request->title),
    //             'CategoryID' => $request->category_id,
    //             'SubcategoryID' => $request->Subcategory_id,
    //             'HSN' => $request->hsn_code,
    //             'GST' => $request->gst,
    //             'ShippingCharges' => $request->shipping_charges,
    //             'ShortDesc' => $request->short_description,
    //             'LongDesc' => $request->long_description,
    //             'CreatedDtTm' => now(),
    //             'ModifiedDtTm' => now(),
    //         ]);
    //         DB::table('product_thumbnail')->insert([
    //             'PID' => $productId,
    //             'Url' => $imagePath
    //         ]);
    //         if ($request->has_variant == 3) {
    //             $prefix = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $request->title), 0, 3));
    //             $pID = $request->PID;
    //             $random = strtoupper(substr(md5(uniqid()), 0, 4));
    //             $sku = "{$prefix}-" . date('y') . "-P{$pID}-{$random}";

    //             DB::table('product_variants')->insert([
    //                 'PID' => $productId,
    //                 'SKU' => $sku, // SKU Field
    //                 'Price' => $request->mrp,
    //                 'Discount' => $request->discount,
    //                 'SellPrice' => $request->sellingPrice,
    //                 'CreatedDtTm' => now(),
    //                 'ModifiedDtTm' => now(),
    //             ]);
    //         }

    //         DB::commit();

    //         return response()->json([
    //             'status' => true,
    //             'message' => 'Product added successfully'
    //         ]);
    //     } catch (\Exception $e) {
    //         DB::rollBack();

    //         return response()->json([
    //             'status' => false,
    //             'message' => $e->getMessage()
    //         ], 500);
    //     }
    // }
    public function productStore(Request $request)
    {
        $productId = $request->productId; // Hidden ID field

        $request->validate([
            'title'             => 'required|string|max:255',
            'category_id'       => 'required|integer',
            'Subcategory_id'    => 'required|integer',
            'hsn_code'          => 'required|string',
            'gst'               => 'required|numeric',
            'shipping_charges'  => 'required|numeric',
            'short_description' => 'required|string',
            'long_description'  => 'required|string',
            'has_variant'       => 'required|integer',

            // Agar naya product hai toh image required, edit hai toh optional (avif, webp, png, jpg, jpeg supported)
            'main_image'        => $productId ? 'nullable|mimes:jpeg,jpg,png,gif,webp,avif,svg|max:5120' : 'required|mimes:jpeg,jpg,png,gif,webp,avif,svg|max:5120',

            // Agar 3 (Base Product) hai to MRP required hai
            'mrp' => $request->has_variant == 3 ? 'required|numeric' : 'nullable',
            'discount' => $request->has_variant == 3 ? 'required|numeric' : 'nullable',
            'sellingPrice' => $request->has_variant == 3 ? 'required|numeric' : 'nullable',
        ]);

        DB::beginTransaction();
        try {
            // --- 1. Image Handling ---
            $imagePath = null;
            if ($request->hasFile('main_image')) {
                $file = $request->file('main_image');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('assets/images/product'), $fileName);
                $imagePath = 'assets/images/product/' . $fileName;
            }

            // --- 2. Common Data ---
            $productData = [
                'ProductType'    => $request->has_variant,
                'Title'          => $request->title,
                'Slug'           => Str::slug($request->title),
                'CategoryID'     => $request->category_id,
                'SubcategoryID'  => $request->Subcategory_id,
                'HSN'            => $request->hsn_code,
                'GST'            => $request->gst,
                'ShippingCharges' => $request->shipping_charges,
                'ShortDesc'      => $request->short_description,
                'LongDesc'       => $request->long_description,
                'ModifiedDtTm'   => now(),
            ];

            if ($productId) {
                // --- UPDATE LOGIC ---
                DB::table('product')->where('ID', $productId)->update($productData);

                // Thumbnail update agar nayi image aayi hai
                if ($imagePath) {
                    DB::table('product_thumbnail')->where('PID', $productId)->update(['Url' => $imagePath]);
                }
                $message = "Product updated successfully";
            } else {
                // --- INSERT LOGIC ---
                $productData['CreatedDtTm'] = now();
                $productId = DB::table('product')->insertGetId($productData);

                DB::table('product_thumbnail')->insert([
                    'PID' => $productId,
                    'Url' => $imagePath
                ]);
                $message = "Product added successfully";
            }

            // Logic for Variants Table
            if ($request->has_variant == 3) {
                // Ye Base Product hai, toh iski entry variants table mein single row banegi
                DB::table('product_variants')->updateOrInsert(
                    ['PID' => $productId],
                    [
                        'SKU' => $this->generateSKU($request->title, $productId),
                        'Price' => (int)round($request->mrp),
                        'Discount' => (int)round($request->discount),
                        'SellPrice' => (int)round($request->sellingPrice),
                        'CreatedDtTm' => now(),
                        'ModifiedDtTm' => now(),
                    ]
                );
            }

            DB::commit();
            return response()->json(['status' => true, 'message' => $message]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // Helper function to keep code clean
    private function generateSKU($title, $id)
    {
        $prefix = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $title), 0, 3));
        return "{$prefix}-" . date('y') . "-P{$id}-" . strtoupper(substr(md5(uniqid()), 0, 4));
    }
    public function productUpdateStatus(Request $request)
    {
        $column = $request->column;
        $id = $request->id;
        $value = $request->value;

        $allowedColumns = ['DealOnOff', 'Trending', 'MostBuyed', 'NewArrivals', 'IsActive'];

        if (in_array($column, $allowedColumns)) {
            DB::table('product')->where('ID', $id)->update([$column => $value]);
            return response()->json([
                'status' => true, // Yahan 'status' rakho kyunki JS mein status check hai
                'message' => 'Status updated successfully!'
            ]);
        }

        return response()->json([
            'status' => false,
            'message' => 'Invalid column or unauthorized action.'
        ], 400);
    }
    public function showVariants($id)
    {
        if (!Auth::check()) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 401);
        }

        $product = DB::table('product')->where('ID', $id)->first();
        if (!$product) {
            return redirect()->back()->with('error', 'Product not found');
        }

        // Main Query: Join sirf details ke liye, attributes ke liye nahi
        $variants = DB::table('product_variants as pv')
            ->where('pv.PID', $id)
            ->leftJoin('product as p', 'p.ID', '=', 'pv.PID')
            ->leftJoin('product_thumbnail as pt', 'p.ID', '=', 'pt.PID')
            ->leftJoin('short_code as sc', 'p.ProductType', '=', 'sc.ID')
            ->leftJoin('inventory as iv', 'pv.ID', '=', 'iv.PVID')
            ->select(
                'pv.*',
                'p.Title as product_name',
                'p.GST as GST',
                'pt.Url as thumbnail_url',
                'sc.Value as product_type',
                'iv.TotalQty',
                'iv.SoldQty',
                'iv.AvailableQty',
                'iv.AlertThreshold',
                'iv.isActive as inventoryStatus'
            )
            ->get();

        // Loop: Har variant ke liye attributes attach karein
        foreach ($variants as $v) {
            $v->all_attributes = DB::table('variant_attribute_table as vat')
                ->join('attribute as a', 'vat.AID', '=', 'a.ID')
                ->join('attribute_value as av', 'vat.AVID', '=', 'av.ID')
                ->where('vat.VPID', $v->ID)
                ->select('a.ID as attr_ID', 'av.ID as attr_value_ID')
                ->get();
        }

        $attributes = DB::table('attribute')->get();
        foreach ($attributes as $attr) {
            $attr->values = DB::table('attribute_value')
                ->where('attributeID', $attr->ID)
                ->get();
        }
        // dd($variants);
        return view('variants', compact('product', 'variants', 'attributes'));
    }
    public function variantStore(Request $request)
    {
        $request->validate([
            'PID' => 'required',
            'attributes' => 'required|array',
            'Price' => 'required|numeric',
            'SellPrice' => 'required|numeric',
            'variant_id' => 'nullable'
        ]);

        DB::beginTransaction();

        try {
            $v_id = $request->input('variant_id');
            $attributes_input = $request->get('attributes');

            // --- BULK CREATE HANDLING (When 'all' size is selected) ---
            $hasAll = false;
            $allAttributeId = null;
            if (is_array($attributes_input)) {
                foreach ($attributes_input as $aid => $avid) {
                    if ($avid === 'all') {
                        $hasAll = true;
                        $allAttributeId = $aid;
                        break;
                    }
                }
            }

            if ($hasAll && !$v_id) {
                // Fetch all values for this attribute (e.g. Size values: XS, S, M, L, XL, XXL, 3XL)
                $allValues = DB::table('attribute_value')
                    ->where('attributeID', $allAttributeId)
                    ->whereNotIn('Value', ['ALL', 'All', 'All Sizes', 'all'])
                    ->get();

                $createdCount = 0;
                foreach ($allValues as $valObj) {
                    $currentAttrs = $attributes_input;
                    $currentAttrs[$allAttributeId] = $valObj->ID;

                    $attributeParts = array();
                    foreach ($currentAttrs as $aid => $avid) {
                        $attrName = DB::table('attribute')->where('ID', $aid)->value('Name');
                        $valName = DB::table('attribute_value')->where('ID', $avid)->value('Value');
                        if ($attrName && $valName) {
                            $attributeParts[] = $attrName . ": " . $valName;
                        }
                    }
                    $readableAttribute = implode(' | ', $attributeParts);

                    // Skip if exact variant already exists for this PID
                    $exists = DB::table('product_variants')
                        ->where('PID', $request->PID)
                        ->where('Attribute', $readableAttribute)
                        ->exists();

                    if ($exists) {
                        continue;
                    }

                    $prefix = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $request->ProductTitle), 0, 3));
                    $random = strtoupper(substr(md5(uniqid() . $valObj->ID), 0, 4));

                    $data = [
                        'PID'          => $request->PID,
                        'SKU'          => "{$prefix}" . date('y') . "P{$request->PID}{$random}",
                        'Price'        => (int)round($request->Price),
                        'Discount'     => (int)round($request->Discount ?? 0),
                        'SellPrice'    => (int)round($request->SellPrice),
                        'Attribute'    => $readableAttribute,
                        'CreatedDtTm'  => now(),
                        'ModifiedDtTm' => now(),
                    ];

                    $vpid = DB::table('product_variants')->insertGetId($data);

                    foreach ($currentAttrs as $aid => $avid) {
                        if (!empty($avid)) {
                            DB::table('variant_attribute_table')->insert([
                                'VPID' => $vpid,
                                'AID'  => $aid,
                                'AVID' => $avid
                            ]);
                        }
                    }
                    $createdCount++;
                }

                DB::commit();
                return response()->json([
                    'status' => true,
                    'message' => "Successfully generated {$createdCount} size variants in 1-click!"
                ]);
            }

            // Readable attributes string banana
            $attributeParts = array();
            if (is_array($attributes_input)) {
                foreach ($attributes_input as $aid => $avid) {
                    $attrName = DB::table('attribute')->where('ID', $aid)->value('Name');
                    $valName = DB::table('attribute_value')->where('ID', $avid)->value('Value');
                    if ($attrName && $valName) {
                        $attributeParts[] = $attrName . ": " . $valName;
                    }
                }
            }
            $readableAttribute = implode(' | ', $attributeParts);

            // Common Data for both Insert & Update
            $data = [
                'Price'     => (int)round($request->Price),
                'Discount'  => (int)round($request->Discount ?? 0),
                'SellPrice' => (int)round($request->SellPrice),
                'Attribute' => $readableAttribute,
                'ModifiedDtTm' => now(),
            ];

            if ($v_id) {
                // --- UPDATE CASE ---
                DB::table('product_variants')->where('ID', $v_id)->update($data);
                $vpid = $v_id;

                // Purane mapping records delete karein taaki naye sync ho sakein
                DB::table('variant_attribute_table')->where('VPID', $vpid)->delete();
                $msg = 'Variant updated successfully!';
            } else {
                // --- INSERT CASE ---
                $prefix = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $request->ProductTitle), 0, 3));
                $random = strtoupper(substr(md5(uniqid()), 0, 4));

                $data['PID'] = $request->PID;
                $data['SKU'] = "{$prefix}" . date('y') . "P{$request->PID}{$random}";
                $data['CreatedDtTm'] = now();

                $vpid = DB::table('product_variants')->insertGetId($data);
                $msg = 'Variant added successfully! SKU: ' . $data['SKU'];
            }

            // 4. Mapping Table Update (Dono cases ke liye)
            $formAttributes = $request->input('attributes');
            foreach ($formAttributes as $aid => $avid) {
                if (!empty($avid)) {
                    DB::table('variant_attribute_table')->insert([
                        'VPID' => $vpid,
                        'AID'  => $aid,
                        'AVID' => $avid
                    ]);
                }
            }

            DB::commit();
            return response()->json(['status' => true, 'message' => $msg]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
    public function VariantUploadImage(Request $request)
    {

        $request->validate([
            'variant_id' => 'required|integer',
            'image' => 'required|array',
            'image.*' => 'mimes:jpg,jpeg,png,webp,avif,svg|max:5120'
        ]);
        try {


            foreach ($request->file('image') as $file) {
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('assets/images/varriant'), $fileName);
                $imagePath = 'assets/images/varriant/' . $fileName;


                DB::table('product_variants_image')->insert([
                    'VPID' => $request->variant_id,
                    'Url'  => $imagePath
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Images uploaded successfully'
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'status' => false,
                'message' => 'Something went wrong'
            ], 500);
        }
    }
    public function deleteInventoryImg($id)
    {
        $image = DB::table('product_variants_image')
            ->where('id', $id)
            ->first();

        if (!$image) {
            return response()->json([
                'status' => false,
                'message' => 'Image not found'
            ], 404);
        }
        if (!empty($image->url)) {
            $imagePath = public_path($image->url);
            if (File::exists($imagePath)) {
                File::delete($imagePath);
            }
        }
        DB::table('product_variants_image')
            ->where('id', $id)
            ->delete();
        return response()->json([
            'status' => true,
            'message' => 'Variant image deleted successfully'
        ]);
    }
    public function VariantGetImage($id)
    {
        $images = DB::table('product_variants_image')->where('VPID', $id)->get();

        $formattedImages = $images->map(function ($img) {
            return [
                'id' => $img->ID,
                'url' => $img->Url // Agar path 'assets/images/variants/...' hai
            ];
        });

        return response()->json($formattedImages);
    }
    public function VariantToggleStatus(Request $request)
    {
        try {
            $id = $request->id;
            $status = $request->status;
            // 1. Variant ka status update karein
            DB::table('product_variants')->where('ID', $id)->update([
                'IsActive' => $status,
                'ModifiedDtTm' => now()
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Status changed successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }
    public function inventoryUpdate(Request $request)
    {
        $request->validate([
            'PID' => 'required',
            'variant_id' => 'required',
            'add_stock' => 'nullable|numeric|min:0',
            'low_stock_threshold' => 'required|numeric',
            'status' => 'required'
        ]);

        try {
            $pvid = $request->variant_id;
            $newStock = (int)$request->add_stock;

            $inventory = DB::table('inventory')->where('PVID', $pvid)->first();

            if ($inventory) {
                $finalTotal = $inventory->TotalQty + $newStock;
                $finalAvailable = $finalTotal - $inventory->SoldQty;

                DB::table('inventory')->where('PVID', $pvid)->update([
                    'PID'            => $request->PID,
                    'TotalQty'       => $finalTotal,
                    'AvailableQty'   => $finalAvailable,
                    'AlertThreshold' => $request->low_stock_threshold,
                    'IsActive'         => $request->status,
                    'updated_at'     => now()
                ]);
            } else {
                DB::table('inventory')->insert([
                    'PID'            => $request->PID,
                    'PVID'           => $pvid,
                    'TotalQty'       => $newStock,
                    'SoldQty'        => 0,
                    'AvailableQty'   => $newStock,
                    'AlertThreshold' => $request->low_stock_threshold,
                    'created_at'     => now(),
                    'updated_at'     => now()
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Inventory updated successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }
    public function getProductReviews($id)
    {
        if (!Auth::check()) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 401);
        }

        $product = DB::table('product')->where('ID', $id)->first();

        if (!$product) {
            return redirect()->back()->with('error', 'Product not found!');
        }

        $reviews = DB::table('product_reviews as pr')
            ->leftJoin('product as p', 'pr.PID', '=', 'p.ID')
            ->leftJoin('product_thumbnail as pt', 'pr.PID', '=', 'pt.PID')
            ->select('pr.*', 'p.Title as ProductTitle', 'pt.Url as ProductImage')
            ->where('pr.PID', $id)
            ->orderBy('pr.CreatedDtTm', 'desc')
            ->get();
        return view('productReviews', compact('product', 'reviews'));
    }
    public function storeProductReviews(Request $request)
    {
        // 1. Basic Validation
        $request->validate([
            'review_id'      => 'nullable|numeric',
            'PID'            => 'required|numeric',
            'UserName'       => 'required|string',
            'Rating'         => 'required|integer|min:1|max:5',
            'ReviewText'     => 'required|string',
            'Status'         => 'required|numeric',
            'deleted_media'  => 'nullable|string',
            'review_media'   => 'nullable|array',
            'review_media.*' => 'nullable|mimes:jpg,jpeg,png,webp,mp4,mov,avi|max:20480',
        ]);

        DB::beginTransaction();

        try {
            $reviewID = $request->review_id;

            // --- A. MEDIA LIMIT VALIDATION (SERVER SIDE) ---
            $existingPhotos = 0;
            $existingVideos = 0;
            $deletedIds = $request->deleted_media ? explode(',', $request->deleted_media) : [];

            if ($reviewID) {
                // Purani media count karo jo delete NAHI ho rahi hain
                $currentMedia = DB::table('product_review_media')
                    ->where('RID', $reviewID)
                    ->whereNotIn('ID', $deletedIds)
                    ->get();

                $existingPhotos = $currentMedia->where('MediaType', 1)->count();
                $existingVideos = $currentMedia->where('MediaType', 2)->count();
            }

            // Nayi media ka count
            $newPhotos = 0;
            $newVideos = 0;
            if ($request->hasFile('review_media')) {
                foreach ($request->file('review_media') as $file) {
                    if (str_contains($file->getMimeType(), 'video')) {
                        $newVideos++;
                    } else {
                        $newPhotos++;
                    }
                }
            }

            // Total check
            if (($existingPhotos + $newPhotos) > 4) {
                return response()->json(['status' => false, 'message' => 'Total limit exceeded: Max 4 photos allowed!'], 422);
            }
            if (($existingVideos + $newVideos) > 1) {
                return response()->json(['status' => false, 'message' => 'Total limit exceeded: Max 1 video allowed!'], 422);
            }

            // --- B. DATA INSERT YA UPDATE ---
            $data = [
                'PID'          => $request->PID,
                'Name'         => $request->UserName,
                'Rating'       => $request->Rating,
                'ReviewText'   => $request->ReviewText,
                'IsActive'     => $request->Status,
                'ModifiedDtTm' => now(),
            ];

            if ($reviewID) {
                DB::table('product_reviews')->where('ID', $reviewID)->update($data);
            } else {
                $data['CreatedDtTm'] = now();
                $reviewID = DB::table('product_reviews')->insertGetId($data);
            }

            // --- C. DELETE REMOVED MEDIA ---
            if (!empty($deletedIds)) {
                $mediaToDelete = DB::table('product_review_media')->whereIn('ID', $deletedIds)->get();
                foreach ($mediaToDelete as $media) {
                    if (file_exists(public_path($media->MediaUrl))) {
                        unlink(public_path($media->MediaUrl));
                    }
                    DB::table('product_review_media')->where('ID', $media->ID)->delete();
                }
            }

            // --- D. HANDLE NEW MEDIA UPLOADS ---
            if ($request->hasFile('review_media')) {
                $destinationPath = public_path('assets/images/reviews');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }

                foreach ($request->file('review_media') as $file) {
                    $mimeType  = $file->getMimeType();
                    $mediaType = str_contains($mimeType, 'video') ? 2 : 1;
                    $fileName  = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

                    $file->move($destinationPath, $fileName);
                    $filePath = 'assets/images/reviews/' . $fileName;

                    DB::table('product_review_media')->insert([
                        'RID'       => $reviewID,
                        'MediaUrl'  => $filePath,
                        'MediaType' => $mediaType,
                    ]);
                }
            }

            DB::commit();
            return response()->json([
                'status'  => true,
                'message' => $request->review_id ? 'Review updated successfully!' : 'Review added successfully!'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }
    public function productReviewToggleStatus(Request $request)
    {
        try {
            $id = $request->id;
            $status = $request->status;
            // 1. Variant ka status update karein
            DB::table('product_reviews')->where('ID', $id)->update([
                'IsActive' => $status,
                'ModifiedDtTm' => now()
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Status changed successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }

    public function productOfferList()
    {

        if (!Auth::check()) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 401);
        }
        $offers =  DB::table("offers")->get();
        return view('offers', compact('offers'));
    }

    public function productOfferSave(Request $request)
    {
        // Validation
        $request->validate([
            'title' => 'required|string|max:255',
            'level' => 'required|in:PRODUCT,VARIANT,CATEGORY,CART', // Direct String Check
            'discount_type' => 'required|in:PERCENT,FLAT',
            'discount_value' => 'required|numeric',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after:start_at',
        ]);

        try {
            $id = $request->offerId;

            $data = [
                'title'          => $request->title,
                'level'          => $request->level,
                'discount_type'  => $request->discount_type,
                'discount_value' => (int)round($request->discount_value),
                'priority'       => $request->priority ?? 1,
                'max_discount' => (int)round($request->max_discount_amount),    // Nullable if no limit
                'start_at'       => $request->start_at,
                'end_at'         => $request->end_at,
                'is_active'      => 1,
                'updated_at'     => now(),
            ];

            if ($id) {
                // Update Logic
                DB::table('offers')->where('id', $id)->update($data);
                $msg = "Offer updated successfully!";
            } else {
                // Insert Logic
                $data['created_at'] = now();
                DB::table('offers')->insert($data);
                $msg = "Offer created successfully!";
            }

            return response()->json(['status' => true, 'message' => $msg]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
    public function productOfferUpdateStatus(Request $request)
    {
        try {
            $column = $request->column;
            $id = $request->id;
            $value = $request->value;

            $allowedColumns = ['is_stackable', 'is_active'];

            if (in_array($column, $allowedColumns)) {
                DB::table('offers')->where('id', $id)->update([$column => $value]);

                return response()->json([
                    'status' => true,
                    'message' => 'Status updated successfully!'
                ]);
            }

            // Agar allowedColumns mein nahi hai toh error bhejien
            return response()->json([
                'status' => false,
                'message' => 'Invalid column: ' . $column
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }
    public function assignOffersList()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // 1. Offers for dropdown
        $offers = DB::table('offers')->get();

        // 2. Product Assignments
        $productOffers = DB::table('offer_products')
            ->join('product', 'offer_products.product_id', '=', 'product.ID')
            ->join('offers', 'offer_products.offer_id', '=', 'offers.id')
            ->select(
                'offer_products.id',
                'offers.title as offer_name',
                'offers.discount_type',
                'offers.discount_value',
                'offers.max_discount',
                'product.Title as entity_name',
                DB::raw("'PRODUCT' as type"),
                'offer_products.created_at'
            );

        // 3. Category Assignments
        $categoryOffers = DB::table('offer_categories')
            ->join('categories', 'offer_categories.category_id', '=', 'categories.ID')
            ->join('offers', 'offer_categories.offer_id', '=', 'offers.id')
            ->select(
                'offer_categories.id',
                'offers.title as offer_name',
                'offers.discount_type',
                'offers.discount_value',
                'offers.max_discount',
                'categories.CategoryName as entity_name',
                DB::raw("'CATEGORY' as type"),
                'offer_categories.created_at'
            );

        // 4. Variant Assignments ❗ NO get() here
        $variantOffers = DB::table('offer_variants')
            ->join('product_variants', 'offer_variants.variant_id', '=', 'product_variants.ID')
            ->join('product', 'product_variants.PID', '=', 'product.ID')
            ->join('offers', 'offer_variants.offer_id', '=', 'offers.id')
            ->select(
                'offer_variants.id',
                'offers.title as offer_name',
                'offers.discount_type',
                'offers.discount_value',
                'offers.max_discount',
                DB::raw("CONCAT(product.Title, ' (', product_variants.Attribute, ')') as entity_name"),
                DB::raw("'VARIANT' as type"),
                'offer_variants.created_at'
            );

        // ✅ FINAL UNION (single get)
        $assignments = $productOffers
            ->unionAll($categoryOffers)
            ->unionAll($variantOffers)
            ->orderBy('created_at', 'desc')
            ->get();

        // dd($assignments);

        return view('assignOffer', compact('offers', 'assignments'));
    }

    public function offersearchItem(Request $request)
    {
        $search = $request->q;
        $level  = $request->level;
        $results = [];

        if ($level == 'PRODUCT') {

            $results = DB::table('product')
                ->leftJoin('product_thumbnail', function ($join) {
                    $join->on('product.ID', '=', 'product_thumbnail.PID')
                        ->where('product_thumbnail.IsActive', 1);
                })
                ->where('product.Title', 'LIKE', "%$search%")
                ->where('product.IsActive', 1)
                ->select(
                    'product.ID',
                    'product.Title',
                    'product_thumbnail.Url as image_url'
                )
                ->limit(15)
                ->get()
                ->map(function ($p) {
                    return [
                        'id'    => $p->ID,
                        'text'  => $p->Title,
                        'image' => $p->image_url
                            ? asset($p->image_url)
                            : asset('assets/images/placeholder.png'),
                        'extra' => 'Product'
                    ];
                });
        } elseif ($level == 'CATEGORY') {
            $results = DB::table('categories')
                ->where('CategoryName', 'LIKE', "%$search%")
                ->where('IsActive', 1)
                ->select('ID', 'CategoryName', 'CategoryImg', 'ParentID')
                ->limit(15)
                ->get()
                ->map(function ($c) {

                    $typeLabel = ($c->ParentID == 0)
                        ? 'Main Category'
                        : 'Subcategory';

                    return [
                        'id'    => $c->ID,
                        'text'  => $c->CategoryName,
                        'image' => $c->CategoryImg
                            ? asset($c->CategoryImg)
                            : asset('assets/images/cat-icon.png'),
                        'extra' => $typeLabel
                    ];
                });
        } elseif ($level == 'VARIANT') {

            $results = DB::table('product_variants')
                ->join('product', 'product_variants.PID', '=', 'product.ID')
                ->leftJoin('product_thumbnail', function ($join) {
                    $join->on('product.ID', '=', 'product_thumbnail.PID')
                        ->where('product_thumbnail.IsActive', 1);
                })
                ->where('product_variants.IsActive', 1)
                ->where(function ($q) use ($search) {
                    $q->where('product.Title', 'LIKE', "%$search%")
                        ->orWhere('product_variants.Attribute', 'LIKE', "%$search%");
                })
                ->select(
                    'product_variants.ID',
                    'product.Title as product_name',
                    'product_variants.Attribute',
                    'product_thumbnail.Url as image_url'
                )
                ->limit(15)
                ->get()
                ->map(function ($v) {
                    return [
                        'id'    => $v->ID,
                        'text'  => $v->product_name . ' (' . $v->Attribute . ')',
                        'image' => $v->image_url
                            ? asset($v->image_url)
                            : asset('assets/images/placeholder.png'),
                        'extra' => 'Variant'
                    ];
                });
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Searching failed'
            ]);
        }
        // dd($results);
        return response()->json($results);
    }


    public function offerAssignSave(Request $request)
    {
        $level = $request->assign_level;
        $offerId = $request->offer_id;
        $refId = $request->ref_id;

        // 1. Table decide karo level ke hisaab se
        $tableName = '';
        $columnName = '';

        if ($level == 'PRODUCT') {
            $tableName = 'offer_products';
            $columnName = 'product_id';
        } elseif ($level == 'CATEGORY') {
            $tableName = 'offer_categories';
            $columnName = 'category_id';
        } elseif ($level == 'VARIANT') {
            $tableName = 'offer_variants';
            $columnName = 'variant_id';
        }

        // 2. Pehle check karo ki kya ye assignment already exists hai?
        $exists = DB::table($tableName)
            ->where('offer_id', $offerId)
            ->where($columnName, $refId)
            ->exists();

        if ($exists) {
            // Agar pehle se hai toh error bhej do
            return response()->json([
                'status' => false,
                'message' => 'Bhai, ye offer is item par pehle se assigned hai!'
            ]);
        }

        // 3. Agar naya hai toh insert karo
        DB::table($tableName)->insert([
            'offer_id'   => $offerId,
            $columnName  => $refId,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['status' => true, 'message' => 'Offer Assigned Successfully!']);
    }
    // 3. Remove Assignment Logic
    public function offerAssignRemove(Request $request)
    {
        $id = $request->id;
        $type = $request->type;

        switch ($type) {

            case 'PRODUCT':
                DB::table('offer_products')->where('id', $id)->delete();
                break;

            case 'CATEGORY':
                DB::table('offer_categories')->where('id', $id)->delete();
                break;

            case 'VARIANT':
                DB::table('offer_variants')->where('id', $id)->delete();
                break;

            default:
                return response()->json([
                    'status' => false,
                    'message' => 'Invalid assignment type'
                ]);
        }

        return response()->json([
            'status' => true
        ]);
    }
    public function attributesView()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }
        $attributes = DB::table("attribute")->get();
        return view('attribute', compact('attributes'));
    }
    public function attributesValue($id)
    {
        $attribute_value = DB::table('attribute_value')->where('attributeID', $id)->get();

        if (!$attribute_value) {
            return redirect()->back()->with('error', 'Attribute not found');
        }
        return view('attributeValue', compact('attribute_value'));
    }
    public function attributesSave(Request $request)
    {
        // 1. Validation
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        if ($request->attrId) {
            DB::table('attribute')
                ->where('id', $request->attrId)
                ->update([
                    'Name' => $request->name,
                ]);
            $message = 'Attribute updated successfully!';
        } else {
            DB::table('attribute')->insert([
                'Name' => $request->name,
            ]);
            $message = 'Attribute created successfully!';
        }
        return response()->json([
            'success' => true,
            'message' => $message
        ]);
    }
    public function attributesValueSave(Request $request)
    {
        // 1. Validation: valueID ko nullable rakhein kyunki naye record mein ye nahi hoti
        $request->validate([
            'valueID' => 'nullable|integer',
            'attrId'  => 'required|integer', // Ye Parent Attribute ID hai (Color/Size ki ID)
            'value'   => 'required|string|max:255',
        ]);

        // Agar valueID hai, matlab hum existing row update kar rahe hain
        if ($request->valueID) {
            DB::table('attribute_value')
                ->where('ID', $request->valueID)
                ->update([
                    'Value' => $request->value,
                ]);
            $message = 'Value updated successfully!';
        } else {
            // Create Case: Naya insert
            DB::table('attribute_value')->insert([
                'attributeID' => $request->attrId, // Yahan Parent ID jayegi
                'Value'       => $request->value,
            ]);
            $message = 'Value created successfully!';
        }

        return response()->json(['success' => true, 'message' => $message]);
    }

    public function orderView(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $searchTerm = $request->get('search');
        $status = $request->get('status');
        $dateRange = $request->get('date_range');
        $sortBy = $request->get('sort_by', 'ID');
        $sortOrder = $request->get('sort_order', 'desc');

        // 1. Base Query with corrected joins
        $query = DB::table('orders as o')
            ->leftJoin('order_payment as op', 'o.ID', '=', 'op.OID')
            ->leftJoin('users as u', 'u.ID', '=', 'o.UID')
            ->leftJoin('short_code as sc_status', 'sc_status.ID', '=', 'o.PaymentStatus')
            ->leftJoin('short_code as sc_mode', 'sc_mode.ID', '=', 'op.PaymentMode')
            ->leftJoin('short_code as sc_orderstatus', 'sc_orderstatus.ID', '=', 'o.OrderStatus');

        $query->select(
            'o.*',
            'u.Name as customer_name',
            'sc_status.Value as PaymentStatusText',
            'sc_mode.Value as PaymentModeText',
            'sc_orderstatus.Value as Status',
            'o.ID as ID'
        );

        // 2. Cumulative Search & Filters using when() for safety
        $query->when($searchTerm, function ($q, $term) {
            $term = trim($term);
            return $q->where(function ($sq) use ($term) {
                $sq->where('o.OrderNo', 'LIKE', "%{$term}%")
                   ->orWhere('u.Name', 'LIKE', "%{$term}%")
                   ->orWhere('o.ID', 'LIKE', "%{$term}%");
            });
        });

        $query->when($status, function ($q, $status) {
            return $q->where('o.OrderStatus', $status);
        });

        $query->when($request->payment_status, function ($q, $payment_status) {
            return $q->where('o.PaymentStatus', $payment_status);
        });

        // 3. Date Range Filter
        if (!empty($dateRange)) {
            $dates = explode(' to ', $dateRange);
            if (count($dates) == 2) {
                $query->whereDate('o.CreatedDtTm', '>=', trim($dates[0]))
                      ->whereDate('o.CreatedDtTm', '<=', trim($dates[1]));
            } else {
                $query->whereDate('o.CreatedDtTm', '=', trim($dates[0]));
            }
        }

        $sortMap = [
            'ID'             => 'o.ID',
            'order_no'       => 'o.OrderNo',
            'customer_name'  => 'u.Name',
            'order_date'     => 'o.CreatedDtTm'
        ];
        $dbSortColumn = $sortMap[$sortBy] ?? 'o.ID';

        $orders = $query->orderBy($dbSortColumn, $sortOrder)->paginate(15)->withQueryString();

        if ($request->ajax()) {
            return view('partials.order_table', compact('orders'))->render();
        }

        return view('order', compact('orders'));
    }

    public function orderDetailsView($orderNo)
    {
        // 1. Fetch Order with User Details (Single Row)
        $order = DB::table('orders as o')
            ->leftJoin('users as u', 'u.ID', '=', 'o.UID')
            ->leftJoin('address as a', 'a.ID', '=', 'o.ShippingAddressID')
            ->leftJoin('order_payment as op', 'o.ID', '=', 'op.OID')
            ->leftJoin('short_code as sc_status', 'sc_status.ID', '=', 'o.PaymentStatus')
            ->leftJoin('short_code as sc_mode', 'sc_mode.ID', '=', 'op.PaymentMode')

            // Payments table se latest transaction uthane ke liye join
            ->leftJoin('payments as p', function ($join) {
                $join->on('o.ID', '=', 'p.OID')
                    ->whereRaw('p.ID = (select max(ID) from payments where OID = o.ID)');
            })
            // Transaction wala payment method name nikalne ke liye join
            ->select(
                'o.*',
                'u.Name as customer_name',
                'u.Email',
                'u.Phone',
                'a.Name as address_on_name',
                'a.Phone as address_on_phone',
                'a.Address as address',
                'a.City',
                'a.Pincode',
                'a.State',
                'a.Landmark',
                'a.Type as address_type',
                'op.PaymentStatus', // Status ID
                'op.PaymentMode as OrderPaymentMode', // Mode ID
                'sc_status.Value as PaymentStatusText', // Paid/Pending text
                'sc_mode.Value as PaymentModeText',   // COD/Online text
                'p.TxnID',
            )
            ->where('o.OrderNo', $orderNo)
            ->first();
        if (!$order) {
            return redirect()->back()->with('error', 'Order not found');
        }
        $order_id = $order->ID;

        // 2. Fetch Order Items with Product Details and Refund Info
        $items = DB::table('order_items as oi')
            ->leftJoin('product', 'oi.PID', '=', 'product.ID')
            ->leftJoin('product_variants as pv', 'oi.PVID', '=', 'pv.ID')
            ->leftJoin('order_payment as op', 'oi.OrderID', '=', 'op.OID')
            ->leftJoin('product_thumbnail as pt', function ($join) {
                $join->on('oi.PID', '=', 'pt.PID')
                    ->where('pt.IsActive', 1);
            })
            ->leftJoin('refunds as r', 'r.OIID', '=', 'oi.ID')
            ->select(
                'oi.*',
                'product.Title as ProductTitle',
                'pv.Attribute as variant_name',
                'pv.SKU as variant_sku',
                'pt.Url as product_image',
                'r.Status as RefundStatus'
            )
            ->where('oi.OrderID', $order_id)
            ->get();
        // 3. Financial Calculations for the View (Original Snapshot)
        $originalItemSubtotalWithTax = (float)$items->sum('TotalAmount');
        $shippingFee = (float)($order->ShippingFee ?? 0);
        $platformFee = (float)($order->PlatformFee ?? 0);
        $couponDiscount = (float)($order->CouponDiscount ?? 0);

        return view('orderDetails', compact('order', 'items', 'originalItemSubtotalWithTax', 'shippingFee', 'platformFee', 'couponDiscount'));
    }
    public function updateOrderStatus(Request $request)
    {
        Log::info("Order Status Update Request Received:", $request->all());
        $request->validate([
            'id' => 'required|integer',
            'value' => 'required|integer'
        ]);

        DB::beginTransaction();
        try {
            $orderId = $request->id;
            $newStatus = $request->value;

            $order = DB::table('orders')->where('ID', $orderId)->first();
            $orderPayment = DB::table('order_payment')->where('OID', $orderId)->first();

            // 1. Status Mapping (Order -> Item)
            $statusMap = [8 => 18, 9 => 19, 10 => 20, 11 => 21, 12 => 22];
            $itemStatus = $statusMap[$newStatus] ?? $newStatus;

            // 2. Main Order Update
            DB::table('orders')->where('ID', $orderId)->update([
                'OrderStatus' => $newStatus,
                'UpdatedDtTm' => now()
            ]);

            // 3. Capture Item Snapshots for History Log (Fetch BEFORE update)
            $items = DB::table('order_items')->where('OrderID', $orderId)->get();

            // 4. Items Update (Skip already cancelled items)
            DB::table('order_items')->where('OrderID', $orderId)
                ->where('is_partially_cancelled', 0)
                ->update(['ItemStatus' => $itemStatus, 'updatedDtTm' => now()]);

            // 5. Global Status History Update
            $adminId = Auth::id() ?? 0;
            foreach ($items as $item) {
                // If the item itself is already cancelled/returned, we might not want to update its history status
                // unless it's a bulk operation that specifically includes them. 
                // However, the rule here is: only update history for items that were actually eligible for the status change.
                if ($item->is_partially_cancelled == 0) {
                    DB::table('order_items_status_history')->where('OrderItemID', $item->ID)->update([
                        'Status'      => $item->ItemStatus,
                        'NewStatus'   => $itemStatus,
                        'ChangedBy'   => $adminId,
                        'CreatedDtTm' => now()
                    ]);
                }
            }

            // 6. 🔥 PAYMENT LOGIC 🔥
            // CASE A: Order Delivered (11)
            if ($newStatus == 11) {
                // Precision Logic: Calculate exactly what was collected (Active Items - Coupon Share + Fees)
                $activeItems = DB::table('order_items')
                    ->where('OrderID', $orderId)
                    ->where('is_partially_cancelled', 0)
                    ->get();
                
                $actualPaidAmount = (int)round($activeItems->sum(function($item) {
                    return (float)($item->TotalAmount ?? 0);
                }) + (float)($order->ShippingFee ?? 0) + (float)($order->PlatformFee ?? 0));

                DB::table('order_payment')->where('OID', $orderId)->update([
                    'PaymentStatus' => 52, // Marked as Paid
                    'PaidAmount' => $actualPaidAmount,
                    'PendingAmount' => 0,
                    'UpdatedAt' => now()
                ]);
                DB::table('orders')->where('ID', $orderId)->update([
                    'PaymentStatus' => 15
                ]);
                // Payment ledger update (Success status 27)
                DB::table('payments')->where('OID', $orderId)->update([
                    'Status' => 27,
                    'ModifiedDtTm' => now()
                ]);

                // ✅ DELIVERY MAIL: Send when whole order is marked Delivered
                try {
                    $orderData = DB::table('orders')->where('ID', $orderId)->first();
                    $customer = DB::table('users')->where('ID', $orderData->UID)->first();
                    $shippingAddress = DB::table('address')->where('ID', $orderData->ShippingAddressID)->first();
                    
                    if ($customer && $customer->Email) {
                        $addressString = $shippingAddress ? ($shippingAddress->Address . ", " . $shippingAddress->City . ", " . $shippingAddress->State . " - " . $shippingAddress->Pincode) : 'Address details not available';
                        $mailData = [
                            'order_no'      => $orderData->OrderNo,
                            'user_name'     => $customer->Name,
                            'address_name'  => $shippingAddress->Name ?? $customer->Name,
                            'address_details' => $addressString,
                        ];
                        Mail::to($customer->Email)->send(new DynamicMail($mailData, 'mail.order_delivered', 'Order Delivered Successfully - #' . $orderData->OrderNo . ' | ' . config('app.name', 'Fintrick')));
                        Log::info("Delivery mail sent from updateOrderStatus for OID: " . $orderId);
                    }
                } catch (\Exception $mailEx) {
                    Log::error("Delivery Mail Error: " . $mailEx->getMessage());
                }
            }

            // CASE B: Order Full Cancelled (12) by Admin
            else if ($newStatus == 12) { // Changed 'if' to 'else if' to avoid overwriting payment status
                $isPaid = $orderPayment ? ($orderPayment->PaymentStatus == 15 || $orderPayment->PaymentStatus == 52) : false;
                $isOnline = $orderPayment ? ($orderPayment->PaymentMode != 49) : false; // Not COD
                $adminId = Auth::id() ?? 0;

                DB::table('orders')->where('ID', $orderId)->update([
                    'OrderStatus'   => 12, // 12 = Cancelled
                    'PaymentStatus' => $isPaid ? 17 : 16, // 17 = Refunded
                    'UpdatedDtTm'   => now()
                ]);

                // 1. UPDATE ALL ORDER ITEMS (ID 22: Cancelled)
                DB::table('order_items')
                    ->where('OrderID', $orderId)
                    ->whereNotIn('ItemStatus', [22, 23])
                    ->update([
                        'ItemStatus' => 22,
                        'updatedDtTm' => now()
                    ]);



                // 3. UPDATE ORDER PAYMENT TABLE
                // Status-Aware Logic: Refund fees ONLY if pre-shipping (Status < 10)
                $isPreShip = ($order->OrderStatus < 10);
                $finalCancelledAmount = $isPreShip ? (float)$order->GrandTotalAmount : (float)($order->GrandTotalAmount - ($order->ShippingFee + $order->PlatformFee));

                DB::table('order_payment')->where('OID', $orderId)->update([
                    'TotalAmount' => (float)$order->GrandTotalAmount,
                    'PendingAmount' => 0,
                    'CancelledAmount' => $finalCancelledAmount,
                    'PaymentStatus' => ($isPaid && $isOnline && $orderPayment) ? 53 : 51, // 53=Refunded, 51=Pending/Cancelled
                    'UpdatedAt' => now()
                ]);

                // Removed premature ledger entry during initiation. 
                // Entry will now only be made during final refund settlement.

                // 5. INVENTORY RESTORE
                foreach ($items as $item) {
                    DB::table('inventory')
                        ->where('PVID', $item->PVID)
                        ->update([
                            'SoldQty' => DB::raw("SoldQty - $item->Quantity"),
                            'AvailableQty' => DB::raw("AvailableQty + $item->Quantity"),
                            'Updated_At' => now()
                        ]);
                }
            }

            // Final Ledger Sync (Ensure all financials are perfectly recalculated post-update)
            $this->syncOrderTotals($orderId);

            DB::commit(); // Sab sahi raha toh save kar do
            return response()->json(['success' => true, 'message' => 'Status updated in all tables!']);
        } catch (\Exception $e) {
            DB::rollBack(); // Kuch bhi phata toh purana data safe rahega
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
    public function updateOrderPaymentStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'value' => 'required|integer'
        ]);

        try {
            $orderId = $request->id;
            $newStatus = (int)$request->value;

            // Update order_payment table
            DB::table('order_payment')->where('OID', $orderId)
                ->update(['PaymentStatus' => $newStatus, 'UpdatedAt' => now()]);

            // Sync main orders table status
            $ordersPayStatus = match($newStatus) {
                52 => 15, // Paid
                53, 55 => 17, // Refunded / Refund Initiated
                61 => 61, // Partial Refund
                51 => 14, // Pending
                54 => 16, // Failed
                default => 14
            };

            DB::table('orders')->where('ID', $orderId)
                ->update(['PaymentStatus' => $ordersPayStatus]);

            return response()->json(['success' => true, 'message' => 'Payment status updated successfully!']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
    public function cancelSingleItem(Request $request)
    {
        $itemId = $request->item_id;

        // 1. Fetch Item & Order Data
        $item = DB::table('order_items')->where('ID', $itemId)->first();

        if (!$item || $item->ItemStatus == 22) {
            return response()->json(['success' => false, 'message' => 'Item not found or already cancelled.']);
        }

        $orderId = $item->OrderID;
        $order = DB::table('orders')->where('ID', $orderId)->first();
        $orderPayment = DB::table('order_payment')->where('OID', $orderId)->first();

        if (!$order || !$orderPayment) {
            return response()->json(['success' => false, 'message' => 'Order data missing.']);
        }

        try {
            DB::beginTransaction();

            // 2. Inventory Restore
            DB::table('inventory')->where('PVID', $item->PVID)->update([
                'AvailableQty' => DB::raw("AvailableQty + $item->Quantity"),
                'SoldQty'      => DB::raw("SoldQty - $item->Quantity"),
                'Updated_At'   => now()
            ]);

            // 3. Mark Item as Cancelled
            DB::table('order_items')->where('ID', $itemId)->update([
                'ItemStatus' => 22,
                'is_partially_cancelled' => 1,
                'updatedDtTm' => now()
            ]);

            // 6. Recalculate Totals (Unified Logic)
            $this->syncOrderTotals($orderId);

            // 7. 🔥 UPI REFUND LOGGING 🔥
            // If order is PAID and NOT COD, log a negative entry for the refund history
            $isPaid = in_array($order->PaymentStatus, [15, 17, 61]);
            $isCOD = ($orderPayment->PaymentMode == 49);

            if ($isPaid && !$isCOD) {
                // a. Calculate Proportional Share (Match ApiController logic)
                $originalItemsTotal = DB::table('order_items')->where('OrderID', $orderId)->sum('TotalAmount');
                $couponDiscount = (float)($order->CouponDiscount ?? 0);
                
                // Identify if this is the final item being terminated
                $activeItemsCount = DB::table('order_items')->where('OrderID', $orderId)->whereNotIn('ItemStatus', [22, 23])->count();
                $isFinalCancellation = ($activeItemsCount <= 1);
                
                // Precision Logic: Use stored TotalAmount (already net of coupon)
                // Status-Aware Fee Refund Logic: Fees are only refunded if order is NOT yet shipped (Status < 10).
                $isPreShip = ($order->OrderStatus < 10);
                $itemRefundAmount = (int)round($item->TotalAmount + ($isFinalCancellation && $isPreShip ? ((float)$order->ShippingFee + (float)$order->PlatformFee) : 0));

                // c. Create a Refund Record (Refunds Table - for bank/tracking)
                DB::table('refunds')->insert([
                    'OID' => $orderId,
                    'OIID' => $itemId,
                    'Amount' => $itemRefundAmount,
                    'Reason' => 'Item-level cancellation',
                    'Status' => 51, // Pending
                    'CreatedDtTm' => now()
                ]);
            }

            // 8. History Log
            DB::table('order_items_status_history')->where('OrderItemID', $itemId)->update([
                'Status' => $item->ItemStatus,
                'NewStatus' => 22,
                'ChangedBy' => Auth::id(),
                'CreatedDtTm' => now()
            ]);

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Item cancelled successfully.']);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
    }

    public function updateItemStatus(Request $request)
    {
        $request->validate([
            'item_id' => 'required|integer',
            'status' => 'required|integer'
        ]);

        try {
            DB::beginTransaction();
            $item = DB::table('order_items')->where('ID', $request->item_id)->first();
            if (!$item) return response()->json(['success' => false, 'message' => 'Item not found']);

            // Update item status
            DB::table('order_items')->where('ID', $request->item_id)->update([
                'ItemStatus' => $request->status,
                'updatedDtTm' => now()
            ]);

            // Sync order totals (Recalculate logic)
            $this->syncOrderTotals($item->OrderID);

            // History Log
            DB::table('order_items_status_history')->where('OrderItemID', $item->ID)->update([
                'Status' => $item->ItemStatus,
                'NewStatus' => $request->status,
                'ChangedBy' => Auth::id(),
                'CreatedDtTm' => now()
            ]);

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Item status updated and totals synchronized']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function syncOrderTotals($orderId)
    {
        $order = DB::table('orders')->where('ID', $orderId)->first();
        if (!$order) return;

        $originalSummary = DB::table('order_items')
            ->where('OrderID', $orderId)
            ->select(
                DB::raw('COALESCE(SUM(UnitPrice * Quantity), 0) as ori_total_mrp'),
                DB::raw('COALESCE(SUM(DiscountAmt), 0) as ori_total_discount'),
                DB::raw('COALESCE(SUM(Gst), 0) as ori_total_tax'),
                DB::raw('COALESCE(SUM(TotalAmount), 0) as ori_items_total'),
                DB::raw('COALESCE(SUM(Quantity), 0) as ori_total_qty'),
                DB::raw('COUNT(ID) as ori_item_count')
            )
            ->first();

        $originalGrandTotal = (int)round($originalSummary->ori_items_total + (float)$order->PlatformFee + (float)$order->ShippingFee);

        // 2. Calculate ACTIVE Summary (Excluded Cancelled 22, 51 and Refunded 23)
        // Used for accounting and financial settlement logic
        $activeSummary = DB::table('order_items')
            ->where('OrderID', $orderId)
            ->whereNotIn('ItemStatus', [22, 51, 23, 60, 44, 45, 46, 47, 48, 55, 56])
            ->select(
                DB::raw('COALESCE(SUM(TotalAmount), 0) as active_items_total'),
                DB::raw('COUNT(ID) as active_item_count')
            )
            ->first();

        // Check if all items are terminated
        $isFullCancel = ($activeSummary->active_item_count == 0);

        // Precision Logic: Sum of TotalAmount is already net-of-coupon. No ratio math needed.
        // Status-Aware Fee Adjustment: If order is terminated POST-shipment, final settlement remains the Fee amount.
        $isPreShip = ($order->OrderStatus < 10);
        $finalNetSettlement = (int)round($activeSummary->active_items_total + ($isFullCancel ? ($isPreShip ? 0 : ((float)$order->PlatformFee + (float)$order->ShippingFee)) : ((float)$order->PlatformFee + (float)$order->ShippingFee)));

        // 3. Status Determination
        $isPaid = in_array($order->PaymentStatus, [15, 17, 55, 61]);
        $isCOD  = false;
        $orderPayment = DB::table('order_payment')->where('OID', $orderId)->first();
        if ($orderPayment) {
            $isCOD = ($orderPayment->PaymentMode == 49);
        }

      $newOrderStatus = $order->OrderStatus; 
        if ($isFullCancel) {
            // Agar order kabhi dispatch hua hi nahi tha (ya pehle se cancelled tha), 
            // toh money refund hone ke baad bhi wo 'Cancelled' hi rahega.
            if ($order->OrderStatus < 10 || $order->OrderStatus == 12) {
                $newOrderStatus = 12; // Cancelled
            } else {
                // Agar shipped ya delivered hone ke baad terminate hua, tabhi wo Return hai.
                $newOrderStatus = 13; // Returned
            }
        }

        $newOrderPayStatus = $order->PaymentStatus;
        if ($isFullCancel) {
            $hasPendingRefunds = DB::table('refunds')
                ->where('OID', $orderId)
                ->where('Status', '!=', 56)
                ->exists();
            $newOrderPayStatus = $isPaid ? ($hasPendingRefunds ? 55 : 17) : 14;
        }

        $refundedItemsCount = DB::table('order_items')->where('OrderID', $orderId)->where('ItemStatus', 23)->count();
        $totalRefundedValue = DB::table('refunds')->where('OID', $orderId)->where('Status', 56)->sum('Amount');
        $totalCancelledValue = DB::table('order_items')->where('OrderID', $orderId)->where('ItemStatus', 22)->sum('TotalAmount');

        if (!$isFullCancel && $refundedItemsCount > 0) {
            $newOrderPayStatus = 61; // Partial Refunded
        }

        // 4. Update Main Orders Table (Store ORIGINAL Snapshot for List View)
        DB::table('orders')->where('ID', $orderId)->update([
            'TotalMRP'         => round($originalSummary->ori_total_mrp, 2),
            'TotalDiscount'    => round($originalSummary->ori_total_discount, 2),
            'TotalTax'         => round($originalSummary->ori_total_tax, 2),
            'GrandTotalAmount' => $originalGrandTotal, // Always preserve Original Bill Snapshot
            'total_items'      => $originalSummary->ori_item_count,
            'total_quantity'   => $originalSummary->ori_total_qty,
            'OrderStatus'      => $newOrderStatus,
            'PaymentStatus'    => $newOrderPayStatus,
            'UpdatedDtTm'      => now()
        ]);

        // 5. Update Order Payment Table (Store NET Settlement for Accounting)
        if ($orderPayment) {
            $paymentStatus = $orderPayment->PaymentStatus;
            if ($isFullCancel) {
                $paymentStatus = $isPaid ? 53 : 51; 
            } else if ($refundedItemsCount > 0 && $isPaid) {
                $paymentStatus = 61; // Partial Refunded
            }

            // Absolute Ledger Sync: Determine what amount remains 'Active' (Paid & Retained)
            // Logic: If order is terminated (isFullCancel) AFTER shipping, we retain fees.
            $currentActiveGrandTotal = ($isFullCancel) 
                ? ($isPreShip ? 0 : (float)$order->PlatformFee + (float)$order->ShippingFee)
                : (int)round($activeSummary->active_items_total + (float)$order->PlatformFee + (float)$order->ShippingFee);

            $finalCancelledAmount = (float)$originalGrandTotal - $currentActiveGrandTotal;

            DB::table('order_payment')->where('OID', $orderId)->update([
                'TotalAmount'     => (float)$originalGrandTotal,
                'PendingAmount'   => $isCOD ? $currentActiveGrandTotal : 0,
                'CancelledAmount' => $finalCancelledAmount,
                'RefundAmount'    => $totalRefundedValue,
                'PaymentStatus'   => $paymentStatus,
                'UpdatedAt'       => now()
            ]);
        }
    }

    public function approveItemRefund(Request $request)
    {
        $itemId = $request->item_id;
        
        DB::beginTransaction();
        try {
            // 1. Update Refund Table
            $refund = DB::table('refunds')->where('OIID', $itemId)->first();
            if (!$refund) return response()->json(['success' => false, 'message' => 'Refund record not found']);

            DB::table('refunds')->where('OIID', $itemId)->update([
                'Status' => 56, // Success/Completed
                'ProcessedAt' => now()
            ]);

            // 2. Sync Order Totals (this will update RefundAmount in order_payment)
            $this->syncOrderTotals($refund->OID);

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Refund approved successfully!']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function getRefundDetails(Request $request)
    {
        $itemId = $request->item_id;
        $orderId = $request->order_id;
        
        $data = null;
        $debug = ['searched_order_id' => $orderId, 'searched_item_id' => $itemId];

        // 1. Try 'refund_bank_details' FIRST (Returns)
        if ($orderId) {
            $bankQuery = DB::table('refund_bank_details');
            if (is_numeric($orderId)) {
                $bankQuery->where('order_id', (int)$orderId);
            } else {
                $orderIDFromNo = DB::table('orders')->where('OrderNo', $orderId)->value('ID');
                if ($orderIDFromNo) {
                    $bankQuery->where('order_id', $orderIDFromNo);
                    $debug['mapped_order_id'] = $orderIDFromNo;
                } else {
                    $bankQuery->where('order_id', -1); // Force fail
                }
            }
            
            $bankDetail = $bankQuery->first();
            
            if ($bankDetail) {
                $data = [
                    'refund_method' => !empty($bankDetail->upi_id) ? 'upi' : 'bank_transfer',
                    'account_holder_name' => $bankDetail->account_holder_name,
                    'account_no' => $bankDetail->account_number,
                    'ifsc_code' => $bankDetail->ifsc_code,
                    'upi_id' => $bankDetail->upi_id,
                    'refund_reason' => 'User provided details for Return/Refund',
                    'source' => 'refund_bank_details'
                ];
            }
        }

        // 2. Fallback to 'refunds' table (Cancellations)
        if (!$data) {
            $refund = null;
            if ($itemId && is_numeric($itemId)) {
                $refund = DB::table('refunds')->where('OIID', (int)$itemId)->first();
            }

            if (!$refund && $orderId) {
                $refundQuery = DB::table('refunds');
                if (is_numeric($orderId)) {
                    $refundQuery->where('OID', (int)$orderId);
                } else {
                    // Search by OrderNo if OID is passed as string
                    $refundQuery->where('OID', $orderId); 
                }
                $refund = $refundQuery->whereNull('OIID')->latest()->first();
            }

            if ($refund) {
                $data = [
                    'amount' => $refund->Amount,
                    'status' => $refund->Status,
                    'refund_method' => $refund->refund_method,
                    'account_holder_name' => $refund->account_holder_name,
                    'account_no' => $refund->account_no,
                    'ifsc_code' => $refund->ifsc_code,
                    'upi_id' => $refund->upi_id,
                    'refund_reason' => $refund->refund_reason ?? $refund->Reason ?? 'Cancellation',
                    'source' => 'refunds'
                ];
            }
        }

        if ($data) {
            return response()->json([
                'success' => true,
                'data' => $data,
                'debug' => $debug
            ]);
        }

        return response()->json([
            'success' => false, 
            'message' => 'No bank or UPI details found for this order ID in ' . (is_numeric($orderId) ? 'ID format' : 'String format'),
            'debug' => $debug
        ]);
    }
    public function returnList(Request $request)
    {
        $query = DB::table('order_returns as r')
            ->leftJoin('orders as o', 'o.ID', '=', 'r.order_id')
            ->leftJoin('order_items as oi', 'oi.ID', '=', 'r.order_item_id')
            ->leftJoin(DB::raw('(SELECT OrderID, SUM(TotalAmount) as ItemsGrossTotal FROM order_items GROUP BY OrderID) as sub'), 'sub.OrderID', '=', 'o.ID')
            ->leftJoin('users as u', 'u.ID', '=', 'r.user_id')
            ->leftJoin('refunds as ref', function($join) {
                $join->on('ref.OID', '=', 'r.order_id')
                     ->on('ref.OIID', '=', 'r.order_item_id');
            })
            ->select(
                'r.id',
                'r.return_uid',
                'r.order_id',
                'r.order_item_id',
                'r.status as return_status',
                'r.reason',
                'r.requested_at',
                'o.OrderNo',
                'o.GrandTotalAmount',
                'u.Name as customer_name',
                'oi.ProductTitle',
                'oi.Quantity',
                'oi.TotalAmount',
                'o.CouponID',
                'o.CouponDiscount',
                'o.PlatformFee',
                'o.ShippingFee',
                'sub.ItemsGrossTotal as OrderGrossTotal',
                'ref.Amount as StoredRefundAmount',
                // Check if this is the last active item in the order
                DB::raw("(SELECT COUNT(*) FROM order_items WHERE OrderID = o.ID AND ItemStatus NOT IN (22, 23, 51, 60, 55, 56)) as ActiveItemCount"),
                // Get the highest Item ID to designate as the fee absorber
                DB::raw("(SELECT MAX(ID) FROM order_items WHERE OrderID = o.ID) as MaxItemIDInOrder")
            );

        // Filter by Search (Order No, Name, or Return ID)
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('o.OrderNo', 'LIKE', "%{$search}%")
                    ->orWhere('u.Name', 'LIKE', "%{$search}%")
                    ->orWhere('r.return_uid', 'LIKE', "%{$search}%");
            });
        }

        // Filter by Status
        if ($request->has('status') && !empty($request->status)) {
            $query->where('r.status', $request->status);
        }

        // Filter by Date Range
        if ($request->has('date_range') && !empty($request->date_range)) {
            $dates = explode(' to ', $request->date_range);
            if (count($dates) == 2) {
                $query->whereBetween(DB::raw('DATE(r.requested_at)'), [trim($dates[0]), trim($dates[1])]);
            } else {
                $query->whereDate('r.requested_at', trim($dates[0]));
            }
        }

        $returns = $query->orderBy('r.id', 'desc')->paginate(10)->withQueryString();

        if ($request->ajax()) {
            return view('partials.return_order_table', compact('returns'))->render();
        }

        return view('returnOrderList', compact('returns'));
    }
    public function updateReturnStatus(Request $request)
    {
        $status = $request->status;
        $return = DB::table('order_returns')->where('id', $request->id)->first();

        if (!$return) {
            return response()->json(['success' => false, 'message' => 'Return record not found']);
        }

        DB::beginTransaction();
        try {
            // 1. Update Return Table
            $updateData = [
                'status' => $status,
                'updated_at' => now()
            ];
            
            if ($status == 45) $updateData['approved_at'] = now();
            if ($status == 55) $updateData['refund_initiated_at'] = now();
            if ($status == 56) $updateData['refund_completed_at'] = now();

            DB::table('order_returns')->where('id', $request->id)->update($updateData);

            // 2. Logic for Item Status
            $itemStatus = 60; // Default: Return Requested (ID: 60)

            // 3. Bridge Return to Refund Settlement Dashboard
            // If Product Received (48) or Refund Initiated (55), create/update a PENDING refund request
            if ($status == 48 || $status == 55) {
                $orderItemForRefund = DB::table('order_items')->where('ID', $return->order_item_id)->first();
                if ($orderItemForRefund) {
                    // Check if this is the last active item (exclude current + already terminated)
                    $remainingActiveCount = DB::table('order_items')
                        ->where('OrderID', $return->order_id)
                        ->where('ID', '!=', $return->order_item_id)
                        ->whereNotIn('ItemStatus', [22, 23, 51, 60, 55, 56])
                        ->count();
                    $orderForFees = DB::table('orders')->where('ID', $return->order_id)->first();
                    $isLastItem = ($remainingActiveCount == 0);
                    $isPreShip = ($orderForFees->OrderStatus < 10);

                    // Precision Logic: Fees are only refunded for Pre-Shipment terminations (Status < 10)
                    $refundAmount = (int)round($orderItemForRefund->TotalAmount)
                        + (($isLastItem && $isPreShip) ? ((float)$orderForFees->ShippingFee + (float)$orderForFees->PlatformFee) : 0);

                    DB::table('refunds')->updateOrInsert(
                        ['OID' => $return->order_id, 'OIID' => $return->order_item_id],
                        [
                            'Amount'      => $refundAmount,
                            'Reason'      => "Return Refund Request (Item #{$return->order_item_id})",
                            'Status'      => 51, // Pending (Settlement)
                            'CreatedDtTm' => now()
                        ]
                    );
                }
            }

            if ($status == 56) { // Refund Completed
                $itemStatus = 23; // ID 23: Refunded (order_items status)

                // 2.1 Fetch Refund Bank/UPI details logged by user
                $bankDetails = DB::table('refund_bank_details')
                    ->where('order_id', $return->order_id)
                    ->first();

                // 2.2 Get Item details for amount
                $orderItemForRefund = DB::table('order_items')->where('ID', $return->order_item_id)->first();
                
                if ($bankDetails && $orderItemForRefund) {
                    $refundMethod = ($bankDetails->upi_id) ? 'upi' : 'bank_transfer';

                    // Check if this is the last active item
                    $remainingActiveCount = DB::table('order_items')
                        ->where('OrderID', $return->order_id)
                        ->where('ID', '!=', $return->order_item_id)
                        ->whereNotIn('ItemStatus', [22, 23, 51, 60, 55, 56])
                        ->count();
                    $orderForFees = DB::table('orders')->where('ID', $return->order_id)->first();
                    $isLastItem = ($remainingActiveCount == 0);
                    $isPreShip = ($orderForFees->OrderStatus < 10);

                    // Precision Logic: Fees are only refunded for Pre-Shipment terminations (Status < 10)
                    $refundAmount = (int)round($orderItemForRefund->TotalAmount)
                        + (($isLastItem && $isPreShip) ? ((float)$orderForFees->ShippingFee + (float)$orderForFees->PlatformFee) : 0);
                    
                    // Upsert into master refunds table (Log entry)
                    DB::table('refunds')->updateOrInsert(
                        ['OID' => $return->order_id, 'OIID' => $return->order_item_id],
                        [
                            'Amount'      => $refundAmount,
                            'Status'      => 56, // Success
                            'ProcessedAt' => now(),
                            'CreatedDtTm' => $bankDetails->created_at ?? now()
                        ]
                    );
                }

                // Payment Status Update (ID 53: Refunded in order_payment)
                DB::table('order_payment')
                    ->where('OID', $return->order_id)
                    ->update(['PaymentStatus' => 53]);

                //  Transaction (ID 36: Success in refund_transactions)
                DB::table('refund_transactions')->insert([
                    'RefundID' => $return->id,
                    'Status' => 36,
                    'CreatedDtTm' => now()
                ]);
            } elseif ($status == 57) { // Rejected
                $itemStatus = 21; // ID 21: Delivered (Back to original state)
            }

            // 3. Update Item & History
            DB::table('order_items')->where('ID', $return->order_item_id)->update(['ItemStatus' => $itemStatus]);

            DB::table('order_items_status_history')->where('OrderItemID', $return->order_item_id)->update([
                'Status'      => $itemStatus == 21 ? 60 : 21, // 60 = Return Requested, 21 = Delivered
                'NewStatus'   => $itemStatus,
                'ChangedBy'   => Auth::id(),
                'CreatedDtTm' => now()
            ]);

            // 🔥 4. CONDITION: Update Main Order Table (Only on Refund Success)
            if ($status == 56) {
                $orderItem = DB::table('order_items')->where('ID', $return->order_item_id)->first();
                $order = DB::table('orders')->where('ID', $return->order_id)->first();
                $orderPayment = DB::table('order_payment')->where('OID', $return->order_id)->first();

                // Restore Inventory
                if ($orderItem && isset($orderItem->PVID)) {
                    DB::table('inventory')->where('PVID', $orderItem->PVID)->update([
                        'SoldQty' => DB::raw("SoldQty - {$orderItem->Quantity}"),
                        'AvailableQty' => DB::raw("AvailableQty + {$orderItem->Quantity}"),
                        'Updated_At' => now()
                    ]);
                }

                // 🔥 Recalculate Totals (Unified Logic)
                $this->syncOrderTotals($return->order_id);
            }

            DB::commit();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()]);
        }
    }
    public function getReturnImages(Request $request)
    {
        $images = DB::table('order_return_images')
            ->where('return_id', $request->id)
            ->get();

        return response()->json([
            'images' => $images
        ]);
    }
    public function couponView(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $coupons = DB::table('coupons')
            ->leftJoin('short_code as sc_discount_type', 'coupons.DiscountType', '=', 'sc_discount_type.ID')
            ->select('coupons.*', 'sc_discount_type.Value as DiscountTypeText')
            ->selectSub(function ($query) {
                $query->from('coupon_usage')
                    ->whereColumn('CouponID', 'coupons.ID')
                    ->selectRaw('count(*)');
            }, 'total_used')
            ->get();
        return view('coupon', compact('coupons'));
    }
    public function couponSave(Request $request)
    {
        // dd($request->all());
        // $startDate = date('Y-m-d H:i:s', strtotime($request->start_date));
        // $endDate = date('Y-m-d H:i:s', strtotime($request->end_date));
        $request->validate([
            'code' => 'required|string|max:50',
            'discount_type' => 'required|integer|in:5,6', // 6 for PERCENT, 5 for FLAT
            'discount_value' => 'required|numeric|min:0|max:100',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'required|in:0,1',
        ]);

        // 2. Data Preparation
        $data = [
            'Code' => strtoupper($request->code),
            'Description' => $request->description,
            'DiscountType' => $request->discount_type,
            'DiscountValue' => (int)round($request->discount_value),
            'MaxDiscountAmount' => (int)round($request->max_discount_amount),
            'MinOrderAmount' => (int)round($request->min_order_amount),
            'UsageLimit' => $request->usage_limit,
            'UsageLimitPerUser' => $request->usage_limit_per_user,
            'StartDate'       => $request->start_date,
            'EndDate'         => $request->end_date,
            'IsActive' => $request->is_active,
            'UpdatedDtTm' => now(), // Timestamp update
        ];
        try {
            if ($request->couponId) {
                // --- UPDATE LOGIC ---
                DB::table('coupons')->where('ID', $request->couponId)->update($data);
                $message = "Coupon updated successfully!";
            } else {
                // --- CREATE LOGIC ---
                $data['CreatedDtTm'] = now(); // Naye record ke liye creation time
                DB::table('coupons')->insert($data);
                $message = "Coupon created successfully!";
            }

            return response()->json(['status' => true, 'message' => $message]);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Something went wrong: ' . $e->getMessage()], 500);
        }
    }
    public function couponUpdateStatus(Request $request)
    {
        try {
            $column = $request->column;
            $id = $request->id;
            $value = $request->value;

            $allowedColumns = ['IsActive'];

            if (in_array($column, $allowedColumns)) {
                DB::table('coupons')->where('ID', $id)->update([$column => $value]);

                return response()->json([
                    'status' => true,
                    'message' => 'Status updated successfully!'
                ]);
            }

            // Agar allowedColumns mein nahi hai toh error bhejien
            return response()->json([
                'status' => false,
                'message' => 'Invalid column: ' . $column
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }

    public function couponHistory($couponId) // ID parameter add karein
    {
        $couponUsages = DB::table('coupon_usage as cu')
            ->join('coupons as c', 'cu.CouponID', '=', 'c.ID')
            ->leftJoin('users as u', 'cu.UID', '=', 'u.ID')
            ->where('cu.CouponID', $couponId) // Yeh line zaroori hai
            ->select(
                'cu.*',
                'c.Code as CouponCode',
                'u.Name as CustomerName',
                'u.Email'
            )
            ->get();
        return view('couponHistory', compact('couponUsages'));
    }

    public function pendingReviews(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 401);
        }

        $query = DB::table('product_reviews as pr')
            ->leftJoin('product as p', 'pr.PID', '=', 'p.ID')
            ->leftJoin('product_thumbnail as pt', 'pr.PID', '=', 'pt.PID')
            ->select('pr.*', 'p.Title as ProductTitle', 'pt.Url as ProductImage');

        // Filter by Search (Product Title, UserName, ReviewText)
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('p.Title', 'LIKE', "%{$search}%")
                    ->orWhere('pr.Name', 'LIKE', "%{$search}%")
                    ->orWhere('pr.ReviewText', 'LIKE', "%{$search}%");
            });
        }

        // Filter by Status
        if ($request->has('status') && $request->status !== null && $request->status !== '') {
            $query->where('pr.IsActive', $request->status);
        }

        // Filter by Date Range
        if ($request->has('date_range') && !empty($request->date_range)) {
            $dates = explode(' to ', $request->date_range);
            if (count($dates) == 2) {
                $query->whereBetween(DB::raw('DATE(pr.CreatedDtTm)'), [trim($dates[0]), trim($dates[1])]);
            } else {
                $query->whereDate('pr.CreatedDtTm', trim($dates[0]));
            }
        }

        $reviews = $query->orderBy('pr.CreatedDtTm', 'desc')->paginate(10)->withQueryString();

        if ($request->ajax()) {
            return view('partials.pending_reviews_table', compact('reviews'))->render();
        }

        return view('pendingReviews', compact('reviews'));
    }
    public function paymentDetails(Request $request)
    {
        $query = DB::table('payments as p')
            ->leftJoin('orders as o', 'p.OID', '=', 'o.ID')
            ->leftJoin('users as u', 'o.UID', '=', 'u.ID')
            ->select('p.*', 'o.OrderNo', 'u.Name as CustomerName');

        // Filter by Search (Order ID, Txn ID, Name)
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('o.OrderNo', 'LIKE', "%{$search}%")
                    ->orWhere('p.TxnID', 'LIKE', "%{$search}%")
                    ->orWhere('u.Name', 'LIKE', "%{$search}%");
            });
        }

        // Filter by Status
        if ($request->has('status') && $request->status !== null && $request->status !== '') {
            $query->where('p.Status', $request->status);
        }

        // Filter by Date Range
        if ($request->has('date_range') && !empty($request->date_range)) {
            $dates = explode(' to ', $request->date_range);
            if (count($dates) == 2) {
                $query->whereBetween(DB::raw('DATE(p.CreatedDtTm)'), [trim($dates[0]), trim($dates[1])]);
            } else {
                $query->whereDate('p.CreatedDtTm', trim($dates[0]));
            }
        }

        $payments = $query->orderBy('p.CreatedDtTm', 'desc')->paginate(10)->withQueryString();

        if ($request->ajax()) {
            return view('partials.payment_table', compact('payments'))->render();
        }

        return view('payments', compact('payments'));
    }
    public function updatePaymentStatus(Request $request)
    {
        $userId = Auth::id();
        $pId = $request->id;
        $newStatus = $request->status; // Example: 27 (Success)

        // 1. Pehle payment dhoondo
        $payment = DB::table('payments')->where('ID', $pId)->first();
        if (!$payment) return response()->json(['success' => false, 'message' => 'Payment Not Found']);


        DB::beginTransaction();
        try {
            $orderID = $payment->OID;

            // --- A. UPDATE PAYMENTS TABLE ---
            $payData = ['Status' => $newStatus, 'ModifiedDtTm' => now()];
            if ($newStatus == 27) {
                $payData['PaidAt'] = now();
            }
            DB::table('payments')->where('ID', $pId)->update($payData);

            if ($newStatus == 27) { // Agar Paisa Mil Gaya (Success)

                // --- B. UPDATE ORDER TABLE ---
                DB::table('orders')->where('ID', $orderID)->update([
                    'PaymentStatus' => 15 // 15 = Paid
                ]);

                // --- C. UPDATE ODERPAYEMTN (Calculation Table) ---
                // Is table mein PaidAmount bharo aur Pending zero karo
                DB::table('order_payment')->where('OID', $orderID)->update([
                    'PaidAmount' => $payment->Amount,
                    'PendingAmount' => 0.00,
                    'PaymentStatus' => 15,
                    'UpdatedAt' => now()
                ]);

                // --- D. UPDATE ORDER_ITEMS (Status transition) ---
                // Payment aate hi status 'Pending(18)' se 'Confirmed(19)' ho jata hai
                DB::table('order_items')->where('OrderID', $orderID)->update([
                    'ItemStatus' => 19,
                    'updatedDtTm' => now()
                ]);

                // --- E. INSERT INTO ORDER_ITEM_HISTORY ---
                // Har item ke liye ek entry history mein
                $items = DB::table('order_items')->where('OrderID', $orderID)->get();
                foreach ($items as $item) {
                    DB::table('order_items_status_history')->where('OrderItemID', $item->ID)->update([
                        'Status'      => 18, // Old Status
                        'NewStatus'   => 19, // New Status (Confirmed)
                        'ChangedBy'   => $userId,
                        'CreatedDtTm' => now()
                    ]);
                }
            }
            DB::commit();
            return response()->json(['success' => true, 'message' => 'Status changed!']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function refundRequestsView(Request $request)
    {
        $query = DB::table('refunds')
            ->leftJoin('orders', 'refunds.OID', '=', 'orders.ID')
            ->leftJoin('users', 'orders.UID', '=', 'users.id')
            ->leftJoin('order_items', 'refunds.OIID', '=', 'order_items.ID')
            ->leftJoin('refund_bank_details as rbd', 'rbd.order_id', '=', 'orders.ID')
            ->leftJoin('refund_transactions as rt', 'rt.RefundID', '=', 'refunds.ID')
            ->select(
                'refunds.OID',
                'orders.OrderNo',
                'users.name as customer_name',
                DB::raw('GROUP_CONCAT(refunds.ID) as refund_ids'),
                DB::raw('SUM(refunds.Amount) as total_amount'),
                'refunds.Status',
                'refunds.Reason as original_reason',
                DB::raw('GROUP_CONCAT(order_items.ProductTitle SEPARATOR ", ") as product_summary'),
                'rbd.account_holder_name as rbd_name',
                'rbd.account_number',
                'rbd.ifsc_code',
                'rbd.upi_id',
                'rt.TxnID as utr_no',
                DB::raw('MAX(refunds.CreatedDtTm) as latest_request_at')
            )
            ->groupBy('refunds.OID', 'refunds.Status', 'orders.OrderNo', 'users.name', 'rbd.account_holder_name', 'rbd.account_number', 'rbd.ifsc_code', 'rbd.upi_id', 'rt.TxnID', 'refunds.Reason');

        // Search
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('orders.OrderNo', 'like', '%' . $request->search . '%')
                  ->orWhere('users.name', 'like', '%' . $request->search . '%');
            });
        }

        // Status Filter
        if ($request->status) {
            $query->where('refunds.Status', $request->status);
        }

        // Method Filter (Check for UPI ID in bank details)
        if ($request->method) {
            if ($request->method == 'upi') {
                $query->whereNotNull('rbd.upi_id');
            } else {
                $query->whereNull('rbd.upi_id');
            }
        }

        $refunds = $query->orderBy('latest_request_at', 'desc')->paginate(10);

        if ($request->ajax()) {
            return view('partials.refund_order_table', compact('refunds'))->render();
        }

        return view('admin.refunds.index', compact('refunds'));
    }

    public function updateRefundStatus(Request $request)
    {
        $idInput = $request->id; // Can be a single ID or a string/array of IDs
        $status = $request->status; 
        $txnId = $request->transaction_id; 
        $userId = Auth::id();

        $ids = is_array($idInput) ? $idInput : explode(',', $idInput);
        $uniqueOrderIds = [];

        try {
            DB::beginTransaction();

            foreach ($ids as $id) {
                $refund = DB::table('refunds')->where('ID', $id)->first();
                if (!$refund) continue;

                $uniqueOrderIds[] = $refund->OID;

                // Update Refund Table Status
                DB::table('refunds')->where('ID', $id)->update([
                    'Status' => $status,
                    'ProcessedAt' => now()
                ]);

                if ($status == 56) { // If Refund Completed (Success)
                    // 1. Log in refund_transactions
                    DB::table('refund_transactions')->updateOrInsert(
                        ['RefundID' => $id],
                        [
                            'TxnID' => $txnId,
                            'Status' => 1,
                            'CreatedDtTm' => now(),
                            'ModifiedDtTm' => now()
                        ]
                    );

                    // 2. Sync with Return Table
                    if ($refund->OIID) {
                        $returnRecord = DB::table('order_returns')
                            ->where('order_id', $refund->OID)
                            ->where('order_item_id', $refund->OIID)
                            ->first();

                        if ($returnRecord) {
                            DB::table('order_returns')
                                ->where('id', $returnRecord->id)
                                ->update([
                                    'status' => 56, 
                                    'refund_completed_at' => now(),
                                    'updated_at' => now()
                                ]);
                        }

                        // 3. Update Item Status
                        DB::table('order_items')->where('ID', $refund->OIID)->update([
                            'ItemStatus' => 23, // Refunded
                            'updatedDtTm' => now()
                        ]);

                        // 4. Create negative record in payments for audit
                        DB::table('payments')->insert([
                            'OID' => $refund->OID,
                            'PaymentMethod' => 25,
                            'TxnID' => $txnId,
                            'Amount' => -$refund->Amount,
                            'Status' => 29, 
                            'PaidAt' => now(),
                            'CreatedDtTm' => now()
                        ]);
                    } else {
                        // FULL ORDER CASE (Ancient records fallback)
                        DB::table('order_items')->where('OrderID', $refund->OID)->update([
                            'ItemStatus' => 23,
                            'updatedDtTm' => now()
                        ]);

                        DB::table('payments')->insert([
                            'OID' => $refund->OID,
                            'PaymentMethod' => 25,
                            'TxnID' => $txnId,
                            'Amount' => -$refund->Amount,
                            'Status' => 29,
                            'PaidAt' => now(),
                            'CreatedDtTm' => now()
                        ]);
                    }
                }
            }

            // Sync totals once for each unique order
            foreach (array_unique($uniqueOrderIds) as $orderId) {
                $this->syncOrderTotals($orderId);
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Refund status updated successfully!']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
