<div class="table-responsive table-checkbox" data-simplebar style="height: 500px">
    <table class="table text-nowrap mb-0 table-centered table-hover">
        <thead class="sticky-top">
            <tr>
                <th>Sr.</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th class="text-center">Action</th>
            </tr>
        </thead>
        <tbody id="payment-table-body" class="list">
            @forelse ($payments as $pay)
                <tr>
                    <td>{{ ($payments->currentPage() - 1) * $payments->perPage() + $loop->iteration }}</td>
                    <td><span class="fw-bold">{{ $pay->OrderNo ?? 'N/A' }}</span></td>
                    <td><span class="text-muted small">{{ $pay->CustomerName ?? 'N/A' }}</span></td>
                    <td>
                        @if ($pay->PaymentMethod == 24)
                            <span class="badge bg-secondary-subtle text-secondary">COD</span>
                        @else
                            <span class="badge bg-info-subtle text-info">Online (UPI)</span>
                        @endif
                    </td>
                    <td><small class="text-muted">{{ $pay->TxnID }}</small></td>
                    <td><span class="text-dark fw-semibold">₹{{ number_format($pay->Amount, 2) }}</span></td>
                    <td>
                        <div class="dropdown">
                            @php
                                $payMap = [
                                    26 => ['text' => 'Pending', 'class' => 'bg-warning text-dark'],
                                    27 => ['text' => 'Success', 'class' => 'bg-success text-white'],
                                    28 => ['text' => 'Failed', 'class' => 'bg-danger text-white'],
                                    29 => ['text' => 'Refunded', 'class' => 'bg-info text-white'],
                                    42 => ['text' => 'Expired', 'class' => 'bg-secondary text-white'],
                                    43 => ['text' => 'Initiated', 'class' => 'bg-primary text-white'],
                                ];
                                $current = $payMap[$pay->Status] ?? [
                                    'text' => 'Unknown',
                                    'class' => 'bg-light',
                                ];
                            @endphp

                            <button class="btn btn-sm dropdown-toggle badge {{ $current['class'] }} border"
                                type="button" data-bs-toggle="dropdown" style="width: 110px;">
                                {{ $current['text'] }}
                            </button>

                            <ul class="dropdown-menu shadow">
                                @foreach ($payMap as $code => $data)
                                    <li>
                                        <a class="dropdown-item update-payment {{ $pay->Status == $code ? 'active' : '' }}"
                                            href="#" data-id="{{ $pay->ID }}"
                                            data-value="{{ $code }}">
                                            {{ $data['text'] }} @if ($pay->Status == $code)
                                                ✓
                                            @endif
                                        </a>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    </td>
                    <td>{{ date('d M Y, h:i A', strtotime($pay->CreatedDtTm)) }}</td>
                    <td class="text-center">
                        <button class="btn btn-ghost btn-sm btn-icon rounded-circle view-payment-btn"
                            data-id="{{ $pay->ID }}" data-upi="{{ $pay->UpiIntend }}"
                            data-modified="{{ $pay->ModifiedDtTm }}" data-paid="{{ $pay->PaidAt }}">
                            <i class="ti ti-eye fs-4"></i>
                        </button>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" class="text-center py-5">
                        <div class="text-muted">
                            <i class="ti ti-search-off fs-1"></i>
                            <p class="mt-2">No transactions found matching your criteria.</p>
                        </div>
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>
</div>

<div class="pagination-wrapper custom-pagination-wrapper py-3 px-4 border-top">
    {{ $payments->appends(request()->query())->onEachSide(1)->links('pagination::bootstrap-5') }}
</div>
