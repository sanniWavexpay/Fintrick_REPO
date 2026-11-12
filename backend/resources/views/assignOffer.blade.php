@extends('layouts.admin')
@section('title', 'Offer Management')

@section('content')
    <style>
        /* Dropdown list ko card ke upar lane ke liye aur alignment sahi karne ke liye */
        .choices__list--dropdown {
            z-index: 20 !important;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb !important;
            border-radius: 0.5rem !important;
        }

        .choices__inner {
            background-color: #fff !important;
            border-radius: 0.5rem !important;
            min-height: 40px !important;
            padding: 4px 10px !important;
        }

        .choices__list--single {
            padding: 2px 0 !important;
        }

        /* Searching text ko center aur clean dikhane ke liye */
        .choices__list--dropdown .choices__item--selectable:after {
            display: none !important;
        }

        .choices.is-invalid .choices__inner {
            border-color: #dc3545 !important;
        }

        .choices__inner.is-invalid {
            border: 1px solid #dc3545 !important;
        }

        /* Har choice ke niche border */
        .choices__list--dropdown .choices__item--choice {
            border-bottom: 1px solid #edf2f9 !important;
            /* Dash UI ka light border color */
            padding: 12px 15px !important;
            transition: background 0.2s ease;
        }

        /* Aakhri item se border hatane ke liye */
        .choices__list--dropdown .choices__item--choice:last-child {
            border-bottom: none !important;
        }

        /* Jab mouse upar jaye (Hover effect) */
        .choices__list--dropdown .choices__item--choice.is-highlighted {
            background-color: #f8f9fa !important;
            color: #333 !important;
        }
    </style>
    <div class="custom-container">
        <div class="row">
            <div class="col-12">
                <div class="mb-8 d-md-flex justify-content-between align-items-center">
                    <div>
                        <h1 class="mb-3 h2">Assign Offers Here ...</h1>
                        <p>Manage product, category, and variant discounts.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="card mb-4">
            <div class="card-header bg-light">
                <h5 class="mb-0">Assign Offer to Items</h5>
            </div>
            <div class="card-body">
                <form id="assignOfferForm" class="needs-validation" novalidate>
                    @csrf
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label">Select Offer</label>
                            <select class="form-select" name="offer_id" id="offerSelector" required>
                                <option value="">-- Choose Offer --</option>
                                @foreach ($offers as $offer)
                                    <option value="{{ $offer->id }}" data-level="{{ $offer->level }}">
                                        {{ $offer->title }}
                                        ({{ $offer->discount_value }}{{ $offer->discount_type == 'PERCENT' ? '%' : '₹' }})
                                    </option>
                                @endforeach
                            </select>
                            <div class="invalid-feedback">Please select offer</div>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Assignment Level</label>
                            <input type="text" id="assignLevel" name="assign_level" class="form-control bg-light"
                                readonly placeholder="Select offer first">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Search & Select Item</label>
                            <select class="form-control text-truncate" name="ref_id" id="itemSelector" required>
                                <option value="">-- Search Item --</option>
                            </select>
                            <div class="invalid-feedback">Please search & select</div>

                        </div>
                        <div class="col-md-2">
                            <label class="form-label d-none d-md-block">&nbsp;</label>
                            <button type="submit" class="btn btn-success w-100 py-2" id="assignNowbtn">
                                Assign Now
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>

        <div>
            <div class="row">
                <div class="col-12">
                    <div class="card card-lg" id="customerList"
                        data-list="category_index,offer_name,offer_appliedTo,offerItem_name,offer_discount">
                        <div class="card-header border-bottom-0">
                            <div class="row w-100 gx-md-0 gy-4 align-items-center">
                                <div class="col-lg-4 col-md-6">
                                    <input type="search" class="form-control listjs-search"
                                        placeholder="Search for subcategory name..." />
                                </div>
                            </div>
                        </div>

                        <div class="table-responsive"data-simplebar style="height: 500px">
                            <table class="table text-nowrap mb-0 table-centered table-hover" data-check-container>
                                <thead class="sticky-top ">
                                    <tr>
                                        <th class="listjs-sorter" data-sort="category_index">ID</th>
                                        <th class="listjs-sorter"data-sort="offer_name">Offer Name</th>
                                        <th class="listjs-sorter"data-sort="offer_appliedTo">Applied To (Level)</th>
                                        <th class="listjs-sorter"data-sort="offerItem_name">Item Name</th>
                                        <th class="listjs-sorter"data-sort="offer_discount">Discount Type</th>
                                        <th class="listjs-sorter"data-sort="offer_discount">Discount Value</th>
                                        <th class="listjs-sorter"data-sort="offer_discount">Max discount</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody class="list">
                                    @forelse ($assignments as $assign)
                                        <tr>
                                            <td class="category_index">{{ $loop->iteration }}</td>
                                            <td class="offer_name"><strong>{{ $assign->offer_name }}</strong></td>

                                            <td class="offer_appliedTo">
                                                <span
                                                    class="badge {{ $assign->type == 'PRODUCT' ? 'bg-success-soft text-success' : ($assign->type == 'CATEGORY' ? 'bg-info-soft text-info' : 'bg-warning-soft text-warning') }}">
                                                    {{ $assign->type }}
                                                </span>
                                            </td>

                                            <td class="offerItem_name">{{ $assign->entity_name }}</td>

                                            <td class="offer_discount_type">
                                                {{ $assign->discount_type ?? 'N/A' }}
                                            </td>

                                            <td class="offer_discount">
                                                @if ($assign->discount_type == 'PERCENT')
                                                    {{ $assign->discount_value }}%
                                                @else
                                                    ₹{{ number_format($assign->discount_value, 2) }}
                                                @endif
                                            </td>

                                            <td class="max_discount">
                                                @if ($assign->max_discount > 0)
                                                    ₹{{ number_format($assign->max_discount, 2) }}
                                                @else
                                                    <span class="text-muted">No Limit</span>
                                                @endif
                                            </td>

                                            <td>
                                                <button class="btn btn-sm btn-outline-danger remove-assignment"
                                                    data-id="{{ $assign->id }}" data-type="{{ $assign->type }}">
                                                    <i class="ti ti-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="8" class="border-0">
                                                <div class="py-5 text-center">
                                                    <div class="mb-3 mx-auto d-flex align-items-center justify-content-center bg-light rounded-circle"
                                                        style="width: 80px; height: 80px;">
                                                        <i class="ti ti-search-off text-secondary"
                                                            style="font-size: 2.5rem;"></i>
                                                    </div>

                                                    <h4 class="fw-bold mb-1">No Transactions Found</h4>
                                                    <p class="text-muted mb-0">
                                                        We couldn't find any data for the selected filters or search term.
                                                    </p>

                                                    @if (request()->has('search') || request()->has('from'))
                                                        <a href="{{ url()->current() }}"
                                                            class="btn btn-outline-primary btn-sm mt-3">
                                                            Clear All Filters
                                                        </a>
                                                    @endif
                                                </div>
                                            </td>
                                        </tr>
                                    @endforelse
                                </tbody>
                                {{-- <tbody id="no-result-container " style="display: none">
                                    <tr>
                                        <td colspan="6" class="border-0">
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
                                </tbody> --}}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="confirmDeleteModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title text-danger">Confirm Removal</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <p class="mb-0">
                        Are you sure you want to remove this offer assignment?
                    </p>
                    <small class="text-muted">
                        This action cannot be undone.
                    </small>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">
                        Cancel
                    </button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteBtn">
                        Yes, Remove
                    </button>
                </div>

            </div>
        </div>
    </div>

