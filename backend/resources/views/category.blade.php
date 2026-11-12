@extends('layouts.admin')

@section('title', 'Category | Shopping Store')

@section('content')
    <div class="custom-container">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-12">
                <div class="mb-8 d-md-flex justify-content-between align-items-center">
                    <div>
                        <h1 class="mb-3 h2">Category</h1>
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="{{ url('/') }}">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Category</li>
                            </ol>
                        </nav>
                    </div>
                    <div>
                        <a class='btn btn-dark d-md-flex align-items-center gap-2' data-bs-target='#addCategoryModal' data-bs-toggle='modal' href='#'>
                            <i class="ti ti-plus"></i> Add Category
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="card card-lg" id="categoryList">
                    <div class="card-header border-bottom-0">
                        <div class="row g-3 align-items-end">
                            <div class="col-lg-4 col-md-6">
                                <label class="form-label">Search Category</label>
                                <input type="search" id="category-search" class="form-control" placeholder="Search by name..." />
                            </div>
                            <div class="col-lg-3 col-md-6">
                                <label class="form-label">Status</label>
                                <select id="status-select" class="form-select">
                                    <option value="">All Status</option>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div id="table-data">
                        @include('partials.category_table')
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <div class="modal fade" id="addCategoryModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="addCategoryModalLabel">Add Category</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="categoryForm" enctype="multipart/form-data">
                        <input type="hidden" id="categoryId" name="categoryId">
                        <div class="mb-3">
                            <label class="form-label">Category Name</label>
                            <input type="text" class="form-control" name="categoryName" id="categoryName" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Category Image</label>
                            <input type="file" class="form-control" name="categoryImage" id="categoryImage" accept="image/*" />
                            <div class="mt-2 text-center">
                                <img id="imgPreview" src="https://via.placeholder.com/100" class="rounded border" style="width: 80px; height: 80px; object-fit: cover;">
                            </div>
                        </div>
                        <div class="text-end">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Save Category</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    $(document).ready(function() {
        function fetchCategories(page = 1) {
            const search = $('#category-search').val();
            const status = $('#status-select').val();
            $('#table-data').css('opacity', '0.5');

            $.ajax({
                url: "{{ route('admin.categories') }}",
                method: "GET",
                data: { page, search, status },
                success: function(response) {
                    $('#table-data').html(response);
                },
                complete: function() {
                    $('#table-data').css('opacity', '1');
                }
            });
        }

        function debounce(func, delay) {
            let timer;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(timer);
                timer = setTimeout(() => func.apply(context, args), delay);
            };
        }

        $('#category-search').on('input', debounce(() => fetchCategories(), 500));
        $('#status-select').on('change', () => fetchCategories());

        $(document).on('click', '.pagination a', function(e) {
            e.preventDefault();
            fetchCategories(new URL($(this).attr('href')).searchParams.get('page'));
        });

        // Toggle Status
        $(document).on('change', '.category-toggle', function() {
            const id = $(this).closest('.category_status').data('id');
            const status = this.checked ? 1 : 0;
            $.ajax({
                url: "{{ route('admin.category.updateStatus') }}",
                method: 'POST',
                data: { _token: '{{ csrf_token() }}', id, status },
                success: function(res) {
                    Toast.fire({ icon: res.status ? 'success' : 'error', title: res.message });
                }
            });
        });

        // Form Submit
        $('#categoryForm').on('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            formData.append('_token', '{{ csrf_token() }}');
            const id = $('#categoryId').val();
            const url = id ? "{{ route('admin.category.update') }}" : "{{ route('admin.category.add') }}";

            $.ajax({
                url: url,
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(res) {
                    if (res.status) {
                        Toast.fire({ icon: 'success', title: res.message });
                        $('#addCategoryModal').modal('hide');
                        fetchCategories();
                    }
                }
            });
        });

        // Edit
        $(document).on('click', '.edit-category-btn', function() {
            $('#categoryId').val($(this).data('id'));
            $('#categoryName').val($(this).data('name'));
            $('#imgPreview').attr('src', $(this).data('image'));
            $('#addCategoryModalLabel').text('Edit Category');
            $('#addCategoryModal').modal('show');
        });

        $('#addCategoryModal').on('hidden.bs.modal', function() {
            $('#categoryForm')[0].reset();
            $('#categoryId').val('');
            $('#imgPreview').attr('src', 'https://via.placeholder.com/100');
            $('#addCategoryModalLabel').text('Add Category');
        });
        
        $('#categoryImage').on('change', function() {
            const reader = new FileReader();
            reader.onload = (e) => $('#imgPreview').attr('src', e.target.result);
            if(this.files[0]) reader.readAsDataURL(this.files[0]);
        });
    });
</script>
@endpush
