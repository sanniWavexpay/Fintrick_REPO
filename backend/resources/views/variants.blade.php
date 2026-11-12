@extends('layouts.admin')

@section('title', 'Variants | Fintrick Admin')

@section('content')
    <style>
        .gallery-item {
            transition: all 0.3s ease;
            border: 1px solid #eee;
            background: #fff;
            padding: 5px;
        }

        .gallery-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .gallery-img-container {
            height: 150px;
            overflow: hidden;
            position: relative;
            border-radius: 8px;
            text-align: center;
        }

        .gallery-img-container img {
            transition: transform 0.5s ease;
        }

        .gallery-item:hover img {
            transform: scale(1.1);
        }

        .delete-btn {
            opacity: 0;
            /* Shuru mein button chupa rahega */
            transition: opacity 0.3s ease;
            background: rgba(220, 53, 69, 0.9);
            border: none;
            backdrop-filter: blur(2px);
        }

        .delete-btn:hover {
            background: rgba(220, 53, 69, 0.9);
        }

        .gallery-item:hover .delete-btn {
            opacity: 1;
            /* Hover karne par button dikhega */
        }

        #view_variant_img {
            transition: transform 0.3s ease;
            border: 2px dashed #dee2e6;
            /* Professional look */
            background: #f8f9fa;
        }

        #view_variant_img:hover {
            transform: scale(1.05);
            /* Hover effect */
        }

        .badge-info-custom {
            background-color: #e0f2fe;
            color: #0369a1;
            border: 1px solid #bae6fd;
            font-weight: 500;
        }
    </style>

    <div class="custom-container">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-12">
                <!-- Page header -->
                <div class="mb-8 d-md-flex justify-content-between align-items-center">
                    <div>
                        <div class="d-flex align-items-center mb-4">
                            <a href="{{ route('admin.products') }}"
                                class="btn btn-outline-secondary btn-sm rounded-circle me-3 shadow-sm d-flex align-items-center justify-content-center"
                                style="width: 35px; height: 35px;" title="Back to Attributes">
                                <i class="ti ti-arrow-left fs-5"></i>
                            </a>
                            <h1 class="h2 mb-0">Variants</h1>
                        </div>
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="{{ url('/') }}">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Variants</li>
                            </ol>
                        </nav>
                    </div>
                    <div>
                        @if ($product->ProductType == 4)
                            <a class='btn btn-dark d-md-flex align-items-center gap-2' data-bs-target='#addVariantModal'
                                data-bs-toggle='modal' href='javascript:void(0)'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 5l0 14" />
                                    <path d="M5 12l14 0" />
                                </svg>
                                Add Variants
                            </a>
                        @else
                            <span class="badge bg-light text-dark">Single Product (No Variants)</span>
                        @endif
                    </div>
                </div>
            </div>
        </div>
        <!-- row -->
        <div class="row">
            <div class="col-12">
                <!-- card -->
                <div class="card card-lg" id="customerList"
                    data-list="variant_index,variant_name,variant_type,variant_sku,variant_attribute,variant_mrp,variant_discount,variant_sellprice,variant_gst,variant_stock,variant_date,variant_offerprice,variant_offerstart,variant_offerend">
                    <div class="card-header border-bottom-0">
                        <div class="row w-100 gx-md-0 gy-4 align-items-center">
                            <div class="col-lg-4 col-md-6">
                                <input type="search" class="form-control listjs-search"
                                    placeholder="Search for category name, image, status" />
                            </div>
                            <div class="col-md-8 d-flex justify-content-md-end gap-2">
                                <a href="#!" class="btn btn-white">Export</a>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive table-checkbox" data-simplebar style="height: 500px">
                        <table class="table text-nowrap mb-0 table-centered table-hover" data-check-container>
                            <thead class="sticky-top">
                                <tr>
                                    <th class="listjs-sorter" data-sort="variant_index">ID</th>
                                    <th class="listjs-sorter" data-sort="variant_name">Product</th>
                                    <th class="listjs-sorter" data-sort="variant_type">Product Type</th>
                                    <th class="listjs-sorter" data-sort="variant_sku">SKU</th>
                                    <th class="listjs-sorter" data-sort="variant_attribute">Attribute</th>
                                    <th class="listjs-sorter" data-sort="variant_mrp">Price(MRP)</th>
                                    <th class="listjs-sorter" data-sort="variant_discount">Discount(%)</th>
                                    <th class="listjs-sorter" data-sort="variant_sellprice">Sell Price</th>
                                    <th class="listjs-sorter" data-sort="variant_gst">GST</th>
                                    <th class="listjs-sorter" data-sort="variant_stock"> Stock</th>
                                    <th class="listjs-sorter" data-sort="variant_date"> date</th>
                                    <th class="listjs-sorter" data-sort="variant_offerprice"> Offer Price</th>
                                    <th class="listjs-sorter" data-sort="variant_offerstart"> Offer Start</th>
                                    <th class="listjs-sorter" data-sort="variant_offerend"> Offer End</th>
                                    <th class="listjs-sorter" data-sort="variant_uploadImg"> Upload Images</th>
                                    <th class="listjs-sorter" data-sort="variant_addInventory"> Add inventory</th>
                                    <th class="listjs-sorter" data-sort="variant_active"> IsActive</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody class="list">
                                @foreach ($variants as $variant)
                                    <tr>
                                        <td class="variant_index">{{ $loop->iteration }}</td>
                                        <td class="variant_name">
                                            <div class="d-flex align-items-center">
                                                <img src="{{ asset($variant?->thumbnail_url ?? 'assets/images/placeholder.png') }}"
                                                    class="rounded-3" width="56" height="56"
                                                    style="object-fit:cover" />

                                                <div class="ms-3 d-flex flex-column" style="min-width:0;">
                                                    <a href="#!" class="fw-semibold text-truncate d-block"
                                                        style="max-width:180px" data-bs-toggle="tooltip"
                                                        data-bs-placement="top"
                                                        title="{{ $variant?->product_name ?? 'N/A' }}">
                                                        {{ $variant?->product_name ?? 'N/A' }}
                                                    </a>

                                                    <small class="text-muted">PID: #{{ $variant->PID }}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="variant_type">{{ $variant?->product_type ?? 'N/A' }}</td>
                                        <td class="variant_sku" data-search="{{ strtolower($variant?->SKU ?? '') }}">
                                            {{ $variant?->SKU ?? 'N/A' }}
                                        </td>
                                        <td class="variant_attribute">{{ $variant?->Attribute ?? 'N/A' }}</td>
                                        <td class="variant_mrp">{{ $variant?->Price ?? 'N/A' }}</td>
                                        <td class="variant_discount">{{ $variant?->Discount ?? 'N/A' }}</td>
                                        <td class="variant_sellprice">{{ $variant?->SellPrice ?? 'N/A' }}</td>
                                        <td class="variant_gst">{{ $variant?->GST ?? 'N/A' }}</td>
                                        <td class="variant_stock">{{ $variant?->AvailableQty ?? 'N/A' }}</td>
                                        <td class="variant_date">{{ $variant?->CreatedDtTm ?? 'N/A' }}</td>
                                        <td class="variant_offerprice">{{ $variant?->OfferPrice ?? 'N/A' }}</td>
                                        <td class="variant_offerstart">{{ $variant?->OfferStart ?? 'N/A' }}</td>
                                        <td class="variant_offerend">{{ $variant?->OfferEnd ?? 'N/A' }}</td>
                                        <td class="text-center">
                                            <a href="#!"
                                                class="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip variant-gallery-btn"
                                                data-id="{{ $variant->ID }}" data-bs-toggle="modal"
                                                data-bs-target="#variantGalleryModal" data-template="galleryTip">
                                                <i class="ti ti-photo-plus fs-4 text-primary"></i>
                                                <div id="galleryTip" class="d-none">
                                                    <span>Variant Gallery</span>
                                                </div>
                                            </a>
                                        </td>

                                        <td class="text-center">
                                            <a href="#!"
                                                class="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip inventory-btn"
                                                data-id="{{ $variant->ID ?? 0 }}" data-pid="{{ $variant->PID ?? 0 }}"
                                                data-img="{{ $variant?->thumbnail_url ?? 0 }}"
                                                data-name="{{ $variant->product_name ?? 0 }}"
                                                data-sku="{{ $variant->SKU ?? 0 }}"
                                                data-total="{{ $variant->TotalQty ?? 0 }}"
                                                data-sold="{{ $variant->SoldQty ?? 0 }}"
                                                data-available="{{ $variant->AvailableQty ?? 0 }}"
                                                data-threshold="{{ $variant->AlertThreshold ?? 0 }}"
                                                data-status="{{ $variant->inventoryStatus ?? 0 }}" data-bs-toggle="modal"
                                                data-bs-target="#inventoryModal" data-template="inventroyTip">
                                                <i class="ti ti-packages fs-4"></i>
                                                <div id="inventroyTip" class="d-none">
                                                    <span>Edit</span>
                                                </div>
                                            </a>
                                        </td>
                                        <td class="category_status" data-id="{{ $variant->ID ?? 0 }}"
                                            data-status="{{ $variant->IsActive ?? 0 }}">
                                            <div class="form-check form-switch">
                                                <input class="form-check-input category-toggle" type="checkbox"
                                                    {{ $variant->IsActive == 1 ? 'checked' : '' }}>
                                            </div>
                                        </td>
                                        <td>
                                            <a href="#!"
                                                class="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip view-variant-btn"
                                                data-id="{{ $variant->ID ?? 0 }}"
                                                data-product-name="{{ $variant->product_name ?? 0 }}"
                                                data-sku="{{ $variant->SKU ?? 0 }}"
                                                data-price="{{ $variant->Price ?? 0 }}"
                                                data-sellprice="{{ $variant->SellPrice ?? 0 }}"
                                                data-discount="{{ $variant->Discount ?? 0 }}"
                                                data-status="{{ $variant->IsActive ?? 0 }}"
                                                data-img="{{ $variant->thumbnail_url ?? 0 }}"
                                                data-total="{{ $variant->TotalQty ?? 0 }}"
                                                data-sold="{{ $variant->SoldQty ?? 0 }}"
                                                data-available="{{ $variant->AvailableQty ?? 0 }}"
                                                data-threshold="{{ $variant->AlertThreshold ?? 0 }}"
                                                data-readable-attr="{{ $variant->Attribute ?? 0 }}"
                                                data-bs-toggle="modal" data-bs-target="#viewVariantModal"
                                                data-template="viewVariant">
                                                <i class="ti ti-eye fs-4"></i>
                                                <div id="viewVariant" class="d-none">
                                                    <span>View Variant</span>
                                                </div>
                                            </a>
                                            <a href="#!"
                                                class="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip edit-variant-btn"
                                                data-id="{{ $variant->ID ?? 0 }}"
                                                data-price="{{ $variant->Price ?? 0 }}"
                                                data-sellprice="{{ $variant->SellPrice ?? 0 }}"
                                                data-discount="{{ $variant->Discount ?? 0 }}"
                                                data-product_type="{{ $variant->product_type ?? 0 }}"
                                                data-attributes='{{ json_encode($variant->all_attributes) }}'
                                                data-bs-toggle="modal" data-bs-target="#addVariantModal"
                                                data-template="editVariant">
                                                <i class="ti ti-edit fs-4"></i>
                                                <div id="editVariant" class="d-none">
                                                    <span>Edit Variant</span>
                                                </div>
                                            </a>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                            <tbody id="no-result-container " style="display: none">
                                <tr>
                                    <td colspan="10" class="border-0">
                                        <div class="py-5 text-center">
                                            <div class="mb-3 mx-auto d-flex align-items-center justify-content-center bg-light rounded-circle"
                                                style="width: 72px; height: 72px;">
                                                <i class="ti ti-search-off text-secondary" style="font-size: 2rem;"></i>
                                            </div>

                                            <h4 class="fw-bold  mb-1">No results found</h4>
                                            <p class="text-muted mb-3">
                                                We couldn't find any categories matching "<strong><span
                                                        class="search-term-placeholder"></span></strong>".
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                    <div
                        class="btn-toolbar card-footer border-top border-dashed d-flex flex-md-row flex-column justify-content-md-between align-items-md-center">
                        <p class="mb-0 listjs-showing-items-label"></p>
                        <div class="d-flex flex-column flex-md-row gap-4">
                            <div class="d-flex align-items-center gap-2">
                                <label class="form-label text-nowrap mb-0">Rows per page:</label>
                                <select class="form-select listjs-items-per-page" data-choices="">
                                    <option value="10" selected>10</option>
                                    <option value="14">14</option>
                                </select>
                            </div>
                            <div>
                                <div class="pagination-buttons d-flex">
                                    <button class="btn btn-white prev">Previous</button>
                                    <ul class="pagination mb-0 ms-1"></ul>
                                    <button class="btn btn-white next">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Variant Add Modal -->
    <div class="modal fade" id="addVariantModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 500px;">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header text-white p-3">
                    <h6 class="modal-title fw-bold"><i class="ri-add-line align-middle me-1"></i> Add Product Variant</h6>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>

                <form id="addVariantForm" class="needs-validation" novalidate>
                    @csrf
                    <input type="hidden" name="variant_id" id="v_variant_id">
                    <input type="hidden" name="PID" value="{{ $product->ID }}">
                    <input type="hidden" name="ProductTitle" value="{{ $product->Title }}">

                    <div class="modal-body p-3">
                        <div class="row g-2 mb-3 bg-light p-2 rounded border" id="attribute">
                            <div class="col-12"><small class="text-muted fw-bold text-uppercase">Attributes</small></div>
                            @foreach ($attributes as $attr)
                                <div class="col-6">
                                    <label class="form-label small mb-1">{{ $attr->Name }}</label>
                                    <select class="form-select form-select-sm" name="attributes[{{ $attr->ID }}]"
                                        required>
                                        <option value="">Select...</option>
                                        @if (strtolower($attr->Name) == 'size' || strtolower($attr->Name) == 'sizes')
                                            <option value="all" class="fw-bold text-primary">✨ ALL Sizes (Bulk Create All Sizes)</option>
                                        @endif
                                        @foreach ($attr->values as $val)
                                            <option value="{{ $val->ID }}">{{ $val->Value }}</option>
                                        @endforeach
                                    </select>
                                    <div class="invalid-feedback">Required</div>
                                </div>
                            @endforeach
                        </div>

                        <div class="row g-2">
                            <div class="col-12"><small class="text-muted fw-bold text-uppercase">Pricing & Stock</small>
                            </div>
                            <div class="col-6">
                                <label class="form-label small mb-1">MRP (₹)</label>
                                <input type="number" name="Price" id="v_mrp" class="form-control form-control-sm"
                                    placeholder="0" required min="1">
                                <div class="invalid-feedback">Min 1 required</div>
                            </div>
                            <div class="col-6">
                                <label class="form-label small mb-1">Discount (%)</label>
                                <input type="number" name="Discount" id="v_discount"
                                    class="form-control form-control-sm" placeholder="0" required>
                                <div class="invalid-feedback">0-100 only</div>
                            </div>
                            <div class="col-6">
                                <label class="form-label small mb-1 text-success fw-bold">Sell Price</label>
                                <input type="number" name="SellPrice" id="v_sell"
                                    class="form-control form-control-sm bg-light" readonly required>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer bg-light p-2">
                        <button type="button" class="btn btn-sm btn-outline-secondary"
                            data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-sm btn-primary px-3" id="saveVariantBtn">Save
                            Variant</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- Variant Gallery Modal -->
    <div class="modal fade" id="variantGalleryModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content border-0 shadow-lg rounded-4">
                <div class="modal-header bg-light">
                    <h6 class="modal-title fw-bold">Manage Variant Images</h6>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">

                    <!-- hidden variant id -->
                    <input type="hidden" id="gallery_vpid">

                    <!-- Dropzone -->
                    <div id="variant-dropzone" class="dropzone border border-dashed rounded-3 p-4 text-center">
                        <div class="dz-message needsclick">
                            <i class="ti ti-upload fs-1 text-muted"></i>
                            <h6 class="mt-2">Drag & drop images here</h6>
                            <span class="text-muted">or click to upload</span>
                        </div>
                    </div>

                    <!-- Existing Images -->
                    <div class="mt-4">
                        <h6 class="fw-semibold mb-2">Existing Images</h6>
                        <div id="existing-images" class="row g-3">
                            <!-- dynamically loaded -->
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <!-- Inventory Gallery Modal -->
    <div class="modal fade" id="inventoryModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">
                <div class="modal-header  bg-light text-white rounded-top-4">
                    <h6 class="modal-title fw-bold"><i class="ti ti-box-seam me-2"></i>Manage Inventory</h6>
                    <button type="button" class="btn-close btn-close-black" data-bs-dismiss="modal"></button>
                </div>
                <form id="inventoryForm" class="needs-validation" novalidate>
                    @csrf
                    <input type="hidden" name="PID" value="{{ $product->ID }}">
                    <div class="modal-body p-4">
                        <div
                            class="d-flex align-items-center mb-4 p-3 bg-light rounded-3 shadow-sm border-start border-primary border-4">
                            <div id="inv_variant_img" class="me-3 rounded border bg-white shadow-sm"
                                style="width: 55px; height: 55px; overflow: hidden;">
                            </div>
                            <div>
                                <small class="text-Primary" id="inv_variant_ppi_display"><i
                                        class="ti ti-lock me-1"></i>SKU: ---</small>
                                <h6 class="mb-0 fw-bold text-dark" id="inv_variant_name">Variant Name</h6>
                                <small class="text-muted" id="inv_variant_sku_display"><i
                                        class="ti ti-barcode me-1"></i>SKU: ---</small>
                            </div>
                        </div>

                        <input type="hidden" name="variant_id" id="inv_variant_id">

                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Total Stock (Qty)</label>
                                <div class="input-group has-validation">
                                    <span class="input-group-text bg-white"><i class="ti ti-box text-primary"></i></span>
                                    <input type="number" name="total_stock" id="total_stock" class="form-control"
                                        min="0" placeholder="0" readonly>
                                    <div class="invalid-feedback">Enter total stock.</div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Sold Stock (Qty)</label>
                                <div class="input-group has-validation">
                                    <span class="input-group-text bg-white"><i
                                            class="ti ti-shopping-cart text-danger"></i></span>
                                    <input type="number" name="sole_stock" id="sole_stock" class="form-control"
                                        min="0" placeholder="0" readonly>
                                    <div class="invalid-feedback">Enter sold stock.</div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Available Stock (Qty)</label>
                                <div class="input-group has-validation">
                                    <span class="input-group-text bg-white"><i
                                            class="ti ti-circle-check text-success"></i></span>
                                    <input type="number" name="available_stock" id="available_stock"
                                        class="form-control" min="0" placeholder="0" readonly>
                                    <div class="invalid-feedback">This is auto-calculated.</div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Alert Threshold</label>
                                <div class="input-group has-validation">
                                    <span class="input-group-text bg-white"><i
                                            class="ti ti-bell-ringing text-warning"></i></span>
                                    <input type="number" name="low_stock_threshold" id="low_stock_threshold"
                                        class="form-control" placeholder="e.g. 5" required>
                                    <div class="invalid-feedback">Set alert limit.</div>
                                </div>
                                <small class="text-muted d-block mt-1" style="font-size: 11px;">Notify when stock hits
                                    this level.</small>
                            </div>

                            <div class="col-12">
                                <label class="form-label fw-semibold">Availability Status</label>
                                <div class="input-group has-validation">
                                    <span class="input-group-text bg-white"><i
                                            class="ti ti-shield-check text-info"></i></span>
                                    <select name="status" id="inv_status" class="form-select" required>
                                        <option value="" selected disabled>Choose status...</option>
                                        <option value="0">❌ Out of Stock</option>
                                        <option value="1">✅ In Stock</option>
                                    </select>
                                    <div class="invalid-feedback">Please select status.</div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label fw-bold text-primary">Add New Stock (Stock In)</label>
                                <div class="input-group has-validation">
                                    <span class="input-group-text bg-primary-subtle border-primary"><i
                                            class="ti ti-plus text-primary"></i></span>
                                    <input type="number" name="add_stock" id="add_stock"
                                        class="form-control border-primary" min="0"
                                        placeholder="Enter quantity to add (e.g. 50)">
                                    <div class="invalid-feedback">Enter quantity you want to add.</div>
                                </div>
                                <small class="text-muted italic">This quantity will be incremented into your current Total
                                    Stock.</small>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer bg-light rounded-bottom-4 border-top">
                        <button type="button" class="btn btn-link text-muted fw-medium text-decoration-none"
                            data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary px-5 shadow-sm rounded-3 updateInventory">
                            <i class="ti ti-device-floppy me-1"></i> Update Inventory
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Variant show Modal -->
    <div class="modal fade" id="viewVariantModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header bg-light text-white">
                    <h5 class="modal-title"><i class="ti ti-eye me-2"></i>Variant Details</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body p-4">
                    <div class="row g-4">
                        <div class="col-md-4 text-center border-end">
                            <div id="view_variant_img"
                                class="rounded-3 mb-3 border bg-light d-flex align-items-center justify-content-center overflow-hidden"
                                style="height: 200px;">
                            </div>
                            <div id="view_status_badge"></div>
                            <hr>
                            <h6 class="text-muted small text-uppercase">SKU Code</h6>
                            <p class="fw-bold text-dark" id="view_sku">---</p>
                        </div>

                        <div class="col-md-8">
                            <h4 class="mb-1" id="view_product_name">Product Name</h4>
                            <div id="view_attributes_chips" class="mb-3">
                            </div>

                            <div class="row g-2 mb-4">
                                <div class="col-4">
                                    <div class="p-2 border rounded bg-light text-center">
                                        <small class="text-muted d-block">MRP</small>
                                        <span class="fw-bold text-danger text-decoration-line-through">₹<span
                                                id="view_mrp">0</span></span>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="p-2 border rounded bg-light text-center">
                                        <small class="text-muted d-block">Discount</small>
                                        <span class="fw-bold text-success" id="view_discount">0%</span>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="p-2 border rounded bg-success-subtle text-center">
                                        <small class="text-success d-block">Sell Price</small>
                                        <span class="fw-bold text-success fs-5">₹<span id="view_sell">0</span></span>
                                    </div>
                                </div>
                            </div>

                            <h6 class="text-muted small text-uppercase mb-3"><i class="ti ti-package me-1"></i>Inventory
                                Status</h6>
                            <div class="table-responsive">
                                <table class="table table-sm table-bordered">
                                    <thead class="bg-light">
                                        <tr>
                                            <th class="text-center">Total</th>
                                            <th class="text-center">Sold</th>
                                            <th class="text-center">Available</th>
                                            <th class="text-center">Threshold</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="text-center fw-bold">
                                            <td id="view_total_qty">0</td>
                                            <td id="view_sold_qty" class="text-danger">0</td>
                                            <td id="view_available_qty" class="text-success">0</td>
                                            <td id="view_threshold" class="text-warning">0</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer bg-light">
                    <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
