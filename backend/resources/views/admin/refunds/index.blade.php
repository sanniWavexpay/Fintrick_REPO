@extends('layouts.admin')

@section('title', 'Refund Management | Fintrick Admin')

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
    
    .refund-scope-badge {
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        padding: 4px 10px;
        border-radius: 6px;
    }
</style>

@section('content')
    <div class="custom-container">
        <div class="row">
            <div class="col-lg-12">
                <div class="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h2 class="mb-1">Refund Settlements</h2>
                        <p class="text-muted small mb-0">Centralized hub for processing all customer refunds (Cancellations & Returns)</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card card-lg shadow-sm border-0 rounded-4">
            <div class="card-header bg-transparent border-bottom-0 pt-4">
                <div class="row g-4 align-items-center">
                    <div class="col-lg-4">
                        <div class="input-group bg-light rounded-3 border-0">
                            <span class="input-group-text bg-transparent border-0 ps-3">
                                <i class="ti ti-search text-muted"></i>
                            </span>
                            <input type="search" class="form-control border-0 bg-transparent py-2" id="refund-search" placeholder="Search Order No or Customer" />
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <select class="form-select bg-light border-0 py-2 rounded-3" id="refund-status-select">
                            <option value="" selected>All Statuses</option>
                            <option value="51">Pending Requests</option>
                            <option value="56">Refund Completed</option>
                        </select>
                    </div>
                    <div class="col-lg-3">
                        <select class="form-select bg-light border-0 py-2 rounded-3" id="refund-method-select">
                            <option value="">All Methods</option>
                            <option value="upi">UPI / Wallet</option>
                            <option value="bank">Bank Transfer</option>
                        </select>
                    </div>
                </div>
            </div>

            <div id="table-data" class="position-relative">
                @include('partials.refund_order_table')
            </div>
        </div>
    </div>

    <!-- REFUND DETAILS MODAL -->
    <div class="modal fade" id="refundDetailsModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-lg border-0 rounded-4">
                <div class="modal-header bg-light border-0">
                    <h5 class="modal-title fw-bold">Settlement Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4">
                    <div id="modalLoading" class="text-center py-4">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="mt-2 text-muted">Fetching details...</p>
                    </div>
                    <div id="modalContent" style="display: none;">
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
                            <div class="p-4 border border-dashed rounded-3 text-center bg-light">
                                <label class="text-muted small d-block mb-1">UPI ID / PhonePe / GPay</label>
                                <h4 class="fw-black text-primary mb-0" id="refUpiId">-</h4>
                                <button class="btn btn-sm btn-outline-primary mt-2 rounded-pill copy-btn" data-target="#refUpiId">Copy ID</button>
                            </div>
                        </div>

                        <div class="mt-4 pt-3 border-top">
                            <label class="text-muted small">Refund Reason</label>
                            <p class="small text-dark italic mb-3" id="refReason">-</p>
                        </div>

                        <div id="utrSelection" class="mt-2 p-3 bg-light-warning rounded-3 border border-warning-subtle">
                            <label class="text-warning-emphasis small fw-bold mb-2 d-block" id="utrLabel">
                                <i class="ti ti-receipt-2 me-1"></i> Transaction ID / UTR Number
                            </label>
                            <input type="text" id="refund_utr" class="form-control form-control-sm border-warning-subtle" placeholder="Enter Reference No." />
                            <div id="utrReadOnly" style="display: none;">
                                <h5 class="fw-black text-dark mb-0" id="refUtrValue">-</h5>
                            </div>
                            <small class="text-muted" id="utrNote" style="font-size: 9px;">This ID will be visible to the customer for verification.</small>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary text-white rounded-pill px-4" id="markDoneInModal">Process & Mark Done</button>
                    <style>.btn-emerald { background-color: #10b981; }</style>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script>
        $(document).ready(function() {
            let activeRefundId = null;

            function fetchRefunds(page = 1) {
                const search = $('#refund-search').val().trim();
                const status = $('#refund-status-select').val();
                const method = $('#refund-method-select').val();

                $('#table-data').css('opacity', '0.5');

                $.ajax({
                    url: "{{ route('admin.refund-list-view') }}",
                    method: "GET",
                    data: {
                        page: page,
                        search: search,
                        status: status,
                        method: method
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

            // Search & Filter
            let searchTimer;
            $('#refund-search').on('keyup input', function() {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(() => fetchRefunds(1), 500);
            });
            $('#refund-status-select, #refund-method-select').on('change', () => fetchRefunds(1));

            // Pagination
            $(document).on('click', '.pagination a', function(e) {
                e.preventDefault();
                const page = $(this).attr('href').split('page=')[1];
                fetchRefunds(page);
            });

            // View Details (Eye Icon - Completed Refund)
            $(document).on('click', '.view-details-btn', function() {
                const data = $(this).data();
                
                $('#refundDetailsModal').modal('show');
                $('#modalLoading').hide();
                $('#modalContent').show();
                
                // Set Header & Hide Footer Action
                $('#refundDetailsModal .modal-title').text('Refund Receipt #' + data.orderno);
                $('#markDoneInModal').hide();
                
                $('#refMethod').text(data.method == 'UPI' ? 'UPI / Wallet' : 'Bank Transfer');
                $('#refReason').text(data.reason || 'Requested refund');
                
                if (data.method == 'UPI') {
                    $('#upiDetails').show();
                    $('#bankDetails').hide();
                    $('#refUpiId').text(data.upi || '-');
                    $('#utrLabel').html('<i class="ti ti-brand-upwork me-1"></i> UPI Ref No.');
                } else {
                    $('#upiDetails').hide();
                    $('#bankDetails').show();
                    $('#refHolderName').text(data.rbdName || '-');
                    $('#refAccountNo').text(data.acc || '-');
                    $('#refIfsc').text(data.ifsc || '-');
                    $('#utrLabel').html('<i class="ti ti-building-bank me-1"></i> Bank UTR No.');
                }

                // Show UTR as Read-Only
                $('#refund_utr').hide();
                $('#utrReadOnly').show();
                $('#utrNote').hide();
                $('#refUtrValue').text(data.utr || 'N/A');
            });

            // Process & Pay (Wallet Icon - Pending Refund)
            $(document).on('click', '.view-ref-btn', function() {
                activeRefundId = $(this).data('id');
                const data = $(this).data('full'); 
                const idList = String(activeRefundId).split(',');
                const isGrouped = idList.length > 1;
                
                $('#refundDetailsModal').modal('show');
                $('#modalLoading').hide();
                
                // Set Header & Show Footer Action
                $('#refundDetailsModal .modal-title').text(isGrouped ? 'Bulk Settlement Details' : 'Settlement Details');
                $('#markDoneInModal').show();

                const isUpi = data.upi_id ? true : false;
                $('#refund_utr').val('').show();
                $('#utrReadOnly').hide();
                $('#utrNote').show();

                $('#refMethod').text(isUpi ? 'UPI / Wallet' : 'Bank Transfer');
                
                // Show product summary or general reason
                const displayReason = data.original_reason || 'Order Cancellation Refund';
                $('#refReason').text(displayReason);
                
                if (isUpi) {
                    $('#utrLabel').html('<i class="ti ti-brand-upwork me-1"></i> UPI Transaction ID / Ref No');
                    $('#refund_utr').attr('placeholder', 'Enter UPI Ref No. (e.g. 4025...)');
                    $('#upiDetails').show();
                    $('#bankDetails').hide();
                    $('#refUpiId').text(data.upi_id || '-');
                } else {
                    $('#utrLabel').html('<i class="ti ti-building-bank me-1"></i> Bank UTR / Reference Number');
                    $('#refund_utr').attr('placeholder', 'Enter Bank UTR No.');
                    $('#upiDetails').hide();
                    $('#bankDetails').show();
                    $('#refHolderName').text(data.rbd_name || '-');
                    $('#refAccountNo').text(data.account_number || '-');
                    $('#refIfsc').text(data.ifsc_code || '-');
                }
                $('#modalContent').show();
            });

            // Status Update
            $(document).on('click', '.update-ref-direct, #markDoneInModal', function() {
                const id = activeRefundId || $(this).data('id');
                const btn = $(this);
                const utr = $('#refund_utr').val().trim();
                
                if (!utr) {
                    alert("Please enter a Transaction ID or UTR number first.");
                    return;
                }

                if (!confirm("Have you actually transferred the amount? This will finalize the order as Refunded.")) return;

                btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span>');

                $.ajax({
                    url: "{{ route('admin.refund-status-update') }}",
                    method: "POST",
                    data: {
                        _token: "{{ csrf_token() }}",
                        id: id,
                        status: 56, // Completed
                        transaction_id: utr
                    },
                    success: function(res) {
                        if (res.success) {
                            Toast.fire({ icon: 'success', title: res.message });
                            $('#refundDetailsModal').modal('hide');
                            fetchRefunds(1);
                        } else {
                            Toast.fire({ icon: 'error', title: res.message });
                            btn.prop('disabled', false).text('Mark Completed');
                        }
                    },
                    error: function() {
                        Toast.fire({ icon: 'error', title: "Server error occurred" });
                        btn.prop('disabled', false).text('Mark Completed');
                    }
                });
            });

            // Utility
            $(document).on('click', '.copy-btn', function() {
                const text = $($(this).data('target')).text();
                navigator.clipboard.writeText(text);
                $(this).text('Copied!').addClass('btn-success').removeClass('btn-outline-primary');
                setTimeout(() => $(this).text('Copy ID').removeClass('btn-success').addClass('btn-outline-primary'), 2000);
            });
        });
    </script>
@endsection
