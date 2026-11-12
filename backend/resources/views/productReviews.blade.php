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
                            @if (isset($product))
                                Reviews for:
                                <span class="text-primary">
                                    {{ \Illuminate\Support\Str::words($product->Title, 6, '...') }}
                                </span>
                            @else
                                All Product Reviews
                            @endif
                        </h1>
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="{{ url('/') }}">Home</a></li>
                                <li class="breadcrumb-item"><a href="{{ url('admin/products') }}">Products</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Reviews</li>
                            </ol>
                        </nav>
                    </div>
                    <div>
                        <a class='btn btn-dark d-md-flex align-items-center gap-2' data-bs-target='#addReviewModal'
                            data-bs-toggle='modal' href='javascript:void(0)'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 5l0 14" />
                                <path d="M5 12l14 0" />
                            </svg>
                            Add Review
                        </a>

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
                        <div class="row w-100 gx-md-0 gy-4 align-items-center">
                            <div class="col-lg-4 col-md-6">
                                <input type="search" class="form-control listjs-search"
                                    placeholder="Search for category name, image, status" />
                            </div>
                            <div class="col-md-8 d-flex justify-content-md-end gap-2">
                                <a href="#!" class="btn btn-white">Export</a>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive table-checkbox" data-simplebar style="height: 500px">
                        <table class="table text-nowrap mb-0 table-centered table-hover" data-check-container>
                            <thead class="sticky-top">
                                <tr>
                                    <th class="listjs-sorter" data-sort="review_index">Sr No.</th>
                                    <th class="listjs-sorter" data-sort="review_user">Username</th>
                                    <th class="listjs-sorter" data-sort="review_product">Product</th>
                                    <th>Review Media</th>
                                    <th class="listjs-sorter" data-sort="review_rating">Rating</th>
                                    <th class="listjs-sorter" data-sort="review_text">Review Text</th>
                                    <th class="listjs-sorter" data-sort="review_date">Created At</th>
                                    <th class="listjs-sorter" data-sort="review_status">Status</th>
                                    <th class="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody class="list">
                                @foreach ($reviews as $review)
                                    <tr>
                                        <td class="category_index">{{ $loop->iteration }}</td>

                                        <td class="review_user">
                                            <span class="fw-semibold">{{ $review->Name ?? 'Anonymous' }}</span>
                                            <br>
                                            <small class="text-muted">UID: #{{ $review->UID ?? '' }}</small>
                                        </td>

                                        <td class="review_product">
                                            <div class="text-truncate" style="max-width: 150px;"
                                                title="{{ $review->ProductTitle ?? 'N/A' }}">
                                                {{ $review->ProductTitle ?? 'N/A' }}
                                            </div>
                                        </td>

                                        <td class="review_media">
                                            @php
                                                $medias = DB::table('product_review_media')
                                                    ->where('RID', $review->ID)
                                                    ->get();
                                            @endphp
                                            <div class="d-flex gap-1">
                                                @forelse($medias as $media)
                                                    <img src="{{ asset($media->MediaUrl) ?? '' }}" class="rounded border"
                                                        width="40" height="40"
                                                        style="object-fit: cover; cursor: pointer;"
                                                        data-media-id="{{ $media->ID }}" data-bs-toggle="modal"
                                                        data-bs-target="#imagePreviewModal"
                                                        onclick="showFullImage('{{ asset($media->MediaUrl) }}')">
                                                @empty
                                                    <small class="text-muted">No Media</small>
                                                @endforelse
                                            </div>
                                        </td>

                                        <td class="review_rating">
                                            <div class="text-warning d-flex align-items-center">
                                                <span class="me-1 fw-bold">{{ $review->Rating ?? '' }}</span>
                                                <i class="ti ti-star-filled fs-5"></i>
                                            </div>
                                        </td>

                                        <td class="review_text">
                                            <a href="javascript:void(0)" class="text-muted text-truncate d-inline-block"
                                                style="max-width: 200px;" data-bs-toggle="tooltip"
                                                title="{{ $review->ReviewText ?? '' }}">
                                                {{ $review->ReviewText ?? 'No comment provided' }}
                                            </a>
                                        </td>

                                        <td class="review_date">
                                            {{ date('d M, Y', strtotime($review->CreatedDtTm)) }}
                                        </td>

                                        <td class="review_status text-center" data-id="{{ $review->ID ?? 0 }}"
                                            data-status="{{ $review->IsActive ?? 0 }}">
                                            <div class="d-flex justify-content-center">
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input status-toggle" type="checkbox"
                                                        data-id="{{ $review->ID }}"
                                                        {{ $review->IsActive == 1 ? 'checked' : '' }}>
                                                </div>
                                            </div>
                                        </td>

                                        <td class="text-center">
                                            <div class="d-flex justify-content-center gap-2">
                                                <a href="javascript:void(0)"
                                                    class="btn btn-ghost btn-icon btn-sm rounded-circle text-primary view-btn"
                                                    data-id="{{ $review->ID }}" data-name="{{ $review->Name }}"
                                                    data-rating="{{ $review->Rating }}"
                                                    data-text="{{ $review->ReviewText }}"
                                                    data-status="{{ $review->IsActive }}">
                                                    <i class="ti ti-eye fs-4"></i>
                                                </a>
                                                <a href="javascript:void(0)"
                                                    class="btn btn-ghost btn-icon btn-sm rounded-circle text-primary edit-btn"
                                                    data-id="{{ $review->ID }}" data-name="{{ $review->Name }}"
                                                    data-rating="{{ $review->Rating }}"
                                                    data-text="{{ $review->ReviewText }}"
                                                    data-status="{{ $review->IsActive }}">
                                                    <i class="ti ti-edit fs-4"></i>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                            <tbody id="no-result-container" style="display: none;">
                                <tr>
                                    <td colspan="10" class="border-0">
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
                    <div
                        class="btn-toolbar card-footer border-top border-dashed d-flex flex-md-row flex-column justify-content-md-between align-items-md-center">
                        <p class="mb-0 listjs-showing-items-label"></p>
                        <div class="d-flex flex-column flex-md-row gap-4">
                            <div class="d-flex align-items-center gap-2">
                                <label class="form-label text-nowrap mb-0">Rows per page:</label>
                                <select class="form-select listjs-items-per-page" data-choices="">
                                    <option value="10" selected>10</option>
                                    <option value="14">14</option>
                                </select>
                            </div>
                            <div>
                                <div class="pagination-buttons d-flex">
                                    <button class="btn btn-white prev">Previous</button>
                                    <ul class="pagination mb-0 ms-1"></ul>
                                    <button class="btn btn-white next">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{--  add and edit product review --}}
    <div class="modal fade" id="addReviewModal" tabindex="-1" aria-labelledby="addReviewModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-light">
                    <h5 class="modal-title" id="addReviewModalLabel">Add Manual Review</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="addReviewForm" class="needs-validation" novalidate enctype="multipart/form-data">
                    @csrf
                    <input type="hidden" name="review_id" id="edit_review_id">
                    <div class="modal-body">
                        <input type="hidden" name="PID" value="{{ $product->ID ?? '' }}">

                        <div class="mb-3">
                            <label class="form-label fw-bold">Customer Name</label>
                            <input type="text" name="UserName" class="form-control" placeholder="e.g. Rahul Sharma"
                                required>
                            <div class="invalid-feedback">Please enter the customer's name.</div>
                        </div>

                        <div class="mb-3 position-relative">
                            <label class="form-label fw-bold d-block">Rating</label>
                            <div class="rating-input text-warning fs-3">
                                <i class="ti ti-star rating-star" data-value="1" style="cursor:pointer;"></i>
                                <i class="ti ti-star rating-star" data-value="2" style="cursor:pointer;"></i>
                                <i class="ti ti-star rating-star" data-value="3" style="cursor:pointer;"></i>
                                <i class="ti ti-star rating-star" data-value="4" style="cursor:pointer;"></i>
                                <i class="ti ti-star rating-star" data-value="5" style="cursor:pointer;"></i>
                                <input type="number" name="Rating" id="selected_rating" min="1" max="5"
                                    required
                                    style="opacity: 0; position: absolute; pointer-events: none; width: 1px; height: 1px;">
                                <div class="invalid-feedback">Please select a rating star.</div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">Review Comment</label>
                            <textarea name="ReviewText" class="form-control" rows="3" placeholder="Write something about product..."
                                required></textarea>
                            <div class="invalid-feedback">Review text cannot be empty.</div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">Upload Media</label>
                            <input type="file" id="hybrid_media_input" class="form-control" multiple
                                accept="image/*,video/*">

                            <div id="new_media_preview" class="d-flex flex-wrap gap-2 mt-2"></div>

                            <small class="text-muted">Max 4 photos & 1 video allowed.</small>
                        </div>

                        <div id="existing-media-wrapper" class="mt-3 d-none border-top pt-3">
                            <h6 class="fw-semibold mb-2 small text-uppercase text-muted">Current Media</h6>
                            <div id="existing-images-grid" class="row g-2"></div>
                            <input type="hidden" name="deleted_media" id="deleted_media_ids">
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">Initial Status</label>
                            <select name="Status" class="form-select" required>
                                <option value="0">Keep Pending</option>
                                <option value="1">Auto Approve</option>
                            </select>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                        <button type="submit" id="saveReviewBtn" class="btn btn-primary">Save Review</button>
                    </div>
                </form>
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
@endsection
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="{{ asset('assets/libs/dropzone/dist/dropzone-min.js') }}"></script>


