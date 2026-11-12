@extends('layouts.admin')

@section('title', 'Products | Fintrick Admin')

@section('content')


    <style>
        /* Main wrapper to align everything */
        .custom-pagination-wrapper nav {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 100%;
        }

        /* Left Side: "Showing 1 to 10..." text */
        .custom-pagination-wrapper .text-muted {
            font-size: 0.875rem;
            color: #6c757d !important;
        }

        /* Right Side: Pagination Buttons */
        .custom-pagination-wrapper .pagination {
            display: flex;
            gap: 5px;
            margin: 0;
        }

        .custom-pagination-wrapper .page-item {
            border: none;
        }

        .custom-pagination-wrapper .page-link {
            border: 1px solid #e0e0e0;
            color: #495057;
            padding: 8px 14px;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 8px !important;
            /* Rounded Corners */
            transition: all 0.2s ease-in-out;
            box-shadow: none;
        }

        /* Hover effect */
        .custom-pagination-wrapper .page-link:hover {
            background-color: #f8f9fa;
            border-color: #5e72e4;
            color: #5e72e4;
        }

        /* Active Page Style */
        .custom-pagination-wrapper .page-item.active .page-link {
            background-color: #5e72e4 !important;
            /* Elegant Blue */
            border-color: #5e72e4 !important;
            color: #ffffff !important;
            box-shadow: 0 4px 6px rgba(94, 114, 228, 0.2);
        }

        /* Disabled State */
        .custom-pagination-wrapper .page-item.disabled .page-link {
            background-color: #fcfcfc;
            color: #adb5bd;
            border-color: #e9ecef;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .custom-pagination-wrapper nav {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
        }

        /* Laravel fixed extra arrows and labels fix */
        .custom-pagination-wrapper nav svg {
            width: 20px;
            height: 20px;
        }

        .custom-pagination-wrapper .pagination {
            display: flex;
            flex-wrap: nowrap;
            /* Wrap hone se rokein */
            overflow-x: auto;
            /* Scroll allow karein agar jagah kam ho */
            padding-bottom: 5px;
        }

        /* Hide scrollbar for clean look */
        .custom-pagination-wrapper .pagination::-webkit-scrollbar {
            display: none;
        }

        .custom-pagination-wrapper .page-link {
            white-space: nowrap;
            min-width: 35px;
            text-align: center;
        }
    </style>
    <div class="custom-container">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-12">
                <!-- Page header -->
                <div class="mb-8 d-md-flex justify-content-between align-items-center">
                    <div>
                        <h1 class="mb-3 h2">Products</h1>
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="{{ url('/') }}">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Product List</li>
                            </ol>
                        </nav>
                    </div>
                    <div>
                        <button class="btn btn-dark d-md-flex align-items-center gap-2" data-bs-toggle="modal"
                            data-bs-target="#addNewProductModal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 5l0 14" />
                                <path d="M5 12l14 0" />
                            </svg>
                            New Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <!-- row -->
            <div class="row">
                <div class="col-12">
                    <div class="card card-lg" id="productList"
                        data-list="product_index,product_name,product_category,product_subcategory,product_hsn,product_date,product_price,product_quantity,product_status">
                        <div class="card-header border-bottom-0">
                            <div class="row g-4">
                                <div class="col-lg-4">
                                    <input type="search" class="form-control " id="productSearch" placeholder="Search" />
                                </div>
                                <div class="col-lg-8 d-flex justify-content-end">
                                    <div class="d-flex align-items-center gap-2">

                                        <div class="dropdown">
                                            <a class="btn btn-white dropdown-toggle" href="#" role="button"
                                                data-bs-toggle="dropdown" aria-expanded="false"> Export </a>

                                            <ul class="dropdown-menu">
                                                <li><a class="dropdown-item" href="#">Download as CSV</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="table-responsive table-checkbox" data-simplebar style="height: 600px">
                            <table class="table text-nowrap table-centered table-hover mb-0" data-check-container>
                                <thead class="sticky-top">
                                    <tr>
                                        <th class="sortable" data-column="ID" style="cursor:pointer">ID ↕️</th>
                                        <th class="sortable" data-column="Title" style="cursor:pointer">Product ↕️</th>
                                        <th class="sortable" data-column="CategoryID" style="cursor:pointer">Category ↕️
                                        </th>
                                        <th class="sortable" data-column="SubCategoryID" style="cursor:pointer">
                                            SubCategory ↕️</th>
                                        <th class="sortable" data-column="ShortDesc" style="cursor:pointer">Short
                                            Description ↕️</th>
                                        <th class="sortable" data-column="LongDesc" style="cursor:pointer">Long
                                            Description ↕️</th>
                                        <th class="sortable" data-column="HSN" style="cursor:pointer">HSN ↕️</th>
                                        <th class="sortable" data-column="created_at" style="cursor:pointer">Added Date
                                            ↕️</th>
                                        <th class="sortable" data-column="variant_count" style="cursor:pointer">Add
                                            Varrient ↕️</th>
                                        <th class="sortable" data-column="review_count" style="cursor:pointer">Add
                                            Review ↕️</th>
                                        <th class="sortable" data-column="DealStatus" style="cursor:pointer">Deal
                                            On/Off ↕️</th>
                                        <th class="sortable" data-column="IsTrending" style="cursor:pointer">Trending
                                            ↕️</th>
                                        <th class="sortable" data-column="IsNewArrivals" style="cursor:pointer">
                                            NewArrivals
                                            ↕️</th>
                                        <th class="sortable" data-column="IsMostBuyer" style="cursor:pointer">Most
                                            Buyer ↕️</th>
                                        <th class="sortable" data-column="Status" style="cursor:pointer">Status ↕️
                                        </th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody class="list">
                                    @forelse ($productList as $product)
                                        @php
                                            // dd($product);
                                            // Sirf is specific product ke variants count karo
                                            $thisProductVariants = DB::table('product_variants')
                                                ->where('PID', $product->ID)
                                                ->count();
                                        @endphp
                                        <tr>
                                            <td class="product_index">
                                                <span
                                                    class="text-muted">{{ ($productList->currentPage() - 1) * $productList->perPage() + $loop->iteration }}</span>
                                                {{-- <br>
                                                <small class="fw-bold">#{{ $product->ID }}</small> --}}
                                            </td>
                                            <td class="product_name ps-0">
                                                <div class="d-flex align-items-center">
                                                    <img src="{{ asset($product?->thumbnail_url ?? 'assets/images/placeholder.png') }}"
                                                        class="rounded-3" width="56" height="56"
                                                        style="object-fit:cover" />

                                                    <div class="ms-3 d-flex flex-column" style="min-width:0;">
                                                        <a href="#!" class="fw-semibold text-truncate d-block"
                                                            style="max-width:180px" data-bs-toggle="tooltip"
                                                            data-bs-placement="top"
                                                            title="{{ $product?->Title ?? 'N/A' }}">
                                                            {{ $product?->Title ?? 'N/A' }}
                                                        </a>

                                                        <small class="text-muted">ID: #{{ $product->ID }}</small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td class="product_category">
                                                {{ collect($categories)->firstWhere('ID', $product->CategoryID)->CategoryName ?? 'N/A' }}
                                            </td>

                                            <td class="product_subcategory">
                                                {{ collect($subCategories)->firstWhere('ID', $product->SubcategoryID)->CategoryName ?? 'N/A' }}
                                            </td>
                                            <td>
                                                <a href="javascript:void(0)" class="text-truncate   d-inline-block"
                                                    style="max-width: 220px; cursor: pointer;" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" title="{{ $product?->ShortDesc ?? 'N/A' }}">
                                                    {{ $product?->ShortDesc ?? 'N/A' }}
                                                </a>
                                            </td>

                                            <td>
                                                <a href="javascript:void(0)" class="text-truncate  d-inline-block"
                                                    style="max-width: 220px; cursor: pointer;" data-bs-toggle="tooltip"
                                                    data-bs-placement="top" title="{{ $product?->LongDesc ?? 'N/A' }}">
                                                    {{ $product?->LongDesc ?? 'N/A' }}
                                                </a>
                                            </td>
                                            <td class="product_hsn">{{ $product?->HSN ?? '' }}</td>
                                            <td class="product_date">
                                                {{ $product?->CreatedDtTm ?? '' }}</td>

                                            <td class="product_varrient text-center">
                                                <a href="{{ url('admin/products/variants/' . $product->ID) }}"
                                                    class="btn btn-sm btn-outline-primary position-relative d-inline-flex align-items-center px-3"
                                                    title="Add or Manage Variants">

                                                    <i class="ti ti-layers-intersect fs-4"></i>

                                                    <span class="fw-bold ms-1"
                                                        style="font-size: 1.2rem; line-height: 0;">+</span>

                                                    <span
                                                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                                        style="font-size: 0.65rem;">
                                                        {{ $thisProductVariants ?? 0 }}
                                                    </span>

                                                </a>
                                            </td>

                                            <td class="product_review text-center">
                                                <a href="{{ url('admin/product/reviews/' . $product->ID) }}"
                                                    class="btn btn-sm btn-outline-warning position-relative d-inline-flex align-items-center px-3"
                                                    title="View/Add Reviews">

                                                    <i class="ti ti-star fs-4"></i>

                                                    <span class="fw-bold ms-1"
                                                        style="font-size: 1.1rem; line-height: 0;">+</span>

                                                    <span
                                                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                                                        style="font-size: 0.65rem;">
                                                        {{ number_format($product->avg_rating ?? 0, 1) }}
                                                    </span>
                                                </a>
                                            </td>
                                            <td class="product_deal text-center">
                                                <div class="d-flex justify-content-center">
                                                    <div class="form-check form-switch m-0">
                                                        <input class="form-check-input status-toggle" type="checkbox"
                                                            data-type="DealOnOff" data-id="{{ $product->ID }}"
                                                            {{ $product->DealOnOff == 1 ? 'checked' : '' }}>
                                                    </div>
                                                </div>
                                            </td>

                                            <td class="product_trending text-center">
                                                <div class="d-flex justify-content-center">
                                                    <div class="form-check form-switch">
                                                        <input class="form-check-input status-toggle" type="checkbox"
                                                            data-type="Trending" data-id="{{ $product->ID }}"
                                                            {{ $product->Trending == 1 ? 'checked' : '' }}>
                                                    </div>
                                                </div>
                                            </td>

                                            <td class="product_status text-center">
                                                <div class="d-flex justify-content-center">
                                                    <div class="form-check form-switch">
                                                        <input class="form-check-input status-toggle" type="checkbox"
                                                            data-type="NewArrivals" data-id="{{ $product->ID }}"
                                                            {{ $product->NewArrivals == 1 ? 'checked' : '' }}>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="product_mostBuyer text-center">
                                                <div class="d-flex justify-content-center">
                                                    <div class="form-check form-switch">
                                                        <input class="form-check-input status-toggle" type="checkbox"
                                                            data-type="MostBuyed" data-id="{{ $product->ID }}"
                                                            {{ $product->MostBuyed == 1 ? 'checked' : '' }}>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="product_status text-center">
                                                <div class="d-flex justify-content-center">
                                                    <div class="form-check form-switch">
                                                        <input class="form-check-input status-toggle" type="checkbox"
                                                            data-type="IsActive" data-id="{{ $product->ID }}"
                                                            {{ $product->IsActive == 1 ? 'checked' : '' }}>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div class="d-flex gap-1">
                                                    <button class="btn btn-ghost btn-sm edit-product-btn"
                                                        data-product="{{ json_encode($product) }}">
                                                        <i class="ti ti-edit text-primary fs-4"></i>
                                                    </button>
                                                    <button class="btn btn-ghost-info btn-sm view-product-btn"
                                                        data-product='@json($product)'>
                                                        <i class="ti ti-eye text-primary fs-4"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="8" class="text-center py-5">
                                                <div class="d-flex flex-column align-items-center justify-content-center"
                                                    style="min-height: 400px;">
                                                    <i class="ti ti-package-off text-muted" style="font-size: 4rem;"></i>
                                                    <h5 class="mt-3 fw-bold">No Products Available</h5>
                                                    <p class="text-muted">Currently, there are no products matching your
                                                        search.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                        <div class="pagination-wrapper custom-pagination-wrapper py-3 px-4 border-top">
                            {{ $productList->onEachSide(1)->links('pagination::bootstrap-5') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {{-- add product modal --}}
    <div class="modal fade" id="addNewProductModal" tabindex="-1" aria-labelledby="addNewProductModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addNewProductModalLabel">Add New Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addProductForm" class="needs-validation" novalidate enctype="multipart/form-data">
                    @csrf
                    <input type="hidden" name="productId" id="productId">
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-12">
                                <label class="form-label">Product Title</label>
                                <input type="text" name="title" class="form-control"
                                    placeholder="Enter product name" required>
                                <div class="invalid-feedback">Please enter a product title.</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Product Type</label>
                                <select name="has_variant" id="productType" class="form-select"
                                    onchange="togglePriceField()" required>
                                    <option value=3>Single Product (No Variants)</option>
                                    <option value=4>Variable Product (Multiple Colors/Sizes)</option>
                                </select>
                                <div class="invalid-feedback">Please select a product type.</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Category</label>
                                <select name="category_id" id="categorySelect" class="form-select" required>
                                    <option value="">Select Category</option>
                                    @foreach ($categories as $cat)
                                        <option value="{{ $cat->ID }}">{{ $cat->CategoryName }}</option>
                                    @endforeach
                                </select>
                                <div class="invalid-feedback">Please select a category.</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">SubCategory</label>
                                <select name="Subcategory_id" id="subCategorySelect" class="form-select" required>
                                    <option value="">Select SubCategory</option>
                                    @foreach ($subCategories as $subcat)
                                        <option value="{{ $subcat->ID }}">{{ $subcat->CategoryName }}</option>
                                    @endforeach
                                </select>
                                <div class="invalid-feedback">Please select a sub-category.</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">HSN Code</label>
                                <input type="text" name="hsn_code" class="form-control" placeholder="e.g. 123456"
                                    required>
                                <div class="invalid-feedback">HSN code is required for taxation.</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">GST (%)</label>
                                <input type="number" name="gst" class="form-control" placeholder="18" required>
                                <div class="invalid-feedback">Please provide the GST percentage.</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Main Image (Thumbnail)</label>
                                <input type="file" name="main_image" class="form-control" accept="image/*,.avif" required>
                                <div class="invalid-feedback">Product thumbnail is required.</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Shipping Charges</label>
                                <input type="number" name="shipping_charges" class="form-control" placeholder="40"
                                    required>
                                <div class="invalid-feedback">Please enter shipping charges (0 if free).</div>
                            </div>

                            <div id="simpleProductFields" class="col-md-12 py-2">
                                <div class="row g-3 p-3 border rounded-3 bg-light">
                                    <level>For Single Product (No Varrient)</level>
                                    <div class="col-md-6">
                                        <label class="form-label text-primary fw-bold">MRP (INR)</label>
                                        <input type="number" name="mrp" class="form-control" placeholder="0.00"
                                            id="mrp" required>
                                        <div class="invalid-feedback">Please enter the selling price.</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label text-primary fw-bold">Discount</label>
                                        <input type="number" name="discount" class="form-control" placeholder="0%"
                                            id="simpleDiscount" step="0.01" required>
                                        <div class="invalid-feedback">Please enter the discount price.</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label text-primary fw-bold">Selling Price</label>
                                        <input type="number" name="sellingPrice" class="form-control "
                                            placeholder="0.00" id="sellingPrice" readonly>
                                        <div class="invalid-feedback">Please enter the selling price.</div>
                                    </div>
                                    {{-- <div class="col-md-6">
                                        <label class="form-label text-primary fw-bold">Stock Quantity</label>
                                        <input type="number" name="stock" class="form-control" placeholder="0"
                                            id="simpleStock" required>
                                        <div class="invalid-feedback">Please enter initial stock quantity.</div>
                                    </div> --}}
                                </div>
                            </div>

                            <div class="col-md-12">
                                <label class="form-label">Short Description</label>
                                <div id="editor" style="height:100px;" class="border rounded-top shadow-sm"></div>
                                <div id="short-editor-error" class="text-danger small d-none">Please enter a short
                                    description.</div>
                                <input type="hidden" name="short_description" id="short_description" required>
                            </div>

                            <div class="col-md-12">
                                <label class="form-label">Long Description</label>
                                <div id="editor1" style="height:150px;" class="border rounded-top shadow-sm"></div>
                                <div id="long-editor-error" class="text-danger small d-none">Please enter a long
                                    description.</div>
                                <input type="hidden" name="long_description" id="long_description" required>
                            </div>

                            <div id="variableProductNote" class="col-md-12 d-none">
                                <div class="alert alert-info border-0 shadow-sm">
                                    <i class="ti ti-info-circle me-1"></i> <strong>Variable Product:</strong> You will
                                    manage specific prices and stock levels on the <strong>Variants Page</strong> after
                                    saving this product.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Create Product</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    {{-- product view modal --}}
    <div class="modal fade" id="viewProductModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header bg-light text-white py-3">
                    <h5 class="modal-title d-flex align-items-center" id="viewProductModalLabel">
                        <i class="ti ti-package me-2 fs-5"></i> Product Details
                    </h5>
                    <button type="button" class="btn-close btn-close-black" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>

                <div class="modal-body p-4">
                    <div class="row g-4">
                        <div class="col-md-4 text-center border-end">
                            <h4 id="v-title" class="fw-bold text-primary mb-1"></h4>
                            <p id="v-category" class="text-muted small mb-3"></p>
                            <div class="position-relative d-inline-block mb-3">
                                <img id="v-thumbnail" src="" class="img-fluid rounded shadow-sm border"
                                    style="max-height: 200px; width: 100%; object-fit: cover;">
                                <span id="v-type-badge"
                                    class="position-absolute top-0 start-0 badge rounded-pill bg-dark m-2"></span>
                            </div>
                            <div class="d-grid gap-2">
                                <div class="p-2 bg-light rounded border">
                                    <small class="text-muted d-block">Selling Price</small>
                                    <span class="h4 fw-bold text-success mb-0">₹<span
                                            id="v-selling-price">0.00</span></span>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-8">
                            <div class="row g-3">
                                <div class="col-6 col-sm-4">
                                    <div class="p-3 border rounded shadow-xs bg-white text-center">
                                        <i class="ti ti-hash text-warning fs-6 mb-1"></i>
                                        <small class="d-block text-muted">HSN Code</small>
                                        <strong id="v-hsn" class="text-dark"></strong>
                                    </div>
                                </div>
                                <div class="col-6 col-sm-4">
                                    <div class="p-3 border rounded shadow-xs bg-white text-center">
                                        <i class="ti ti-receipt-tax text-info fs-6 mb-1"></i>
                                        <small class="d-block text-muted">GST Rate</small>
                                        <strong id="v-gst" class="text-dark"></strong>%
                                    </div>
                                </div>
                                <div class="col-6 col-sm-4">
                                    <div class="p-3 border rounded shadow-xs bg-white text-center">
                                        <i class="ti ti-truck-delivery text-danger fs-6 mb-1"></i>
                                        <small class="d-block text-muted">Shipping</small>
                                        <strong id="v-shipping" class="text-dark"></strong>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="p-3 rounded-3 border border-dashed bg-light-primary">
                                        <div class="d-flex justify-content-between mb-2">
                                            <span class="text-muted">Market Price (MRP):</span>
                                            <span class="text-decoration-line-through text-danger">₹<span
                                                    id="v-mrp"></span></span>
                                        </div>
                                        <div class="d-flex justify-content-between mb-2">
                                            <span class="text-muted">Discount Applied:</span>
                                            <span class="badge bg-success-subtle text-success" id="v-discount"></span>
                                        </div>
                                        <hr class="my-2">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <span class="fw-bold">Final Price:</span>
                                            <span class="h5 fw-bolder text-primary mb-0">₹<span
                                                    id="v-final-price"></span></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <h6 class="fw-bold mb-2 mt-2"><i class="ti ti-align-left me-1"></i> Short Description
                                    </h6>
                                    <div id="v-short-desc" class="p-3 bg-light rounded small text-muted border"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer bg-light border-0">
                    <button type="button" class="btn btn-outline-primary px-4 rounded-pill"
                        data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
@endsection
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script>
    $(document).ready(function() {

        // Price Calculation
        $(document).on('input', '#mrp, #simpleDiscount', function() {
            let mrp = parseFloat($('#mrp').val()) || 0;
            let discount = parseFloat($('#simpleDiscount').val()) || 0;

            if (discount > 100) {
                discount = 100;
                $('#simpleDiscount').val(100);
            }

            const discountAmount = (mrp * discount) / 100;
            const sellingPrice = mrp - discountAmount;
            $('#sellingPrice').val(sellingPrice > 0 ? sellingPrice.toFixed(2) : "0.00");
        });

        // 1. EDIT BUTTON CLICK
        $(document).on('click', '.edit-product-btn', function() {
            let p = $(this).data('product');
            console.log("Mapping Data:", p);

            // Modal Header & Button Update
            $('#addNewProductModalLabel').text('Edit Product');
            $('#addProductForm button[type="submit"]').text('Update Product');

            // 1. Basic Inputs (Console ke keys match kiye gaye hain)
            $('#productId').val(p.ID);
            $('input[name="title"]').val(p.Title); // 'ProductName' ki jagah 'Title'

            // 2. Select Dropdowns
            $('#productType').val(p.ProductType).trigger('change');
            $('#categorySelect').val(p.CategoryID).trigger('change');

            // Subcategory tabhi load hogi agar category change trigger work karega
            $('#subCategorySelect').val(p.SubcategoryID).trigger('change');

            $('input[name="hsn_code"]').val(p.HSN); // 'HSNCode' ki jagah 'HSN'
            $('input[name="gst"]').val(p.GST);
            $('input[name="shipping_charges"]').val(p.ShippingCharges);

            // 3. Simple Product Fields (MRP, Discount etc.)
            $('#mrp').val(parseFloat(p.Price).toFixed(2));
            $('#simpleDiscount').val(parseFloat(p.Discount).toFixed(2));
            $('#sellingPrice').val(parseFloat(p.SellPrice).toFixed(2));

            // 4. Quill Editors (Console: ShortDesc, LongDesc)
            if (typeof quill1 !== 'undefined') {
                quill1.root.innerHTML = p.ShortDesc || ''; // 'ShortDescription' -> 'ShortDesc'
            }
            if (typeof quill2 !== 'undefined') {
                quill2.root.innerHTML = p.LongDesc || ''; // 'LongDescription' -> 'LongDesc'
            }

            // 5. Image Handling
            $('input[name="main_image"]').prop('required', false);

            $('#addNewProductModal').modal('show');
        });

        $('#addNewProductModal').on('hidden.bs.modal', function() {
            // 1. Poora form reset
            let form = $('#addProductForm');
            form[0].reset();

            // 2. Hidden field ko manual empty karo (Ye reset() se nahi hota)
            $('#productId').val('');

            // 3. Quill Editors ko empty karo
            if (typeof quill1 !== 'undefined') quill1.setContents([]);
            if (typeof quill2 !== 'undefined') quill2.setContents([]);

            // 4. Validation errors hatao
            form.removeClass('was-validated');
            $('.invalid-feedback').hide();

            // 5. Default UI set karo
            $('#addNewProductModalLabel').text('Create New Product');
            $('#addProductForm button[type="submit"]').text('Create Product').prop('disabled', false);
            $('input[name="main_image"]').prop('required', true);

            // 6. Toggle logic reset
            $('#simpleProductFields').removeClass('d-none');
            $('#variableProductNote').addClass('d-none');
        });

        $(document).ready(function() {
            $("#addProductForm").on('submit', function(e) {
                e.preventDefault();
                // --- A. Sync Quill Data to Hidden Inputs ---
                let shortContent = quill1.root.innerHTML === '<p><br></p>' ? '' : quill1.root
                    .innerHTML;
                let longContent = quill2.root.innerHTML === '<p><br></p>' ? '' : quill2.root
                    .innerHTML;

                $('#short_description').val(shortContent);
                $('#long_description').val(longContent);
                // Reset Errors
                $('#short-editor-error, #long-editor-error').addClass('d-none');
                $('#editor, #editor1').closest('.col-md-12').removeClass('is-invalid');
                let isQuillValid = true;
                // --- B. Frontend Validation Check ---
                var form = this;
                if (form.checkValidity() === false) {
                    e.stopPropagation();
                    $(form).addClass('was-validated');

                    if (!shortContent) $('#short-editor-error').removeClass('d-none');
                    if (!longContent) $('#long-editor-error').removeClass('d-none');

                    return;
                }

                let formData = new FormData(this);
                formData.append('_token', '{{ csrf_token() }}');

                // --- D. AJAX Call ---
                $.ajax({
                    url: "{{ route('admin.product.store') }}",
                    type: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,

                    beforeSend: function() {
                        $('button[type="submit"]').prop('disabled', true).text(
                            'Creating...');
                    },
                    success: function(response) {
                        if (response.status) {
                            Toast.fire({
                                icon: 'success',
                                title: response.message
                            }).then(() => {
                                location.reload();
                            });
                        } else {
                            alert("Error: " + response.message);
                            $('button[type="submit"]').prop('disabled', false).text(
                                'Create Product');
                        }
                    },
                    error: function(xhr) {
                        $('button[type="submit"]').prop('disabled', false).text(
                            'Create Product');

                        if (xhr.status === 422) { // Laravel Validation Error
                            let errors = xhr.responseJSON.errors;
                            console.log(errors);
                            alert("Validation failed! Please check all fields.");
                        } else {
                            alert("Something went wrong. Please try again.");
                        }
                    }
                });
            });
        });

    });
    $(document).on('click', '.view-product-btn', function() {
        let p = $(this).data('product');

        // Basic Info
        $('#v-title').text(p.Title);
        $('#v-category').html(
            `${p.category_name} <i class="ti ti-chevron-right mx-1"></i> ${p.subcategory_name}`);
        $('#v-thumbnail').attr('src', `{{ asset('') }}${p.thumbnail_url}`);

        // Type Badge Logic
        let typeText = (p.ProductType == 3) ? 'Base Product' : 'Variant Product';
        let typeClass = (p.ProductType == 3) ? 'bg-primary' : 'bg-purple';
        $('#v-type-badge').text(typeText).removeClass('bg-primary bg-purple').addClass(typeClass);

        // Pricing & Stats
        $('#v-hsn').text(p.HSN || 'N/A');
        $('#v-gst').text(p.GST);
        $('#v-shipping').text(p.ShippingCharges > 0 ? `₹${p.ShippingCharges}` : 'Free');
        $('#v-mrp').text(parseFloat(p.Price).toFixed(2));
        $('#v-discount').text(p.Discount + '% OFF');
        $('#v-selling-price, #v-final-price').text(parseFloat(p.SellPrice).toFixed(2));

        // Description (Handling HTML from Quill)
        $('#v-short-desc').html(p.ShortDesc || 'No description available.');

        // Open Modal
        $('#viewProductModal').modal('show');
    });

    function togglePriceField() {
        const type = $('#productType').val();
        if (type == 4) { // Agar variable product select hua hai toh simple product ke price/stock fields hide kar do
            $('#simpleProductFields').addClass('d-none');
            $('#variableProductNote').removeClass('d-none');
            $('#mrp, #simpleDiscount, #simpleStock').removeAttr('required');
        } else {
            $('#simpleProductFields').removeClass('d-none');
            $('#variableProductNote').addClass('d-none');
            $('#mrp, #simpleDiscount, #simpleStock').attr('required', 'required');
        }
    }
</script>
<script>
    let timer;
    let currentSort = 'ID';
    let currentOrder = 'desc';

    $(document).on('click', '.sortable', function() {
        currentSort = $(this).data('column');
        currentOrder = (currentOrder === 'asc') ? 'desc' : 'asc';
        let search = $('#productSearch').val();
        fetchProducts(search, 1);
    });
    $(document).on('keyup', '#productSearch', function() {
        let val = $(this).val().trim();
        clearTimeout(timer);
        timer = setTimeout(() => {
            fetchProducts(val);
        }, 400);
    });
    $(document).on('click', '.pagination a', function(e) {
        e.preventDefault();
        let page = $(this).attr('href').split('page=')[1];
        let search = $('#productSearch').val();
        fetchProducts(search, page);
    });
    $(document).on('input', '#productSearch', function() {
        let val = $(this).val();
        if (val === "") {
            fetchProducts('', 1);
        }
    });

    function initTooltips() {
        $('[data-bs-toggle="tooltip"]').tooltip('dispose');

        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                boundary: 'viewport',
                container: 'body' // Isse tooltip table ke peeche nahi dabetga
            });
        });
    }

    function fetchProducts(search = '', page = 1) {
        $.ajax({
            url: "{{ url('admin/products') }}",
            type: "GET",
            data: {
                search: search,
                page: page,
                sort_by: currentSort,
                sort_order: currentOrder
            },
            beforeSend: function() {
                $('.list').css('opacity', '0.5');
            },
            success: function(data) {
                // 1. Table rows update karein
                let newRows = $(data).find('.list').html();
                $('.list').html(newRows);

                // 2. Pagination update karein (Yeh line add karein)
                let newPagination = $(data).find('.pagination-wrapper').html();
                $('.pagination-wrapper').html(newPagination);

                $('.list').css('opacity', '1');

                initTooltips();
            },
            error: function(err) {
                console.log("Error fetching data:", err);
            }
        });
    }

    // Normal page load par chale
    $(document).ready(function() {
        initTooltips();
    });
    $(document).on('change', '.status-toggle', function() {
        let id = $(this).data('id');
        let type = $(this).data('type');
        let status = $(this).prop('checked') ? 1 : 0;
        let _this = $(this); // Current element ko save kar lo agar error pe wapas toggle karna pade

        $.ajax({
            url: "{{ route('product.update-status') }}",
            method: "POST",
            data: {
                _token: "{{ csrf_token() }}",
                id: id,
                column: type,
                value: status
            },
            success: function(response) {
                if (response.status) {
                    Toast.fire({
                        icon: 'success',
                        title: response.message || 'Status Updated Successfully!'
                    }).then(() => {
                        // location.reload(); 
                    });
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: response.message || 'Failed to update status'
                    });
                    // Error aaye toh switch ko wapas purani state pe le jao
                    _this.prop('checked', !status);
                }
            },
            error: function(xhr) {
                let errorMsg = 'Something went wrong!';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                }
                Toast.fire({
                    icon: 'error',
                    title: errorMsg
                });
                _this.prop('checked', !status);
            }
        });
    });
</script>
