@extends('layouts.admin')
@section('title', 'Attribute Management')

@section('content')
    <div class="custom-container">
        <div class="row">
            <div class="col-12">
                <div class="mb-8 d-md-flex justify-content-between align-items-center">

                    <div class="d-flex">
                        <a href="{{ route('admin.attributes.view') }}"
                            class="btn btn-outline-secondary btn-sm rounded-circle me-3 shadow-sm" title="Back to Attributes">
                            <i class="ti ti-arrow-left fs-2"></i>
                        </a>
                        <h1 class="mb-1 h2">Product Attributes Value</h1>
                        {{-- <p class="mb-0 text-muted">Manage product variations like Color, Size, and Material.</p> --}}
                    </div>
                    <div>
                        <button class="btn btn-primary d-md-flex align-items-center gap-2 shadow-sm" data-bs-toggle="modal"
                            data-bs-target="#attributeModal">
                            <i class="ti ti-plus"></i> Add New Attribute Value
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="card card-lg shadow-sm" id="customerList" data-list="category_index,attribute_value">
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
                                    <th class="listjs-sorter" data-sort="attribute_value">Attribute Value</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody class="list">
                                @foreach ($attribute_value as $attr_value)
                                    <tr>
                                        <td class="category_index">{{ $loop->iteration }}</td>
                                        <td class="attribute_value">
                                            <div class="d-flex align-items-center">
                                                <div class="icon-shape icon-sm bg-light text-primary rounded me-2">
                                                    <i class="ti ti-tag"></i>
                                                </div>
                                                <strong>{{ $attr_value->Value ?? 'N/A' }}</strong>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex gap-2">
                                                <button class="btn btn-ghost btn-sm edit-attr-btn"
                                                    data-offer="{{ json_encode($attr_value) }}">
                                                    <i class="ti ti-edit text-primary fs-4"></i>
                                                </button>
                                            </div>
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

    <div class="modal fade" id="attributeModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header border-0 p-4 pb-0">
                    <h5 class="modal-title fw-bold fs-3" id="attributeModalLabel">Create New Attribute</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form id="attributeForm" class="needs-validation" novalidate>
                    <div class="modal-body p-4">
                        @csrf
                        <input type="hidden" name="attrId" id="attrId" value="{{ request()->id }}">
                        <input type="hidden" name="valueID" id="valueID">
                        <div class="mb-3">
                            <label class="form-label fw-bold">Attribute Value</label>
                            <input type="text" class="form-control form-control-lg" name="value" id="attrValue"
                                placeholder="e.g. Color, Size, Material" required>
                            <div class="form-text">This will be displayed in product filters.</div>
                            <div class="invalid-feedback">Attribute required</div>

                        </div>
                    </div>
                    <div class="modal-footer border-0 p-4 pt-0">
                        <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" id="saveAttrBtn" class="btn btn-primary px-4">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

@endsection

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script>
    $(document).ready(function() {


        // 2. Edit Attribute
        $('.edit-attr-btn').on('click', function() {
            const data = $(this).data('offer');
            console.log(data);
            $('#attributeModalLabel').text('Update Attribute');
            $('#attrId').val(data.attributeID);
            $('#attrValue').val(data.Value);
            $('#valueID').val(data.ID);
            $('#attributeModal').modal('show');
        });


        // 4. Create or Update Attribute via AJAX
        $('#attributeForm').on('submit', function(e) {
            e.preventDefault();

            // Basic Validation
            if (!this.checkValidity()) {
                $(this).addClass('needs-validation was-validated');
                return;
            }

            let formData = $(this).serialize();
            let attrId = $('#attrId').val();
            let btn = $('#saveAttrBtn');
            let originalText = btn.html();

            btn.prop('disabled', true).html(
                '<span class="spinner-border spinner-border-sm"></span> Saving...');

            $.ajax({
                url: "{{ route('admin.attributesValue.save') }}",
                type: "POST",
                data: formData,
                success: function(response) {
                    if (response.success) {
                        Toast.fire({
                            icon: 'success',
                            title: response.message
                        }).then(() => location.reload());
                    }
                },
                error: function(xhr) {
                    let message = 'Something went wrong';
                    if (xhr.responseJSON && xhr.responseJSON.message) {
                        message = xhr.responseJSON.message;
                    }
                    Toast.fire({
                        icon: 'error',
                        title: message
                    });
                },
                complete: function() {
                    btn.prop('disabled', false).html(originalText);
                }
            });
        });
        // 3. Reset Modal on Close
        $('#attributeModal').on('hidden.bs.modal', function() {

            const form = $('#attributeForm')[0];
            form.reset();

            $('#attributeForm')
                .removeClass('was-validated')
                .find('.is-invalid, .is-valid')
                .removeClass('is-invalid is-valid');

        });

    });
</script>
