@extends('layouts.admin')
@section('title', 'Coupon Management')

@section('content')
    <div class="custom-container">
        <div class="row">
            <div class="col-12">
                <div class="mb-8 d-md-flex justify-content-between align-items-center">
                    <div>
                        <h1 class="mb-3 h2">All Coupon</h1>
                    </div>
                    <div>
                        <button class="btn btn-primary d-md-flex align-items-center gap-2" data-bs-toggle="modal"
                            data-bs-target="#couponModal">
                            <i class="ti ti-plus"></i> Create New Coupon
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="row">
                <div class="col-12">
                    <div class="card card-lg shadow-sm" id="customerList"
                        data-list="category_index,coupon_code,coupon_description,coupon_discount_type,coupon_duration_value,coupon_maxdiscountammount,coupon_minorderammount,coupon_limit,coupon_peruserlimit,coupoun_startdate,coupon_enddate,coupon_created,coupon_used,coupon_remaining">
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
                                        <th class="listjs-sorter" data-sort="coupon_code">Coupon Code</th>
                                        <th class="listjs-sorter" data-sort="coupon_description">Description</th>
                                        <th class="listjs-sorter" data-sort="coupon_discount_type">Discount Type</th>
                                        <th class="listjs-sorter" data-sort="coupon_duration_value">Discount Value </th>
                                        <th class="listjs-sorter" data-sort="coupon_maxdiscountammount">Max Discount Amount
                                        </th>
                                        <th class="listjs-sorter" data-sort="coupon_minorderammount">Min Order Amount</th>
                                        <th class="listjs-sorter" data-sort="coupon_limit">Usage Limit</th>
                                        <th class="listjs-sorter" data-sort="coupon_peruserlimit">Usage Limit Per User</th>
                                        <th class="listjs-sorter" data-sort="coupon_used text-primary">Used</th>
                                        <th class="listjs-sorter" data-sort="coupon_remaining text-primary">Remaining</th>
                                        <th class="listjs-sorter" data-sort="coupoun_startdate">start Date</th>
                                        <th class="listjs-sorter" data-sort="coupon_enddate">End Date</th>
                                        <th class="listjs-sorter" data-sort="coupon_created">Created At</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody class="list">
                                    @foreach ($coupons as $coupon)
                                        <tr>
                                            <td class="category_index">{{ $coupon->ID }}</td>

                                            <td class="coupon_code">
                                                <strong>{{ $coupon->Code ?? 'N/A' }}</strong>
                                            </td>

                                            <td class="coupon_description">
                                                {{ $coupon->Description ?? 'N/A' }}
                                            </td>

                                            <td class="coupon_discount_type">
                                                {{ $coupon->DiscountTypeText ?? 'N/A' }}
                                            </td>

                                            <td class="coupon_discount_value">
                                                {{ $coupon->DiscountValue ?? 'N/A' }}
                                            </td>

                                            <td class="coupon_maxdiscountammount">
                                                {{ $coupon->MaxDiscountAmount ?? 'N/A' }}
                                            </td>

                                            <td class="coupon_minorderammount">
                                                {{ $coupon->MinOrderAmount ?? 'N/A' }}
                                            </td>

                                            <td class="coupon_limit">
                                                {{ $coupon->UsageLimit ?? '∞' }}
                                            </td>

                                            <td class="coupon_peruserlimit">
                                                {{ $coupon->UsageLimitPerUser ?? '∞' }}
                                            </td>
                                            <td>
                                                <span class="badge bg-light-info text-info">
                                                    {{ $coupon->total_used ?? 0 }}
                                                </span>
                                            </td>

                                            <td>
                                                @php
                                                    $remaining = $coupon->UsageLimit - ($coupon->total_used ?? 0);
                                                @endphp
                                                <span
                                                    class="fw-bold {{ $remaining <= 5 ? 'text-danger' : 'text-success' }}">
                                                    {{ $remaining > 0 ? $remaining : 0 }}
                                                </span>
                                            </td>   
                                            <td class="coupoun_startdate">
                                                {{ date('d M Y', strtotime($coupon->StartDate ?? 'N/A')) }}
                                            </td>

                                            <td class="coupon_enddate">
                                                {{ date('d M Y', strtotime($coupon->EndDate ?? 'N/A')) }}
                                            </td>

                                            <td class="coupon_created">
                                                {{ date('d M Y', strtotime($coupon->CreatedDtTm ?? 'N/A')) }}
                                            </td>

                                            <td>
                                                <div class="d-flex justify-content-center">
                                                    <div class="form-check form-switch">
                                                        <input class="form-check-input coupon-toggle" type="checkbox"
                                                            data-id="{{ $coupon->ID ?? '' }}" data-type="IsActive"
                                                            {{ $coupon->IsActive ? 'checked' : '' }}>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <a href="{{ url('/admin/assign-coupon', $coupon->ID) }}"
                                                    class="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip view-variant-btn">
                                                    <i class="ti ti-eye fs-4"></i>
                                                    <div id="viewVariant" class="d-none">
                                                        <span>View Variant</span>
                                                    </div>
                                                </a>
                                                <button class="btn btn-ghost btn-sm edit-coupon-btn"
                                                    data-coupon="{{ json_encode($coupon) }}">
                                                    <i class="ti ti-edit text-primary fs-4"></i>
                                                </button>
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
    <div class="modal fade" id="couponModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow" style="border-radius: 16px;">

                <!-- Header -->
                <div class="modal-header border-0 bg-light p-4">
                    <h5 class="modal-title fw-bold">Create Coupon</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <!-- Body -->
                <div class="modal-body p-4">
                    <form id="couponForm" class="needs-validation" novalidate>
                        @csrf
                        <input type="hidden" name="couponId" id="couponId">

                        <div class="row g-3">

                            <!-- Coupon Code -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Coupon Code</label>
                                <input type="text" class="form-control" name="code" id="couponCode"
                                    placeholder="Offer Coupon Code" required>
                                <div class="invalid-feedback">Please enter a valid coupon code.</div>
                            </div>

                            <!-- Description -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Description</label>
                                <input type="text" class="form-control" name="description" id="couponDescription"
                                    placeholder="Brief description of the coupon" required>
                                <div class="invalid-feedback">Please enter a valid description.</div>
                            </div>

                            <!-- Discount Type -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Discount Type</label>
                                <select class="form-select" name="discount_type" id="discountType" required>
                                    <option value="">Select Type</option>
                                    <option value="5">Flat Amount (₹)</option>
                                    <option value="6">Percentage (%)</option>
                                </select>
                                <div class="invalid-feedback">Please select a discount type.</div>
                            </div>

                            <!-- Discount Value -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Discount Value</label>
                                <div class="input-group has-validation"> <span class="input-group-text"
                                        id="discountSymbol">%</span>
                                    <input type="number" step="0.01" min="0" class="form-control"
                                        name="discount_value" id="discountValue" required>
                                    <div class="invalid-feedback">Discount value is required.</div>
                                </div>
                            </div>
                            <!-- Max Discount Amount -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">
                                    Max Discount Amount
                                    <small class="text-muted">(Only for % type)</small>
                                </label>
                                <div class="input-group has-validation">
                                    <span class="input-group-text">₹</span>
                                    <input type="number" min="0" class="form-control" name="max_discount_amount"
                                        id="maxDiscountAmount" placeholder="Optional" required>
                                    <div class="invalid-feedback">Please enter a valid capping amount.</div>
                                </div>
                            </div>
                            <!-- Min Order Amount -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Minimum Order Amount</label>
                                <input type="number" step="0.01" min="0" class="form-control"
                                    name="min_order_amount" id="minOrderAmount" placeholder="Minimum cart value required"
                                    required>
                                <div class="invalid-feedback">Please enter a valid minimum order amount.</div>
                            </div>

                            <!-- Total Usage Limit -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Total Usage Limit</label>
                                <input type="number" min="0" class="form-control" name="usage_limit"
                                    id="usageLimit" placeholder="No of Coupon" required>
                                <div class="invalid-feedback">Please enter a valid usage limit.</div>
                            </div>

                            <!-- Usage Limit Per User -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Usage Limit Per User</label>
                                <input type="number" min="0" class="form-control" name="usage_limit_per_user"
                                    id="usageLimitPerUser" placeholder="Times a user can use this coupon" required>
                                <div class="invalid-feedback">Please enter a valid per-user limit.</div>
                            </div>

                            <!-- Start Date -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Start Date</label>
                                <input type="datetime-local" class="form-control" name="start_date" id="startDate"
                                    required>
                                <div class="invalid-feedback">Please select a start date.</div>
                            </div>

                            <!-- End Date -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">End Date</label>
                                <input type="datetime-local" class="form-control" name="end_date" id="endDate"
                                    required>
                                <div class="invalid-feedback">Please select an end date.</div>
                            </div>

                            <!-- Status -->
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Status</label>
                                <select class="form-select" name="is_active" id="isActive">
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                                <div class="invalid-feedback">Please select a status.</div>
                            </div>

                        </div>

                        <!-- Footer -->
                        <div class="text-end mt-4">
                            <button type="submit" class="btn btn-primary px-4" id="savecouponBtn">
                                Save Coupon
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    </div>