@endsection
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="{{ asset('assets/libs/dropzone/dist/dropzone-min.js') }}"></script>



<script>
    $(document).on('input', '#v_mrp, #v_discount', function() {
        let mrp = parseFloat($('#v_mrp').val()) || 0;
        let discount = parseFloat($('#v_discount').val()) || 0;
        if (discount > 100) {
            discount = 100;
            $('#v_discount').val(100);
        }
        const discountAmount = (mrp * discount) / 100;
        const sellingPrice = mrp - discountAmount;
        $('#v_sell').val(sellingPrice > 0 ? sellingPrice.toFixed(2) : "0.00");
    });

    $(document).ready(function() {
        $("#addVariantForm").on('submit', function(e) {
            e.preventDefault();
            let form = this;
            if (!form.checkValidity()) {
                e.stopPropagation();
                $(form).addClass('was-validated');
                return;
            }
            let submitBtn = $("#saveVariantBtn");
            let originalText = submitBtn.text();
            submitBtn.prop('disabled', true).html(
                '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...'
            );
            let formData = $(this).serialize();

            $.ajax({
                url: "{{ route('admin.variants.store') }}",
                method: "POST",
                data: formData,
                dataType: "json",
                success: function(response) {
                    if (response.status) {
                        Toast.fire({
                            icon: 'success',
                            title: response.message
                        }).then(() => {
                            location.reload();
                        });
                    } else {
                        submitBtn.prop('disabled', false).text(originalText);
                    }
                },
                error: function(xhr) {
                    let errors = xhr.responseJSON.errors;
                    if (errors) {
                        let errorMessage = Object.values(errors).flat().join('\n');
                        alert(errorMessage);
                    } else {
                        alert("Something went wrong. Please try again.");
                    }
                },
                complete: function() {
                    submitBtn.prop('disabled', false).text(originalText);
                }
            });
        });
    });
