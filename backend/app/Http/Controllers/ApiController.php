<?php

namespace App\Http\Controllers;

use App\Mail\DynamicMail;
use App\Mail\OtpMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ApiController extends Controller
{

    public function deactivateAccount(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
            }

            // Update user status to Inactive (0)
            User::where('ID', $user->ID)->update(['IsActive' => 0]);

            // Logout user from all devices (revoke tokens)
            $user->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Your account has been deactivated successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to deactivate account',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);
            $user = User::where('Email', $request->email)->first();

            // 3. Credential Verification
            if (!$user || !Hash::check($request->password, $user->Password)) {
                return response()->json([
                    'success' => false,
                    'status' => 401,
                    'message' => 'Invalid email or password',
                    'data' => null
                ], 401);
            }

            // 4. Token Management (Sanctum)
            $user->tokens()->delete(); // Clear old tokens
            $token = $user->createToken('auth_token')->plainTextToken;

            // 5. Success Response (Standard JSON Structure)
            return response()->json([
                'success' => true,
                'status' => 200,
                'message' => 'Login successful',
                'token' => $token,
                'data' => [
                    'user_id' => $user->ID,
                    'name'    => $user->Name,
                    'email'   => $user->Email
                ]
            ], 200);
        } catch (\Exception $e) {
            // Standard Error Response
            return response()->json([
                'success' => false,
                'status' => 500,
                'message' => 'Something went wrong!',
                'error' => $e->getMessage() // Sirf debug ke liye, production pe hata dena
            ], 500);
        }
    }
    public function getCategory()
    {
        try {
            // 1. Fetch only Active Categories
            $allCategories = DB::table('categories')
                ->where('IsActive', 1)
                ->orderBy('ID', 'ASC') // Maintain structural order
                ->get()
                ->toArray();

            // 2. Recursive helper for infinite category nesting
            $categoryTree = $this->buildTree($allCategories, 0, null);

            return response()->json([
                'success' => true,
                'status' => 200,
                'count' => count($categoryTree),
                'message' => 'Category tree fetched successfully',
                'data' => $categoryTree
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'status' => 500,
                'message' => 'Failed to load categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // This function handles nesting to any depth
    private function buildTree(array $elements, $parentId = 0, $parentSlug = null)
    {
        $branch = [];

        foreach ($elements as $element) {
            if ($element->ParentID == $parentId) {
                // Attach parent slug for easy frontend routing
                if ($parentSlug) {
                    $element->parentSlug = $parentSlug;
                }

                $children = $this->buildTree($elements, $element->ID, $element->Slug);
                if ($children) {
                    $element->subcategories = $children;
                } else {
                    $element->subcategories = [];
                }
                $branch[] = $element;
            }
        }

        return $branch;
    }
    public function getBySlugCategory($catSlug, $subSlug = null)
    {
        try {
            // 1. Fetch parent category by slug (e.g., 'toys')
            $category = DB::table('categories')
                ->where('Slug', $catSlug)
                ->where('IsActive', 1)
                ->first();

            if (!$category) {
                return response()->json(['success' => false, 'message' => 'Category not found'], 404);
            }

            // --- CASE 1: Subcategory slug is provided ---
            if ($subSlug) {
                $subcategory = DB::table('categories')
                    ->where('Slug', $subSlug)
                    ->where('ParentID', $category->ID) // Validation: Ensure subcategory belongs to this parent
                    ->where('IsActive', 1)
                    ->first();

                if (!$subcategory) {
                    return response()->json(['success' => false, 'message' => 'Subcategory not found'], 404);
                }

                // Fetch only products for this subcategory
                $product = DB::table('product')
                    ->where('CategoryID', $subcategory->ID)
                    ->where('IsActive', 1)
                    ->get();

                return response()->json([
                    'success' => true,
                    'message' => 'Subcategory product fetched',
                    'level'   => 'subcategory',
                    'data'    => [
                        'subcategory'     => $subcategory,
                        'product' => $product
                    ]
                ], 200);
            }

            // --- CASE 2: Only main category slug is provided ---

            // A. Fetch all child subcategories
            $subcategories = DB::table('categories')
                ->where('ParentID', $category->ID)
                ->where('IsActive', 1)
                ->get();

            // B. Fetch all products under this category (Aggregated from subcategories)
            $subcategoryIds = $subcategories->pluck('ID')->toArray(); // Collect all subcategory IDs

            $product = DB::table('product')
                ->whereIn('CategoryID', $subcategoryIds) // Use 'whereIn' to aggregate products
                ->where('IsActive', 1)
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Category data with subcategories and all product',
                'level'   => 'category',
                'data'    => [
                    'category'          => $category,
                    'subcategories' => $subcategories,
                    'product'      => $product
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong!',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
    public function getFilteredproduct(Request $request)
    {
        try {
            $query = DB::table('product as p')
                ->leftJoin('product_thumbnail as pt', 'p.ID', '=', 'pt.PID')
                ->join('categories as c', 'p.CategoryID', '=', 'c.ID')
                ->leftJoin('categories as sc', 'p.SubCategoryID', '=', 'sc.ID')
                ->leftJoin('product_reviews as pr', function ($join) {
                    $join->on('p.ID', '=', 'pr.PID')
                        ->where('pr.IsActive', '=', 1);
                })
                ->join('product_variants as pv', function ($join) {
                    $join->on('p.ID', '=', 'pv.PID')
                        ->whereRaw('pv.ID = (select min(ID) from product_variants where PID = p.ID)');
                })
                // ->join('inventory as i', 'pv.ID', '=', 'i.PVID')
                ->leftJoin('inventory as i', 'p.ID', '=', 'i.PID')
                ->select(
                    'p.ID',
                    'p.Title',
                    'p.Slug',
                    'c.CategoryName', // Include category name
                    'pt.Url as Thumbnail',
                    'pv.ID as VariantID',
                    'pv.Attribute',
                    'pv.Price as MRP',
                    DB::raw('ROUND(pv.SellPrice, 0) as SellingPrice'),
                    'pv.Discount',
                    'p.Trending',
                    'p.NewArrivals',
                    'p.MostBuyed',
                    DB::raw('ROUND(AVG(pr.Rating), 1) as AvgRating'),   // Average star rating
                    DB::raw('COUNT(DISTINCT pr.ID) as ReviewCount'), // Use distinct to ensure accurate count
                    DB::raw('(SELECT SUM(AvailableQty) FROM inventory WHERE PID = p.ID) as TotalStock') // Aggregated stock
                )
                ->where('p.IsActive', 1)
                ->where('c.IsActive', 1);

            // --- 1. Multi-Category Support (Comma separated slugs) ---
            if ($request->has('category')) {
                $catSlugs = explode(',', $request->get('category'));
                $query->whereIn('c.Slug', $catSlugs);
            }

            // --- 2. Multi-Subcategory Support ---
            if ($request->has('subcategory')) {
                $subSlugs = explode(',', $request->get('subcategory'));
                $query->whereExists(function ($subQuery) use ($subSlugs) {
                    $subQuery->select(DB::raw(1))
                        ->from('categories as sc')
                        ->whereColumn('sc.ID', 'p.SubCategoryID')
                        ->whereIn('sc.Slug', $subSlugs);
                });
            }
            // --- 5. ADVANCED SEARCH FILTER (Smart & Fuzzy) ---
            if ($request->has('search')) {
                $search = trim($request->get('search'));
                $words = array_filter(explode(' ', $search)); // Split words by space

                $query->where(function ($q) use ($search, $words) {
                    // Exact phrase matches (High Priority)
                    $q->where('p.Title', 'LIKE', "%{$search}%")
                      ->orWhere('c.CategoryName', 'LIKE', "%{$search}%")
                      ->orWhere('sc.CategoryName', 'LIKE', "%{$search}%")
                      ->orWhere('p.Slug', 'LIKE', "%{$search}%");

                    // Multi-word / Keyword matching
                    if (count($words) > 1) {
                        $q->orWhere(function ($sub) use ($words) {
                            foreach ($words as $word) {
                                if (strlen($word) > 2) { // Skip small words
                                    $sub->where(function ($fieldQ) use ($word) {
                                        $fieldQ->where('p.Title', 'LIKE', "%{$word}%")
                                               ->orWhere('p.ShortDesc', 'LIKE', "%{$word}%")
                                               ->orWhere('p.LongDesc', 'LIKE', "%{$word}%")
                                               ->orWhere('c.CategoryName', 'LIKE', "%{$word}%")
                                               ->orWhere('sc.CategoryName', 'LIKE', "%{$word}%");
                                    });
                                }
                            }
                        });
                    } else {
                        // Broad scan for single word
                        $q->orWhere('p.ShortDesc', 'LIKE', "%{$search}%")
                          ->orWhere('p.LongDesc', 'LIKE', "%{$search}%");
                    }
                });
            }
            // --- 3. PRICE FILTER (Budget) ---
            if ($request->has('max_price')) {
                $query->where('pv.SellPrice', '<=', $request->get('max_price'));
            }

            // --- 4. DISCOUNT FILTER (Fixed for Range and 40+) ---
            if ($request->has('discount')) {
                $discountVal = $request->get('discount');

                if (str_contains($discountVal, '+')) {
                    // "40+" -> More than 40%
                    $val = (int) str_replace('+', '', $discountVal);
                    $query->where('pv.Discount', '>=', $val);
                } elseif (str_contains($discountVal, '-')) {
                    // "20-30" -> Between 20% and 30%
                    $range = explode('-', $discountVal);
                    $query->whereBetween('pv.Discount', [(int)$range[0], (int)$range[1]]);
                } else {
                    // Single value
                    $query->where('pv.Discount', '>=', (int)$discountVal);
                }
            }
            $query->groupBy(
                'p.ID',
                'p.Title',
                'p.Slug',
                'c.CategoryName', // Include category name
                'pt.Url',
                'pv.ID',
                'pv.Attribute',
                'pv.Price',
                'pv.SellPrice',
                'pv.Discount',
                'p.Trending',
                'p.NewArrivals',
                'p.MostBuyed'
            );
            // ->having('TotalStock', '>', 0);

            // --- TYPE LOGIC (Filter by flags) ---
            $type = $request->get('type');
            if ($type === 'trending') {
                $query->where('p.Trending', 1);
            } elseif ($type === 'latest') {
                $query->where('p.NewArrivals', 1);
            } elseif ($type === 'most_buyed') {
                $query->where('p.MostBuyed', 1);
            }

            // --- SORTING LOGIC ---
            $sort = $request->get('sort');

            if ($sort === 'top_rated') {
                $query->having('AvgRating', '>', 0);
                $query->orderBy('AvgRating', 'desc');
            } elseif ($sort === 'price_asc') {
                $query->orderBy('pv.SellPrice', 'asc');
            } elseif ($sort === 'price_desc') {
                $query->orderBy('pv.SellPrice', 'desc');
            } elseif ($sort === 'newest') {
                $query->orderBy('p.ID', 'desc');
            }

            // --- DEFAULT ORDER ---
            // Agar kuch bhi sort nahi ho raha aur type bhi nahi hai tab default p.ID desc lo
            if (!$sort && !$type && !$request->has('random')) {
                $query->orderBy('p.ID', 'asc');
            }

            // --- Use Pagination for Shop Page ---
            $limit = $request->get('limit', 12);
            $products = $query->paginate($limit);

            return response()->json([
                'success' => true,
                'data' => $products // Pagination automatically return meta like total_pages, current_page
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function toggleWishlist(Request $request)
    {
        try {
            // Validation check
            $request->validate(['product_id' => 'required|integer']);

            $userId = Auth::id();
            $productId = $request->product_id;

            // Check if exists (Validate column names UID/PID in schema)
            $exists = DB::table('wishlists')
                ->where('UID', $userId) 
                ->where('PID', $productId)
                ->first();

            if ($exists) {
                DB::table('wishlists')->where('ID', $exists->ID)->delete();
                return response()->json([
                    'success' => true,
                    'status' => 200,
                    'message' => 'Product removed from wishlist',
                    'action' => 'removed'
                ], 200);
            } else {
                DB::table('wishlists')->insert([
                    'UID' => $userId,
                    'PID' => $productId,
                    'created_at' => now(),
                ]);
                return response()->json([
                    'success' => true,
                    'status' => 200,
                    'message' => 'Product added to wishlist',
                    'action' => 'added'
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'status' => 500,
                'message' => 'Error toggling wishlist',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getWishlist()
    {
        try {
            $product = DB::table('wishlists as w')
                ->join('product as p', 'w.PID', '=', 'p.ID')
                ->leftJoin('product_thumbnail as pt', 'p.ID', '=', 'pt.PID')
                ->leftJoin('product_variants as pv', function ($join) {
                    $join->on('p.ID', '=', 'pv.PID')
                        ->whereRaw('pv.ID = (SELECT MIN(ID) FROM product_variants WHERE PID = p.ID)');
                })
                ->leftJoin('inventory as i', 'p.ID', '=', 'i.PID')
                ->leftJoin('product_reviews as pr', function ($join) {
                    $join->on('p.ID', '=', 'pr.PID')
                        ->where('pr.IsActive', '=', 1);
                })
                ->where('w.UID', Auth::id())
                ->select(
                    'p.ID',
                    'p.Title',
                    'p.Slug',
                    'pt.Url as Thumbnail',
                    'pv.ID as VariantID', 
                    DB::raw('ROUND(pv.SellPrice, 0) as SellingPrice'),
                    DB::raw('ROUND(pv.Price, 0) as MRP'),
                    'pv.Discount',
                    'p.Trending',
                    'p.NewArrivals',
                    'p.MostBuyed',
                    DB::raw('ROUND(AVG(pr.Rating), 1) as AvgRating'),
                    DB::raw('COUNT(DISTINCT pr.ID) as ReviewCount'),
                    DB::raw('COALESCE(SUM(i.AvailableQty), 0) as TotalStock')
                )
                ->groupBy(
                    'p.ID',
                    'p.Title',
                    'p.Slug',
                    'pt.Url',
                    'pv.ID', // Included in GroupBy for correct SQL execution
                    'pv.SellPrice',
                    'pv.Price',
                    'pv.Discount',
                    'p.Trending',
                    'p.NewArrivals',
                    'p.MostBuyed'
                )
                ->get();

            return response()->json([
                'success' => true,
                'status' => 200,
                'message' => 'Wishlist fetched successfully',
                'count' => $product->count(),
                'data' => $product
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'status' => 500,
                'message' => 'Could not fetch wishlist',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getCart()
    {
        try {
            $cartItems = DB::table('cart as c')
                ->join('product as p', 'c.PID', '=', 'p.ID')
                ->join('product_variants as pv', 'c.VPID', '=', 'pv.ID')
                ->leftJoin('product_thumbnail as pt', function ($join) {
                    $join->on('p.ID', '=', 'pt.PID')
                         ->whereRaw('pt.ID = (SELECT MIN(ID) FROM product_thumbnail WHERE PID = p.ID)');
                })
                ->leftJoin('inventory as i', function ($join) {
                    $join->on('c.VPID', '=', 'i.PVID')
                         ->on('c.PID', '=', 'i.PID');
                })
                ->where('c.UID', Auth::id())
                ->groupBy('c.ID', 'p.Title', 'p.Slug', 'p.GST', 'pt.Url', 'pv.SellPrice', 'pv.Price', 'pv.Discount', 'pv.Attribute', 'c.Quantity', 'c.PID', 'c.VPID')
                ->select(
                    'c.ID as cart_id',
                    'p.Title',
                    'p.Slug',
                    'p.GST', 
                    'pt.Url as Thumbnail',
                    DB::raw('pv.SellPrice as Price'), 
                    DB::raw('pv.Price as MRP'),
                    'pv.Discount',
                    'pv.Attribute',
                    DB::raw('COALESCE(MAX(i.AvailableQty), 10) as AvailableQty'),
                    'c.Quantity',
                    'c.PID as product_id',
                    'c.VPID as variant_id'
                )
                ->get();

            $totalMrp = 0;
            $totalBaseAmount = 0; // Total excluding tax
            $totalTax = 0;
            $totalQuantity = 0;

            foreach ($cartItems as $item) {
                $quantity = $item->Quantity;
                $totalQuantity += $quantity;

                // 1. MRP calculation
                $totalMrp += ($item->MRP * $quantity);

                // 2. Base Amount calculation (Price * Qty)
                $itemBaseTotal = $item->Price * $quantity;
                $totalBaseAmount += $itemBaseTotal;

                // 3. GST calculation (Exclusive: Price pe extra tax)
                $gstRate = $item->GST ?? 0;
                $taxAmount = ($itemBaseTotal * $gstRate) / 100;
                $totalTax += $taxAmount;
            }

            // --- Final Summary Logic ---

            $platformFee = 10;

            // Final Product Value (Base + Tax)
            $totalWithTax = $totalBaseAmount + $totalTax;
            
            // Delivery logic: Free shipping for orders above 500 (based on Product Subtotal)
            $deliveryCharge = ($totalBaseAmount >= 500 || $totalQuantity == 0) ? 0 : 40;

            // Bag Discount: Total savings (MRP vs Selling Price)
            $bagDiscount = $totalMrp - $totalBaseAmount;

            // Net payable amount
            $finalPayable = $totalWithTax + $platformFee + $deliveryCharge;

            return response()->json([
                'success' => true,
                'status' => 200,
                'data' => [
                    'items' => $cartItems,
                    'summary' => [
                        'total_mrp' => round($totalMrp, 2),
                        'total_base_price' => round($totalBaseAmount, 2),
                        'total_tax' => round($totalTax, 2),
                        'bag_discount' => round($bagDiscount, 2),
                        'platform_fee' => $platformFee,
                        'delivery_charge' => $deliveryCharge,
                        'final_payable' => round($finalPayable, 2),
                        'total_quantity' => $totalQuantity
                    ]
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function addToCart(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|integer',
                'variant_id' => 'required|integer',
                'Quantity'   => 'required|integer|min:1'
            ]);

            $userId = Auth::id();
            $pid = $request->product_id;
            $vid = $request->variant_id; // Frontend se aane wala Variant ID
            $qty = $request->Quantity;

            // --- LAYER 1: Inventory & Product Status Check ---
            // Join product and inventory tables for stock validation
            $stockDetail = DB::table('inventory as i')
                ->join('product as p', 'i.PID', '=', 'p.ID')
                ->where('i.PVID', $vid) // Check variant ID
                ->where('i.PID', $pid)  // Check product ID
                ->select('i.AvailableQty', 'i.IsActive as InventoryActive', 'p.IsActive as ProductActive', 'i.PVID')
                ->first();

            // Defensive Fallback: If not found by variant ID, check product-level inventory mapping
            if (!$stockDetail) {
                $stockDetail = DB::table('inventory as i')
                    ->join('product as p', 'i.PID', '=', 'p.ID')
                    ->where('i.PID', $pid)
                    ->select('i.AvailableQty', 'i.IsActive as InventoryActive', 'p.IsActive as ProductActive', 'i.PVID')
                    ->first();
                if ($stockDetail && $stockDetail->PVID) {
                    $vid = $stockDetail->PVID;
                }
            }

            // 1. Existence Check
            if (!$stockDetail) {
                return response()->json([
                    'success' => false,
                    'status' => 400,
                    'message' => 'Product or Variant mapping not found in inventory.'
                ], 400);
            }

            // 2. Double Security: Check if Product AND Inventory are both Active
            if ($stockDetail->ProductActive != 1 || $stockDetail->InventoryActive != 1) {
                return response()->json([
                    'success' => false,
                    'status' => 403,
                    'message' => 'This product variant is currently unavailable.'
                ], 403);
            }

            // 3. Precise Stock Check (AvailableQty)
            if ($stockDetail->AvailableQty < $qty) {
                return response()->json([
                    'success' => false,
                    'status' => 409,
                    'message' => "Only $stockDetail->AvailableQty items left in stock."
                ], 409);
            }

            // --- LAYER 2: Cart Operations ---
            $existing = DB::table('cart')
                ->where('UID', $userId)
                ->where('PID', $pid)
                ->where('VPID', $vid)
                ->first();

            // Enforce maximum quantity limit per product (Default: 5)
            $maxAllowed = 5;
            $currentQtyInCart = $existing ? $existing->Quantity : 0;

            if (($currentQtyInCart + $qty) > $maxAllowed) {
                return response()->json([
                    'success' => false,
                    'status' => 422, // Unprocessable Entity
                    'message' => "You can only add a maximum of $maxAllowed units of this Product."
                ], 422);
            }

            if ($existing) {
                // Validate total requested quantity against stock levels
                if (($existing->Quantity + $qty) > $stockDetail->AvailableQty) {
                    return response()->json([
                        'success' => false,
                        'status' => 409,
                        'message' => 'Total quantity in cart cannot exceed available stock.'
                    ], 409);
                }

                DB::table('cart')->where('ID', $existing->ID)->increment('Quantity', $qty);
                $msg = "Cart updated successfully";
            } else {
                DB::table('cart')->insert([
                    'UID' => $userId,
                    'PID' => $pid,
                    'VPID' => $vid,
                    'Quantity' => $qty,
                    'created_at' => now()
                ]);
                $msg = "Added to cart";
            }

            return response()->json([
                'success' => true,
                'status' => 200,
                'message'=> $msg
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'status' => 500,
                'message' => 'Critical error in AddToCart logic',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function mergeCart(Request $request)
    {
        Log::info('Merge Cart Items:', $request->items);

        try {
            $request->validate([
                'items' => 'required|array',
                'items.*.product_id' => 'required|integer',
                'items.*.variant_id' => 'required|integer',
                'items.*.Quantity'   => 'required|integer',
            ]);

            $userId = Auth::id();
            $items = $request->items;

            foreach ($items as $item) {

                $existing = DB::table('cart')
                    ->where('UID', $userId)
                    ->where('PID', $item['product_id'])
                    ->where('VPID', $item['variant_id'])
                    ->first();

                if ($existing) {

                    $newQty = min($existing->Quantity + $item['Quantity'], 5);

                    DB::table('cart')
                        ->where('ID', $existing->ID)
                        ->update([
                            'Quantity' => $newQty
                        ]);
                } else {

                    DB::table('cart')->insert([
                        'UID' => $userId,
                        'PID' => $item['product_id'],
                        'VPID' => $item['variant_id'],
                        'Quantity' => min($item['Quantity'], 5),
                        'created_at' => now()
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'status' => 200,
                'message' => 'Cart merged successfully'
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'status' => 500,
                'message' => 'Merge failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function updateQuantity(Request $request)
    {
        try {
            $request->validate([
                'cart_id' => 'required|integer',
                'Quantity' => 'required|integer|min:1|max:10'
            ]);

            $userId = Auth::id();
            $cartId = $request->cart_id;
            $newQty = $request->Quantity;

            // 1. Fetch cart item and current inventory status
            $cartItem = DB::table('cart as c')
                ->join('inventory as i', 'c.VPID', '=', 'i.PVID') // Link via Variant ID
                ->where('c.ID', $cartId)
                ->where('c.UID', $userId)
                ->select('c.ID', 'c.VPID', 'i.AvailableQty', 'i.IsActive')
                ->first();

            // 2. Security Check: Kya item user ka hai?
            if (!$cartItem) {
                return response()->json([
                    'success' => false,
                    'status' => 404,
                    'message' => 'Cart item not found.'
                ], 404);
            }

            // 3. Status Check: Kya item abhi bhi active hai?
            if ($cartItem->IsActive != 1) {
                return response()->json([
                    'success' => false,
                    'status' => 403,
                    'message' => 'This variant is no longer available.'
                ], 403);
            }

            // 4. STOCK VALIDATION: Kya naya quantity available stock se zyada toh nahi?
            if ($newQty > $cartItem->AvailableQty) {
                return response()->json([
                    'success' => false,
                    'status' => 409, // Conflict
                    'message' => "Only $cartItem->AvailableQty items available in stock."
                ], 409);
            }

            // 5. Sab sahi hai toh update karo
            DB::table('cart')->where('ID', $cartId)->update([
                'Quantity' => $newQty,
                'updated_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'status' => 200,
                'message' => 'Quantity updated successfully',
                'data' => [
                    'cart_id' => $cartId,
                    'new_quantity' => $newQty
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'status' => 500,
                'message' => 'Update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function removeItem($cartId)
    {
        try {
            $userId = Auth::id();

            // Check and Delete (Ensure only the current user's item is deleted)
            $deleted = DB::table('cart')
                ->where('ID', $cartId)
                ->where('UID', $userId)
                ->delete();

            if ($deleted) {
                return response()->json([
                    'success' => true,
                    'status' => 200,
                    'message' => 'Item removed from cart'
                ], 200);
            }

            return response()->json([
                'success' => false,
                'status' => 404,
                'message' => 'Item not found or already removed'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'status' => 500,
                'message' => 'Could not remove item',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getProductDetails($slug)
    {
        try {
            // 1. Product Info
            $product = DB::table('product as p')
                ->join('categories as c', 'p.CategoryID', '=', 'c.ID')
                ->select('p.*', 'c.CategoryName as CategoryName')
                ->where('p.Slug', $slug)
                ->where('p.IsActive', 1)
                ->first();

            if (!$product) {
                return response()->json(['success' => false, 'message' => 'Product not found'], 404);
            }

            // 2. Variants & Specs (As it is)
            $variants = DB::table('product_variants as pv')
                ->join('inventory as i', 'pv.ID', '=', 'i.PVID')
                ->select('pv.ID', 'pv.Price', 'pv.SellPrice', 'pv.Discount', 'i.AvailableQty')
                ->where('pv.PID', $product->ID)
                ->where('i.IsActive', 1)
                ->get()
                ->map(function ($variant) {
                    $variant->Price = round($variant->Price);
                    $variant->SellPrice = round($variant->SellPrice);
                    $variant->images = DB::table('product_variants_image')->where('VPID', $variant->ID)->pluck('Url');
                    $variant->specs = DB::table('variant_attribute_table as vat')
                        ->join('attribute as a', 'vat.AID', '=', 'a.ID')
                        ->join('attribute_value as av', 'vat.AVID', '=', 'av.ID')
                        ->where('vat.VPID', $variant->ID)
                        ->select('a.Name as key', 'av.Value as value')
                        ->get();
                    return $variant;
                });

            // 3. Related Products
            $related = DB::table('product as p')
                ->leftJoin('product_thumbnail as pt', 'p.ID', '=', 'pt.PID')
                ->leftJoin('product_variants as pv', 'p.ID', '=', 'pv.PID')
                ->leftJoin('product_reviews as pr', function ($join) {
                    $join->on('p.ID', '=', 'pr.PID')
                        ->where('pr.IsActive', '=', 1);
                })
                ->select(
                    'p.ID',
                    'p.Title',
                    'p.Slug',
                    DB::raw('MIN(pv.ID) as VariantID'),
                    'pt.Url as Thumbnail',
                    DB::raw('MIN(pv.Price) as MRP'),      // Minimum MRP
                    DB::raw('MIN(pv.SellPrice) as SellingPrice'), // Minimum Selling Price
                    DB::raw('MAX(pv.Discount) as Discount'),   // Maximum discount percentage
                    DB::raw('AVG(pr.Rating) as AvgRating'),    // Average star rating
                    DB::raw('COUNT(pr.ID) as ReviewCount'),     // Total review count
                    DB::raw('(SELECT SUM(AvailableQty) FROM inventory WHERE PID = p.ID) as TotalStock')
                )
                ->where('p.SubcategoryID', $product->SubcategoryID)
                ->where('p.ID', '!=', $product->ID)
                ->groupBy('p.ID', 'p.Title', 'p.Slug', 'pt.Url')
                ->limit(5)
                ->get();

            // 4. Individual Reviews List (User comments)
            $reviews = DB::table('product_reviews as pr')
                ->where('pr.PID', $product->ID)
                ->where('pr.IsActive', 1)
                ->orderBy('pr.CreatedDtTm', 'desc')
                ->get()
                ->map(function ($review) {
                    $review->media = DB::table('product_review_media')->where('RID', $review->ID)->get();
                    return $review;
                });

            // 5. Fetch aggregate rating and review data
            // Efficiently calculates average across all users
            $overall_rating = DB::table('product_reviews')
                ->where('PID', $product->ID)
                ->where('IsActive', 1)
                ->select(
                    DB::raw('COUNT(*) as total_reviews'), // Total individual reviews
                    DB::raw('ROUND(AVG(Rating), 1) as average_rating') // Combined average rating
                )
                ->first();

            // 6. Rating Distribution (For Progress Bars)
            $rating_distribution = DB::table('product_reviews')
                ->where('PID', $product->ID)
                ->where('IsActive', 1)
                ->select('Rating', DB::raw('count(*) as total'))
                ->groupBy('Rating')
                ->get();

            // --- Check if logged in user has purchased this product ---
            $has_purchased = false;
            $user = Auth::guard('sanctum')->user();
            if ($user) {
                $has_purchased = DB::table('order_items as oi')
                    ->join('orders as o', 'oi.OrderID', '=', 'o.ID')
                    ->leftJoin('short_code as sc', 'oi.ItemStatus', '=', 'sc.ID')
                    ->where('o.UID', $user->ID)
                    ->where('oi.PID', $product->ID)
                    ->where('sc.Value', 'Delivered')
                    ->where('o.PaymentStatus', 15) // 15 = Paid
                    ->exists();
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'product' => array_merge((array)$product, ['has_purchased' => $has_purchased]),
                    'variants' => $variants,
                    'related' => $related,
                    'reviews' => $reviews,
                    'overall_rating' => $overall_rating, // Ab direct ye use karo header mein
                    'rating_distribution' => $rating_distribution
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => "Error occurred", 'error' => $e->getMessage()], 500);
        }
    }

    public function customerRegister(Request $request)
    {
        try {
            // 1. Validation (Unique email and phone check)
            $validator = Validator::make($request->all(), [
                'name'  => 'required|string|max:50',
                'email' => 'required|email|max:100|unique:users,email',
                'phone' => 'required|numeric|digits:10|unique:users,phone',
            ], [
                'email.unique'   => 'This email is already registered. Please login instead.',
                'phone.unique'   => 'This phone number is already associated with an account.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => $validator->errors()->first()
                ], 422);
            }

            // 2. User Creation
            $user = User::create([
                'Name'     => $request->name,
                'Email'    => $request->email,
                'Phone'    => $request->phone,
                'CreatedDtTm' => now(),
                'ModifiedDtTm' => now()
            ]);

            return response()->json([
                'status'  => 'success',
                'message' => 'Registration successful! You can now login.'
            ], 201);
        } catch (\Exception $e) {
            // Log error for debugging (Log::error($e->getMessage()))
            return response()->json([
                'status'  => 'error',
                'message' => 'Server issue, please try again later!'
            ], 500);
        }
    }
    public function sendOtp(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
            }

            $email = $request->email;
            $user = User::where('Email', $email)->first();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'This email is not registered with us.'
                ], 404);
            }
            $type = $user ? 'old' : 'new';
            $uid = $user ? $user->ID : 0;
            $otp = rand(100000, 999999);

            DB::beginTransaction();

            DB::table('email_otps')->updateOrInsert(
                ['Email' => $email],
                [
                    'UID'         => $uid,
                    'OtpCode'     => Hash::make($otp),
                    'Type'        => $type,
                    'IsVerified'  => 0,
                    'CreatedDtTm' => now(),
                    'UpdatedDtTm' => now(),
                    'ExpiresAt'   => now()->addMinutes(5),
                ]
            );

            // Use Mailable class for consistency
            Mail::to($email)->send(new DynamicMail(['otp' => $otp], 'otp', 'Your ' . config('app.name', 'Fintrick') . ' Verification Code'));
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'OTP sent successfully to your email.',
                'type'    => $type
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Mail Error: ' . $e->getMessage()], 500);
        }
    }
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|numeric',
        ]);

        // 1. Check if user exists (Double check for safety)
        $user = User::where('Email', $request->email)->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }
        // Account Status Check: Block access for inactive or deactivated users
        if ($user->IsActive == 0) {
            return response()->json([
                'status' => false,
                'message' => 'Your account is deactivated. Please contact support.'
            ], 403); // Use 403 Forbidden for unauthorized access attempts
        }

        // 2. Fetch OTP Record
        $record = DB::table('email_otps')
            ->where('Email', $request->email)
            ->first();

        // 3. Validation
        if (!$record || !Hash::check($request->otp, $record->OtpCode)) {
            return response()->json(['success' => false, 'message' => 'Invalid OTP'], 401);
        }

        if (now()->gt($record->ExpiresAt)) {
            return response()->json(['success' => false, 'message' => 'OTP has expired.'], 401);
        }

        // 4. Generate Token
        $token = $user->createToken('auth_token')->plainTextToken;

        // 5. Cleanup: Delete used OTP
        DB::table('email_otps')->where('Email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }
    public function storeReview(Request $request)
    {

        $request->validate([
            'PID' => 'required|exists:product,ID', // Make sure product exists
            'Rating' => 'required|integer|min:1|max:5',
            'ReviewText' => 'required|string|max:500',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp,avif,gif|max:2048',
            'video' => 'nullable|mimetypes:video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv,video/x-flv,video/x-matroska,video/webm|max:51200',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $user = $request->user();

                // 2. EXTRA SECURITY: Double check purchase status on backend
                $hasPurchased = DB::table('order_items as oi')
                    ->join('orders as o', 'oi.OrderID', '=', 'o.ID')
                    ->leftJoin('short_code as sc', 'oi.ItemStatus', '=', 'sc.ID')
                    ->where('o.UID', $user->ID)
                    ->where('oi.PID', $request->PID)
                    ->where('sc.Value', 'Delivered')
                    ->where('o.PaymentStatus', 15) // 15 = Paid
                    ->exists();

                if (!$hasPurchased) {
                    throw new \Exception("Review failed: You must have a delivered and fully paid order for this product to leave a review.");
                }

                // 3. Table 1: Save Review
                $reviewId = DB::table('product_reviews')->insertGetId([
                    'PID' => $request->PID,
                    'UID' => $user->ID,
                    'Name' => $user->Name,
                    'Rating' => $request->Rating,
                    'ReviewText' => $request->ReviewText,
                    'IsActive' => 0, // 0 = Pending/Inactive, 1 = Active
                    'CreatedDtTm' => now(),
                ]);

                // 3. Table 2: Save Media (Images)
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        // Generate unique filenames to prevent collisions
                        $fileName = time() . '_' . $image->getClientOriginalName();
                        $image->move(public_path('assets/images/reviews'), $fileName);

                        // Store relative path (useful for frontend accessibility)
                        $path = 'assets/images/reviews/' . $fileName;

                        DB::table('product_review_media')->insert([
                            'RID' => $reviewId,
                            'MediaUrl' => $path,
                            'MediaType' => 1,
                        ]);
                    }
                }

                // 4. Table 2: Save Media (Video)
                if ($request->hasFile('video')) {
                    $video = $request->file('video');
                    $videoName = time() . '_' . $video->getClientOriginalName();
                    $video->move(public_path('assets/videos/reviews'), $videoName);

                    $videoPath = 'assets/videos/reviews/' . $videoName;

                    DB::table('product_review_media')->insert([
                        'RID' => $reviewId,
                        'MediaUrl' => $videoPath,
                        'MediaType' => 2,
                    ]);
                }
                return response()->json([
                    'status' => 'success',
                    'message' => 'Review and media uploaded successfully!',
                    'data' => ['RID' => $reviewId]
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getAddresses()
    {
        $userId = Auth::id();
        try {
            $addresses = DB::table('address')
                ->where('UID', $userId)
                ->where('IsActive', '>', 0) // Fetch only active addresses (Status: 1)
                ->orderBy('ID', 'desc')     // Sort newest first
                ->get();
            // Agar user ka koi address nahi mila
            if ($addresses->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'message' => 'No addresses found.',
                    'data' => []
                ], 200);
            }

            return response()->json([
                'success' => true,
                'message' => 'Addresses fetched successfully.',
                'data' => $addresses
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong while fetching addresses!',
                'error' => $e->getMessage() // Sirf development mein dikhayein, production mein nahi
            ], 500);
        }
    }
    // 2. Naya Address Save karna
    public function storeAddress(Request $request)
    {
        $userId = Auth::id();
        try {

            $validator = Validator::make($request->all(), [
                'Type' => 'required|string',
                'Name' => 'required|string',
                'Email' => 'required|email', // Added Email validation
                'Phone' => 'required|digits:10',
                'Address' => 'required',
                'Pincode' => 'required',
                'City' => 'required',
                'State' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
            }

            // Handle default address selection logic
            if ($request->IsActive == 1) {
                DB::table('address')->where('UID', $userId)->update(['IsActive' => 0]);
            }

            $addressId = DB::table('address')->insertGetId([
                'UID' => $userId,
                'Name' => $request->Name,
                'Email' => $request->Email, // Added Email insert
                'Phone' => $request->Phone,
                'Address' => $request->Address,
                'Pincode' => $request->Pincode,
                'City' => $request->City,
                'State' => $request->State,
                'Landmark' => $request->Landmark,
                'Type' => $request->Type ?? 'Home',
                'IsActive' => 1
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Address saved successfully!',
                'address_id' => $addressId
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save address. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // ApiController.php

    public function updateAddress(Request $request)
    {
        // 1. Validation
        $request->validate([
            'ID'      => 'required',
            'Name'    => 'required|string|max:255',
            'Phone'   => 'required|numeric|digits:10',
            'Address' => 'required|string',
            'City'    => 'required|string',
            'State'   => 'required|string',
            'Pincode' => 'required|digits:6',
            'Type'    => 'required|string',
            'Email'   => 'required|email',
        ]);

        // 2. Query execution
        $query = DB::table('address')
            ->where('ID', $request->ID)
            ->where('UID', Auth::id());

        // Check if exists
        if (!$query->exists()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Address not found or unauthorized'
            ], 404);
        }

        // 3. Perform Update
        $updateData = $request->only([
            'Name',
            'Phone',
            'Address',
            'City',
            'State',
            'Pincode',
            'Type',
            'Email',
            'Landmark'
        ]);

        $query->update($updateData);

        // 4. Get updated data for response
        $updatedAddress = $query->first();

        return response()->json([
            'status'  => 'success',
            'message' => 'Address updated successfully',
            'data'    => $updatedAddress
        ], 200);
    }

    public function removeAddress(Request $request)
    {
        // Validate ID from request
        $request->validate(['id' => 'required']);

        $address = DB::table('address')
            ->where('ID', $request->id)
            ->where('UID', Auth::id());

        if (!$address->exists()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Address not found'
            ], 404);
        }

        $address->update([
            'IsActive' => 0,
            'Updated_At' => now()
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Address removed successfully'
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user(); // Fetch authenticated user via Sanctum

            // 1. Validation
            $request->validate([
                'fullName'   => 'required|string|min:3|max:50',
                'email'      => 'required|email|max:100|unique:users,Email,' . $user->ID . ',ID',
                'phone'      => 'required|numeric|digits:10',
                'profileImg' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Max 2MB
            ]);

            // 2. Update profile details (Database keys: Name, Email, Phone)
            $user->Name = $request->fullName;
            $user->Email = $request->email;
            $user->Phone = $request->phone;

            // 3. Image Processing
            if ($request->hasFile('profileImg')) {
                $file = $request->file('profileImg');
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('assets/images/profileImg'), $filename);
                $path = 'assets/images/profileImg/' . $filename;
                if ($user->ProfileImage && file_exists(public_path($user->ProfileImage))) {
                    @unlink(public_path($user->ProfileImage));
                }
                $user->ProfileImage = $path;
            }

            $user->save();

            // 4. Success Response
            return response()->json([
                'status'  => true,
                'message' => 'Profile updated successfully!',
                'data'    => $user
            ], 200);
        } catch (\Exception $e) {
            // Kisi bhi unexpected error ke liye
            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong!',
                'error'   => $e->getMessage() // Sirf dev mode mein dikhao, production pe nahi
            ], 500);
        }
    }
    public function myOrders(Request $request)
    {
        try {
            $userId = Auth::id();

            // 1. Fetch orders with shipping address, payment status, and localized descriptions
            $orders = DB::table('orders as o')
                ->leftJoin('address as a', 'o.ShippingAddressID', '=', 'a.ID')
                ->leftJoin('order_payment as op', 'o.ID', '=', 'op.OID')
                // Join for Order Status Text (ID: 8, 9, 11, etc.)
                ->leftJoin('short_code as sc_status', 'o.OrderStatus', '=', 'sc_status.ID')
                // Join for Order Payment Status Text (ID: 14, 15, etc.)
                ->leftJoin('short_code as sc_pay', 'o.PaymentStatus', '=', 'sc_pay.ID')
                ->where('o.UID', $userId)
                ->select(
                    'o.*',
                    'sc_status.Value as order_status_text',  // Confirmed, Delivered etc.
                    'sc_pay.Value as payment_status_text',  // Pending, Paid etc.
                    'op.PaymentMode as payment_mode',
                    'op.PaymentStatus as payment_detail_status',
                    'a.Name as customer_name',
                    'a.Phone as customer_phone',
                    'a.Address as flat_address',
                    'a.City',
                    'a.State',
                    'a.Pincode'
                )
                ->orderBy('o.CreatedDtTm', 'desc')
                ->get();

            // 2. Fetch items with return status, tracking, and FULL PAYMENT snapshot
            $orders->transform(function ($order) {
                // Attach the full payment record to each order for Frontend Source of Truth
                $order->payment = DB::table('order_payment')->where('OID', $order->ID)->first();

                $order->items = DB::table('order_items as oi')
                    ->leftJoin('product_variants_image as pvi', function ($join) {
                        $join->on('oi.PVID', '=', 'pvi.VPID')
                            ->whereRaw('pvi.ID = (SELECT MIN(ID) FROM product_variants_image WHERE VPID = oi.PVID)');
                    })
                    // Join for Item Status (ID: 18, 21, 60 etc.)
                    ->leftJoin('short_code as sc_item', 'oi.ItemStatus', '=', 'sc_item.ID')
                    // Join for Return Status (ID: 44, 45, 56 etc.)
                    ->leftJoin('order_returns as r', 'r.order_item_id', '=', 'oi.ID')
                    ->leftJoin('short_code as sc_return', 'r.status', '=', 'sc_return.ID')
                    ->leftJoin('refund_bank_details as rbd', 'rbd.order_id', '=', 'oi.OrderID')
                    ->where('oi.OrderID', $order->ID)
                    ->select(
                        'oi.*',
                        'sc_item.Value as item_status_text',
                        'sc_return.Value as return_status_text',
                        'pvi.Url as variant_image',
                        'r.status as return_status_id',
                        DB::raw("(SELECT rf.Status FROM refunds rf WHERE rf.OID = oi.OrderID AND (rf.OIID = oi.ID OR rf.OIID IS NULL) ORDER BY rf.ID DESC LIMIT 1) as refund_status_id"),
                        // Advanced Precision SQL: Use COALESCE for terminated items
                        DB::raw("
                            CASE 
                                WHEN oi.ItemStatus IN (22, 51, 23, 60, 44, 45, 46, 47, 48, 55, 56) THEN
                                    COALESCE(
                                        (SELECT rf.Amount FROM refunds rf WHERE rf.OID = oi.OrderID AND rf.OIID = oi.ID ORDER BY rf.ID DESC LIMIT 1),
                                        oi.TotalAmount
                                    )
                                ELSE 0 
                            END as refund_amount
                        "),
                        DB::raw("(SELECT rf.Reason FROM refunds rf WHERE rf.OID = oi.OrderID AND (rf.OIID = oi.ID OR rf.OIID IS NULL) ORDER BY rf.ID DESC LIMIT 1) as refund_reason"),
                        DB::raw("(SELECT rt.TxnID FROM refund_transactions rt JOIN refunds rf ON rt.RefundID = rf.ID WHERE rf.OID = oi.OrderID AND (rf.OIID = oi.ID OR rf.OIID IS NULL) ORDER BY rf.ID DESC LIMIT 1) as refund_txn_id"),
                        DB::raw("(SELECT rf.ProcessedAt FROM refunds rf WHERE rf.OID = oi.OrderID AND (rf.OIID = oi.ID OR rf.OIID IS NULL) ORDER BY rf.ID DESC LIMIT 1) as refund_processed_at"),
                        'rbd.upi_id as refund_upi_id',
                        'rbd.account_number as refund_account_no',
                        'rbd.account_holder_name',
                        'rbd.ifsc_code as refund_ifsc_code',
                        'r.requested_at as return_requested_at',
                        'r.approved_at as return_approved_at',
                        'r.refund_initiated_at',
                        'r.refund_completed_at',
                        'r.updated_at as return_last_updated'
                    )
                    ->get()
                    ->unique('ID');

                return $order;
            });

            return response()->json([
                'status' => true,
                'data'   => $orders,
                'message' => 'Orders fetched successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'error' => $e->getMessage()], 500);
        }
    }
    public function placeOrder(Request $request)
    {
        // 1. Full Validation
        $validator = Validator::make($request->all(), [
            'UID' => 'required|integer',
            'ShippingAddressID' => 'required|integer',
            'items' => 'required|array|min:1',
            'PaymentMode' => 'required|string',
            'GrandTotal' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 400);
        }

        DB::beginTransaction();

        try {
            $orderNo = 'ORD' . strtoupper(uniqid());
            $invoiceNo = 'INV' . rand(1000, 9999);

            // --- 1. PRE-CALCULATE TOTAL BASE PRICE FOR PROPORTIONAL COUPON SPLIT ---
            $totalBaseForSplit = 0;
            foreach ($request->items as $item) {
                $dbP = DB::table('product_variants')->where('id', $item['PVID'])->select('SellPrice')->first();
                if ($dbP) $totalBaseForSplit += ($dbP->SellPrice * (int)$item['Quantity']);
            }

            // --- 2. COUPON DISCOUNT INITIALIZATION ---
            $totalCouponDiscount = 0;
            $couponId = null;
            $couponCode = null;

            if ($request->coupon_code) {
                $coupon = DB::table('coupons')
                    ->where('Code', strtoupper(trim($request->coupon_code)))
                    ->where('IsActive', 1)
                    ->where('StartDate', '<=', now())
                    ->where('EndDate', '>=', now())
                    ->first();

                if ($coupon) {
                    // 🔒 SECURITY: Re-validate MinOrderAmount at order placement
                    // Frontend pe item hata ke ya qty ghata ke coupon bypass nahi ho sakta
                    if ($coupon->MinOrderAmount && $totalBaseForSplit < $coupon->MinOrderAmount) {
                        // Silently ignore coupon — coupon invalid at current cart total
                        $coupon = null;
                    }
                }

                if ($coupon) {
                    if ($coupon->DiscountType == 5) {
                        $totalCouponDiscount = min($coupon->DiscountValue, $totalBaseForSplit);
                    } else {
                        $totalCouponDiscount = ($totalBaseForSplit * $coupon->DiscountValue) / 100;
                        if ($coupon->MaxDiscountAmount) $totalCouponDiscount = min($totalCouponDiscount, $coupon->MaxDiscountAmount);
                    }
                    $totalCouponDiscount = (float)$totalCouponDiscount;
                    $couponId = $coupon->ID;
                    $couponCode = $coupon->Code;
                }
            }


            $runningFinalItemsTotal = 0;
            $runningTotalTax = 0;
            $runningTotalMRP = 0;
            $runningTotalDiscount = 0;
            $totalQtyCount = 0;
            $orderItemsFinalPayload = [];

            // --- 3. MAIN ITEM LOOP (PROPORTIONAL PRECISION CALCULATION) ---
            foreach ($request->items as $item) {
                $dbProduct = DB::table('product_variants as pv')
                    ->join('product as p', 'p.id', '=', 'pv.PID')
                    ->where('pv.id', $item['PVID'])
                    ->select('pv.SellPrice as Price', 'pv.Price as MRP', 'pv.PID as product_id', 'pv.id as PVID', 'p.Title', 'p.GST as GstRate')
                    ->first();

                if (!$dbProduct) throw new \Exception("Product variant not found for PVID: " . $item['PVID']);

                $qty = (int)$item['Quantity'];
                $mrp = (float)$dbProduct->MRP;
                $sellPrice = (float)$dbProduct->Price;
                $gstPercent = (float)$dbProduct->GstRate;

                // --- PROPORTIONAL COUPON SHARE (THE HEART OF PRECISION) ---
                $itemBasePrice = $sellPrice * $qty;
                $itemCouponShare = ($totalBaseForSplit > 0) ? ($itemBasePrice / $totalBaseForSplit) * $totalCouponDiscount : 0;
                
                // --- TAX ON NET VALUE (After-Coupon Amount) ---
                $netTaxableValue = $itemBasePrice - $itemCouponShare;
                $itemTax = ($netTaxableValue * $gstPercent) / 100;
                
                $itemFinalTotal = $netTaxableValue + $itemTax;

                $runningFinalItemsTotal += $itemFinalTotal;
                $runningTotalTax        += $itemTax;
                $runningTotalMRP        += ($mrp * $qty);
                $runningTotalDiscount    += ($mrp - $sellPrice) * $qty;
                $totalQtyCount          += $qty;

                // 4. Inventory Stock Update
                $inventory = DB::table('inventory')->where('PVID', $item['PVID'])->lockForUpdate()->first();
                if (!$inventory || $inventory->AvailableQty < $qty) {
                    throw new \Exception("Sorry, " . $dbProduct->Title . " is out of stock!");
                }
                
                DB::table('inventory')->where('PVID', $item['PVID'])->update([
                    'AvailableQty' => $inventory->AvailableQty - $qty,
                    'SoldQty' => $inventory->SoldQty + $qty,
                    'Updated_At' => now()
                ]);

                $orderItemsFinalPayload[] = [
                    'PID' => $dbProduct->product_id,
                    'PVID' => $dbProduct->PVID,
                    'ProductTitle' => $dbProduct->Title,
                    'Quantity' => $qty,
                    'UnitPrice' => $mrp,
                    'SellPrice' => $sellPrice,
                    'Discount' => ($mrp > 0) ? round((($mrp - $sellPrice) / $mrp) * 100) : 0,
                    'DiscountAmt' => ($mrp - $sellPrice) * $qty,
                    'Gst' => round($itemTax, 2),
                    'coupon_share' => $itemCouponShare, 
                    'TotalAmount' => round($itemFinalTotal, 2), 
                    'VariantAttribute' => $item['VariantAttribute'] ?? '',
                    'ItemStatus' => 18,
                    'CreatedDtTm' => now(),
                ];
            }

            $actualPlatformFee = 10.00;
            $actualShippingFee = ($totalBaseForSplit >= 500 || $totalBaseForSplit <= 0) ? 0 : 40.00;

            // Final Master Calculation (Rounded only at the end)
            $finalBackendTotal = (int)round($runningFinalItemsTotal + $actualPlatformFee + $actualShippingFee);

            // Final Price Verification
            if (abs($finalBackendTotal - round($request->GrandTotal)) > 5) {
                throw new \Exception("Price mismatch detected. Please refresh your cart.");
            }

            // --- 5. INSERT MASTER ORDER RECORD ---
            $orderId = DB::table('orders')->insertGetId([
                'UID' => $request->UID,
                'OrderNo' => $orderNo,
                'OrderStatus' => 8,
                'TotalMRP' => $runningTotalMRP,
                'TotalDiscount' => $runningTotalDiscount + $totalCouponDiscount,
                'TotalTax' => $runningTotalTax,
                'ShippingFee' => $actualShippingFee,
                'PlatformFee' => $actualPlatformFee,
                'GrandTotalAmount' => $finalBackendTotal,
                'PaymentStatus' => 14,
                'ShippingAddressID' => $request->ShippingAddressID,
                'InvoiceNo' => $invoiceNo,
                'invoiceDate' => now(),
                'total_items' => count($orderItemsFinalPayload),
                'total_quantity' => $totalQtyCount,
                'CouponID' => $couponId,
                'CouponCode' => $couponCode,
                'CouponDiscount' => $totalCouponDiscount > 0 ? $totalCouponDiscount : null,
                'CreatedDtTm' => now(),
            ]);

            // --- 6. INSERT ORDER ITEMS & STATUS HISTORY ---
            foreach ($orderItemsFinalPayload as $oiData) {
                $oiData['OrderID'] = $orderId;
                $oiId = DB::table('order_items')->insertGetId($oiData);

                DB::table('order_items_status_history')->insert([
                    'OID' => $orderId,
                    'OrderItemID' => $oiId,
                    'Status' => 18,
                    'NewStatus' => 18,
                    'ChangedBy' => $request->UID,
                    'CreatedDtTm' => now(),
                ]);
            }

            // --- 7. COUPON USAGE RECORD ---
            if ($couponId) {
                DB::table('coupon_usage')->insert([
                    'CouponID' => $couponId,
                    'UID' => $request->UID,
                    'OID' => $orderId,
                    'UsedAt' => now()
                ]);
            }

            // --- 8. PAYMENT PROCESSING ---
            if ($request->PaymentMode == 'COD') {
                $modeForOrderPayment = 49; $methodForPayments = 24; $opStatus = 14; $pStatus = 26;
            } elseif ($request->PaymentMode == 'UPI' || $request->PaymentMode == 'ONLINE') {
                $modeForOrderPayment = 50; $methodForPayments = 25; $opStatus = 14; $pStatus = 26;
            } else {
                throw new \Exception("Invalid Payment Mode selected!");
            }

            DB::table('order_payment')->insert([
                'OID'           => $orderId,
                'TotalAmount'   => $finalBackendTotal,
                'PaidAmount'    => 0,
                'PendingAmount' => $finalBackendTotal,
                'PaymentMode'   => $modeForOrderPayment,
                'PaymentStatus' => $opStatus,
                'UpdatedAt'     => now(),
            ]);

            DB::table('payments')->insert([
                'OID'           => $orderId,
                'Amount'        => $finalBackendTotal,
                'PaymentMethod' => $methodForPayments,
                'TxnID'         => ($modeForOrderPayment == 49) ? 'COD-' . strtoupper(uniqid()) : ($request->TransactionID),
                'Status'        => $pStatus,
                'PaidAt'        => now(),
                'CreatedDtTm'   => now(),
            ]);

            // --- 9. DELETE FROM CART (Only if not Buy Now) ---
            if (!$request->isBuyNow) {
                $variantIds = array_map(function($pi) { return $pi['PVID']; }, $orderItemsFinalPayload);
                DB::table('cart')->where('UID', $request->UID)->whereIn('VPID', $variantIds)->delete();
            }

            DB::commit();

            // --- 10. FETCH DETAILS FOR RESPONSE & EMAIL ---
            $shippingAddress = DB::table('address')->where('ID', $request->ShippingAddressID)->first();
            $user = DB::table('users')->where('ID', $request->UID)->first();

            try {
                // Enable mail for both COD (49) and Online/UPI (50)
                $allowedMailModes = [49, 50]; 
                if (in_array($modeForOrderPayment, $allowedMailModes) && $user && $shippingAddress) {
                    $addressString = $shippingAddress->Address . ", " . $shippingAddress->City . ", " . $shippingAddress->State . " - " . $shippingAddress->Pincode;
                    $mailData = [
                        'order_no'      => $orderNo,
                        'user_name'     => $user->Name,
                        'address_name'  => $shippingAddress->Name,
                        'address_details' => $addressString,
                        'payment_mode'  => $request->PaymentMode,
                        'grand_total'   => $finalBackendTotal,
                        'delivery_date' => now()->addDays(7)->format('l, d F Y'),
                    ];
                    Mail::to($user->Email)->send(new DynamicMail($mailData, 'mail.order_confirmation', 'Order Confirmed - #' . $orderNo . ' | ' . config('app.name', 'Fintrick')));
                }
            } catch (\Exception $mailEx) {
                Log::error("Order Mail Error: " . $mailEx->getMessage());
            }

            return response()->json([
                'success' => true,
                'OrderNo' => $orderNo,
                'GrandTotal' => $finalBackendTotal,
                'PaymentMode' => $request->PaymentMode,
                'ShippingAddress' => $shippingAddress ? [
                    'Name' => $shippingAddress->Name,
                    'Details' => $shippingAddress->Address . ", " . $shippingAddress->City . ", " . $shippingAddress->State . " - " . $shippingAddress->Pincode
                ] : null,
                'DeliveryEstimate' => now()->addDays(7)->format('l, d F Y')
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ==========================================
    // COUPON SYSTEM APIs
    // ==========================================
    public function myCoupons()
    {
        try {
            $userId = Auth::id();

            $coupons = DB::table('coupons')
                ->where('IsActive', 1)
                ->where('StartDate', '<=', now())
                ->where('EndDate', '>=', now())
                ->select('ID', 'Code', 'Description', 'DiscountType', 'DiscountValue', 'MaxDiscountAmount', 'MinOrderAmount')
                ->get()
                ->filter(function ($coupon) use ($userId) {
                    // Check total usage limit
                    if ($coupon->ID) {
                        $totalUsed = DB::table('coupon_usage')->where('CouponID', $coupon->ID)->count();
                        $limit = DB::table('coupons')->where('ID', $coupon->ID)->value('UsageLimit');
                        if ($limit && $totalUsed >= $limit) return false;

                        // Check per-user limit
                        $userUsed = DB::table('coupon_usage')->where('CouponID', $coupon->ID)->where('UID', $userId)->count();
                        $perUserLimit = DB::table('coupons')->where('ID', $coupon->ID)->value('UsageLimitPerUser');
                        if ($perUserLimit && $userUsed >= $perUserLimit) return false;
                    }
                    return true;
                })
                ->map(function ($coupon) {
                    $coupon->DiscountValue = (int)round($coupon->DiscountValue);
                    $coupon->MaxDiscountAmount = $coupon->MaxDiscountAmount ? (int)round($coupon->MaxDiscountAmount) : null;
                    $coupon->MinOrderAmount = $coupon->MinOrderAmount ? (int)round($coupon->MinOrderAmount) : null;
                    return $coupon;
                })
                ->values();

            return response()->json(['status' => true, 'data' => $coupons], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function applyCoupon(Request $request)
    {
        try {
            $userId = Auth::id();
            $code = strtoupper(trim($request->code));
            $cartAmount = (float) $request->cart_amount;

            // 1. Find coupon
            $coupon = DB::table('coupons')
                ->where('Code', $code)
                ->where('IsActive', 1)
                ->where('StartDate', '<=', now())
                ->where('EndDate', '>=', now())
                ->first();

            if (!$coupon) {
                return response()->json(['status' => false, 'message' => 'Invalid or expired coupon code.'], 200);
            }

            // 2. Min order check
            if ($coupon->MinOrderAmount && $cartAmount < $coupon->MinOrderAmount) {
                return response()->json([
                    'status' => false,
                    'message' => "Minimum order amount is ₹" . (int)round($coupon->MinOrderAmount) . " to use this coupon."
                ], 200);
            }

            // 3. Total usage limit
            if ($coupon->UsageLimit) {
                $totalUsed = DB::table('coupon_usage')->where('CouponID', $coupon->ID)->count();
                if ($totalUsed >= $coupon->UsageLimit) {
                    return response()->json(['status' => false, 'message' => 'This coupon has reached its usage limit.'], 200);
                }
            }

            // 4. Per-user limit
            if ($coupon->UsageLimitPerUser) {
                $userUsed = DB::table('coupon_usage')->where('CouponID', $coupon->ID)->where('UID', $userId)->count();
                if ($userUsed >= $coupon->UsageLimitPerUser) {
                    return response()->json(['status' => false, 'message' => 'You have already used this coupon.'], 200);
                }
            }

            // 5. Calculate discount
            if ($coupon->DiscountType == 5) {
                // FLAT discount
                $discount = min($coupon->DiscountValue, $cartAmount);
            } else {
                // PERCENT discount
                $discount = ($cartAmount * $coupon->DiscountValue) / 100;
                if ($coupon->MaxDiscountAmount) {
                    $discount = min($discount, $coupon->MaxDiscountAmount);
                }
            }

            $discount = (int)round($discount);

            return response()->json([
                'status' => true,
                'message' => "Coupon applied! You save ₹{$discount}",
                'coupon_id' => $coupon->ID,
                'discount' => $discount,
                'coupon_code' => $coupon->Code,
                'min_order_amount' => $coupon->MinOrderAmount ? (int)round($coupon->MinOrderAmount) : 0,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function paymentInitiate(Request $request)
    {
        $gatewayToken = env('PAYIN_GATEWAY_TOKEN');

        $request->validate([
            'order_id' => 'required|string',
            'name'     => 'required|string',
            'email'    => 'required|email',
            'phone'    => 'required|digits:10',
            'amount'   => 'required|numeric|min:1',
        ]);

        // 🛡️ Strict Developer Check: Phone Number validation
        $phone = trim($request->phone);
        if (str_starts_with($phone, '0') || strlen($phone) !== 10) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Phone Number format: Must be exactly 10 digits and cannot start with 0',
                'debug_phone' => $phone
            ], 400);
        }

        try {
            // Prepare gateway payload
            $payload = [
                "token"   => $gatewayToken,
                "orderid" => $request->order_id,
                "name"    => $request->name,
                "email"   => $request->email,
                "method"  => 1, // UPI
                "phone"   => $request->phone,
                "amount"  => (float) $request->amount
            ];
            $response = Http::timeout(30)->post(
                'https://payincreate.upiweb.live/api/payin',
                $payload
            );
            $result = $response->json();

            // Logging (debug and transaction tracking)
            Log::info('Payin Request', $payload);
            Log::info('Payin Response', $result);

            if (isset($result['Status']) && $result['Status'] === 'INITIATE') {
                $order = DB::table('orders')
                    ->where('OrderNo', $result['OrderID'])
                    ->first();

                if (!$order) {
                    Log::error('Order not found', ['OrderNo' => $result['OrderID']]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Order not found'
                    ]);
                }
                // 3. Security Check: Validate DB Amount against Gateway Amount
                if (round($order->GrandTotalAmount) !== round($result['Amount'])) {
                    Log::error('Security Breach: Amount Mismatch', [
                        'db_amt' => $order->GrandTotalAmount,
                        'gateway_amt' => $result['Amount']
                    ]);
                    return response()->json(['success' => false, 'message' => 'Invalid payment amount']);
                }

                $updatePayment = DB::table('payments')
                    ->where('OID', $order->ID)
                    ->update([
                        'TxnID'      => $result['TxnID'], // Update Gateway Transaction ID
                        'Amount'     => $result['Amount'], // Validate and update amount
                        'UpiIntend'    => $result['UPI_URL'],
                        'Status'     => 43,                // Status: Initiated (Pending)
                        'ModifiedDtTm' => now(),
                    ]);

                if ($updatePayment) {
                    return response()->json([
                        'success' => true,
                        'message' => $result['Message'],
                        'data'    => $result
                    ]);
                } else {
                    // Handle missing order record scenario
                    Log::error('Payment Update Failed: OrderID not found', ['order_id' => $request->order_id]);
                    return response()->json(['success' => false, 'message' => 'Order record not found']);
                }
                
            }
            // 7. Error Handle
            return response()->json([
                'success' => false,
                'message' => $result['Message'] ?? 'Payment failed',
                'error'   => $result
            ], 400);
        } catch (\Exception $e) {

            Log::error('Payin Exception', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function checkStatus($txnId)
    {

        $payment = DB::table('payments')->where('TxnID', $txnId)->first();

        if (!$payment) {
            return response()->json([
                'success' => false,
                'status' => 0,
                'message' => 'Transaction not found'
            ]);
        }

        // ✅ SUCCESS
        if ($payment->Status == 27) {
            return response()->json([
                'success' => true,
                'status' => 27,
                'message' => 'Payment Successful'
            ]);
        }

        // ❌ FAILED
        if ($payment->Status == 28) {
            return response()->json(['success' => true, 'status' => 28, 'message' => 'Payment Failed']);
        }

        // ⏳ INITIATE → expiry check
        if ($payment->Status == 43) {

            $startTime = \Carbon\Carbon::parse($payment->ModifiedDtTm);

            if ($startTime->diffInSeconds(now()) > 300) {

                DB::table('payments')
                    ->where('TxnID', $txnId)
                    ->update(['Status' => 42]); // Expired

                return response()->json([
                    'success' => false,
                    'status' => 42
                ]);
            }
        }

        // ⏳ PENDING / INITIATE
        return response()->json([
            'success' => true,
            'status' => $payment->Status,
            'message' => 'Waiting for payment'
        ]);
    }
    public function cancelPayment(Request $request)
    {
        $txnId = $request->input('txnId');

        $updated = DB::table('payments')
            ->where('TxnID', $txnId)
            ->where('Status', 43)
            ->update([
                'Status' => 59, // 59 = User Manual Cancel
                'ModifiedDtTm' => now()
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment cancelled by user',
            'status' => 59
        ]);
    }

    public function handleWebhook(Request $request)
    {
        Log::info('Payment Webhook Received:', $request->all());
        Log::info('Webhook Headers:', $request->headers->all());
        $userId = Auth::id();

        // 🧾 2. Raw Log Save (Future debugging ke liye)
        $rawTxnId = $request->input('Txnid') ?? $request->input('TxnID') ?? $request->input('txnid');
        $rawOrderNo = $request->input('OrderID') ?? $request->input('orderid');

        DB::table('payin_webhook')->insert([
            'Url'        => $request->fullUrl(),
            'TxnID'      => $rawTxnId,
            'OrderID'    => $rawOrderNo,
            'Response'   => json_encode($request->all()),
            'CreatedDtTm' => now(),
        ]);

        // 📦 3. Data Extract
        $txnId   = $rawTxnId;
        $orderNo = $rawOrderNo;
        $status  = strtoupper($request->input('Status') ?? $request->input('status'));
        $amount  = (float) ($request->input('Amount') ?? $request->input('amount'));

        if (!$txnId) {
            return response()->json(['message' => 'Invalid TxnID'], 400);
        }

        // 🔍 4. Fetch Payment Record (via TxnID)
        $payment = DB::table('payments')->where('TxnID', $txnId)->first();

        if (!$payment) {
            Log::error("Webhook Error: No payment found", ['TxnID' => $txnId]);
            return response()->json(['message' => 'Record not found'], 404);
        }

        // 🔁 5. Idempotency (Ignore duplicate webhooks)
        if (in_array($payment->Status, [27, 28])) {
            return response()->json(['message' => 'Already processed'], 200);
        }

        // 💰 6. Amount Validation (CRITICAL)
        if ((int)round((float)$payment->Amount) !== (int)round($amount)) {
            Log::error("Amount mismatch", [
                'TxnID'    => $txnId,
                'expected' => $payment->Amount,
                'received' => $amount
            ]);
            return response()->json(['message' => 'Amount mismatch'], 400);
        }

        // 🔄 7. Status Mapping
        if ($status === 'SUCCESS') {
            $paymentStatus = 27;
            $orderPaymentStatus = 52; // Paid
            $orderStatus = 9; // Confirmed
        } elseif (in_array($status, ['FAILED', 'CANCELLED', 'USER DROP'])) {
            $paymentStatus = 28;
            $orderPaymentStatus = 51; // Failed
            $orderStatus = 12; // Cancelled immediately (no retry option)
        } else {
            $paymentStatus = 26; // Pending
            $orderPaymentStatus = 51;
            $orderStatus = 8;
        }

        DB::beginTransaction();

        try {
            // 🧾 A. Update payments
            DB::table('payments')->where('ID', $payment->ID)->update([
                'Status'       => $paymentStatus,
                'PaidAt'       => ($paymentStatus == 27) ? now() : null,
                'ModifiedDtTm' => now(),
            ]);

            // 📦 B. Update orders
            DB::table('orders')->where('ID', $payment->OID)->update([
                'OrderStatus'   => $orderStatus,
                'PaymentStatus' => ($paymentStatus == 27) ? 15 : ($paymentStatus == 28 ? 16 : 14),
                'UpdatedDtTm'   => now(),
            ]);

            // 💳 C. Update order_payment
            DB::table('order_payment')->where('OID', $payment->OID)->update([
                'PaymentStatus' => $orderPaymentStatus,
                'PaidAmount'    => ($paymentStatus == 27) ? $amount : 0,
                'PendingAmount' => ($paymentStatus == 27) ? 0 : $payment->Amount,
                'UpdatedAt'     => now(),
            ]);
            $changedBy = Auth::id() ?? $payment->UID ?? 1;

            // 3. 🚨 Update Order Item Status 🚨
            if ($paymentStatus == 27) {
                DB::table('order_items')
                    ->where('OrderID', $payment->OID)
                    ->update([
                        'ItemStatus' => 19,
                        'updatedDtTm' => now()
                    ]);
                // 4. 🚨 Log Status History 🚨
                $items = DB::table('order_items')->where('OrderID', $payment->OID)->get();

                foreach ($items as $item) {
                    DB::table('order_items_status_history')->where('OrderItemID', $item->ID)->update([
                        'Status'      => 18, // Old status
                        'NewStatus'   => 19, // New status
                        'ChangedBy'   => $changedBy,
                        'UpdatedDtTm' => now()
                    ]);
                }
            } elseif ($paymentStatus == 28) {
                $items = DB::table('order_items')->where('OrderID', $payment->OID)->get();
                foreach ($items as $item) {
                    // 1. Inventory Update (Restore Stock)
                    DB::table('inventory')->where('PVID', $item->PVID)->update([
                        'AvailableQty' => DB::raw("AvailableQty + " . $item->Quantity),
                        'SoldQty'      => DB::raw("SoldQty - " . $item->Quantity),
                        'Updated_At'   => now()
                    ]);

                    // 2. Order Item Status Update (22 = Cancelled)
                    DB::table('order_items')->where('ID', $item->ID)->update([
                        'ItemStatus' => 22,
                        'updatedDtTm' => now()
                    ]);

                    // 3. History Table Entry
                    DB::table('order_items_status_history')->where('OrderItemID', $item->ID)->update([
                        'Status'      => 18, // Old: Pending
                        'NewStatus'   => 22, // New: Cancelled
                        'ChangedBy'   => $changedBy,
                        'CreatedDtTm' => now()
                    ]);
                }
            }
            DB::commit();

            // --- 🚨 SEND CONFIRMATION EMAIL ONLY AFTER SUCCESS 🚨 ---
            if ($paymentStatus == 27) {
                try {
                    $order = DB::table('orders')->where('ID', $payment->OID)->first();
                    $shippingAddress = DB::table('address')->where('ID', $order->ShippingAddressID)->first();
                    $user = DB::table('users')->where('ID', $order->UID)->first();
                    
                    if ($user && $shippingAddress && $order) {
                        $addressString = $shippingAddress->Address . ", " . $shippingAddress->City . ", " . $shippingAddress->State . " - " . $shippingAddress->Pincode;
                        
                        $mailData = [
                            'order_no'      => $order->OrderNo,
                            'user_name'     => $user->Name,
                            'address_name'  => $shippingAddress->Name,
                            'address_details' => $addressString,
                            'payment_mode'  => "Online / UPI",
                            'grand_total'   => $order->GrandTotal,
                            'delivery_date' => now()->addDays(7)->format('l, d F Y'),
                        ];

                        Mail::to($user->Email)->send(new DynamicMail($mailData, 'mail.order_confirmation', 'Order Confirmed - #' . $order->OrderNo . ' | ' . config('app.name', 'Fintrick')));
                    }
                } catch (\Exception $mailEx) {
                    Log::error("Webhook Order Mail Error: " . $mailEx->getMessage());
                }
            }

            return response()->json(['success' => true], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error("Webhook Crash", [
                'error' => $e->getMessage(),
                'TxnID' => $txnId
            ]);

            return response()->json(['message' => 'Server Error'], 500);
        }
    }
    public function cancelOrder(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
            'refund_method' => 'nullable|string|in:bank_transfer,upi',
            'account_holder_name' => 'required_if:refund_method,bank_transfer|max:50',
            'account_no' => 'required_if:refund_method,bank_transfer|max:30',
            'ifsc_code' => 'required_if:refund_method,bank_transfer|max:20',
            'upi_id' => 'required_if:refund_method,upi|max:100',
            'refund_reason' => 'nullable|string|max:500'
        ]);

        $userId = Auth::id();
        $orderId = $request->order_id;

        $order = DB::table('orders')
            ->where('ID', $orderId)
            ->where('UID', $userId)
            ->first();

        if (!$order || !in_array($order->OrderStatus, [8, 9])) {
            return response()->json([
                'success' => false,
                'message' => 'Order cannot be cancelled.'
            ], 400);
        }

        $orderPayment = DB::table('order_payment')
            ->where('OID', $orderId)
            ->first();

        if (!$orderPayment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment details not found.'
            ], 400);
        }

        DB::beginTransaction();

        try {
            $items = DB::table('order_items')
                ->where('OrderID', $orderId)
                ->get();

            $itemHistoryData = [];

            $itemStatus = ($orderPayment->PaymentStatus == 15 || $orderPayment->PaymentStatus == 52) ? 51 : 22; // 51 = Refund Pending, 22 = Cancelled

            $activeItems = $items->filter(function($item) {
                return !in_array($item->ItemStatus, [22, 51, 23, 60, 44, 45, 46, 47, 48, 55, 56]);
            });

            if ($activeItems->isEmpty() && $order->OrderStatus != 12) {
                // If no active items left but order not marked cancelled, just mark order cancelled
                DB::table('orders')->where('ID', $orderId)->update(['OrderStatus' => 12, 'UpdatedDtTm' => now()]);
                DB::commit();
                return response()->json(['success' => true, 'message' => 'Order was already partially processed. Full cancellation completed.']);
            }

            foreach ($activeItems as $item) {
                // ✅ 1. Inventory Restore
                DB::table('inventory')
                    ->where('PVID', $item->PVID)
                    ->update([
                        'AvailableQty' => DB::raw("AvailableQty + $item->Quantity"),
                        'SoldQty'      => DB::raw("SoldQty - $item->Quantity"),
                        'Updated_At'   => now()
                    ]);

                // ✅ 2. Prepare History Data
                $itemHistoryData[] = [
                    'OID'         => $orderId,
                    'OrderItemID' => $item->ID,
                    'Status'      => $item->ItemStatus,
                    'NewStatus'   => $itemStatus,
                    'ChangedBy'   => $userId,
                    'CreatedDtTm' => now()
                ];
            }

            // ✅ 3. Update ONLY active items to Cancelled/Refund Pending
            DB::table('order_items')
                ->where('OrderID', $orderId)
                ->whereIn('ID', $activeItems->pluck('ID')->toArray())
                ->update([
                    'ItemStatus' => $itemStatus,
                    'is_partially_cancelled' => 1,
                    'updatedDtTm' => now()
                ]);

            foreach ($itemHistoryData as $history) {
                DB::table('order_items_status_history')
                    ->where('OrderItemID', $history['OrderItemID'])
                    ->update([
                        'Status'      => $history['Status'],
                        'NewStatus'   => $history['NewStatus'],
                        'ChangedBy'   => $history['ChangedBy'],
                        'UpdatedDtTm' => now()
                    ]);
            }

            // --- Memory Based Financial Aggregation (No Extra SQL hits) ---
            $remainingSubtotal = $activeItems->sum('TotalAmount'); // Sum of items we are cancelling NOW
            
            // 🚨 Is this a "Full Order Termination"?
            $prevActiveCount = $items->whereNotIn('ItemStatus', [22, 51, 23, 60, 44, 45, 46, 47, 48, 55, 56])->count();
            $isFinalCancellation = ($prevActiveCount === $activeItems->count());
            
            // --- Proportional Coupon Recovery ---
            $originalWholeSubtotal = $items->sum('TotalAmount'); 
            $orderCouponDiscount = $order->CouponDiscount ?? 0;
            $actionCouponShare = ($originalWholeSubtotal > 0) ? ($remainingSubtotal / $originalWholeSubtotal) * $orderCouponDiscount : 0;
            
            // Status-Aware Fee Refund Logic
            $isPreShip = ($order->OrderStatus < 10);
            $currentActionRefundAmount = (int)round($remainingSubtotal - $actionCouponShare + ($isFinalCancellation && $isPreShip ? ($order->ShippingFee + $order->PlatformFee) : 0));
            
            // Determine Financial States
            $paidStatuses = [15, 17, 52, 53, 55, 61]; 
            $wasPaidViaOnline = in_array((int)$orderPayment->PaymentStatus, $paidStatuses) || in_array((int)$order->PaymentStatus, $paidStatuses);
            $isCOD = ($orderPayment->PaymentMode == 49);
            $finalStatus = (!$isCOD && $wasPaidViaOnline) ? 55 : 51;

            // Updated settlement snapshot (What's left after this action)
            $newRemainingActiveSubtotal = ($isFinalCancellation) ? 0 : ($originalWholeSubtotal - $remainingSubtotal); // Logical fallback
            
            $currentActiveGrandTotal = ($newRemainingActiveSubtotal > 0) ? ($newRemainingActiveSubtotal + (float)$order->ShippingFee + (float)$order->PlatformFee) : 0;
            $newCancelledAmount = (float)$order->GrandTotalAmount - $currentActiveGrandTotal;

            DB::table('order_payment')
                ->where('OID', $orderId)
                ->update([
                    'PendingAmount'   => ($orderPayment->PaymentMode == 49) ? $currentActiveGrandTotal : 0,
                    'CancelledAmount' => $newCancelledAmount,
                    'PaymentStatus'   => $finalStatus,
                    'UpdatedAt'       => now()
                ]);
            // ✅ 4. Log to refunds table — Per-Item records with Precision Rounding
            if ($wasPaidViaOnline && $remainingSubtotal > 0) {
                // Calculate total amount that NEEDS to be added to refunds table this time
                // We must account for all existing refund records (Pending or Settled) to prevent double-counting.
                $isPreShip = ((int)$order->OrderStatus < 10);
                $existingRefundTotal = DB::table('refunds')->where('OID', $orderId)->sum('Amount');
                $totalTargetRefundForThisCancel = (int)round($newCancelledAmount - (float)$existingRefundTotal);
                
                // Agar Shipped ho gaya hai aur user cancel maarta hai (Safety handle), 
                // toh hum fees wapas nahi karenge, sirf item price denge.
                if (!$isPreShip && $isFinalCancellation) {
                    $orderFees = (float)$order->ShippingFee + (float)$order->PlatformFee;
                    $totalTargetRefundForThisCancel = max(0, $totalTargetRefundForThisCancel - $orderFees);
                }
                
                $runningRefundTotal = 0;
                $activeItemsList = $activeItems->values();
                $totalActiveCount = $activeItemsList->count();

                foreach ($activeItemsList as $index => $refundItem) {
                    $isLastItem = ($index === $totalActiveCount - 1);

                    if ($isLastItem) {
                        // The last item absorbs any rounding differences to ensure perfect match with ledger
                        $itemRefundAmt = $totalTargetRefundForThisCancel - $runningRefundTotal;
                    } else {
                        // Standard rounding for intermediate items
                        $itemRefundAmt = (int)round($refundItem->TotalAmount);
                        $runningRefundTotal += $itemRefundAmt;
                    }

                    if ($itemRefundAmt > 0) {
                        DB::table('refunds')->insert([
                            'OID'         => $orderId,
                            'OIID'        => $refundItem->ID,
                            'Amount'      => $itemRefundAmt,
                            'Reason'      => $request->refund_reason ?? 'Order Cancelled',
                            'Status'      => 51,
                            'CreatedDtTm' => now()
                        ]);
                    }
                }
            }

            // ✅ 5. Final Sync for Snapshots and Status
            (new \App\Http\Controllers\AdminController)->syncOrderTotals($orderId);

            // ✅ 6. Order History Log
            DB::table('order_status_history')->insert([
                'OID'        => $orderId,
                'Status'     => $order->OrderStatus,
                'NewStatus'  => 12,
                'ChangedBy'  => $userId,
                'CreatedDtTm' => now()
            ]);

            // ✅ 7. Bank details check for refunds
            if ($order->PaymentStatus == 15 && $request->refund_method) {
                DB::table('refund_bank_details')->updateOrInsert(
                    ['order_id' => $orderId],
                    [
                        'user_id' => $userId,
                        'account_holder_name' => $request->account_holder_name,
                        'account_number' => $request->account_no,
                        'ifsc_code' => $request->ifsc_code,
                        'upi_id' => $request->upi_id,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]
                );
            }

            $updatedOrder = DB::table('orders')
                ->where('ID', $orderId)
                ->select(
                    'orders.*',
                    DB::raw("(SELECT SUM(rf.Amount) FROM refunds rf WHERE rf.OID = orders.ID AND rf.Status IN (51, 55, 44, 45, 46)) as processing_refund_total")
                )
                ->first();

            $updatedOrder->items = DB::table('order_items as oi')
                ->where('oi.OrderID', $orderId)
                ->select(
                    'oi.*',
                    DB::raw("(SELECT rf.Status FROM refunds rf WHERE rf.OID = oi.OrderID AND (rf.OIID = oi.ID) ORDER BY rf.ID DESC LIMIT 1) as refund_status_id"),
                    DB::raw("(SELECT rf.Amount FROM refunds rf WHERE rf.OID = oi.OrderID AND (rf.OIID = oi.ID) ORDER BY rf.ID DESC LIMIT 1) as refund_amount")
                )
                ->get();
            
            $updatedOrder->payment = DB::table('order_payment')->where('OID', $orderId)->first();
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order cancelled successfully!',
                'data'    => $updatedOrder
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function cancelSingleOrderItem(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'refund_method' => 'nullable|string|in:bank_transfer,upi',
            'account_holder_name' => 'required_if:refund_method,bank_transfer|max:50',
            'account_no' => 'required_if:refund_method,bank_transfer|max:30',
            'ifsc_code' => 'required_if:refund_method,bank_transfer|max:20',
            'upi_id' => 'required_if:refund_method,upi|max:100',
            'refund_reason' => 'nullable|string|max:500'
        ]);

        $itemId = $request->id;
        $userId = Auth::id();

        // 1. Fetch Precise Data
        $item = DB::table('order_items as oi')
            ->join('orders as o', 'oi.OrderID', '=', 'o.ID')
            ->join('order_payment as op', 'o.ID', '=', 'op.OID')
            ->where('oi.ID', $itemId)
            ->where('o.UID', $userId)
            ->select(
                'oi.*',
                'o.ID as OrderID',
                'o.PlatformFee',
                'o.ShippingFee',
                'o.OrderStatus',
                'o.PaymentStatus as OrderPayStatus',
                'op.PaymentMode'
            )
            ->first();

        if (!$item || $item->ItemStatus == 22) {
            return response()->json(['success' => false, 'message' => 'Item not found or already cancelled.'], 400);
        }

        DB::beginTransaction();
        try {
            // 2. Inventory Restore
            DB::table('inventory')->where('PVID', $item->PVID)->update([
                'AvailableQty' => DB::raw("AvailableQty + $item->Quantity"),
                'SoldQty'      => DB::raw("SoldQty - $item->Quantity"),
                'Updated_At'   => now()
            ]);

            $isPaid = ($item->PaymentMode != 49 && $item->OrderPayStatus == 15);
            $newItemStatus = $isPaid ? 51 : 22;

            // 3. Mark Item as Cancelled / Refund Pending
            DB::table('order_items')->where('ID', $itemId)->update([
                'ItemStatus' => $newItemStatus,
                'is_partially_cancelled' => 1,
                'updatedDtTm' => now()
            ]);
            DB::table('order_items_status_history')->where('OrderItemID', $itemId)->update([
                'Status' => $item->ItemStatus,
                'NewStatus' => $newItemStatus,
                'ChangedBy' => $userId,
                'CreatedDtTm' => now()
            ]);
            // --- OPTIMIZED SNAPSHOT CALCULATION (Single Query) ---
            $allOrderItems = DB::table('order_items')->where('OrderID', $item->OrderID)->get();

            // 1. Original Snapshots (All Items)
            $ori_total_mrp       = $allOrderItems->sum(fn($i) => $i->UnitPrice * $i->Quantity);
            $ori_total_discount  = $allOrderItems->sum('DiscountAmt');
            $ori_total_tax       = $allOrderItems->sum('Gst');
            $ori_items_total     = $allOrderItems->sum('TotalAmount');
            $ori_total_qty       = $allOrderItems->sum('Quantity');
            $all_item_count      = $allOrderItems->count();
            
            // This is the true Original Bill Snapshot (Items + Fees)
            $originalGrandTotal = (int)round($ori_items_total + (float)$item->PlatformFee + (float)$item->ShippingFee);

            // 2. Active Items for Remaining Order Total calculation
            $activeItems = $allOrderItems->where('ID', '!=' , $itemId) 
                ->whereNotIn('ItemStatus', [22, 51, 23, 60, 44, 45, 46, 47, 48, 55, 56]);

            $isFullCancel = ($activeItems->count() == 0);
            $activeItemsTotal = $activeItems->sum('TotalAmount');

            // --- PROPORTIONAL COUPON LOGIC ---
            $originalCouponDiscount = DB::table('orders')->where('ID', $item->OrderID)->value('CouponDiscount') ?? 0;
            $itemCouponShare = ($ori_items_total > 0) ? ($item->TotalAmount / $ori_items_total) * $originalCouponDiscount : 0;
            
            $itemRefundAmount = (int)round($item->TotalAmount);
            // Status-Aware Fee Refund Logic: Fees are only refunded if order is NOT yet shipped (Status < 10).
            $isPreShip = ($item->OrderStatus < 10);
            if ($isFullCancel && $isPreShip) {
                $itemRefundAmount += (int)round($item->ShippingFee) + (int)round($item->PlatformFee);
            }

            $finalPlatformFee = (int)round($item->PlatformFee);
            $finalShippingFee = (int)round($item->ShippingFee);
            $finalGrandTotal  = $isFullCancel ? 0 : (int)round($activeItemsTotal + $finalPlatformFee + $finalShippingFee);

            $orderPayment = DB::table('order_payment')->where('OID', $item->OrderID)->first();
            $isCOD = ($orderPayment && $orderPayment->PaymentMode == 49);
            $isPaidFlags = in_array((int)$item->OrderPayStatus, [15, 17, 55, 61]) && !$isCOD;
            
            $newOrderPayStatus = $item->OrderPayStatus;
            if ($isFullCancel) {
                $newOrderPayStatus = $isPaidFlags ? 55 : 14;
            } else if ($isPaidFlags) {
                $newOrderPayStatus = 61; // Partial Refunded
            }

            DB::table('orders')->where('ID', $item->OrderID)->update([
                'TotalMRP'         => round($ori_total_mrp, 2),
                'TotalDiscount'    => round($ori_total_discount, 2),
                'TotalTax'         => round($ori_total_tax, 2),
                'GrandTotalAmount' => $originalGrandTotal, // Always preserve Original Bill Snapshot
                'total_items'      => $all_item_count,
                'total_quantity'   => $ori_total_qty,
                'OrderStatus'      => $isFullCancel ? 12 : $item->OrderStatus,
                'PaymentStatus'    => $newOrderPayStatus,
                'UpdatedDtTm'      => now()
            ]);

            // 5. Update Order Payment (Restore original Amount from snapshots if damaged)
            if ($orderPayment) {
                // Absolute Ledger Sync: Determine amount to keep as 'Active' (Paid/Retained)
                $currentActiveGrandTotal = ($isFullCancel) 
                    ? ($isPreShip ? 0 : (float)$item->PlatformFee + (float)$item->ShippingFee)
                    : (int)round($activeItemsTotal + (float)$item->PlatformFee + (float)$item->ShippingFee);

                $totalCancelled = (float)$originalGrandTotal - $currentActiveGrandTotal;

                $paymentStatus = $isFullCancel 
                    ? ($isPaidFlags ? 55 : 51) 
                    : ($isPaidFlags ? 61 : 51);

                DB::table('order_payment')->where('OID', $item->OrderID)->update([
                    'PendingAmount'   => ($item->PaymentMode == 49) ? $currentActiveGrandTotal : 0,
                    'CancelledAmount' => $totalCancelled,
                    'PaymentStatus'   => $paymentStatus,
                    'UpdatedAt'       => now()
                ]);
            }


            if ($isPaidFlags && $request->refund_method) {
                DB::table('refund_bank_details')->updateOrInsert(
                    ['order_id' => $item->OrderID],
                    [
                        'user_id' => $userId,
                        'account_holder_name' => $request->account_holder_name,
                        'account_number' => $request->account_no,
                        'ifsc_code' => $request->ifsc_code,
                        'upi_id' => $request->upi_id,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]
                );
            }

            if ($isPaidFlags) {
                $exists = DB::table('refunds')
                    ->where('OID', $item->OrderID)
                    ->where('OIID', $itemId)
                    ->whereIn('Status', [51, 55, 56])
                    ->exists();

                if (!$exists) {
                    DB::table('refunds')->insert([
                        'OID'         => $item->OrderID,
                        'OIID'        => $itemId,
                        'Amount'      => $itemRefundAmount,
                        'Reason'      => $request->refund_reason ?? 'Item Cancelled by User',
                        'Status'      => 51, // Pending
                        'CreatedDtTm' => now()
                    ]);
                }
            }

            if ($isFullCancel) {
                DB::table('order_status_history')->insert([
                    'OID'         => $item->OrderID,
                    'Status'      => $item->OrderStatus,
                    'NewStatus'   => 12, // Full Cancelled
                    'ChangedBy'   => $userId,
                    'CreatedDtTm' => now()
                ]);
            } else {
                DB::table('order_status_history')->insert([
                    'OID'         => $item->OrderID,
                    'Status'      => $item->OrderStatus,
                    'NewStatus'   => 62, // Partial
                    'ChangedBy'   => $userId,
                    'CreatedDtTm' => now()
                ]);
            }
            $updatedOrder = DB::table('orders')
                ->where('ID', $item->OrderID)
                ->select(
                    'orders.*',
                    DB::raw("(SELECT SUM(rf.Amount) FROM refunds rf WHERE rf.OID = orders.ID AND rf.Status IN (51, 55, 44, 45, 46)) as processing_refund_total")
                )
                ->first();

            $updatedOrder->items = DB::table('order_items as oi')
                ->where('oi.OrderID', $item->OrderID)
                ->select(
                    'oi.*',
                    DB::raw("(SELECT rf.Status FROM refunds rf WHERE rf.OID = oi.OrderID AND (rf.OIID = oi.ID) ORDER BY rf.ID DESC LIMIT 1) as refund_status_id"),
                    DB::raw("(SELECT rf.Amount FROM refunds rf WHERE rf.OID = oi.OrderID AND (rf.OIID = oi.ID) ORDER BY rf.ID DESC LIMIT 1) as refund_amount")
                )
                ->get();

            $updatedOrder->payment = DB::table('order_payment')->where('OID', $item->OrderID)->first();
            DB::commit();
            return response()->json(['success' => true, 'message' => 'Order updated successfully', 'data' => $updatedOrder]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
    public function returnRequest(Request $request)
    {
        $request->validate([
            'order_id'      => 'required|exists:orders,ID',
            'order_item_id' => 'required|exists:order_items,ID',
            'reason'        => 'required|string|max:255',
            'refund_method' => 'required|in:upi,bank_transfer',
            'images.*'      => 'image|mimes:jpeg,png,jpg|max:2048',
            'account_holder_name' => 'required_if:refund_method,bank_transfer|max:50',
            'account_no'    => 'required_if:refund_method,bank_transfer|max:20',
            'ifsc_code'     => 'required_if:refund_method,bank_transfer|max:15',
            'upi_id'        => 'required_if:refund_method,upi|max:100',
        ]);

        DB::beginTransaction();

        try {
            $userId = Auth::id();

            $order = DB::table('orders')->where('ID', $request->order_id)->where('UID', $userId)->first();
            $item = DB::table('order_items')->where('ID', $request->order_item_id)->where('OrderID', $request->order_id)->first();

            if (!$order || !in_array($order->OrderStatus, [11, 58, 61, 62])) {
                return response()->json(['success' => false, 'message' => 'Only delivered or partially returned orders are eligible for return.'], 400);
            }

            if (now()->diffInDays($order->UpdatedDtTm) > 7) {
                return response()->json(['success' => false, 'message' => 'Return period expired (7 days max).'], 400);
            }

            if (!$item || in_array($item->ItemStatus, [22, 23, 60])) {
                return response()->json(['success' => false, 'message' => 'Item not eligible for return.'], 400);
            }

            $exists = DB::table('order_returns')->where('order_item_id', $request->order_item_id)->whereNotIn('status', [57])->exists();
            if ($exists) {
                return response()->json(['success' => false, 'message' => 'Return already requested for this item.'], 400);
            }

            $returnId = DB::table('order_returns')->insertGetId([
                'return_uid'    => 'RET-' . strtoupper(Str::random(10)),
                'order_id'      => $request->order_id,
                'user_id'       => $userId,
                'order_item_id' => $request->order_item_id,
                'reason'        => $request->reason,
                'comments'      => $request->comments ?? null,
                'status'        => 44, 
                'requested_at'  => now(),
                'updated_at'    => now(),
            ]);

            DB::table('refund_bank_details')->updateOrInsert(
                ['user_id' => $userId, 'order_id' => $request->order_id],
                [
                    'account_holder_name' => $request->account_holder_name,
                    'account_number'      => $request->account_no,
                    'ifsc_code'           => $request->ifsc_code,
                    'upi_id'              => $request->upi_id,
                    'refund_status'       => 'pending',
                    'updated_at'          => now(),
                    'created_at'          => now(),
                ]
            );

            if ($request->hasFile('images')) {
                $imageData = [];
                foreach ($request->file('images') as $file) {
                    $fileName = time() . '_' . $file->getClientOriginalName();
                    $file->move(public_path('assets/images/return'), $fileName);
                    $imageData[] = [
                        'return_id'  => $returnId,
                        'image'      => 'assets/images/return/' . $fileName,
                        'created_at' => now(),
                        'updated_at' => now()
                    ];
                }
                DB::table('order_return_images')->insert($imageData);
            }

            $oldStatus = $item->ItemStatus;
            DB::table('order_items')->where('ID', $request->order_item_id)->update(['ItemStatus' => 60]);
            DB::table('order_items_status_history')->where('OrderItemID', $request->order_item_id)->update([
                'Status'      => $oldStatus,
                'NewStatus'   => 60,
                'ChangedBy'   => $userId,
                'CreatedDtTm' => now()
            ]);
            DB::table('return_status_histories')->insert([
                'return_id'  => $returnId,
                'old_status' => 44,
                'new_status' => 44,
                'changed_by' => $userId,
                'created_at' => now(),
            ]);

            // --- REFUND RECORD GENERATION (Logic Updated for Cancel vs Return) ---
            $orderPayment = DB::table('order_payment')->where('OID', $request->order_id)->first();
            $isCOD = ($orderPayment && $orderPayment->PaymentMode == 49);
            $isPaid = in_array((int)$order->PaymentStatus, [15, 17, 55, 61]);
            
            // Return hamesha delivery ke baad hota hai, isliye status checks
            $isOrderDelivered = in_array((int)$order->OrderStatus, [11, 56, 58, 62]);

            // Agar Online paid hai OR COD Delivered hai (tabhi cash milta hai)
            if (($isPaid || ($isCOD && $isOrderDelivered))) {
                
                // RETURN POLICY: Hamesha Item Price Only (Fees Deducted)
                // Chaahe aakhri item hi kyun na ho, return par fees wapas nahi hogi.
                $refundAmount = (int)round($item->TotalAmount);

                DB::table('refunds')->updateOrInsert(
                    ['OID' => $request->order_id, 'OIID' => $request->order_item_id],
                    [
                        'Amount'      => $refundAmount,
                        'Reason'      => "Return Refund (Item #{$request->order_item_id})",
                        'Status'      => 51, // Pending
                        'CreatedDtTm' => now()
                    ]
                );
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Return request submitted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function calculateSummary(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'coupon_code' => 'nullable|string'
        ]);

        try {
            $runningSubtotal = 0;
            $runningMRP = 0;
            $runningTax = 0;
            $totalQty = 0;

            foreach ($request->items as $item) {
                $pvid = $item['PVID'] ?? $item['variant_id'] ?? null;
                if (!$pvid) continue;

                $dbProduct = DB::table('product_variants as pv')
                    ->join('product as p', 'pv.PID', '=', 'p.ID')
                    ->where('pv.ID', $pvid)
                    ->select('p.ID as product_id', 'p.Title', 'p.GST', 'pv.ID as PVID', 'pv.Price as MRP', 'pv.SellPrice as Price')
                    ->first();

                if (!$dbProduct) continue;

                $qty = (int)($item['Quantity'] ?? 1);
                $sellPrice = (float)$dbProduct->Price;
                $mrp = (float)$dbProduct->MRP;
                if ($mrp == 0 || $mrp < $sellPrice) $mrp = $sellPrice;
                $gstPercent = (float)$dbProduct->GST;

                $itemSubtotal = $sellPrice * $qty;
                $gstAmountInRupees = ($itemSubtotal * $gstPercent) / 100;
                $finalItemPriceWithTax = $itemSubtotal + $gstAmountInRupees;

                $runningSubtotal += $finalItemPriceWithTax;
                $runningMRP += ($mrp * $qty);
                $runningTax += $gstAmountInRupees;
                $totalQty += $qty;
            }

            $basePriceBeforeTax = $runningSubtotal - $runningTax;
            $platformFee = 10.00;
            $deliveryCharge = ($basePriceBeforeTax >= 500 || $basePriceBeforeTax <= 0) ? 0 : 40.00;

            $couponDiscount = 0;
            if ($request->coupon_code) {
                $coupon = DB::table('coupons')->where('Code', strtoupper(trim($request->coupon_code)))->where('IsActive', 1)->where('StartDate', '<=', now())->where('EndDate', '>=', now())->first();
                if ($coupon) {
                    $discountableAmount = $runningSubtotal - $runningTax;
                    if ($coupon->DiscountType == 5) {
                        $couponDiscount = min($coupon->DiscountValue, $discountableAmount);
                    } else {
                        $couponDiscount = ($discountableAmount * $coupon->DiscountValue) / 100;
                        if ($coupon->MaxDiscountAmount) $couponDiscount = min($couponDiscount, $coupon->MaxDiscountAmount);
                    }
                    $couponDiscount = round($couponDiscount, 2);
                }
            }

            $couponRatio = ($basePriceBeforeTax > 0) ? ($couponDiscount / $basePriceBeforeTax) : 0;
            
            // --- NEW STABLE ROUNDING LOGIC ---
            // 1. Calculate the Raw Total (No intermediate rounding)
            $rawNetSubtotal = $basePriceBeforeTax - $couponDiscount;
            $rawNetTax = $runningTax * (1 - $couponRatio);
            $rawGrandTotal = $rawNetSubtotal + $rawNetTax + $platformFee + $deliveryCharge;

            // 2. Round the Total Payable FIRST
            $finalPayable = (int)round($rawGrandTotal);

            // 3. Derive Display components to ensure they add up perfectly 
            $displaySubtotal = (int)round($rawNetSubtotal);
            $displayTax = $finalPayable - $displaySubtotal - (int)$platformFee - (int)$deliveryCharge;
            // ---------------------------------

            return response()->json([
                'success' => true,
                'summary' => [
                    'total_mrp' => (int)round($runningMRP),
                    'bag_discount' => (int)round($runningMRP - $basePriceBeforeTax),
                    'total_base_price' => $displaySubtotal,
                    'original_base_price' => (int)round($basePriceBeforeTax),
                    'total_tax' => $displayTax,
                    'original_tax' => (int)round($runningTax),
                    'delivery_charge' => (int)round($deliveryCharge),
                    'platform_fee' => (int)round($platformFee),
                    'coupon_discount' => (int)round($couponDiscount),
                    'final_payable' => $finalPayable,
                    'total_quantity' => $totalQty,
                    'item_count' => count($request->items)
                ]
            ]);

        } catch (\Throwable $e) {
            Log::error("calculateSummary failed: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
