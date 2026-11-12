<div class="table-responsive table-checkbox" data-simplebar style="height: 500px">
    <table class="table text-nowrap mb-0 table-centered table-hover">
        <thead class="sticky-top">
            <tr>
                <th>Sr No.</th>
                <th>Username</th>
                <th>Product</th>
                <th>Review Media</th>
                <th>Rating</th>
                <th>Review Text</th>
                <th>Created At</th>
                <th>Status</th>
                <th class="text-center">Action</th>
            </tr>
        </thead>
        <tbody class="list">
            @forelse ($reviews as $review)
                <tr>
                    <td class="category_index">{{ ($reviews->currentPage() - 1) * $reviews->perPage() + $loop->iteration }}</td>

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
                        </div>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" class="text-center py-5">
                        <div class="text-muted">
                            <i class="ti ti-search-off fs-1"></i>
                            <p class="mt-2">No reviews found matching your criteria.</p>
                        </div>
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>
</div>

<div class="pagination-wrapper custom-pagination-wrapper py-3 px-4 border-top">
    {{ $reviews->appends(request()->query())->onEachSide(1)->links('pagination::bootstrap-5') }}
</div>
