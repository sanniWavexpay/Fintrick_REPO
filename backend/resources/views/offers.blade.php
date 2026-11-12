@extends('layouts.admin')
@section('title', 'Offer Management')

@section('content')
    <div class="custom-container">
        <div class="row">
            <div class="col-12">
                <div class="mb-8 d-md-flex justify-content-between align-items-center">
                    <div>
                        <h1 class="mb-3 h2">All Offers</h1>
                        <p>Manage product, category, and variant discounts.</p>
                    </div>
                    <div>
                        <button class="btn btn-primary d-md-flex align-items-center gap-2" data-bs-toggle="modal"
                            data-bs-target="#offerModal">
                            <i class="ti ti-plus"></i> Create New Offer
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="row">
                <div class="col-12">
                    <div class="card card-lg shadow-sm" id="customerList"
                        data-list="category_index,offer_title,offer_level,offer_discount,offer_duration,offer_priority">
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
                                        <th class="listjs-sorter" data-sort="offer_title">Title</th>
                                        <th class="listjs-sorter" data-sort="offer_level">Level</th>
                                        <th class="listjs-sorter" data-sort="offer_discount">Discount</th>
                                        <th class="listjs-sorter" data-sort="offer_duration">Duration </th>
                                        <th class="listjs-sorter" data-sort="offer_priority">Priority</th>
                                        <th class="listjs-sorter" data-sort="">Stackable</th>
                                        <th class="listjs-sorter" data-sort="">Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody class="list">
                                    @foreach ($offers as $offer)
                                        <tr>
                                            <td class="category_index">{{ $loop->iteration }}</td>

                                            <td class="offer_title"><strong>{{ $offer->title ?? '' }}</strong></td>
                                            <td class="offer_level"><span
                                                    class="badge bg-info-soft text-info">{{ $offer->level ?? '' }}</span>
                                            </td>
                                            <td class="offer_discount">
                                                {{ $offer->discount_value ?? '' }}{{ $offer->discount_type == 'PERCENT' ? '%' : ' FLAT' }}
                                            </td>
                                            <td class="offer_duration">
                                                {{ date('d M', strtotime($offer->start_at)) }} -
                                                {{ date('d M', strtotime($offer->end_at)) }}
                                            </td>
                                            <td class="offer_priority">
                                                <div class="d-flex justify-content-center">
                                                    <span
                                                        class="badge bg-secondary text-center">{{ $offer->priority ?? '' }}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex justify-content-center">
                                                    <div class="form-check form-switch">
                                                        <input class="form-check-input offer-toggle" type="checkbox"
                                                            data-id="{{ $offer->id }}" data-type="is_stackable"
                                                            {{ $offer->is_stackable ? 'checked' : '' }}>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div class="d-flex justify-content-center">
                                                    <div class="form-check form-switch">
                                                        <input class="form-check-input offer-toggle" type="checkbox"
                                                            data-id="{{ $offer->id }}" data-type="is_active"
                                                            {{ $offer->is_active ? 'checked' : '' }}>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <button class="btn btn-ghost btn-sm edit-offer-btn"
                                                    data-offer="{{ json_encode($offer) }}">
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

    <div class="modal fade" id="offerModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow" style="border-radius: 16px;">

                <div class="modal-header border-0 bg-light p-4">
                    <h5 class="modal-title fw-bold" id="offerModalLabel">Create New Offer</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body p-4">
                    <form id="offerForm" class="needs-validation" novalidate>
                        @csrf
                        <input type="hidden" name="offerId" id="offerId">

                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Offer Title</label>
                                <input type="text" class="form-control" name="title" id="offerTitle"
                                    placeholder="e.g. Diwali Dhamaka" required>
                                <div class="invalid-feedback">Please enter a valid offer title.</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Offer Level</label>
                                <select class="form-select" name="level" id="offerLevel" required>
                                    <option value="">Select Level</option>
                                    <option value="PRODUCT">Product Level</option>
                                    <option value="VARIANT">Variant Level</option>
                                    <option value="CATEGORY">Category Level</option>
                                </select>
                                <div class="invalid-feedback">Please select an offer level.</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Discount Type</label>
                                <select class="form-select" name="discount_type" id="discountType" required>
                                    <option value="">Select Type</option>
                                    <option value="PERCENT">Percentage (%)</option>
                                    <option value="FLAT">Flat Amount (₹)</option>
                                </select>
                                <div class="invalid-feedback">Please select a discount type.</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Discount Value</label>
                                <div class="input-group has-validation"> <span class="input-group-text"
                                        id="discountSymbol">%</span>
                                    <input type="number" step="0.01" min="0" class="form-control"
                                        name="discount_value" id="discountValue" required>
                                    <div class="invalid-feedback">Discount value is required.</div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">
                                    Max Discount (Capping)
                                    <small class="text-muted">(Only for % type)</small>
                                </label>
                                <div class="input-group has-validation">
                                    <span class="input-group-text">₹</span>
                                    <input type="number" min="0" class="form-control" name="max_discount_amount"
                                        id="maxDiscountAmount" placeholder="Optional" required>
                                    <div class="invalid-feedback">Please enter a valid capping amount.</div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Priority</label>
                                <select class="form-select" name="priority" id="offerPriority" required>
                                    <option value="">Select Priority</option>
                                    <option value="1">1 (Highest)</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5 (Lowest)</option>
                                </select>
                                <div class="invalid-feedback">Please assign a priority level (1-5).</div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Start Date</label>
                                <input type="datetime-local" class="form-control" name="start_at" id="startAt"
                                    required>
                                <div class="invalid-feedback">Please select a start date.</div>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">End Date</label>
                                <input type="datetime-local" class="form-control" name="end_at" id="endAt"
                                    required>
                                <div class="invalid-feedback">Please select an end date.</div>
                            </div>
                        </div>
                        <div class="text-end mt-4">

                            <button type="submit" id="saveofferBtn" class="btn btn-primary px-4">
                                Save Offer
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

            if (type === 'PERCENT') {
                symbol.text('%');
                maxDiscount.prop('disabled', false);
            } else {
                symbol.text('₹');
                maxDiscount.val('').prop('disabled', true);
            }
        });

        // 2. Form Submit (Save/Update)
        $('#offerForm').on('submit', function(e) {
            e.preventDefault();

            let form = this;
            if (!form.checkValidity()) {
                e.stopPropagation();
                $(form).addClass('was-validated');
                return;
            }
            let submitBtn = $("#saveofferBtn");
            let originalText = submitBtn.text();
            submitBtn.prop('disabled', true).html(
                '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...'
            );
            let formData = $(this).serialize();

            $.ajax({
                url: "{{ route('admin.offers.save') }}",
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
        // 3. Edit Offer
        $(document).on('click', '.edit-offer-btn', function() {
            let data = $(this).data('offer');
            $('#offerModalLabel').text('Edit Offer');
            $('#offerId').val(data.id);
            $('#offerTitle').val(data.title);
            $('#offerLevel').val(data.level).trigger('change');
            $('#discountType').val(data.discount_type).trigger('change');
            $('#discountValue').val(data.discount_value);
            $('#minOrderAmount').val(data.min_order_amount);
            $('#maxDiscountAmount').val(data.max_discount);
            $('#offerPriority').val(data.priority);
            $('#startAt').val(data.start_at.replace(" ", "T"));
            $('#endAt').val(data.end_at.replace(" ", "T"));
            $('#isStackable').prop('checked', data.is_stackable == 1);
            $('#offerModal').modal('show');
        });
        $('[data-bs-target="#offerModal"]').on('click', function() {
            $('#offerForm')[0].reset();
            $('#offerId').val('');
            $('#offerModalLabel').text('Create New Offer');
        });
    
        $(document).on('change', '.offer-toggle', function() {
            let id = $(this).data('id');
            let type = $(this).data('type');
            let status = $(this).prop('checked') ? 1 : 0;
            let _this = $(this); 

            $.ajax({
                url: "{{ route('admin.offer.update-status') }}",
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