@endsection
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<script>
    $(document).ready(function() {

        $(document).on('change', '#discountType', function() {
            let type = $(this).val();
            let symbol = $('#discountSymbol');
            let maxDiscount = $('#maxDiscountAmount');
            let discountInput = $('#discountValue');

            if (type == 6) {
                symbol.text('%');
                maxDiscount.prop('disabled', false);
                if (discountInput.val() > 100) discountInput.val(100);
            } else {
                symbol.text('₹');
                maxDiscount.val('').prop('disabled', true);
            }
        });

        $(document).on('input', '#discountValue', function() {
            let type = $('#discountType').val();
            let value = parseFloat($(this).val());

            if (type == 6 && value > 100) {
                $(this).val(100);

            }
        });
        // 2. Form Submit (Save/Update)
        $('#couponForm').on('submit', function(e) {
            e.preventDefault();

            let form = this;
            if (!form.checkValidity()) {
                e.stopPropagation();
                $(form).addClass('was-validated');
                return;
            }
            let submitBtn = $("#savecouponBtn");
            let originalText = submitBtn.text();
            submitBtn.prop('disabled', true).html(
                '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...'
            );
            let formData = $(this).serialize();

            $.ajax({
                url: "{{ route('admin.coupon.save') }}",
                method: 'POST',
                data: formData,
                success: function(res) {
                    if (res.status) {
                        Toast.fire({
                                icon: 'success',
                                title: res.message
                            })
                            .then(() => location.reload());
                    } else {
                        // submitBtn.prop('disabled', false).text(originalText);
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
        // 3. Edit coupon
        // EDIT COUPON
        $(document).on('click', '.edit-coupon-btn', function() {
            let data = $(this).data('coupon');
            console.log(data);
            $('#couponModal .modal-title').text('Edit Coupon');
            $('#couponId').val(data.ID);
            $('#couponCode').val(data.Code);
            $('#couponDescription').val(data.Description);
            $('#discountType').val(data.DiscountType).trigger('change');
            $('#discountValue').val(data.DiscountValue);
            $('#discountSymbol').text(data.DiscountType == 6 ? '%' : '₹');
            $('#maxDiscountAmount').val(data.MaxDiscountAmount);
            $('#minOrderAmount').val(data.MinOrderAmount);
            $('#usageLimit').val(data.UsageLimit);
            $('#usageLimitPerUser').val(data.UsageLimitPerUser);
            $('#startDate').val(data.StartDate.replace(" ", "T"));
            $('#endDate').val(data.EndDate.replace(" ", "T"));
            $('#isActive').val(data.IsActive);
            $('#couponModal').modal('show');
        });

        // CREATE COUPON (Reset)
        $('[data-bs-target="#couponModal"]').on('click', function() {
            $('#couponForm')[0].reset();
            $('#couponId').val('');
            $('#discountSymbol').text('%');
            $('#couponModal .modal-title').text('Create Coupon');
        });

        // 3. Reset Modal on Close
        $('#couponModal').on('hidden.bs.modal', function() {
            const form = $('#couponForm')[0];
            form.reset();
            $('#couponForm')
                .removeClass('was-validated')
                .find('.is-invalid, .is-valid')
                .removeClass('is-invalid is-valid');

        });
        $(document).on('change', '.coupon-toggle', function() {
            let id = $(this).data('id');
            let type = $(this).data('type');
            let status = $(this).prop('checked') ? 1 : 0;
            let _this = $(this);

            $.ajax({
                url: "{{ route('admin.coupon.update-status') }}",
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
                            title: response.message ||
                                'Status Updated Successfully!'
                        }).then(() => {
                            // location.reload(); 
                        });
                    } else {
                        Toast.fire({
                            icon: 'error',
                            title: response.message || 'Failed to update status'
                        });
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
    });
</script>
