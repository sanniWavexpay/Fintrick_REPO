@extends('layouts.admin')

@section('title', 'Orders | Shopping Store')

@section('content')
    <div class="custom-container">
        <div class="row mb-5">
            <div class="col-12 d-md-flex justify-content-between align-items-center">
                <div>
                    <h1 class="mb-1 h2 fw-bold">Order Management</h1>
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb mb-0">
                            <li class="breadcrumb-item"><a href="#">Dashboard</a></li>
                            <li class="breadcrumb-item active">Orders</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="card card-lg" id="orderList">
                    <div class="card-header border-bottom-0">
                        <form id="filter-form" class="row g-2 align-items-end">
                            <!-- Search -->
                            <div class="col-lg-3 col-md-6">
                                <label class="form-label small fw-bold">Search</label>
                                <input type="search" name="search" id="order-search" class="form-control form-control-sm"
                                    placeholder="Order No / Name" value="{{ request('search') }}" />
                            </div>

                            <!-- Order Status Filter -->
                            <div class="col-lg-2 col-md-6">
                                <label class="form-label small fw-bold">Order Status</label>
                                <select name="status" id="status-select" class="form-select form-select-sm">
                                    <option value="">All Order Status</option>
                                    <option value="8">Pending</option>
                                    <option value="9">Confirmed</option>
                                    <option value="10">Shipped</option>
                                    <option value="11">Delivered</option>
                                    <option value="12">Cancelled</option>
                                    <option value="13">Refunded</option>
                                    <option value="62">Partial</option>
                                </select>
                            </div>

                            <!-- Payment Status Filter -->
                            <div class="col-lg-2 col-md-6">
                                <label class="form-label small fw-bold">Payment Status</label>
                                <select name="payment_status" id="payment-status-select" class="form-select form-select-sm">
                                    <option value="">All Payment Status</option>
                                    <option value="15">Paid</option>
                                    <option value="14">Pending</option>
                                    <option value="16">Failed</option>
                                    <option value="17">Refunded</option>
                                    <option value="61">Partial Refund</option>
                                </select>
                            </div>

                            <!-- Date Range -->
                            <div class="col-lg-5 col-md-12">
                                <label class="form-label small fw-bold">Order Date Range</label>
                                <div class="input-group input-group-sm">
                                    <span class="input-group-text"><i class="ti ti-calendar"></i></span>
                                    <input type="text" name="date_range" id="date-range-picker"
                                        class="form-control" placeholder="Select Date Range"
                                        value="{{ request('date_range') }}" />
                                </div>
                            </div>
                        </form>
                    </div>

                    <div id="table-data">
                        @include('partials.order_table')
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('styles')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <style>
        .card-header .row > div { margin-bottom: 1rem; }
    </style>
@endpush

