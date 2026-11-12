<div class="table-responsive table-checkbox" data-simplebar style="height: 500px">
    <table class="table text-nowrap mb-0 table-centered table-hover" data-check-container>
        <thead class="sticky-top">
            <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Image</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody class="list">
            @forelse ($categories as $category)
                <tr>
                    <td class="category_index">
                        {{ ($categories->currentPage() - 1) * $categories->perPage() + $loop->iteration }}
                    </td>
                    <td class="category_name">
                        {{ $category?->CategoryName ?? 'N/A' }}
                    </td>
                    <td>
                        @php
                            $imagePath = $category?->CategoryImg
                                ? asset($category->CategoryImg)
                                : asset('assets/images/placeholder.jpg');
                        @endphp
                        <a href="javascript:void(0);" class="view-image" data-img-src="{{ $imagePath }}">
                            <img src="{{ $imagePath }}" alt="Category Image" class="avatar avatar-md rounded-circle" loading="lazy" />
                        </a>
                    </td>
                    <td class="category_status" data-id="{{ $category->ID }}" data-status="{{ $category->IsActive }}">
                        <div class="form-check form-switch">
                            <input class="form-check-input category-toggle" type="checkbox" {{ $category->IsActive == 1 ? 'checked' : '' }}>
                        </div>
                    </td>
                    <td class="category_created_at">{{ $category?->CreatedAt ?? 'N/A' }}</td>
                    <td>
                        <a href="{{ route('admin.subcategories', $category->ID) }}" class="btn btn-ghost btn-icon btn-sm rounded-circle" title="View Subcategories">
                            <i class="ti ti-eye fs-4"></i>
                        </a>
                        <a href="#!" class="btn btn-ghost btn-icon btn-sm rounded-circle edit-category-btn" 
                            data-name="{{ $category?->CategoryName ?? '' }}"
                            data-id="{{ $category->ID }}"
                            data-image="{{ asset($category?->CategoryImg ?? '') }}"
                            title="Edit">
                            <i class="ti ti-edit fs-4"></i>
                        </a>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center py-5">
                        <div class="text-muted">
                            <i class="ti ti-search-off fs-1"></i>
                            <p class="mt-2">No categories found matching your search.</p>
                        </div>
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>
</div>

<div class="pagination-wrapper py-3 px-4 border-top">
    {{ $categories->onEachSide(1)->links('pagination::bootstrap-5') }}
</div>
