@extends('layouts.admin')

@section('title', 'Subcategories | Shopping Store')

@section('content')

    <div class="custom-container">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-12">
                <div class="mb-8 d-md-flex justify-content-between align-items-center">

                    <div>
                        <div class="d-flex">
                            <a href="{{ route('admin.categories') }}"
                                class="btn btn-outline-secondary btn-sm rounded-circle me-3 shadow-sm"
                                title="Back to Attributes">
                                <i class="ti ti-arrow-left fs-2"></i>
                            </a>
                            <h1 class="h2 mb-1 ">Subcategories <span class="text-primary"> ({{ $CategoryName }})</span></h1>
                        </div>
                        <nav aria-label="breadcrumb" class="mt-2">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="{{ url('/') }}">Home</a></li>
                                <li class="breadcrumb-item"><a href="{{ url('/admin/categories') }}">Category</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Subcategory
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <div>
                        <button class="btn btn-dark d-md-flex align-items-center gap-2" data-bs-toggle="modal"
                            data-bs-target="#addSubcategoryModal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 5l0 14" />
                                <path d="M5 12l14 0" />
                            </svg>
                            Add Subcategory
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <div class="row">
                <div class="col-12">
                    <div class="card card-lg" id="customerList" data-list="Subcategory_name,category_index">
                        <div class="card-header border-bottom-0">
                            <div class="row w-100 gx-md-0 gy-4 align-items-center">
                                <div class="col-lg-4 col-md-6">
                                    <input type="search" class="form-control listjs-search"
                                        placeholder="Search for subcategory name..." />
                                </div>
                            </div>
                        </div>

                        <div class="table-responsive"data-simplebar style="height: 500px">
                            <table class="table text-nowrap mb-0 table-centered table-hover" data-check-container>
                                <thead class="sticky-top ">
                                    <tr>
                                        <th class="listjs-sorter" data-sort="category_index">ID</th>
                                        <th class="listjs-sorter" data-sort="Subcategory_name">Subcategory Name</th>
                                        <th class="listjs-sorter" data-sort="">Image</th>
                                        <th class="listjs-sorter" data-sort="">Status</th>
                                        <th class="listjs-sorter" data-sort="">Created At</th>
                                        <th class="listjs-sorter" data-sort="">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="list">
                                    @foreach ($subcategories as $subcategory)
                                        <tr>
                                            <td class="category_index">{{ $loop->iteration }}</td>
                                            <td class="Subcategory_name">
                                                <div class="d-flex align-items-center ">
                                                    <div class="ms-2">
                                                        <span
                                                            class="text-inherit fw-bold">{{ $subcategory?->CategoryName ?? '' }}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <a href="javascript:void(0);" class="view-sub-image"
                                                    data-img-src="{{ asset($subcategory->CategoryImg) }}">
                                                    <img src="{{ asset($subcategory?->CategoryImg ?? '') }}" alt="Image"
                                                        class="avatar avatar-xl rounded-circle " />
                                                </a>
                                            </td>
                                            <td class="subcategory_status" data-id="{{ $subcategory->ID }}">
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input subcategory-toggle" type="checkbox"
                                                        {{ $subcategory->IsActive == 1 ? 'checked' : '' }}>
                                                </div>
                                            </td>
                                            <td>{{ $subcategory?->CreatedAt ?? 'N/A' }}</td>
                                            <td>
                                                <a href="javascript:void(0);"
                                                    class="btn btn-ghost btn-icon btn-sm rounded-circle edit-subcategory-btn"
                                                    data-name="{{ $subcategory->CategoryName }}"
                                                    data-id="{{ $subcategory->ID }}"
                                                    data-image="{{ asset($subcategory->CategoryImg) }}">
                                                    <i class="ti ti-edit fs-4 text-primary"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                                <tbody id="no-result-container " style="display: none">
                                    <tr>
                                        <td colspan="6" class="border-0">
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
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="addSubcategoryModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow" style="border-radius: 24px; overflow: hidden;">

                <div class="modal-header border-0 pb-0 position-relative"
                    style="height: 110px; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);">
                    <div class="position-absolute start-50 translate-middle-x text-center">
                        <div class="bg-body rounded-circle shadow d-inline-flex align-items-center justify-content-center"
                            style="width: 70px; height: 70px;">
                            <i class="ti ti-category fs-1 text-primary"></i>
                        </div>
                    </div>
                    <button type="button" class="btn-close btn-close-white position-absolute end-0 me-3"
                        style="top: 15px;" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body px-4 pt-5 pb-4">
                    <div class="text-center mb-4 pt-3">
                        <h4 class="fw-bold mb-1" id="addSubcategoryModalLabel">Add New Subcategory</h4>
                        <p class="text-muted small">Manage your catalog items with ease</p>
                    </div>

                    <form id="subcategoryForm" class="needs-validation" novalidate enctype="multipart/form-data">
                        <input type="hidden" id="subcategoryId" name="subcategoryId">
                        <input type="hidden" name="categoryId" id="categoryId" value="{{ $id }}">

                        <div class="mb-4">
                            <label class="form-label small fw-bold text-uppercase opacity-75">Subcategory Name</label>
                            <div class="input-group bg-light-subtle border rounded-3 p-1">
                                <span class="input-group-text bg-transparent border-0"><i
                                        class="ti ti-pencil opacity-50"></i></span>
                                <input type="text" class="form-control border-0 shadow-none bg-transparent"
                                    name="subcategoryName" id="subcategoryName" placeholder="e.g. Smartphones"
                                    required />
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label small fw-bold text-uppercase opacity-75">Subcategory Image</label>
                            <div class="upload-container d-flex align-items-center p-3 rounded-4 border border-dashed">
                                <div class="position-relative me-3">
                                    <img id="subImgPreview" src="https://via.placeholder.com/100" alt="Preview"
                                        class="rounded-3 shadow-sm object-fit-cover"
                                        style="width: 80px; height: 80px; border: 2px solid var(--bs-border-color);">
                                    <label for="subcategoryImage"
                                        class="position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center border border-2 border-white cursor-pointer"
                                        style="width: 28px; height: 28px; transform: translate(30%, 30%); cursor: pointer;">
                                        <i class="ti ti-camera text-white fs-6"></i>
                                    </label>
                                </div>
                                <div class="flex-grow-1">
                                    <input type="file" class="form-control form-control-sm border-0 bg-transparent"
                                        name="subcategoryImage" id="subcategoryImage" accept="image/*" required />
                                    <div class="opacity-50 mt-1" style="font-size: 11px;">PNG, JPG up to 2MB</div>
                                </div>
                            </div>
                        </div>

                        <div class="row g-2 mt-3">
                            <div class="col-6">
                                <button type="button" class="btn btn-outline-secondary w-100 border-0 fw-bold py-2"
                                    data-bs-dismiss="modal" style="border-radius: 12px;">Cancel</button>
                            </div>
                            <div class="col-6">
                                <button type="submit" id="subSubmitBtn"
                                    class="btn btn-primary w-100 fw-bold py-2 shadow-sm"
                                    style="border-radius: 12px; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); border: 0;">
                                    <span>Save Category</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="subImagePreviewModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-transparent border-0 text-center">
                <img src="" id="subModalLargeImage" class="img-fluid rounded shadow">
            </div>
        </div>
    </div>
