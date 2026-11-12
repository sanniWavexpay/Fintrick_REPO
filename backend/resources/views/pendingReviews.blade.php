@extends('layouts.admin')

@section('title', 'Product Reviews ${id} | Fintrick Admin')

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
                        <h1 class="mb-3 h2">
                            All Pending Reviews
                        </h1>

                    </div>

                </div>
            </div>
        </div>
        <!-- row -->
        <div class="row">
            <div class="col-12">
                <!-- card -->
                <div class="card card-lg" id="customerList"
                    data-list="category_index,review_user,review_product,review_rating,review_text,review_date,review_status,">
                    <div class="card-header border-bottom-0">
                        <div class="row g-3 align-items-center">
                            <div class="col-lg-4">
                                <input type="search" id="review-search" class="form-control"
                                    placeholder="Search Product, Name or Text..." />
                            </div>
                            <div class="col-lg-3">
                                <select class="form-select" id="review-status-select">
                                    <option value="">All Status</option>
                                    <option value="1">Active / Approved</option>
                                    <option value="0">Pending</option>
                                </select>
                            </div>
                            <div class="col-lg-4">
                                <div class="input-group">
                                    <span class="input-group-text bg-transparent border-end-0">
                                        <i class="ti ti-calendar text-muted"></i>
                                    </span>
                                    <input type="text" id="date-range-picker" class="form-control border-start-0 ps-0" placeholder="Select Date Range" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="table-data">
                        @include('partials.pending_reviews_table')
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- view product review --}}

    <div class="modal fade" id="viewReviewModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header bg-light border-bottom-0 py-3">
                    <div class="d-flex align-items-center">
                        <div class="bg-primary-subtle text-primary rounded-circle p-2 me-3">
                            <i class="ti ti-message-2 fs-3"></i>
                        </div>
                        <div>
                            <h5 class="modal-title fw-bold mb-0">Review Full Details</h5>
                            <small class="text-muted" id="view_review_id_label">Review ID: #000</small>
                        </div>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body p-4">
                    <div class="row g-4">
                        <div class="col-lg-7 border-end">
                            <div class="mb-4">
                                <label class="text-muted small text-uppercase fw-bold mb-2 d-block">Customer Info</label>
                                <div class="d-flex align-items-center bg-light p-3 rounded-3">
                                    <div class="avatar-initials bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                        style="width: 45px; height: 45px;" id="view_user_avatar">
                                        R
                                    </div>
                                    <div class="ms-3">
                                        <h6 class="mb-0 fw-bold" id="view_user_name">Rahul Sharma</h6>
                                        <div id="view_rating_stars" class="text-warning small mt-1"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="text-muted small text-uppercase fw-bold mb-2 d-block">Review Content</label>
                                <div class="p-3 border rounded-3 bg-white shadow-sm">
                                    <p id="view_review_text" class="mb-0 text-dark italic"
                                        style="line-height: 1.6; font-style: italic;">
                                        "This product is amazing..."
                                    </p>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-6">
                                    <label class="text-muted small text-uppercase fw-bold mb-1 d-block">Status</label>
                                    <div id="view_status_badge"></div>
                                </div>
                                <div class="col-6 text-end">
                                    <label class="text-muted small text-uppercase fw-bold mb-1 d-block">Created On</label>
                                    <span class="fw-semibold text-dark" id="view_created_at">12 Feb, 2024</span>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-5">
                            <label class="text-muted small text-uppercase fw-bold mb-3 d-block text-center">Attached
                                Media</label>
                            <div id="view_media_container"
                                class="d-flex flex-wrap gap-2 justify-content-center p-2 bg-light rounded-3"
                                style="min-height: 200px;">
                            </div>
                            <div class="mt-3 text-center">
                                <small class="text-muted"><i class="ti ti-info-circle me-1"></i>Click images to
                                    enlarge</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer bg-light border-top-0">
                    <button type="button" class="btn btn-white shadow-sm rounded-pill px-4"
                        data-bs-dismiss="modal">Close View</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="imageLightbox" tabindex="-1" style="background: rgba(0,0,0,0.85); z-index: 9999;">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content bg-transparent border-0">
                <div class="modal-body p-0 text-center position-relative">
                    <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                        data-bs-dismiss="modal"></button>
                    <img src="" id="lightbox_img" class="img-fluid rounded shadow-lg" style="max-height: 85vh;">
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
                        fetchReviews(1);
                    }
                }
            });
        }

        // --- 1. Search Logic ---
        let searchTimer;
        $('#review-search').on('keyup input', function() {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(function() {
                fetchReviews(1);
            }, 500);
        });

        // --- 2. Status Filter ---
        $('#review-status-select').on('change', function() {
            fetchReviews(1);
        });

        // --- 3. AJAX Pagination ---
        $(document).on('click', '.pagination a', function(e) {
            e.preventDefault();
            const page = $(this).attr('href').split('page=')[1];
            fetchReviews(page);
        });

        // --- 4. Fetch Reviews Function ---
        function fetchReviews(page = 1) {
            const search = $('#review-search').val().trim();
            const status = $('#review-status-select').val();
            const date_range = $('#date-range-picker').val();

            $('#table-data').css('opacity', '0.5');

            $.ajax({
                url: "{{ route('admin.pending-reviews') }}", // Corrected route name
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

        // --- Original Status Toggle Logic ---
        $(document).on('change', '.status-toggle', function() {
            let checkbox = $(this);
            let id = checkbox.closest('.review_status').data('id');
            let status = checkbox.is(':checked') ? 1 : 0;

            checkbox.prop('disabled', true);

            $.ajax({
                url: "{{ url('admin/productReview/toggle-status') }}",
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

        // --- Original View Logic (Updated to delegate correctly) ---
        $(document).on('click', '.view-btn', function() {
            let id = $(this).data('id');
            let name = $(this).data('name');
            let rating = $(this).data('rating');
            let text = $(this).data('text');
            let status = $(this).data('status');
            let date = $(this).closest('tr').find('.review_date').text();

            $('#view_review_id_label').text('Review ID: #' + id);
            $('#view_user_name').text(name);
            $('#view_user_avatar').text(name ? name.charAt(0).toUpperCase() : 'A');
            $('#view_review_text').text('"' + text + '"');
            $('#view_created_at').text(date);

            let stars = '';
            for (let i = 1; i <= 5; i++) {
                stars += (i <= rating) ? '<i class="ti ti-star-filled"></i>' : '<i class="ti ti-star"></i>';
            }
            $('#view_rating_stars').html(stars);

            let badge = (status == '1') ?
                '<span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3">Active / Approved</span>' :
                '<span class="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-3">Pending</span>';
            $('#view_status_badge').html(badge);

            let mediaBox = $('#view_media_container');
            mediaBox.empty();
            let tableMedia = $(this).closest('tr').find('.review_media').find('img, video');

            if (tableMedia.length > 0) {
                tableMedia.each(function() {
                    let src = $(this).attr('src');
                    let clone = $(this).clone()
                        .removeAttr('onclick data-bs-toggle data-bs-target')
                        .css({
                        'width': '100px',
                        'height': '100px',
                        'object-fit': 'cover',
                        'border-radius': '12px',
                        'cursor': 'pointer'
                    }).addClass('shadow-sm border border-white enlarge-trigger');

                    clone.on('click', function() {
                        $('#lightbox_img').attr('src', src);
                        $('#imageLightbox').modal('show');
                    });

                    mediaBox.append(clone);
                });
            } else {
                mediaBox.html('<div class="text-center mt-5 text-muted"><i class="ti ti-photo-off fs-1 d-block mb-2"></i>No Media Uploaded</div>');
            }

            $('#viewReviewModal').modal('show');
        });
    });
</script>