<script>
    $(document).ready(function() {
        let selectedFiles = []; // Nayi select ki hui files yahan rahengi

        // --- 1. Star Rating Logic ---
        $(document).on('click', '.rating-star', function() {
            let val = $(this).data('value');
            updateStars(val);
        });

        function updateStars(val) {
            $('#selected_rating').val(val);
            $('.rating-star').each(function() {
                if ($(this).data('value') <= val) {
                    $(this).removeClass('ti-star').addClass('ti-star-filled');
                } else {
                    $(this).removeClass('ti-star-filled').addClass('ti-star');
                }
            });
        }

        // --- 2. Hybrid Media Selection with STRICT LIMIT (4 Photos, 1 Video) ---
        $('#hybrid_media_input').on('change', function(e) {
            let files = Array.from(this.files);
            let previewDiv = $('#new_media_preview');

            // 1. Purani images jo UI mein dikh rahi hain unhe count karo
            let existingPhotoCount = $('.existing-item img').length; // Sirf images
            let existingVideoCount = $('.existing-item video').length; // Sirf videos

            // 2. Nayi select ki hui files ka count (jo abhi upload nahi hui)
            let currentNewPhotoCount = selectedFiles.filter(f => f.type.startsWith('image/')).length;
            let currentNewVideoCount = selectedFiles.filter(f => f.type.startsWith('video/')).length;

            // Total Count = Purani + Nayi
            let totalPhotos = existingPhotoCount + currentNewPhotoCount;
            let totalVideos = existingVideoCount + currentNewVideoCount;

            let maxPhotos = 4;
            let maxVideos = 1;

            files.forEach((file) => {
                let isVideo = file.type.startsWith('video/');
                let isImage = file.type.startsWith('image/');

                // Validation Check: Total 4 se zyada nahi hona chahiye
                if (isImage && (totalPhotos >= maxPhotos)) {
                    Toast.fire({
                        icon: 'error',
                        title: `Limit Exceeded: Total ${maxPhotos} Photos allowed (including existing)!`
                    });
                    return;
                }
                if (isVideo && (totalVideos >= maxVideos)) {
                    Toast.fire({
                        icon: 'error',
                        title: `Limit Exceeded: 1 Video already exists or selected!`
                    });
                    return;
                }

                if (!selectedFiles.some(f => f.name === file.name)) {
                    selectedFiles.push(file);
                    if (isImage) totalPhotos++;
                    if (isVideo) totalVideos++;

                    // Preview logic yahan wahi rahega...
                    let reader = new FileReader();
                    reader.onload = function(event) {
                        let html = `
                    <div class="position-relative new-media-item" data-name="${file.name}">
                        ${isVideo 
                            ? `<video src="${event.target.result}" style="width:70px;height:70px;object-fit:cover;" class="rounded border"></video>`
                            : `<img src="${event.target.result}" style="width:70px;height:70px;object-fit:cover;" class="rounded border">`
                        }
                        <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 remove-new-file" style="width:18px;height:18px;margin:-5px;border-radius:50%;">×</button>
                    </div>`;
                        previewDiv.append(html);
                    };
                    reader.readAsDataURL(file);
                }
            });
            $(this).val('');
        });
        // Nayi file list se hatana
        $(document).on('click', '.remove-new-file', function() {
            let name = $(this).closest('.new-media-item').data('name');
            selectedFiles = selectedFiles.filter(file => file.name !== name);
            $(this).closest('.new-media-item').remove();
        });

        // --- 3. Existing (Purani) Photos hatana ---
        $(document).on('click', '.remove-existing', function() {
            let id = $(this).closest('.existing-item').data('id');
            let deletedInput = $('#deleted_media_ids');
            let currentVal = deletedInput.val();
            console.log(id, deletedInput, currentVal);

            deletedInput.val(currentVal ? currentVal + ',' + id : id);
            $(this).closest('.existing-item').fadeOut(300, function() {
                $(this).remove();
            });
        });

        // --- 4. Edit Button Click ---
        $(document).on('click', '.edit-btn', function() {
            let id = $(this).data('id'),
                name = $(this).data('name'),
                rating = $(this).data('rating'),
                text = $(this).data('text'),
                status = $(this).data('status');

            // Form Reset
            $('#addReviewForm')[0].reset();
            $('#addReviewForm').removeClass('was-validated');
            selectedFiles = [];
            $('#new_media_preview').empty();
            $('#deleted_media_ids').val('');

            // Populate Basic Data
            $('#edit_review_id').val(id);
            $('input[name="UserName"]').val(name);
            $('textarea[name="ReviewText"]').val(text);
            $('select[name="Status"]').val(status);
            updateStars(rating);

            // Populate Existing Media
            let grid = $('#existing-images-grid');
            grid.empty();
            let tableMedia = $(this).closest('tr').find('.review_media img, .review_media video');

            if (tableMedia.length > 0) {
                $('#existing-media-wrapper').removeClass('d-none');
                tableMedia.each(function() {
                    let src = $(this).attr('src');
                    let mediaId = $(this).data('media-id');
                    grid.append(`
                    <div class="col-3 position-relative existing-item" data-id="${mediaId}">
                        <img src="${src}" class="img-fluid rounded border shadow-sm" style="height:70px; width:100%; object-fit:cover;">
                        <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 remove-existing" 
                                style="width:18px;height:18px;margin:-5px;border-radius:50%;">×</button>
                    </div>
                `);
                });
            } else {
                $('#existing-media-wrapper').addClass('d-none');
            }

            $('#addReviewModalLabel').text('Edit Review (#' + id + ')');
            $('#saveReviewBtn').text('Update Review').removeClass('btn-primary').addClass(
                'btn-warning');
            $('#addReviewModal').modal('show');
        });

        // --- 5. Add New Click ---
        $('.add-new-btn').on('click', function() {
            $('#addReviewForm')[0].reset();
            $('#edit_review_id').val('');
            $('#deleted_media_ids').val('');
            selectedFiles = [];
            $('#new_media_preview').empty();
            $('#existing-media-wrapper').addClass('d-none');
            updateStars(0);
            $('#addReviewModalLabel').text('Add Manual Review');
            $('#saveReviewBtn').text('Save Review').removeClass('btn-warning').addClass('btn-primary');
        });

        // --- 6. Form Submission (AJAX) ---
        $('#addReviewForm').on('submit', function(e) {
            e.preventDefault();
            if (this.checkValidity() === false) {
                $(this).addClass('was-validated');
                return false;
            }

            let formData = new FormData(this);
            // Nayi select ki hui files add karein
            selectedFiles.forEach(file => {
                formData.append('review_media[]', file);
            });

            $.ajax({
                url: "{{ route('admin.reviews.store') }}",
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                beforeSend: function() {
                    $('#saveReviewBtn').prop('disabled', true).text('Saving...');
                },
                success: function(response) {
                    if (response.status) {
                        Toast.fire({
                            icon: 'success',
                            title: response.message
                        }).then(() => location.reload());
                    }
                },
                error: function() {
                    $('#saveReviewBtn').prop('disabled', false).text('Save Review');
                    alert("Something went wrong!");
                }
            });
        });


        $(document).on('change', '.status-toggle', function() {
            let checkbox = $(this);
            let id = checkbox.closest('.review_status').data('id');
            let status = checkbox.is(':checked') ? 1 : 0;

            // Optional: Loading state dikhane ke liye
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
                        }).then(() => {
                            location.reload();
                        });
                    } else {
                        // Agar fail ho toh switch wapas purani state mein
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
        // --- VIEW BUTTON CLICK ---
        $(document).on('click', '.view-btn', function() {
            // 1. Fetching all data from data-attributes
            let id = $(this).data('id');
            let name = $(this).data('name');
            let rating = $(this).data('rating');
            let text = $(this).data('text');
            let status = $(this).data('status');
            let date = $(this).closest('tr').find('.review_date').text(); // Date table se uthai

            // 2. Mapping to Modal
            $('#view_review_id_label').text('Review ID: #' + id);
            $('#view_user_name').text(name);
            $('#view_user_avatar').text(name.charAt(0).toUpperCase());
            $('#view_review_text').text('"' + text + '"');
            $('#view_created_at').text(date);

            // 3. Rating Logic
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                stars += (i <= rating) ? '<i class="ti ti-star-filled"></i>' :
                    '<i class="ti ti-star"></i>';
            }
            $('#view_rating_stars').html(stars);

            // 4. Status Badge Logic
            let badge = (status == '1' || status == 'approved') ?
                '<span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3">Active / Approved</span>' :
                '<span class="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-3">Pending</span>';
            $('#view_status_badge').html(badge);

            // 5. Media Gallery Logic (Table se images nikalna)
            let mediaBox = $('#view_media_container');
            mediaBox.empty();
            let tableMedia = $(this).closest('tr').find('.review_media').find('img, video');

            if (tableMedia.length > 0) {
                tableMedia.each(function() {
                    let clone = $(this).clone().removeAttr(
                        'onclick data-bs-toggle data-bs-target').css({
                        'width': '100px',
                        'height': '100px',
                        'object-fit': 'cover',
                        'border-radius': '12px'
                    }).addClass('shadow-sm border border-white');
                    mediaBox.append(clone);
                });
            } else {
                mediaBox.html(
                    '<div class="text-center mt-5 text-muted"><i class="ti ti-photo-off fs-1 d-block mb-2"></i>No Media Uploaded</div>'
                );
            }

            // Modal ID store karna edit button ke liye (optional)
            $('.edit-from-view').attr('data-id', id);

            $('#viewReviewModal').modal('show');
        });
    });
</script>