@endsection
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script>
    $(document).ready(function() {

        const element = document.getElementById('itemSelector');

        const itemChoices = new Choices(element, {
            searchEnabled: true,
            removeItemButton: true,
            itemSelectText: '',
            allowHTML: true,
            placeholder: true,
            placeholderValue: 'Type to search...',
            shouldSort: false,
            searchPlaceholderValue: 'Type at least 2 characters...',
            noResultsText: 'No items found',
            noChoicesText: 'Start typing to search...',
            callbackOnCreateTemplates: function(strToEl) {
                return {

                    choice: (conf, data) => {

                        if (data.placeholder) {
                            return strToEl(
                                `<div class="choices__item choices__item--choice">${data.label}</div>`
                            );
                        }

                        const img = data.customProperties?.image ?
                            data.customProperties.image :
                            '/assets/images/placeholder.png';

                        const extra = data.customProperties?.extra || '';

                        return strToEl(`
                        <div class="choices__item choices__item--choice d-flex align-items-center"
                             data-choice
                             data-id="${data.id}"
                             data-value="${data.value}">
                             
                            <img src="${img}" 
                                 class="rounded me-2"
                                 style="width:30px;height:30px;object-fit:cover;"
                                 onerror="this.src='/assets/images/placeholder.png'">
                                 
                            <div>
                                <div class="fw-bold">${data.label}</div>
                                <small class="text-muted">${extra}</small>
                            </div>
                        </div>
                    `);
                    },

                    item: (conf, data) => {

                        const hasImg = data.customProperties?.image;

                        const imgTag = hasImg ?
                            `<img src="${data.customProperties.image}"
                                class="rounded-circle me-1"
                                style="width:18px;height:18px;object-fit:cover;">` :
                            '';

                        return strToEl(`
                        <div class="choices__item choices__item--selectable text-truncate d-flex align-items-center">
                            ${imgTag}
                            ${data.label}
                        </div>
                    `);
                    },
                };
            },
        });

        $('#offerSelector').on('change', function() {
            let selectedLevel = $(this).find(':selected').data('level');

            if (selectedLevel) {
                $('#assignLevel').val(selectedLevel);
            } else {
                $('#assignLevel').val('');
            }

            itemChoices.removeActiveItems();
            itemChoices.clearChoices();
        });

        let xhr = null;

        element.addEventListener('search', function(event) {
            let searchTerm = event.detail.value.trim();
            let level = $('#assignLevel').val();

            if (!level) {
                itemChoices.clearChoices();
                return;
            }

            if (searchTerm.length < 2) {
                itemChoices.clearChoices();
                return;
            }

            if (xhr && xhr.readyState !== 4) {
                xhr.abort();
            }

            xhr = $.ajax({
                url: "{{ route('admin.offers.search-items') }}",
                type: "GET",
                data: {
                    q: searchTerm,
                    level: level // Ye sahi level jayega backend par
                },
                success: function(data) {
                    const itemsList = data.map(item => ({
                        value: item.id,
                        label: item.text,
                        customProperties: {
                            image: item.image,
                            extra: item.extra
                        }
                    }));

                    itemChoices.clearChoices();
                    itemChoices.setChoices(itemsList, 'value', 'label', true);
                }
            });
        });

        // Reset on level change
        $('#assignLevel').on('change', function() {
            itemChoices.removeActiveItems();
            itemChoices.clearChoices();
        });

        // Form Submit
        $('#assignOfferForm').on('submit', function(e) {
            e.preventDefault();

            let form = this;
            let isValid = form.checkValidity();

            $(form).addClass('was-validated');
            $('.choices__inner').removeClass('is-invalid');

            if (!$('#itemSelector').val()) {
                isValid = false;
                $('.choices__inner').addClass('is-invalid');
                $('#itemSelector').closest('.col-md-4')
                    .find('.invalid-feedback')
                    .show();
            }

            if (!isValid) return;

            let submitBtn = $("#assignNowbtn");
            let originalText = submitBtn.text();
            let formData = $(form).serialize();

            submitBtn.prop('disabled', true).html(
                '<span class="spinner-border spinner-border-sm"></span> Assigning...'
            );

            $.ajax({
                url: "{{ route('admin.offers.assign-save') }}",
                type: "POST",
                data: formData,
                success: function(res) {

                    if (res.status) {
                        Toast.fire({
                            icon: 'success',
                            title: res.message
                        }).then(() => location.reload());
                    } else {
                        submitBtn.prop('disabled', false).text(originalText);
                        Toast.fire({
                            icon: 'error',
                            title: res.message
                        })
                    }
                },
                error: function() {
                    submitBtn.prop('disabled', false).text(originalText);
                }
            });
        });


        // Remove validation error when item selected
        element.addEventListener('addItem', function() {
            $('.choices__inner').removeClass('is-invalid');
            $('#itemSelector').closest('.col-md-4')
                .find('.invalid-feedback')
                .hide();
        });


        let deleteId = null;
        let deleteType = null;

        // Open modal
        $(document).on('click', '.remove-assignment', function() {
            deleteId = $(this).data('id');
            deleteType = $(this).data('type');

            $('#confirmDeleteModal').modal('show');
        });

        // Confirm delete
        $('#confirmDeleteBtn').on('click', function() {

            $.get("{{ route('admin.offers.assign-remove') }}", {
                _token: "{{ csrf_token() }}",
                id: deleteId,
                type: deleteType
            }, function(res) {

                if (res.status) {
                    $('#confirmDeleteModal').modal('hide');

                    Toast.fire({
                        icon: 'success',
                        title: 'Offer removed successfully'
                    });

                    setTimeout(() => location.reload(), 800);
                }
            });
        });


    });
</script>