@endsection
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<script>
    $(document).ready(function() {
        // 1. Image Preview Logic
        $('#subcategoryImage').on('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    $('#subImgPreview').attr('src', e.target.result).addClass('border-primary');
                }
                reader.readAsDataURL(file);
            }
        });

        // 2. Form Submit (Add & Update)
        $('#subcategoryForm').on('submit', function(e) {
            e.preventDefault();
            if (!this.checkValidity()) {
                $(this).addClass('was-validated');
                return;
            }
            const formData = new FormData(this);
            const subId = $('#subcategoryId').val();
            // URL switch based on ID
            let apiUrl = subId ? "{{ route('admin.subcategory.update') }}" :
                "{{ route('admin.subcategory.add') }}";
            formData.append('_token', '{{ csrf_token() }}');

            $.ajax({
                url: apiUrl,
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.status) {
                        Toast.fire({
                            icon: 'success',
                            title: response.message
                        }).then(() => location.reload());
                    } else {
                        Toast.fire({
                            icon: 'error',
                            title: response.message
                        });
                    }
                },
                error: function() {
                    Toast.fire({
                        icon: 'error',
                        title: 'Request failed!'
                    });
                }
            });
        });

        // 3. Edit Button Click (Event Delegation)
        $(document).on('click', '.edit-subcategory-btn', function() {
            const name = $(this).data('name');
            const id = $(this).data('id');
            const image = $(this).data('image');
            // Edit button click logic mein ye lines thodi change karein
            $('#addSubcategoryModalLabel').text('Edit Subcategory');
            $('#subSubmitBtn').html('<i class="ti ti-check me-1"></i> Update Subcategory');
            $('#subcategoryName').val(name);
            $('#subImgPreview').attr('src', image);
            $('#subcategoryId').val(id);
            $('#subcategoryImage').removeAttr('required');
            $('#addSubcategoryModal').modal('show');
        });

        // 4. Modal Reset on Close
        $('#addSubcategoryModal').on('hidden.bs.modal', function() {
            $('#subcategoryForm')[0].reset();
            $('#subcategoryForm').removeClass('was-validated');
            $('#subcategoryId').val('');
            $('#subImgPreview').attr('src', 'https://via.placeholder.com/100');
            $('#addSubcategoryModalLabel').text('Add New Subcategory');
            $('#subSubmitBtn').text('+ Save Subcategory');
            $('#subcategoryImage').attr('required', 'required');
        });

        // 5. Status Toggle
        $(document).on('change', '.subcategory-toggle', function() {
            const subId = $(this).closest('.subcategory_status').data('id');
            const status = this.checked ? 1 : 0;

            $.ajax({
                url: "{{ route('admin.subcategory.updateStatus') }}",
                method: 'POST',
                data: {
                    _token: '{{ csrf_token() }}',
                    id: subId,
                    status: status
                },
                success: function(response) {
                    Toast.fire({
                        icon: 'success',
                        title: response.message
                    });
                }
            });
        });

        // 6. Image Preview Modal
        $(document).on('click', '.view-sub-image', function() {
            let imgSrc = $(this).data('img-src');
            $('#subModalLargeImage').attr('src', imgSrc);
            $('#subImagePreviewModal').modal('show');
        });
    });
</script>
