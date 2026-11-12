@extends('layouts.admin')

@section('title', 'Customer | Shopping Store')

@section('content')
    <div class="custom-container">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-12">
                <!-- Page header -->
                <div class="mb-8 d-md-flex justify-content-between align-items-center">
                    <div>
                        <h1 class="mb-3 h2">Customer</h1>
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#">Home</a></li>
                                <li class="breadcrumb-item"><a href="#">Ecommerce</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Customer</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <!-- row -->
            <div class="row">
                <div class="col-12">
                    <!-- card -->
                    <div class="card card-lg" id="customerList">
                        <div class="card-header border-bottom-0">
                            <form id="filter-form" class="row g-3 align-items-end">
                                <!-- Search -->
                                <div class="col-lg-4 col-md-6">
                                    <label class="form-label">Search</label>
                                    <input type="search" name="search" id="search-input" class="form-control"
                                        placeholder="Name, Email, Phone..." value="{{ request('search') }}" />
                                </div>

                                <!-- Status Filter -->
                                <div class="col-lg-3 col-md-6">
                                    <label class="form-label">Status</label>
                                    <select name="status" id="status-select" class="form-select">
                                        <option value="">All Status</option>
                                        <option value="1" {{ request('status') === '1' ? 'selected' : '' }}>Active
                                        </option>
                                        <option value="0" {{ request('status') === '0' ? 'selected' : '' }}>Inactive
                                        </option>
                                    </select>
                                </div>

                                <!-- Date Range (Modern Single Input) -->
                                <div class="col-lg-5 col-md-12">
                                    <label class="form-label">Date Range</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="ti ti-calendar"></i></span>
                                        <input type="text" name="date_range" id="date-range-picker"
                                            class="form-control" placeholder="Select Date Range (From to To)"
                                            value="{{ request('date_range') }}" />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div id="table-data">
                            @include('partials.customer_table')
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="addCustomerModal" tabindex="-1" aria-labelledby="addCustomerModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addCustomerModalLabel">Add Customer</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form class="needs-validation" novalidate>
                        <div>
                            <div class="mb-3">
                                <label for="customerName" class="form-label">Customer name</label>
                                <input type="text" class="form-control" placeholder="Enter name" id="customerName"
                                    required />
                                <div class="invalid-feedback">Please enter name.</div>
                            </div>
                            <div class="mb-3">
                                <label for="customerEmail" class="form-label">Email</label>
                                <input type="email" class="form-control" placeholder="Enter Email" id="customerEmail"
                                    required />
                                <div class="invalid-feedback">Please enter email.</div>
                            </div>
                            <div class="mb-3">
                                <label for="customerPhone" class="form-label">Phone</label>
                                <input type="text" class="form-control" placeholder="Enter Phone" id="customerPhone"
                                    required />
                                <div class="invalid-feedback">Please enter phone.</div>
                            </div>
                            <div class="mb-3">
                                <label for="customerDate" class="form-label">Joining Date</label>
                                <input type="text" class="form-control flatpickr" placeholder="Select date"
                                    id="customerDate" required />
                                <div class="invalid-feedback">Please enter Date.</div>
                            </div>
                            <div class="text-end">
                                <button type="submit" class="btn btn-primary me-1">+ Add Customer</button>
                                <button type="button" class="btn btn-white" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script>
        $(document).ready(function() {
            // 1. Initialize Modern Range Date Picker
            const flatpickrInstance = flatpickr("#date-range-picker", {
                mode: "range",
                dateFormat: "Y-m-d",
                onChange: function(selectedDates, dateStr, instance) {
                    if (selectedDates.length === 1 || selectedDates.length === 2) {
                        fetchFilteredData();
                    }
                }
            });

            // 2. Debounce helper for Search
            function debounce(func, delay) {
                let timer;
                return function() {
                    const context = this;
                    const args = arguments;
                    clearTimeout(timer);
                    timer = setTimeout(() => func.apply(context, args), delay);
                };
            }

            // 3. AJAX Fetch Logic
            function fetchFilteredData(page = 1) {
                const search = $('#search-input').val();
                const status = $('#status-select').val();
                const date_range = $('#date-range-picker').val();

                $('#table-data').css('opacity', '0.5');

                $.ajax({
                    url: "{{ route('admin.customers') }}",
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
                    error: function() {
                        console.log("Error loading data.");
                    },
                    complete: function() {
                        $('#table-data').css('opacity', '1');
                    }
                });
            }

            // 4. Event Listeners
            $('#search-input').on('input', debounce(function() {
                fetchFilteredData();
            }, 500));

            $('#status-select').on('change', function() {
                fetchFilteredData();
            });

            // 5. AJAX Pagination Links Handle
            $(document).on('click', '.pagination a', function(e) {
                e.preventDefault();
                const url = new URL($(this).attr('href'));
                const page = url.searchParams.get('page');
                fetchFilteredData(page);
            });
        });

        // Status Toggle AJAX
        $(document).on('change', '.status-toggle', function() {
            const $this = $(this);
            const customerId = $this.data('id');
            const isActive = $this.prop('checked') ? 1 : 0;
            const $label = $this.closest('tr').find('.status-label');

            $this.css('opacity', '0.5');

            $.ajax({
                url: "{{ route('admin.customer.toggleStatus') }}",
                method: "POST",
                data: {
                    _token: "{{ csrf_token() }}",
                    id: customerId,
                    is_active: isActive
                },
                success: function(response) {
                    if (!response.success) {
                        $this.prop('checked', !isActive);
                    } else {
                        if (isActive === 1) {
                            $label.text('Active')
                                .removeClass('text-danger-emphasis bg-danger-subtle')
                                .addClass('text-success-emphasis bg-success-subtle');
                        } else {
                            $label.text('Inactive')
                                .removeClass('text-success-emphasis bg-success-subtle')
                                .addClass('text-danger-emphasis bg-danger-subtle');
                        }
                    }
                },
                error: function() {
                    $this.prop('checked', !isActive);
                },
                complete: function() {
                    $this.css('opacity', '1');
                }
            });
        });
    </script>
@endsection