</script>

<script>
    Dropzone.autoDiscover = false;

    $(document).ready(function() {

        $(document).on('click', '.variant-gallery-btn', function() {
            let variantId = $(this).data('id');
            $('#gallery_vpid').val(variantId);
            variantDropzone.removeAllFiles(true);
            loadVariantImages(variantId);
        });

        let variantDropzone = new Dropzone("#variant-dropzone", {
            url: "{{ url('admin/variant/upload-image') }}",
            paramName: "image",
            maxFilesize: 5, // MB
            maxFiles: 10,
            acceptedFiles: "image/*,.avif",
            uploadMultiple: true,
            parallelUploads: 5,

            addRemoveLinks: true,
            dictRemoveFile: "Remove",
            dictDefaultMessage: "Drag & drop images here or click to upload",
            headers: {
                'X-CSRF-TOKEN': "{{ csrf_token() }}"
            },

            init: function() {
                this.on("sending", function(file, xhr, formData) {
                    formData.append("variant_id", $('#gallery_vpid').val());
                });
            },

            success: function(file, response) {
                let vId = $('#gallery_vpid').val();
                loadVariantImages(vId);
                setTimeout(() => {
                    this.removeFile(file);
                }, 2000);
            },

        });

    });

    function loadVariantImages(variantId) {
        $('#gallery_vpid').val(variantId);
        $('#existing-images').html('<p class="text-center">Loading...</p>');

        $.ajax({
            url: "{{ url('admin/variant/get-images') }}/" + variantId,
            type: "POST",
            headers: {
                'X-CSRF-TOKEN': "{{ csrf_token() }}"
            },
            success: function(res) {
                $('#existing-images').html('');
                if (res.length === 0) {
                    $('#existing-images').html(
                        '<p class="text-muted text-center">No images found for this variant.</p>');
                }

                res.forEach(img => {
                    $('#existing-images').append(`
                        <div class="col-md-3 mb-3">
                            <div class="gallery-item rounded-3 shadow-sm">
                                <div class="gallery-img-container">
                                    <img src="{{ asset('') }}${img.url}" class="img-fluid w-90 object-fit-cover" alt="Variant Image">
                                    
                                    <button type="button" 
                                            class="delete-btn btn btn-icon btn-sm text-white position-absolute top-0 end-0 m-2 rounded-circle"
                                            onclick="deleteExistingImage(${img.id}, this)"
                                            title="Delete Image">
                                        <i class="ti ti-trash fs-5"></i> ✕
                                    </button>
                                </div>
                                <div class="p-1 text-center">
                                <small class="text-muted" style="font-size: 10px;">ID: #${img.id}</small>
                                </div>
                            </div>
                        </div>
                    `);
                });
            },
            error: function(xhr) {
                console.error("Error fetching images:", xhr.responseText);
                $('#existing-images').html('<p class="text-danger text-center">Failed to load images.</p>');
            }
        });
    }

    function deleteExistingImage(id, el) {
        $.ajax({
            url: "{{ url('admin/variant/delete-image') }}/" + id,
            type: "DELETE",
            headers: {
                'X-CSRF-TOKEN': "{{ csrf_token() }}"
            },
            success: function() {
                $(el).closest('.col-md-3').remove();
            }
        });
    }
    $(document).on('click', '.inventory-btn', function() {
        // Button se data nikalna
        let id = $(this).data('id');
        let pid = $(this).data('pid');
        let name = $(this).data('name');
        let sku = $(this).data('sku');

        // DB columns ke hisab se mapping (Inhe check karein ki button me data- attributes hain ya nahi)
        let total = parseInt($(this).data('total'));
        let sold = parseInt($(this).data('sold'));
        let threshold = $(this).data('threshold');
        let available = $(this).data('available');
        let status = $(this).data('status');
        let img = $(this).data('img');

        // Modal ke fields me value set karna
        $('#inv_variant_id').val(id);
        $('#inv_variant_name').text(name);
        $('#inv_variant_sku_display').html('<i class="ti ti-barcode me-1"></i>SKU: ' + (sku ? sku : 'N/A'));
        $('#inv_variant_ppi_display').html('<i class="ti ti-lock me-1"></i>PID: ' + (pid ? pid : 'N/A'));

        // Stock fields
        $('#total_stock').val(total);
        $('#sole_stock').val(sold);
        $('#available_stock').val(available);
        $('#low_stock_threshold').val(threshold);
        $('#inv_status').val(status);

        // IMPORTANT: Original total ko 'add_stock' input me save karein calculation ke liye
        $('#add_stock').data('original-total', total).val('');

        // Image logic
        let baseAssetUrl = "{{ asset('') }}";
        if (img) {
            $('#inv_variant_img').html(
                `<img src="${baseAssetUrl}${img}" class="img-fluid w-100 h-100 object-fit-cover">`);
        } else {
            $('#inv_variant_img').html(
                `<div class="bg-light d-flex align-items-center justify-content-center h-100"><i class="ti ti-photo text-muted fs-2"></i></div>`
            );
        }

        $('#inventoryModal').modal('show');
    });

    $(document).on('input', '#add_stock', function() {
        let originalTotal = parseInt($(this).data('original-total')) || 0;
        let adding = parseInt($(this).val()) || 0;
        let sold = parseInt($('#sole_stock').val()) || 0;

        let newTotal = originalTotal + adding;
        let newAvailable = newTotal - sold;

        $('#total_stock').val(newTotal);
        $('#available_stock').val(newAvailable > 0 ? newAvailable : 0);

        // Auto status update
        if (newAvailable <= 0) $('#inv_status').val(0);
        else $('#inv_status').val(1);
    });
    $(document).on('submit', '#inventoryForm', function(e) {
        e.preventDefault();

        let form = $(this);
        let submitBtn = form.find('button[type="submit"]');
        let originalHtml = submitBtn.html();
        if (this.checkValidity() === false) {
            $(this).addClass('was-validated');
            return;
        }
        submitBtn.prop('disabled', true).html(
            '<span class="spinner-border spinner-border-sm me-2"></span> Updating...');

        let formData = form.serialize();

        $.post("{{ url('admin/inventory/update') }}", formData, function(res) {
            if (res.status) {
                $('#inventoryModal').modal('hide');
                Toast.fire({
                    icon: 'success',
                    title: res.message
                }).then(() => {
                    location.reload();
                });
            } else {
                Toast.fire({
                    icon: 'error',
                    title: res.message
                });
                submitBtn.prop('disabled', false).html(originalHtml);
            }
        }).fail(function(xhr) {
            console.error(xhr.responseText);
            alert('Something went wrong!');
            submitBtn.prop('disabled', false).html(originalHtml);
        });
    });
    $(document).on('change', '.category-toggle', function() {
        let checkbox = $(this);
        let id = checkbox.closest('.category_status').data('id');
        let status = checkbox.is(':checked') ? 1 : 0;

        // Optional: Loading state dikhane ke liye
        checkbox.prop('disabled', true);

        $.ajax({
            url: "{{ url('admin/variant/toggle-status') }}", // Route name change kar lena
            method: "POST",
            data: {
                _token: "{{ csrf_token() }}",
                id: id,
                status: status
            },
            success: function(res) {
                checkbox.prop('disabled', false);
                if (res.status) {
                    Toast.fire({
                        icon: 'success',
                        title: 'Status Updated Successfully!'
                    });
                } else {
                    // Agar fail ho toh switch wapas purani state mein
                    checkbox.prop('checked', !status);
                    alert('Failed to update status');
                }
            },
            error: function() {
                checkbox.prop('disabled', false);
                checkbox.prop('checked', !status);
                alert('Server Error');
            }
        });
    });
    $(document).on('click', '[data-bs-target="#addVariantModal"]:not(.edit-variant-btn)', function() {
        // Form reset karein
        $('#addVariantForm')[0].reset();
        $('#v_variant_id').val(''); // ID khali karna sabse zaroori hai

        // Title wapas normal karein
        $('#addVariantModal .modal-title').text('Add New Variant');
        $('#saveVariantBtn').text('Save Variant');

        // Bootstrap validation class hataein
        $('#addVariantForm').removeClass('was-validated');


    });
    $(document).on('click', '.edit-variant-btn', function() {
        // 1. Basic data nikalein
        let id = $(this).data('id');
        let price = $(this).data('price');
        let sellPrice = $(this).data('sellprice');
        let discount = $(this).data('discount');
        let attributes = $(this).data('attributes');
        let product_type = $(this).data('product_type') || ""; // Data nikalna

        let cleanType = product_type.toString().trim();
        if (cleanType === "Base Product") {
            $("#attribute").css('display', 'none');
            $("#attribute select").prop('required', false);
        } else {
            $("#attribute").css('display', 'flex'); // Kyunki 'row' flex hota hai
            $("#attribute select").prop('required', true);
        }

        $('#v_variant_id').val(id);
        $('#v_mrp').val(price);
        $('#v_sell').val(sellPrice);
        $('#v_discount').val(discount);

        $('#addVariantModal .modal-title').text('Edit Variant');
        $('#saveVariantBtn').text('Update Variant');

        $('#addVariantModal select').val('').trigger('change');

        if (attributes && attributes.length > 0) {
            attributes.forEach(function(item) {
                let selectBox = $(`select[name="attributes[${item.attr_ID}]"]`);
                if (selectBox.length > 0) {
                    selectBox.val(item.attr_value_ID).trigger('change');
                }
            });
        }
        $('#addVariantModal').modal('show');
    });
    $(document).on('click', '.view-variant-btn', function() {
        // 1. Fetch data from button attributes
        let name = $(this).data('product-name');
        let sku = $(this).data('sku');
        let mrp = $(this).data('price');
        let sell = $(this).data('sellprice');
        let discount = $(this).data('discount');
        let img = $(this).data('img');
        let status = $(this).data('status');

        // Inventory Data
        let total = $(this).data('total');
        let sold = $(this).data('sold');
        let available = $(this).data('available');
        let threshold = $(this).data('threshold');

        // Attributes (Readable string like "Color: Red | Size: XL")
        let attrString = $(this).data('readable-attr');

        // 2. Inject into Modal
        $('#view_product_name').text(name);
        $('#view_sku').text(sku);
        $('#view_mrp').text(mrp);
        $('#view_sell').text(sell);
        $('#view_discount').text(discount + '%');

        // Inventory table
        $('#view_total_qty').text(total) || 0;
        $('#view_sold_qty').text(sold) || 0;
        $('#view_available_qty').text(available) || 0;
        $('#view_threshold').text(threshold) || 0;

        // Status Badge
        let statusHtml = status == 1 ?
            '<span class="badge bg-success">Active</span>' :
            '<span class="badge bg-danger">Inactive</span>';
        $('#view_status_badge').html(statusHtml);

        // Attribute Chips
        let chips = '';
        if (attrString) {
            attrString.split('|').forEach(part => {
                chips +=
                    `<span class="badge bg-info-subtle text-info me-1 border border-info-subtle">${part.trim()}</span>`;
            });
        }
        $('#view_attributes_chips').html(chips);

        // Image logic
        let baseAssetUrl = "{{ asset('') }}";
        if (img) {
            $('#view_variant_img').html(
                `<img src="${baseAssetUrl}${img}" class="img-fluid w-100 h-100 object-fit-cover">`);
        } else {
            $('#view_variant_img').html(`<i class="ti ti-photo text-muted fs-1"></i>`);
        }

        // Show Modal
        $('#viewVariantModal').modal('show');
    });
</script>
