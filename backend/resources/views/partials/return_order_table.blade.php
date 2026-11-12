<div class="table-responsive" style="height: 600px">
    <table class="table table-hover text-nowrap mb-0">
        <thead class="sticky-top">
            <tr>
                <th>#</th>
                <th>Return ID</th>
                <th>Order No</th>
                <th>Item ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Requested At</th>
                <th>View Images</th>
                <th>Action</th>
            </tr>
        </thead>

        <tbody class="list">
            @forelse ($returns as $return)
                <tr>
                    <td>{{ ($returns->currentPage() - 1) * $returns->perPage() + $loop->iteration }}</td>
                    <td>{{ $return->return_uid }}</td>
                    <td class="fw-bold text-primary">
                        {{ $return->OrderNo }}
                    </td>
                    <td>#{{ $return->order_item_id }}</td>

                    <td>{{ $return->customer_name }}</td>

                    <td>{{ $return->ProductTitle }}</td>

                    <td>{{ $return->Quantity }}</td>

                    <td class="fw-bold">
                        @php
                            $itemTotal = (float)($return->TotalAmount ?? 0);
                            $storedRefund = $return->StoredRefundAmount ?? null;

                            if ($storedRefund !== null) {
                                // 1. If actual refund record exists, use that amount (Most Reliable)
                                $netAmount = $storedRefund;
                            } else {
                                // 2. Fallback logic for pending requests
                                $orderGross = (float)($return->OrderGrossTotal ?? 0);
                                $grandTotal = (float)($return->GrandTotalAmount ?? 0);
                                
                                // Enhanced logic: Item is final ONLY if it's the last one standing (ActiveCount == 1)
                                // OR if everything is terminated and this was the highest ID (designated absorber)
                                $isTerminated = in_array((int)$return->return_status, [56, 57]);
                                $isMaxID = ((int)$return->order_item_id == (int)$return->MaxItemIDInOrder);
                                
                                $isFinalItem = false;
                                if ((int)$return->ActiveItemCount == 0 && $isMaxID) {
                                    $isFinalItem = true;
                                } elseif ((int)$return->ActiveItemCount == 1 && !$isTerminated && $isMaxID) {
                                    $isFinalItem = true;
                                }

                                if ($isFinalItem) {
                                    $otherItemsTotal = $orderGross - $itemTotal;
                                    $netAmount = round($grandTotal - $otherItemsTotal);
                                } else {
                                    $netAmount = round($itemTotal);
                                }
                            }
                        @endphp
                        ₹{{ number_format($netAmount, 2) }}
                    </td>

                    <td>{{ $return->reason }}</td>

                    {{-- RETURN STATUS --}}
                    <td>
                        @php
                            $statusMap = [
                                44 => ['text' => 'Requested', 'class' => 'bg-warning text-dark'], // Yellow
                                45 => ['text' => 'Approved', 'class' => 'bg-info text-white'], // Blue
                                46 => ['text' => 'Picked', 'class' => 'bg-danger'], // Red
                                47 => ['text' => 'In Transit', 'class' => 'bg-primary'], // Dark Blue
                                48 => ['text' => 'Received', 'class' => 'bg-secondary'], // Grey
                                55 => ['text' => 'Refund Initiated', 'class' => 'bg-dark'], // Black
                                56 => ['text' => 'Refund Completed', 'class' => 'bg-dark text-white'],
                                57 => ['text' => 'Refund Rejected', 'class' => 'bg-success'], // Green ✅
                            ];

                            $current = $statusMap[$return->return_status] ?? [
                                'text' => 'Unknown',
                                'class' => 'bg-secondary',
                            ];
                        @endphp

                        <span class="badge {{ $current['class'] }}">
                            {{ $current['text'] }}
                        </span>
                    </td>

                    <td>
                        {{ date('d M, Y', strtotime($return->requested_at)) }}<br>
                        <small class="text-muted">{{ date('h:i A', strtotime($return->requested_at)) }}</small>
                    </td>

                    <td class="text-center">
                        <a class="btn btn-ghost btn-icon btn-sm rounded-circle text-success view-images"
                            data-id="{{ $return->id }}" title="View Images">
                            <i class="ti ti-eye fs-4"></i>
                        </a>
                    </td>

                    {{-- ACTION --}}
                    <td>
                        <div class="d-flex gap-2">
                            <div class="dropdown">
                                <button class="btn btn-sm btn-primary dropdown-toggle badge bg-dark"
                                    data-bs-toggle="dropdown">
                                    Action
                                </button>
                                <ul class="dropdown-menu cursor-pointer">
                                    <li><a class="dropdown-item update-return" data-id="{{ $return->id }}"
                                            data-value="44">Requested</a></li>
                                    <li><a class="dropdown-item update-return" data-id="{{ $return->id }}"
                                            data-value="45">Approved</a></li>
                                    <li><a class="dropdown-item update-return" data-id="{{ $return->id }}"
                                            data-value="46">Picked</a></li>
                                    <li><a class="dropdown-item update-return" data-id="{{ $return->id }}"
                                            data-value="47">In Transit</a></li>
                                    <li><a class="dropdown-item update-return" data-id="{{ $return->id }}"
                                            data-value="48">Received</a></li>
                                    <li><a class="dropdown-item update-return" data-id="{{ $return->id }}"
                                            data-value="55">Refund Initiated</a></li>
                                    <li><a class="dropdown-item update-return" data-id="{{ $return->id }}"
                                            data-value="56">Refund Completed</a></li>
                                    <li><a class="dropdown-item update-return" data-id="{{ $return->id }}"
                                            data-value="57">Rejected</a></li>
                                </ul>
                            </div>
                        </div>
                    </td>

                </tr>
            @empty
                <tr>
                    <td colspan="13" class="text-center py-5">
                        <div class="text-muted">
                            <i class="ti ti-search-off fs-1"></i>
                            <p class="mt-2">No returns found matching your criteria.</p>
                        </div>
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>
</div>

<div class="pagination-wrapper custom-pagination-wrapper py-3 px-4 border-top">
    {{ $returns->appends(request()->query())->onEachSide(1)->links('pagination::bootstrap-5') }}
</div>
