                        <div class="table-responsive table-checkbox" data-simplebar style="height: 500px">
                            <table class="table text-nowrap mb-0 table-centered table-hover">
                                <thead class="sticky-top">
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Location</th>
                                        <th>Create Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse ($customers as $customer)
                                        <tr>
                                            <td>{{ $customer->ID }}</td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <img src="{{ asset($customer?->ProfileImage ?? 'assets/images/placeholder.png') }}"
                                                        alt="Image" class="avatar avatar-sm rounded-circle" />
                                                    <div class="ms-2">
                                                        <span class="fw-bold">{{ $customer?->Name ?? '' }}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{{ $customer?->Phone ?? '' }}</td>
                                            <td>{{ $customer?->Email ?? '' }}</td>
                                            <td>{{ $customer?->Location ?? 'N/A' }}</td>
                                            <td>{{ $customer?->CreatedDtTm ? \Carbon\Carbon::parse($customer->CreatedDtTm)->format('d M, Y') : '' }}
                                            </td>
                                            <td>
                                                <div class="form-check form-switch d-flex align-items-center gap-2">
                                                    <input class="form-check-input status-toggle" type="checkbox"
                                                        role="switch" data-id="{{ $customer->ID }}"
                                                        {{ $customer->IsActive == 1 ? 'checked' : '' }}
                                                        style="cursor: pointer;">

                                                    <span
                                                        class="status-label badge {{ $customer->IsActive == 1 ? 'text-success-emphasis bg-success-subtle' : 'text-danger-emphasis bg-danger-subtle' }} rounded-pill">
                                                        {{ $customer->IsActive == 1 ? 'Active' : 'Inactive' }}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="7" class="text-center py-5">
                                                <div class="mb-3 mx-auto d-flex align-items-center justify-content-center bg-light rounded-circle"
                                                    style="width: 72px; height: 72px;">
                                                    <i class="ti ti-search-off text-secondary" style="font-size: 2rem;"></i>
                                                </div>
                                                <h4 class="fw-bold mb-1">No results found</h4>
                                                <p class="text-muted">Try adjusting your filters to find what you're
                                                    looking for.</p>
                                            </td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                        <div
                            class="btn-toolbar card-footer border-top border-dashed d-flex flex-md-row flex-column justify-content-md-between align-items-md-center">
                            <div class="mb-0">
                                Showing {{ $customers->firstItem() ?? 0 }} to {{ $customers->lastItem() ?? 0 }} of
                                {{ $customers->total() }} entries
                            </div>
                            <div class="mt-3 mt-md-0 pagination-container">
                                {{ $customers->links('pagination::bootstrap-5') }}
                            </div>
                        </div>
