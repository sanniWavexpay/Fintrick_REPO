<div class="table-responsive table-checkbox" data-simplebar style="height: 600px">
    <table class="table text-nowrap table-centered table-hover mb-0" data-check-container>
        <thead class="sticky-top">
            <tr>
                <th class="sortable" data-column="ID">ID</th>
                <th class="sortable" data-column="order_no">Order No</th>
                <th class="sortable" data-column="customer_name">Customer Name</th>
                <th class="sortable" data-column="total_items">Items</th>
                <th class="sortable" data-column="total_qunatity">Qty</th>
                <th class="sortable" data-column="payale_amount">Amount</th>
                <th class="sortable" data-column="Payment_mode">Mode</th>
                <th class="sortable" data-column="payment_status">Payment</th>
                <th class="sortable" data-column="order_status">Order Status</th>
                <th class="sortable" data-column="order_date">Date</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody class="list">
            @forelse ($orders as $order)
                <tr>
                    <td class="customer_index">
                        {{ ($orders->currentPage() - 1) * $orders->perPage() + $loop->iteration }}
                    </td>
                    <td class="align-middle">
                        <span class="fw-bold text-primary ">{{ $order->OrderNo ?? 'N/A' }}</span>
                    </td>
                    <td class="align-middle">
                        {{ $order->customer_name ?? 'N/A' }}
                    </td>
                    <td class="align-middle text-center">{{ $order->total_items }}</td>
                    <td class="align-middle text-center">{{ $order->total_quantity }}</td>
                    <td class="align-middle text-primary fw-bold">
                        ₹{{ number_format($order->GrandTotalAmount, 0) }}
                    </td>
                    <td class="align-middle small text-uppercase">{{ $order->PaymentModeText }}</td>
                    
                    {{-- Payment Status Dropdown --}}
                    <td class="align-middle">
                        <div class="dropdown">
                            @php
                                $currentStatus = (int) $order->PaymentStatus;
                                $payStatusMap = [
                                    14 => ['text' => 'Pending', 'class' => 'bg-light-warning text-warning', 'ids' => [14, 51]],
                                    15 => ['text' => 'Paid', 'class' => 'bg-light-success text-success', 'ids' => [15, 52]],
                                    16 => ['text' => 'Failed', 'class' => 'bg-light-danger text-danger', 'ids' => [16, 54]],
                                    17 => ['text' => 'Refunded', 'class' => 'bg-light-info text-info', 'ids' => [17, 53, 55]],
                                    61 => ['text' => 'Partial Refund', 'class' => '', 'style' => 'background-color: #fff3cd; color: #856404;', 'ids' => [61]],
                                ];
                                $active = null;
                                foreach ($payStatusMap as $map) {
                                    if (in_array($currentStatus, $map['ids'])) {
                                        $active = $map;
                                        break;
                                    }
                                }
                                $currentData = $active ?? ['text' => $order->PaymentStatusText ?? 'Unknown', 'class' => 'bg-secondary text-white'];
                            @endphp
                            <span class="badge {{ $currentData['class'] }} dropdown-toggle" role="button" data-bs-toggle="dropdown" 
                                  style="min-width: 110px; font-size: 11px; {{ $currentData['style'] ?? '' }}">
                                {{ $currentData['text'] }}
                            </span>
                            <ul class="dropdown-menu shadow">
                                @foreach ($payStatusMap as $mainId => $data)
                                    <li>
                                        <a class="dropdown-item update-payment {{ in_array($currentStatus, $data['ids']) ? 'active' : '' }}" href="#" data-id="{{ $order->ID }}" data-value="{{ $data['ids'][1] ?? $data['ids'][0] }}">
                                            {{ $data['text'] }}
                                        </a>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    </td>

                    {{-- Order Status Dropdown --}}
                    <td class="align-middle">
                        <div class="dropdown">
                            @php
                                $statusMap = [
                                    8 => ['text' => 'Pending', 'class' => 'bg-light-warning text-warning'],
                                    9 => ['text' => 'Confirmed', 'class' => 'bg-light-info text-info'],
                                    10 => ['text' => 'Shipped', 'class' => 'bg-light-primary text-primary'],
                                    11 => ['text' => 'Delivered', 'class' => 'bg-light-success text-success'],
                                    12 => ['text' => 'Cancelled', 'class' => 'bg-light-danger text-danger'],
                                    13 => ['text' => 'Refunded', 'class' => 'bg-dark text-white'],
                                    62 => ['text' => 'Partial', 'class' => '', 'style' => 'background-color: #fff3cd; color: #856404;'],
                                ];
                                $current = $statusMap[$order->OrderStatus] ?? ['text' => 'Unknown', 'class' => 'bg-secondary text-white'];
                            @endphp
                            <span class="badge {{ $current['class'] }} dropdown-toggle" role="button" data-bs-toggle="dropdown" 
                                  style="min-width: 110px; font-size: 11px; {{ $current['style'] ?? '' }}">
                                {{ $current['text'] }}
                            </span>
                            <ul class="dropdown-menu shadow">
                                @foreach ([8,9,10,12,13,62,11] as $sid)
                                    @continue(!isset($statusMap[$sid]))
                                    <li>
                                        <a class="dropdown-item update-order {{ $order->OrderStatus == $sid ? 'active' : '' }}" href="#" data-id="{{ $order->ID }}" data-value="{{ $sid }}">
                                            {{ $statusMap[$sid]['text'] }}
                                        </a>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    </td>

                    <td class="align-middle small">
                        {{ date('d M, Y', strtotime($order->CreatedDtTm)) }}<br>
                        <span class="text-muted">{{ date('h:i A', strtotime($order->CreatedDtTm)) }}</span>
                    </td>

                    <td>
                        <a href="{{ url('admin/order-details/' . $order->OrderNo) }}" class="btn btn-ghost btn-icon btn-sm rounded-circle text-success" title="View Details">
                            <i class="ti ti-eye fs-4"></i>
                        </a>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="11" class="text-center py-5">
                        <div class="text-muted">
                            <i class="ti ti-search-off fs-1"></i>
                            <p class="mt-2">No orders found matching your criteria.</p>
                        </div>
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>
</div>

<div class="pagination-wrapper custom-pagination-wrapper py-3 px-4 border-top">
    {{ $orders->appends(request()->query())->onEachSide(1)->links('pagination::bootstrap-5') }}
</div>