@push('scripts')
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script>
        $(document).ready(function() {
            // 1. Initialize Modern Range Date Picker
            const flatpickrInstance = flatpickr("#date-range-picker", {
                mode: "range",
                dateFormat: "Y-m-d",
                onChange: function(selectedDates, dateStr, instance) {
                    if (selectedDates.length === 2 || selectedDates.length === 0) {
                        fetchOrders();
                    }
                }
            });

            // 2. Prevent Form Submission
            $('#filter-form').on('submit', function(e) {
                e.preventDefault();
                fetchOrders();
            });

            // 3. Debounce helper for Search
            function debounce(func, delay) {
                let timer;
                return function() {
                    const context = this;
                    const args = arguments;
                    clearTimeout(timer);
                    timer = setTimeout(() => func.apply(context, args), delay);
                };
            }

            // 4. AJAX Fetch Logic
            function fetchOrders(page = 1) {
                const search = $('#order-search').val().trim();
                const status = $('#status-select').val();
                const payment_status = $('#payment-status-select').val();
                const date_range = $('#date-range-picker').val();

                $('#table-data').css('opacity', '0.5');

                $.ajax({
                    url: "{{ route('admin.order-view') }}",
                    method: "GET",
                    data: {
                        page: page,
                        search: search,
                        status: status,
                        payment_status: payment_status,
                        date_range: date_range
                    },
                    success: function(response) {
                        $('#table-data').html(response);
                    },
                    error: function(xhr) {
                        console.error("Fetch Error:", xhr.responseText);
                        Toast.fire({ icon: 'error', title: 'Failed to fetch orders' });
                    },
                    complete: function() {
                        $('#table-data').css('opacity', '1');
                    }
                });
            }

            // 5. Event Listeners
            $('#order-search').on('input search', debounce(function() {
                fetchOrders();
            }, 500));

            $('#status-select, #payment-status-select').on('change', function() {
                fetchOrders();
            });

            // 6. AJAX Pagination Links
            $(document).on('click', '.pagination a', function(e) {
                e.preventDefault();
                const url = new URL($(this).attr('href'));
                const page = url.searchParams.get('page');
                fetchOrders(page);
            });

            // 7. Update Order Status
            $(document).on('click', '.update-order', function(e) {
                e.preventDefault();
                const orderId = $(this).attr('data-id');
                const newValue = $(this).attr('data-value');
                const statusText = $(this).text().trim();
                
                console.log("Updating Order:", orderId, "to Status:", statusText);

                Swal.fire({
                    title: 'Update Order Status?',
                    text: `Are you sure you want to change this order to "${statusText}"?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, update it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log("Confirmed. Sending AJAX for Order Status update...");
                        $.ajax({
                            url: "{{ route('admin.update-order-status') }}",
                            type: "POST",
                            data: {
                                _token: "{{ csrf_token() }}",
                                id: orderId,
                                value: newValue
                            },
                            success: function(response) {
                                if (response.success) {
                                    let currentPage = $('.pagination .active .page-link').text() || $('.pagination .active span').text() || 1;
                                    fetchOrders(currentPage.toString().trim());
                                    Toast.fire({ icon: 'success', title: response.message || 'Status Updated' });
                                } else {
                                    Swal.fire('Error', response.message || 'Update failed', 'error');
                                }
                            },
                            error: function(xhr) {
                                console.error("Order Update Error:", xhr);
                                let msg = (xhr.responseJSON && xhr.responseJSON.message) ? xhr.responseJSON.message : "Server error code: " + xhr.status;
                                Swal.fire('Error', msg, 'error');
                            }
                        });
                    }
                });
            });

            // 8. Update Payment Status
            $(document).on('click', '.update-payment', function(e) {
                e.preventDefault();
                const paymentId = $(this).attr('data-id');
                const newValue = $(this).attr('data-value');
                const statusText = $(this).text().trim();
                
                console.log("Updating Payment Status for ID:", paymentId, "to:", statusText);

                Swal.fire({
                    title: 'Update Payment Status?',
                    text: `Change payment status to "${statusText}"?`,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, change it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log("Confirmed. Sending AJAX for Payment Status update...");
                        $.ajax({
                            url: "{{ route('admin.update-order-payment-status') }}",
                            method: "POST",
                            data: {
                                _token: "{{ csrf_token() }}",
                                id: paymentId,
                                value: newValue
                            },
                            success: function(response) {
                                if (response.success) {
                                    let currentPage = $('.pagination .active .page-link').text() || $('.pagination .active span').text() || 1;
                                    fetchOrders(currentPage.toString().trim());
                                    Toast.fire({ icon: 'success', title: response.message || 'Payment Status Changed' });
                                } else {
                                    Swal.fire('Error', response.message || 'Update failed', 'error');
                                }
                            },
                            error: function(xhr) {
                                console.error("Payment Update Error:", xhr);
                                let msg = (xhr.responseJSON && xhr.responseJSON.message) ? xhr.responseJSON.message : "Server error code: " + xhr.status;
                                Swal.fire('Error', msg, 'error');
                            }
                        });
                    }
                });
            });
        });
    </script>
@endpush
