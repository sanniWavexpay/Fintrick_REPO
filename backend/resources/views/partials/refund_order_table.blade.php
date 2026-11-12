<div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
        <thead class="bg-light">
            <tr>
                <th class="ps-4">Target Order</th>
                <th>Refund Scope</th>
                <th>Amount</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Requested At</th>
                <th>Status</th>
                <th class="text-end pe-4">Actions</th>
            </tr>
        </thead>
        <tbody>
            @forelse($refunds as $refund)
                @php
                    $idList = explode(',', $refund->refund_ids);
                    $isGrouped = count($idList) > 1;
                @endphp
                <tr>
                    <td class="ps-4">
                        <div class="d-flex align-items-center gap-2">
                            <span class="fw-bold text-dark">#{{ $refund->OrderNo }}</span>
                            <a href="{{ route('admin.order-details.view', $refund->OrderNo) }}" target="_blank" class="text-muted" title="View Order">
                                <i class="ti ti-external-link fs-6"></i>
                            </a>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            @if($isGrouped)
                                <span class="badge bg-light-primary text-primary refund-scope-badge border border-primary-subtle">Full Order</span>
                                <span class="text-muted small text-truncate" style="max-width: 150px;" title="{{ $refund->product_summary }}">{{ count($idList) }} items</span>
                            @else
                                <span class="badge bg-light-info text-info refund-scope-badge border border-info-subtle">Item Level</span>
                                <span class="text-muted small text-truncate" style="max-width: 150px;">{{ $refund->product_summary }}</span>
                            @endif
                        </div>
                    </td>
                    <td>
                        <span class="fw-black text-dark">₹{{ number_format($refund->total_amount, 2) }}</span>
                    </td>
                    <td>
                         <div class="d-flex flex-column">
                             <span class="fw-bold small text-dark">{{ $refund->customer_name }}</span>
                             <span class="text-muted" style="font-size: 10px;">User #{{ $refund->OID }}</span>
                         </div>
                    </td>
                    <td>
                        @if($refund->upi_id)
                            <span class="badge bg-light-success text-success border border-success-subtle px-3 rounded-pill" style="font-size: 10px;">
                                <i class="ti ti-brand-upwork me-1"></i> UPI
                            </span>
                        @else
                            <span class="badge bg-light-primary text-primary border border-primary-subtle px-3 rounded-pill" style="font-size: 10px;">
                                <i class="ti ti-building-bank me-1"></i> Bank
                            </span>
                        @endif
                    </td>
                    <td>
                        <span class="text-muted small">{{ \Carbon\Carbon::parse($refund->latest_request_at)->format('d M, h:i A') }}</span>
                    </td>
                    <td>
                        @if($refund->Status == 56)
                            <span class="badge bg-emerald text-white px-3 py-1 rounded-pill" style="font-size: 10px;">Success</span>
                        @else
                            <span class="badge bg-warning text-dark px-3 py-1 rounded-pill animate-pulse" style="font-size: 10px;">Pending</span>
                        @endif
                        <style>.bg-emerald { background-color: #10b981; }</style>
                    </td>
                    <td class="text-end pe-4">
                        @if($refund->Status != 56)
                            <button class="btn btn-light-primary rounded-circle p-2 view-ref-btn" 
                                    title="Process & Pay"
                                    data-id="{{ $refund->refund_ids }}" 
                                    data-full="{{ json_encode($refund) }}">
                                <i class="ti ti-wallet fs-5"></i>
                            </button>
                        @else
                            <div class="d-flex justify-content-end gap-2">
                                <button class="btn btn-light-success rounded-circle p-2" title="Refund Completed" disabled>
                                    <i class="ti ti-circle-check fs-5"></i>
                                </button>
                                <button class="btn btn-light-info rounded-circle p-2 view-details-btn" 
                                        title="View Details"
                                        data-orderno="{{ $refund->OrderNo }}"
                                        data-name="{{ $refund->customer_name }}"
                                        data-amount="{{ number_format($refund->total_amount, 2) }}"
                                        data-method="{{ $refund->upi_id ? 'UPI' : 'Bank' }}"
                                        data-rbd-name="{{ $refund->rbd_name }}"
                                        data-acc="{{ $refund->account_number }}"
                                        data-ifsc="{{ $refund->ifsc_code }}"
                                        data-upi="{{ $refund->upi_id }}"
                                        data-utr="{{ $refund->utr_no }}"
                                        data-reason="{{ $refund->original_reason }}"
                                        data-date="{{ \Carbon\Carbon::parse($refund->latest_request_at)->format('d M, Y') }}">
                                    <i class="ti ti-eye fs-5"></i>
                                </button>
                            </div>
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" class="text-center py-5">
                        <div class="d-flex flex-column align-items-center">
                            <i class="ti ti-mood-empty fs-1 text-muted opacity-25"></i>
                            <p class="text-muted mt-2">No refund requests found matching your filters.</p>
                        </div>
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>
</div>

@if($refunds->hasPages())
    <div class="card-footer bg-transparent border-top-0 pt-4 pb-4">
        {{ $refunds->links('pagination::bootstrap-5') }}
    </div>
@endif
