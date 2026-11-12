@extends('layouts.admin')

@section('title', 'Product Reviews ${id} | Fintrick Admin')
<?php
// dd($payments);
?>
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
            <div class="col-12">
                <div class="mb-4 d-flex align-items-center justify-content-between">

                    <div class="d-flex align-items-center gap-3">

                        {{-- Back button only when filter applied --}}
                        @if (request()->hasAny(['from', 'to', 'search']))
                            <a href="{{ route('admin.payment-details.view') }}"
                                class="btn btn-outline-secondary btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                                style="width:36px;height:36px" title="Clear filters">
                                <i class="ti ti-arrow-left fs-2"></i>
                            </a>
                        @endif

                        <h1 class="mb-0 h2">Transaction History</h1>

                    </div>

                </div>
            </div>
        </div>
        <div class="card card-lg mb-4 shadow-sm border-0">
            <div class="card-body p-4">
                <div class="row g-3 align-items-center">
                    <!-- Search Input -->
                    <div class="col-md-4">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0">
                                <i class="ti ti-search text-muted"></i>
                            </span>
                            <input type="search" id="payment-search" class="form-control border-start-0 ps-0"
                                placeholder="Search Order ID, Txn ID, or Customer..." value="{{ request('search') }}">
                        </div>
                    </div>

                    <!-- Status Filter -->
                    <div class="col-md-3">
                        <select class="form-select" id="payment-status-select">
                            <option value="">All Status</option>
                            <option value="26">Pending</option>
                            <option value="27">Success</option>
                            <option value="28">Failed</option>
                            <option value="29">Refunded</option>
                            <option value="42">Expired</option>
                            <option value="43">Initiated</option>
                        </select>
                    </div>

                    <!-- Date Range Picker -->
                    <div class="col-md-5">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0">
                                <i class="ti ti-calendar text-muted"></i>
                            </span>
                            <input type="text" id="date-range-picker" class="form-control border-start-0 ps-0"
                                placeholder="Select Date Range (Created Date)" readonly>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card card-lg" id="table-data">
            @include('partials.payment_table')
        </div>
        </div>
    </div>

    {{-- view product review --}}

    <div class="modal fade" id="paymentDetailModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header bg-light border-bottom-0 py-3">
                    <h5 class="modal-title fw-bold">Payment Transaction Detail</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <div class="mb-3 pb-3 border-bottom">
                        <label class="text-muted small text-uppercase fw-bold mb-2 d-block">UPI Intent URL</label>
                        <div class="p-3 bg-light rounded text-break small" id="view_upi_intent">
                        </div>
                    </div>
                    <div class="row g-3">
                        <div class="col-6">
                            <label class="text-muted small fw-bold d-block text-uppercase">Paid At</label>
                            <span id="view_paid_at" class="fw-semibold"></span>
                        </div>
                        <div class="col-6">
                            <label class="text-muted small fw-bold d-block text-uppercase">Modified At</label>
                            <span id="view_modified_at" class="fw-semibold" ></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="{{ asset('assets/libs/dropzone/dist/dropzone-min.js') }}"></script>

    <script>
        $(document).ready(function() {
            // --- 0. Initialize Date Picker ---
            if (typeof flatpickr !== 'undefined') {
                flatpickr("#date-range-picker", {
                    mode: "range",
                    dateFormat: "Y-m-d",
                    onChange: function(selectedDates, dateStr, instance) {
                        if (selectedDates.length === 2) {
                            fetchPayments(1);
                        }
                    }
                });
            }

            // --- 1. Search Logic ---
            let searchTimer;
            $('#payment-search').on('keyup input', function() {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(function() {
                    fetchPayments(1);
                }, 500);
            });

            // --- 2. Status Select Logic ---
            $('#payment-status-select').on('change', function() {
                fetchPayments(1);
            });

            // --- 3. AJAX Pagination ---
            $(document).on('click', '.pagination a', function(e) {
                e.preventDefault();
                const page = $(this).attr('href').split('page=')[1];
                fetchPayments(page);
            });

            // --- 4. AJAX Fetch Logic ---
            function fetchPayments(page = 1) {
                const search = $('#payment-search').val().trim();
                const status = $('#payment-status-select').val();
                const date_range = $('#date-range-picker').val();

                $('#table-data').css('opacity', '0.5');

                $.ajax({
                    url: "{{ route('admin.payment-details.view') }}",
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

            // --- 5. View Modal Detail (Updated to use $(document).on for dynamic content) ---
            $(document).on('click', '.view-payment-btn', function() {
                let upi = $(this).data('upi');
                let paidAt = $(this).data('paid');
                let modifiedAt = $(this).data('modified');

                $('#view_upi_intent').text(upi || 'N/A');
                $('#view_paid_at').text(paidAt || 'Not Paid Yet');
                $('#view_modified_at').text(modifiedAt || 'N/A');

                $('#paymentDetailModal').modal('show');
            });

            // --- 6. Status Update Logic (Updated to use $(document).on) ---
            $(document).on('click', '.update-payment', function(e) {
                e.preventDefault();

                let $this = $(this);
                let paymentId = $this.data('id');
                let newStatus = $this.data('value');
                let statusText = $this.text().trim().replace('✓', '');

                if (confirm(`Are you sure you want to change Payment Status to ${statusText}?`)) {
                    $.ajax({
                        url: "{{ route('admin.update-payment-status') }}",
                        type: "POST",
                        data: {
                            _token: "{{ csrf_token() }}",
                            id: paymentId,
                            status: newStatus
                        },
                        success: function(response) {
                            if (response.success) {
                                Toast.fire({
                                    icon: 'success',
                                    title: response.message
                                });
                                // Instead of manual UI rewrite, just refetch
                                fetchPayments($('.pagination .active span').text() || 1);
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
                                title: "Server error occurred."
                            });
                        }
                    });
                }
            });
        });
    </script>
