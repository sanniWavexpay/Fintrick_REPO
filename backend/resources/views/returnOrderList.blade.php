@extends('layouts.admin')

@section('title', 'Return Orders | Fintrick Admin')

<style>
    .dropdown-toggle.badge {
        min-width: 95px;
        padding: 6px 10px;
        font-size: 12px;
        text-transform: capitalize;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .dropdown-toggle::after {
        margin-left: auto;
    }

    .zoomable-img {
        transition: transform 0.3s ease;
    }

    .zoomable-img:hover {
        transform: scale(1.08);
    }
</style>

@section('content')
    <div class="custom-container">
        <div class="row">
            <div class="col-lg-12">
                <div class="mb-4 d-flex justify-content-between align-items-center">
                    <h2>Return Order List</h2>
                </div>
            </div>
        </div>

        <div class="card card-lg">
            <div class="card-header border-bottom-0">
                <div class="row g-4 align-items-center">
                    <div class="col-lg-4">
                        <div class="input-group">
                            <span class="input-group-text bg-transparent border-end-0">
                                <i class="ti ti-search text-muted"></i>
                            </span>
                            <input type="search" class="form-control border-start-0 ps-0" id="return-search" placeholder="Search Order No, Name or Return ID" />
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <select class="form-select" id="return-status-select">
                            <option value="">All Return Status</option>
                            <option value="44">Requested</option>
                            <option value="45">Approved</option>
                            <option value="46">Picked</option>
                            <option value="47">In Transit</option>
                            <option value="48">Received</option>
                            <option value="55">Refund Initiated</option>
                            <option value="56">Refund Completed</option>
                            <option value="57">Rejected</option>
                        </select>
                    </div>
                    <div class="col-lg-4">
                        <div class="input-group">
                            <span class="input-group-text bg-transparent border-end-0">
                                <i class="ti ti-calendar text-muted"></i>
                            </span>
                            <input type="text" class="form-control border-start-0 ps-0" id="date-range-picker" placeholder="Select Date Range" />
                        </div>
                    </div>
                </div>
            </div>

            <div id="table-data">
                @include('partials.return_order_table')
            </div>
        </div>
    </div>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="{{ asset('assets/libs/dropzone/dist/dropzone-min.js') }}"></script>

    <script>
        $(document).ready(function() {
            // 0. Initialize Date Range Picker
            if (typeof flatpickr !== 'undefined') {
                flatpickr("#date-range-picker", {
                    mode: "range",
                    dateFormat: "Y-m-d",
                    onChange: function(selectedDates, dateStr, instance) {
                        if (selectedDates.length === 2) {
                            fetchReturns(1);
                        }
                    }
                });
            }

            // 1. Search Logic
            let searchTimer;
            $(document).on('keyup input', '#return-search', function() {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(function() {
                    fetchReturns(1);
                }, 500);
            });

            // 2. Status Select Logic
            $(document).on('change', '#return-status-select', function() {
                fetchReturns(1);
            });

            // 3. Pagination Logic
            $(document).on('click', '.pagination a', function(e) {
                e.preventDefault();
                const page = $(this).attr('href').split('page=')[1];
                fetchReturns(page);
            });

            // 4. AJAX Fetch Logic
            function fetchReturns(page = 1) {
                const search = $('#return-search').val().trim();
                const status = $('#return-status-select').val();
                const date_range = $('#date-range-picker').val();

                $('#table-data').css('opacity', '0.5');

                $.ajax({
                    url: "{{ route('admin.return-list-view') }}",
                    method: "GET",
                    data: {
                        page: page,
                        search: search,
                        status: status,
                        date_range: date_range
                    },
                    success: function(response) {
                        $('#table-data').html(response);
                    },
                    error: function(xhr) {
                        console.error("AJAX Error:", xhr.responseText);
                    },
                    complete: function() {
                        $('#table-data').css('opacity', '1');
                    }
                });
            }

            // --- Status Update Logic ---
            $(document).on('click', '.update-return', function(e) {
                e.preventDefault();
                let id = $(this).data('id');
                let value = $(this).data('value');
                let btn = $(this);
                btn.addClass('disabled');

                $.ajax({
                    url: "/admin/update-return-status",
                    type: "POST",
                    data: {
                        _token: "{{ csrf_token() }}",
                        id: id,
                        status: value
                    },
                    success: function(response) {
                        if (response.success) {
                            Toast.fire({
                                icon: 'success',
                                title: response.message || "Status updated successfully!"
                            }).then(() => fetchReturns(1));
                        } else {
                            Toast.fire({
                                icon: 'error',
                                title: response.message || "Something went wrong!"
                            });
                            btn.removeClass('disabled');
                        }
                    },
                    error: function(xhr) {
                        Toast.fire({
                            icon: 'error',
                            title: "Server Error! Please try again."
                        });
                        btn.removeClass('disabled');
                    }
                });
            });

            // --- View Images Logic ---
            $(document).on('click', '.view-images', function() {
                let returnId = $(this).data('id');
                $.ajax({
                    url: "/admin/get-return-images",
                    type: "GET",
                    data: { id: returnId },
                    success: function(res) {
                        let html = '';
                        if (res.images && res.images.length > 0) {
                            res.images.forEach(img => {
                                html += `<div class="col-4 mb-3"><img src="/${img.image}" class="img-fluid rounded shadow-sm zoomable-img" style="cursor:pointer"></div>`;
                            });
                        } else {
                            html = `<p class="text-center text-muted">No Images Found</p>`;
                        }
                        $('#imageContainer').html(html);
                        $('#imageModal').modal('show');
                    }
                });
            });

            // --- Zoom Logic ---
            $(document).on('click', '.zoomable-img', function() {
                let src = $(this).attr('src');
                $('#zoomedImage').attr('src', src).css('transform', 'scale(1)');
                scale = 1;
                $('#zoomModal').modal('show');
            });

            let scale = 1;
            $('#zoomedImage').on('wheel', function(e) {
                e.preventDefault();
                if (e.originalEvent.deltaY < 0) scale += 0.1;
                else scale -= 0.1;
                scale = Math.max(1, scale);
                $(this).css('transform', `scale(${scale})`);
            });
            // --- View Refund Details ---
            $(document).on('click', '.view-refund-btn', function() {
                let itemId = $(this).data('id');
                let orderId = $(this).data('oid');
                
                $('#refundDetailsModal').modal('show');
                $('#refundLoading').show();
                $('#refundContent').hide();

                console.log("Fetching refund details for Order Item:", itemId, "Order ID:", orderId);
                
                $.ajax({
                    url: "{{ route('admin.get-refund-details') }}",
                    method: "POST",
                    data: {
                        _token: "{{ csrf_token() }}",
                        item_id: itemId,
                        order_id: orderId
                    },
                    success: function(res) {
                        console.log("Refund details full response:", res);
                        $('#refundLoading').hide();
                        if (res.success) {
                            let data = res.data;
                            $('#refMethod').text(data.refund_method == 'upi' ? 'UPI / Wallet' : 'Bank Transfer');
                            $('#refReason').text(data.refund_reason || 'User requested return/refund');
                            
                            if (data.refund_method == 'upi') {
                                $('#upiDetails').show();
                                $('#bankDetails').hide();
                                $('#refUpiId').text(data.upi_id || '-');
                            } else {
                                $('#upiDetails').hide();
                                $('#bankDetails').show();
                                $('#refHolderName').text(data.account_holder_name || '-');
                                $('#refAccountNo').text(data.account_no || '-');
                                $('#refIfsc').text(data.ifsc_code || '-');
                            }
                            $('#refundContent').fadeIn();
                        } else {
                            console.warn("Refund fetch failed. Debug info:", res.debug, "Message:", res.message);
                            $('#refundContent').html('<div class="alert alert-warning border-0 shadow-sm p-3 rounded-3"><i class="ti ti-alert-circle me-2"></i> '+res.message+'</div>').show();
                        }
                    },
                    error: function(xhr, status, err) {
                        console.error("AJAX Error:", status, err, xhr.responseText);
                        $('#refundLoading').hide();
                        let errorMsg = "Something went wrong! Please check if refund details were provided.";
                        if(xhr.status === 404) errorMsg = "Refund details not found for this order.";
                        $('#refundContent').html('<div class="alert alert-danger border-0 shadow-sm p-3 rounded-3"><i class="ti ti-alert-triangle me-2"></i> '+errorMsg+'</div>').show();
                    }
                });
            });

            // Mark Refund Done (Helper alert)
            $(document).on('click', '#markRefundDone', function() {
                alert('Please update the Status dropdown to "Refund Completed" after transferring the amount.');
                $('#refundDetailsModal').modal('hide');
            });
        });
    </script>

    <div class="modal fade" id="imageModal">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5>Return Images</h5>
                    <button class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <div class="row" id="imageContainer"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="zoomModal">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content bg-dark border-0">
                <div class="modal-body d-flex justify-content-center align-items-center position-relative">

                    <!-- Close Button -->
                    <button class="btn btn-light position-absolute top-0 end-0 m-3" data-bs-dismiss="modal">
                        ✕
                    </button>

                    <!-- Image -->
                    <img id="zoomedImage" src="" class="img-fluid" style="max-height:90vh;">
                </div>
            </div>
        </div>
    </div>

    <!-- REFUND DETAILS MODAL (Universal) -->
    <div class="modal fade" id="refundDetailsModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-lg border-0 rounded-4">
                <div class="modal-header bg-light border-0">
                    <h5 class="modal-title fw-bold">Refund Settlement Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4">
                    <div id="refundLoading" class="text-center py-4">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="mt-2 text-muted">Fetching details...</p>
                    </div>
                    <div id="refundContent" style="display: none;">
                        <div class="d-flex align-items-center mb-4 p-3 bg-light-primary rounded-3">
                            <div class="bg-primary text-white rounded-circle p-2 me-3">
                                <i class="ti ti-wallet fs-4"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold">Refund Method</h6>
                                <span class="badge bg-primary" id="refMethod">UPI</span>
                            </div>
                        </div>

                        <div id="bankDetails" style="display: none;">
                            <div class="mb-3">
                                <label class="text-muted small">Account Holder</label>
                                <p class="fw-bold mb-0" id="refHolderName">-</p>
                            </div>
                            <div class="row">
                                <div class="col-6 mb-3">
                                    <label class="text-muted small">Account Number</label>
                                    <p class="fw-bold mb-0" id="refAccountNo">-</p>
                                </div>
                                <div class="col-6 mb-3">
                                    <label class="text-muted small">IFSC Code</label>
                                    <p class="fw-bold mb-0 text-primary" id="refIfsc">-</p>
                                </div>
                            </div>
                        </div>

                        <div id="upiDetails" style="display: none;">
                            <div class="p-3 border rounded-3 text-center bg-light">
                                <label class="text-muted small d-block mb-1">UPI ID / PhonePe / GPay</label>
                                <h5 class="fw-black text-primary mb-0" id="refUpiId">-</h5>
                            </div>
                        </div>

                        <div class="mt-4 pt-3 border-top">
                            <label class="text-muted small">Refund Reason</label>
                            <p class="small text-dark italic" id="refReason">-</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success rounded-pill px-4" id="markRefundDone">Done Refunded</button>
                </div>
            </div>
        </div>
    </div>
@endsection
