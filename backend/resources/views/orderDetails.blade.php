@extends('layouts.admin')

@section('title', 'Orders | Shopping Store')
<?php
// dd($items);
?>
<style>
    /* Premium Invoice Modal Styles - Antigravity Precision UI */
    #invoiceModal .modal-dialog {
        max-width: 900px;
    }

    #invoiceModal .modal-body {
        background-color: #f8f9fa;
        padding: 40px;
    }

    .invoice-container {
        background: #fff;
        padding: 50px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
        min-height: 1000px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .invoice-body-wrapper {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        z-index: 1;
        position: relative;
    }

    .invoice-footer-wrapper {
        margin-top: auto;
        z-index: 1;
        position: relative;
    }

    /* Top Bar Pink */
    .invoice-top-bar {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 10px;
        background-color: #ec4899;
    }

    .brand-pink { color: #ec4899; }
    .bg-brand-pink { background-color: #ec4899; }

    /* Watermark - THANK YOU */
    .watermark {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 100px;
        font-weight: 900;
        color: rgba(236, 72, 153, 0.08); /* 0.08 Opacity Pink */
        white-space: nowrap;
        pointer-events: none;
        z-index: 0;
    }

    .invoice-header-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin-top: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
        z-index: 1;
        position: relative;
    }

    .address-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin-top: 30px;
    }

    .address-box h6 {
        color: #ec4899;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        margin-bottom: 10px;
    }

    .address-box p {
        margin-bottom: 2px;
        word-break: break-word;
        overflow-wrap: break-word;
    }

    .invoice-table {
        margin-top: 40px;
        width: 100%;
        border-collapse: collapse;
    }

    .invoice-table th {
        background: #ec4899;
        color: white;
        padding: 10px 8px;
        font-size: 12px;
        text-align: left;
    }

    .invoice-table td {
        padding: 10px 8px;
        border-bottom: 1px solid #eee;
        font-size: 12px;
    }

    /* Prevent numeric and short columns from wrapping, and style them nicely */
    .invoice-table th:not(:nth-child(2)),
    .invoice-table td:not(:nth-child(2)) {
        white-space: nowrap;
    }

    .invoice-table td:nth-child(2) {
        white-space: normal;
        word-break: break-word;
    }

    .invoice-summary-grid {
        display: grid;
        grid-template-columns: 1fr 280px;
        margin-top: 30px;
    }

    .summary-table {
        width: 100%;
    }

    .summary-table td {
        padding: 5px 0;
        font-size: 13px;
    }

    .final-total-row {
        border-top: 2px solid #ec4899;
        margin-top: 10px;
        padding-top: 15px;
    }

    .digital-sign-box {
        border: 1px solid #ec4899;
        padding: 10px;
        width: 180px;
        text-align: center;
        margin-top: 20px;
        float: right;
    }

    .sign-text {
        font-size: 9px;
        color: #ec4899;
        font-weight: 800;
        display: block;
    }

    /* Print Specific Overrides */
    @media print {
        @page {
            size: A4 portrait;
            margin: 0;
        }
        
        body {
            visibility: hidden !important;
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        #invoiceModal {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            display: block !important;
            visibility: visible !important;
            border: none !important;
            background: #fff !important;
        }

        #invoiceModal .modal-dialog,
        #invoiceModal .modal-content,
        #invoiceModal .modal-body {
            position: static !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            background: #fff !important;
            border: none !important;
            box-shadow: none !important;
            display: block !important;
            visibility: visible !important;
        }

        .invoice-container {
            visibility: visible !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            position: relative !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 20mm 15mm 15mm 15mm !important; /* Perfect margins for A4 */
            box-sizing: border-box !important;
            width: 210mm !important; /* Fixed A4 Width */
            height: 297mm !important; /* Fixed A4 Height */
            min-height: 297mm !important;
            background: #fff !important;
            page-break-after: avoid;
            page-break-inside: avoid;
        }

        .invoice-container * {
            visibility: visible !important;
        }

        .modal-footer, .btn-close, .modal-header {
            display: none !important;
        }

        /* Prevent browsers from losing colors/backgrounds on print */
        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
    }
</style>
@section('content')
    <div class="custom-container ">
        <div class="row mb-5">
            <div class="col-12 d-md-flex justify-content-between align-items-center">
                <div>
                    <div class="d-flex">
                        <a href="{{ route('admin.order-view') }}"
                            class="btn btn-outline-secondary btn-sm rounded-circle me-3 shadow-sm" title="Back to Attributes">
                            <i class="ti ti-arrow-left fs-2"></i>
                        </a>
                        <h1 class="mb-1 h2 fw-bold">Order #<span class="text-primary">{{ $order->OrderNo ?? 'N/A' }}</h1>
                    </div>
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb mb-0">
                            <li class="breadcrumb-item"><a href="#" class="text-decoration-none">Dashboard</a></li>
                            <li class="breadcrumb-item"><a href="#" class="text-decoration-none">Orders</a></li>
                            <li class="breadcrumb-item active">Details</li>
                        </ol>
                    </nav>
                </div>
                <div class="mt-3 mt-md-0 d-flex gap-2">
                    @php
                        $isDelivered = ($order->OrderStatus == 11);
                        $isPaid = ($order->PaymentStatus == 15 || $order->PaymentStatus == 52);
                        $canViewInvoice = ($isDelivered && $isPaid);
                    @endphp

                    @if($canViewInvoice)
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#invoiceModal">
                            <i class="ti ti-receipt me-1"></i> View Invoice
                        </button>
                    @endif
                </div>
            </div>
        </div>
        <div>
            <!-- row -->
            <div class="row mb-6">
                <div class="col-12 mb-6">
                    <div class="progress-container">
                        @php
                            $s = $order->OrderStatus;
                        @endphp

                        @if ($s == 12)
                            <div class="alert alert-danger mb-0 text-center"><strong>Status:</strong> Order Cancelled</div>
                        @elseif($s == 13)
                            <div class="alert alert-dark mb-0 text-center"><strong>Status:</strong> Order Refunded</div>
                        @elseif(in_array($s, [58, 61, 62]))
                            <div class="alert alert-warning mb-0 text-center"><strong>Status:</strong> Partially Delivered / Refunded</div>
                        @else
                            <ul class="progress-steps">
                                <li class="active">
                                    <span class="step-icon">1</span>
                                    <p>Order Placed</p>
                                </li>

                                <li class="{{ $s >= 9 ? 'active' : '' }}">
                                    <span class="step-icon">2</span>
                                    <p>Confirmed</p>
                                </li>

                                <li class="{{ $s >= 10 && $s < 12 ? 'active' : ($s == 12 ? 'active' : '') }}">
                                    <span class="step-icon">3</span>
                                    <p>Shipped</p>
                                </li>

                                <li class="{{ $s == 11 ? 'active' : '' }}">
                                    <span class="step-icon">4</span>
                                    <p>Delivered</p>
                                </li>
                            </ul>
                        @endif
                    </div>
                </div>
                <div class="card my-6 card-lg">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 border-end-md">
                                <div class="pe-md-4">
                                    <h5 class="mb-4 text-dark fw-bold">Customer Details</h5>
                                    <div class="d-flex align-items-center mb-4">
                                        <div class="avatar avatar-md bg-light-primary text-primary rounded-circle d-flex align-items-center justify-content-center"
                                            style="width: 50px; height: 50px; font-size: 1.2rem;">
                                            @if ($order->customer_image ?? '')
                                                <img src="{{ asset($order->customer_image ?? '') }}" class="rounded-circle"
                                                    width="50" height="50">
                                            @else
                                                @php
                                                    $name = trim($order->customer_name ?? '');
                                                    $words = $name ? explode(' ', $name) : [];
                                                    $initials = '';
                                                    foreach ($words as $w) {
                                                        if (!empty($w)) {
                                                            $initials .= $w[0];
                                                        }
                                                    }
                                                    echo strtoupper(substr($initials, 0, 2));
                                                @endphp
                                                <span class="fw-bold">{{ $initials }} </span>
                                            @endif
                                        </div>
                                        <div class="ms-3">
                                            <h6 class="mb-0 fs-5">{{ $order->customer_name ?? 'N/A' }} </h6>
                                            <small class="text-secondary">Customer ID: #{{ $order->UID ?? 'N/A' }} </small>
                                        </div>
                                    </div>

                                    <ul class="list-unstyled mb-0">
                                        <li class="mb-2 d-flex align-items-center">
                                            <i class="ti ti-mail me-3 text-primary fs-5"></i>
                                            <a href="mailto:{{ $order->Email ?? 'N/A' }}"
                                                class="text-inherit">{{ $order->Email ?? 'N/A' }}</a>
                                        </li>
                                        <li class="mb-0 d-flex align-items-center">
                                            <i class="ti ti-phone me-3 text-primary fs-5"></i>
                                            <span class="text-secondary">+91{{ $order->Phone ?? 'N/A' }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div class="col-md-6 mt-4 mt-md-0">
                                <div class="ps-md-4">
                                    <div class="d-flex justify-content-between align-items-center mb-4">
                                        <h5 class="mb-0 text-dark fw-bold">Shipping Details</h5>
                                        <span class="badge bg-light-secondary text-secondary rounded-pill px-3 small">
                                            {{ $order->address_type ?? 'Other' }}
                                        </span>
                                    </div>

                                    <div class="d-flex">
                                        <div class="me-3">
                                            <div class="bg-light-danger text-danger rounded-3 d-flex align-items-center justify-content-center"
                                                style="width: 40px; height: 40px;">
                                                <i class="ti ti-map-pin fs-4"></i>
                                            </div>
                                        </div>

                                        <div class="flex-grow-1">
                                            <h6 class="mb-1 fw-bold text-dark">
                                                {{ $order->address_on_name }}
                                                <small class="text-muted fw-normal ms-1">(Recipient)</small>
                                            </h6>

                                            <address class="mb-3 text-secondary lh-base small">
                                                {{ $order->address }}<br>
                                                {{ $order->City }}, {{ $order->State }} - {{ $order->Pincode }}<br>
                                                @if ($order->Landmark)
                                                    <span class="text-muted small"><strong>Landmark:</strong>
                                                        {{ $order->Landmark }}</span>
                                                @endif
                                            </address>

                                            <div class="bg-light p-2 rounded-2 border-start border-primary border-3">
                                                <div class="mb-1">
                                                    <i class="ti ti-phone me-2 text-primary"></i>
                                                    <a href="tel:{{ $order->address_on_phone }}"
                                                        class="text-decoration-none fw-bold text-dark small">
                                                        {{ $order->address_on_phone }}
                                                    </a>
                                                </div>
                                                <div>
                                                    <i class="ti ti-mail me-2 text-primary"></i>
                                                    <span class="small text-secondary">{{ $order->Email }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mt-3 d-flex gap-2">
                                        <a href="https://www.google.com/maps/search/?api=1&query={{ urlencode($order->address . ' ' . $order->City) . '' . $order->State . '' . $order->Pincode }}"
                                            target="_blank" class="btn btn-outline-secondary btn-sm">
                                            <i class="ti ti-map me-1"></i> Locate on Map
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="row g-6">
                <div class="col-lg-7 col-xxl-9 col-12">
                    <div class="card card-lg">
                        <div class="card-header border-bottom-0">
                            <div>
                                <div class="d-flex justify-content-between align-items-center">

                                    <div>
                                        <h5 class="mb-1">Order ID: <span
                                                class="text-primary">{{ $order->OrderNo ?? 'N/A' }}</span></h5>

                                        <div class="d-flex align-items-center mb-3">
                                            <span class="text-secondary">Order Date:
                                                {{ date('d M, Y', strtotime($order->CreatedDtTm)) }} ||
                                                {{ date('h:i A', strtotime($order->CreatedDtTm)) }} ||
                                            </span>

                                            &nbsp;&nbsp;

                                            @php
                                                // Payment Status Badge Logic
                                                $badgeColor = match ($order->PaymentStatusText) {
                                                    'Paid' => 'bg-success',
                                                    'Pending' => 'bg-warning text-dark',
                                                    'Failed' => 'bg-danger',
                                                    'Refunded' => 'bg-info text-dark',
                                                    default => 'bg-secondary',
                                                };
                                            @endphp

                                            <span class="badge {{ $badgeColor }}">
                                                {{ $order->PaymentStatusText ?? 'Unknown' }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table text-nowrap mb-0 table-centered table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">Products</th>
                                        <th scope="col">Items</th>
                                        <th scope="col">Amounts</th>
                                        <th scope="col">Status</th>
                                        <th scope="col" class="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($items as $item)
                                        <tr>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <a href="#!">
                                                        <img src="{{ asset($item->product_image ?? 'assets/images/placeholder.jpg') }}"
                                                            alt="Image" class="rounded-3" width="56"
                                                            height="56" style="object-fit: cover;" />
                                                    </a>

                                                    <div class="ms-3 d-flex flex-column">
                                                        <a href="#!"
                                                            class="text-dark fw-bold text-decoration-none">{{ $item->ProductTitle }}</a>

                                                        <div class="d-flex gap-1 mt-1">
                                                            @if ($item->Discount > 0)
                                                                <span class="badge bg-light-warning text-warning"
                                                                    style="font-size: 10px;">
                                                                    <i class="ti ti-tag"></i> {{ $item->Discount }}% Off
                                                                </span>
                                                            @endif

                                                            @if ($item->is_partially_cancelled)
                                                                <span class="badge bg-light-danger text-danger"
                                                                    style="font-size: 10px;">Cancelled</span>
                                                            @endif
                                                        </div>

                                                        <small class="text-secondary">SKU:
                                                            {{ $item->variant_sku ?? 'N/A' }}</small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td class="align-middle text-center">
                                                <span class="badge bg-light-primary text-primary rounded-pill px-3">{{ $item->Quantity }}</span>
                                            </td>
                                            <td class="align-middle text-end">
                                                <div class="d-flex flex-column pe-3">
                                                    <span class="fw-bold text-primary fs-5">
                                                        &#x20B9; {{ number_format($item->TotalAmount, 0) }}
                                                    </span>
                                                    <small class="text-muted" style="font-size: 0.7rem;">
                                                        ({{ $item->Quantity }} × {{ number_format($item->UnitPrice, 0) }})
                                                    </small>
                                                </div>
                                            </td>
                                            @php
                                                $isCancelled = ($item->ItemStatus == 22 || $item->ItemStatus == 23);
                                            @endphp
                                            <td class="align-middle">
                                                <select class="form-select form-select-sm item-status-select fw-bold border-0 shadow-sm rounded-pill px-3 py-2 {{ $isCancelled ? 'text-danger bg-light-danger' : 'text-primary bg-light-primary' }}" 
                                                        data-id="{{ $item->ID }}" 
                                                        style="width: 140px; font-size: 11px;">
                                                    <option value="18" {{ $item->ItemStatus == 18 ? 'selected' : '' }}>Placed</option>
                                                    <option value="19" {{ $item->ItemStatus == 19 ? 'selected' : '' }}>Processing</option>
                                                    <option value="20" {{ $item->ItemStatus == 20 ? 'selected' : '' }}>Packed</option>
                                                    <option value="21" {{ $item->ItemStatus == 21 ? 'selected' : '' }}>Delivered</option>
                                                    <option value="22" {{ $item->ItemStatus == 22 ? 'selected' : '' }}>Cancelled</option>
                                                    <option value="23" {{ $item->ItemStatus == 23 ? 'selected' : '' }}>Returned</option>
                                                </select>
                                            </td>

                                            <td class="align-middle text-end pe-4">
                                                @if (!$isCancelled)
                                                    <button class="btn btn-sm btn-outline-danger cancel-item-btn border-0 rounded-circle p-2"
                                                        data-id="{{ $item->ID }}" title="Cancel this item">
                                                        <i class="ti ti-trash fs-5"></i>
                                                    </button>
                                                @else
                                                    <div class="d-flex flex-column align-items-end gap-1">
                                                        @if ($item->RefundStatus == 51)
                                                            <a href="{{ route('admin.refund-list-view', ['search' => $order->OrderNo]) }}" 
                                                               class="btn btn-xs btn-outline-primary px-3 py-1 rounded-pill" 
                                                               style="font-size: 10px;">
                                                                <i class="ti ti-receipt-refund"></i> Manage Refund
                                                            </a>
                                                        @elseif ($item->RefundStatus == 56)
                                                            <span class="badge bg-light-success text-success px-3 py-2 rounded-pill" style="font-size: 10px;">
                                                                <i class="ti ti-check"></i> Refunded
                                                            </span>
                                                        @endif
                                                    </div>
                                                @endif
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                @php
                    // --- ADVANCED UNIFIED MATH (Admin Sync) ---
                    $shippingFee = $order->ShippingFee ?? 0;
                    $platformFee = $order->PlatformFee ?? 0;

                    // 1. Original Totals (Historical Snapshot)
                    $originalMRP = $items->sum(fn($i) => $i->UnitPrice * $i->Quantity);
                    $originalProductDiscount = $items->sum(fn($i) => ($i->UnitPrice - $i->SellPrice) * $i->Quantity);
                    
                    // TotalAmount in DB is (Net + Tax) ALREADY minus coupon_share.
                    // So Sum of all TotalAmount + Fees = Original Grand Total Paid/Payable.
                    $originalGrandTotal = $items->sum('TotalAmount') + $shippingFee + $platformFee;
                    $couponDiscount = $items->sum('coupon_share');
                    
                    // 2. Status-wise Deductions (Using stored TotalAmount directly)
                    $deductionCancelled = $items->whereIn('ItemStatus', [22, 51])->sum('TotalAmount');
                    $deductionRefunded = $items->where('ItemStatus', 23)->sum('TotalAmount');

                    // 3. Termination Check (If no active items, deduct fees)
                    $activeItems = $items->whereNotIn('ItemStatus', [22, 51, 23]);
                    $isFullyTerminated = $activeItems->count() === 0;
                    $orderLevelDeduction = $isFullyTerminated ? ($shippingFee + $platformFee) : 0;

                    // 4. Final Settlement
                    $totalDeductions = $deductionCancelled + $deductionRefunded + $orderLevelDeduction;
                    $netSettlement = $originalGrandTotal - $totalDeductions;
                @endphp

                <div class="col-lg-5 col-xxl-3 col-12 mb-4">
                    <div class="card mb-6 mt-lg-0 card-lg border-0 shadow-sm animate-in fade-in duration-500">
                        <div class="card-header border-bottom-0 bg-light-primary rounded-top-3">
                            <h5 class="mb-0 fw-bold">Settlement Summary</h5>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-centered mb-0 align-middle">
                                <thead>
                                    <tr class="bg-light">
                                        <th scope="col" class="ps-3 text-[11px] uppercase tracking-wider">Descriptions</th>
                                        <th scope="col" class="text-end pe-3 text-[11px] uppercase tracking-wider">Amounts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="ps-3 text-secondary">Original MRP:</td>
                                        <td class="text-end pe-3 fw-bold text-muted">₹ {{ number_format($originalMRP) }}</td>
                                    </tr>
                                    <tr>
                                        <td class="ps-3 text-secondary">Product Discounts:</td>
                                        <td class="text-end pe-3 text-danger fw-bold">- ₹ {{ number_format($originalProductDiscount) }}</td>
                                    </tr>

                                    @if ($couponDiscount > 0)
                                    <tr class="table-success opacity-75">
                                        <td class="ps-3 text-success fw-bold">Coupon ({{ $order->CouponCode }}):</td>
                                        <td class="text-end pe-3 text-success fw-bold">- ₹ {{ number_format($couponDiscount) }}</td>
                                    </tr>
                                    @endif

                                    <tr>
                                        <td class="ps-3 text-secondary">Shipping & Platform Fees:</td>
                                        <td class="text-end pe-3 fw-bold">₹ {{ number_format($shippingFee + $platformFee) }}</td>
                                    </tr>

                                    <tr class="bg-light-secondary border-top border-bottom">
                                        <td class="ps-3 fw-bold">Total Bill (Original):</td>
                                        <td class="text-end pe-3 fw-black">₹ {{ number_format($originalGrandTotal) }}</td>
                                    </tr>

                                    @if($totalDeductions > 0)
                                        @if($deductionCancelled > 0)
                                        <tr class="text-danger opacity-75">
                                            <td class="ps-3 italic">Total Cancelled Value:</td>
                                            <td class="text-end pe-3 fw-bold">- ₹ {{ number_format($deductionCancelled + ($isFullyTerminated && $order->PaymentStatus == 16 ? $orderLevelDeduction : 0)) }}</td>
                                        </tr>
                                        @endif
                                        @if($deductionRefunded > 0)
                                        <tr class="text-success opacity-75">
                                            <td class="ps-3 italic">Total Refunded (Paid):</td>
                                            <td class="text-end pe-3 fw-bold">- ₹ {{ number_format($deductionRefunded + ($isFullyTerminated && $order->PaymentStatus != 16 ? $orderLevelDeduction : 0)) }}</td>
                                        </tr>
                                        @endif
                                    @endif
                                </tbody>
                                <tfoot class="border-top-2 border-primary">
                                    <tr class="fw-black fs-4 {{ $isFullyTerminated ? 'bg-light text-muted opacity-50' : 'bg-light-primary text-primary' }}">
                                        <td class="ps-3">{{ $isFullyTerminated ? 'NET SETTLEMENT' : 'AMOUNT PAYABLE' }}</td>
                                        <td class="text-end pe-3">₹ {{ number_format($netSettlement) }}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {{-- Payment Details Section --}}
                    <div class="card card-lg border-0 shadow-sm">
                        <div class="card-body">
                            <h5 class="mb-4 fw-bold">Payment Details</h5>
                            <ul class="list-unstyled mb-0">
                                <li class="d-flex justify-content-between mb-3">
                                    <span class="text-muted">Method:</span>
                                    <span class="badge {{ $order->OrderPaymentMode == 49 ? 'bg-light-warning text-warning' : 'bg-light-info text-info' }}">
                                        {{ $order->OrderPaymentMode == 49 ? 'Cash On Delivery' : 'Online Payment' }}
                                    </span>
                                </li>

                                <li class="d-flex justify-content-between mb-3 border-top pt-3">
                                    <span class="text-muted">Payment Status:</span>
                                    @php
                                        $payStatusLabel = match ((int)$order->PaymentStatus) {
                                            15, 52 => 'Paid (Success)',
                                            53 => 'Refunded',
                                            61 => 'Partial Refund',
                                            51 => 'Pending',
                                            default => 'Unknown'
                                        };
                                        $payStatusClass = match ((int)$order->PaymentStatus) {
                                            15, 52 => 'bg-success',
                                            53 => 'bg-info',
                                            61 => 'bg-primary',
                                            51 => 'bg-warning text-dark',
                                            default => 'bg-secondary'
                                        };
                                    @endphp
                                    <span class="badge {{ $payStatusClass }}">{{ $payStatusLabel }}</span>
                                </li>

                                <li class="d-flex justify-content-between mb-2 mt-4">
                                    <span class="text-dark fw-bold">Current Settlement:</span>
                                    <span class="{{ $isFullyTerminated ? 'text-muted line-through' : 'text-primary' }} fw-black fs-5">
                                        ₹ {{ number_format($netSettlement) }}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- REFUND DETAILS MODAL -->
    <div class="modal fade" id="refundDetailsModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-lg border-0 rounded-4">
                <div class="modal-header bg-light border-0">
                    <h5 class="modal-title fw-bold">Refund Settlement Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4">
                    <div id="refundLoading" class="text-center py-4">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="mt-2 text-muted">Fetching details...</p>
                    </div>
                    <div id="refundContent" style="display: none;">
                        <div class="d-flex align-items-center mb-4 p-3 bg-light-primary rounded-3">
                            <div class="bg-primary text-white rounded-circle p-2 me-3">
                                <i class="ti ti-wallet fs-4"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold">Refund Method</h6>
                                <span class="badge bg-primary" id="refMethod">UPI</span>
                            </div>
                        </div>

                        <div id="bankDetails" style="display: none;">
                            <div class="mb-3">
                                <label class="text-muted small">Account Holder</label>
                                <p class="fw-bold mb-0" id="refHolderName">-</p>
                            </div>
                            <div class="row">
                                <div class="col-6 mb-3">
                                    <label class="text-muted small">Account Number</label>
                                    <p class="fw-bold mb-0" id="refAccountNo">-</p>
                                </div>
                                <div class="col-6 mb-3">
                                    <label class="text-muted small">IFSC Code</label>
                                    <p class="fw-bold mb-0 text-primary" id="refIfsc">-</p>
                                </div>
                            </div>
                        </div>

                        <div id="upiDetails" style="display: none;">
                            <div class="p-3 border rounded-3 text-center bg-light">
                                <label class="text-muted small d-block mb-1">UPI ID / PhonePe / GPay</label>
                                <h5 class="fw-black text-primary mb-0" id="refUpiId">-</h5>
                            </div>
                        </div>

                        <div class="row mt-4 mb-2 p-3 border rounded-3 bg-light-success mx-0">
                            <div class="col-12 text-center">
                                <label class="text-success small fw-bold">Amount to be Refunded</label>
                                <h3 class="fw-black text-success mb-0">₹ <span id="refAmount">0</span></h3>
                            </div>
                        </div>

                        <div class="mt-4 pt-3 border-top">
                            <label class="text-muted small">Refund Reason</label>
                            <p class="small text-dark italic" id="refReason">-</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary rounded-pill px-4" id="processRefundFinalBtn" style="display: none;">Confirm & Process Refund</button>
                </div>
            </div>
        </div>
    </div>

    <!-- PREMIUM INVOICE MODAL -->
    <div class="modal fade" id="invoiceModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-body p-0">
                    <div class="invoice-container" id="printableInvoice">
                        <div class="invoice-top-bar"></div>
                        <div class="watermark">THANK YOU</div>

                        <!-- MAIN WRAPPER (Top & Center) -->
                        <div class="invoice-body-wrapper">
                            {{-- Header Section --}}
                        <div class="invoice-header-grid">
                            <div>
                                <h2 class="fw-black brand-pink mb-1">INVOICE</h2>
                                <p class="text-muted small mb-0">Order: #{{ $order->OrderNo }}</p>
                                <p class="text-muted small">Date: {{ date('d M, Y', strtotime($order->CreatedDtTm)) }}</p>
                            </div>
                            <div class="text-end">
                                @php
                                    $appCompanyName = config('app.company_name');
                                    $cleanCompanyName = ($appCompanyName && $appCompanyName !== 'Laravel') ? $appCompanyName : 'FINTRICK INNOVATIONS';

                                    $appAddress = config('app.address');
                                    $cleanAddress = ($appAddress && $appAddress !== 'India' && $appAddress !== 'Laravel') ? $appAddress : 'A 43, OFFICE NO 8,SECTOR 2,Noida,Gautambuddha Nagar,Uttar Pradesh,201301';

                                    $appGst = config('app.gst');
                                    $cleanGst = ($appGst && $appGst !== '') ? $appGst : '08ABCDE1234F1Z5';

                                    $appName = config('app.name');
                                    $cleanBrandName = ($appName && $appName !== 'Laravel') ? $appName : 'Fintrick';

                                    $appEmail = config('app.email');
                                    $cleanEmail = ($appEmail && $appEmail !== 'Laravel') ? $appEmail : 'tech@fintrickinnovations.com';

                                    $appPhone = config('app.phone');
                                    $cleanPhone = ($appPhone && $appPhone !== 'Laravel') ? $appPhone : '9876543210';
                                @endphp
                                <h4 class="fw-bold mb-1">{{ $cleanCompanyName }}</h4>
                                @if($cleanBrandName)
                                    <p class="text-muted small mb-1" style="font-size: 11px; font-weight: 600; color: #ec4899;">({{ $cleanBrandName }})</p>
                                @endif
                                <p class="text-muted small mb-0">{{ $cleanAddress }}</p>
                                <p class="text-muted small mb-0">GST: {{ $cleanGst }}</p>
                            </div>
                        </div>

                        {{-- Address Section --}}
                        <div class="address-section">
                            <div class="address-box">
                                <h6>BILL TO</h6>
                                <p class="fw-bold mb-1">{{ $order->customer_name }}</p>
                                <p class="text-muted small mb-0">{{ $order->Email }}</p>
                                <p class="text-muted small">{{ $order->Phone }}</p>
                            </div>
                            <div class="address-box">
                                <h6>SHIP TO</h6>
                                <p class="fw-bold mb-1">{{ $order->address_on_name }}</p>
                                <p class="text-muted small mb-0">{{ $order->address }}</p>
                                <p class="text-muted small">{{ $order->City }}, {{ $order->State }} - {{ $order->Pincode }}</p>
                            </div>
                        </div>

                        @php
                            // Exclude Cancelled (22), Pending Refund (51), Returned (23) and Refunded (56) items to match frontend generateInvoice.js
                            $activeInvoiceItems = $items->filter(function($item) {
                                $status = (int)($item->ItemStatus ?? 0);
                                $refundStatus = (int)($item->RefundStatus ?? 0);
                                return !in_array($status, [22, 51, 23]) && !in_array($refundStatus, [56]);
                            });

                            $invoiceMRP = 0;
                            $invoiceDiscount = 0;
                            $invoiceTax = 0;
                            $invoiceSubtotal = 0;
                            $invoiceCouponShare = 0;

                            foreach ($activeInvoiceItems as $item) {
                                $qty = (float)($item->Quantity ?? 1);
                                $unitPrice = (float)($item->UnitPrice ?? 0);
                                $discountAmt = (float)($item->DiscountAmt ?? 0);
                                $gstAmt = (float)($item->Gst ?? 0);
                                $totalAmt = (float)($item->TotalAmount ?? 0);
                                $couponShare = (float)($item->coupon_share ?? 0);

                                $invoiceMRP += $unitPrice * $qty;
                                $invoiceDiscount += $discountAmt;
                                $invoiceTax += $gstAmt;
                                $invoiceSubtotal += $totalAmt;
                                $invoiceCouponShare += $couponShare;
                            }

                            $invoiceShipping = (float)($order->ShippingFee ?? 0);
                            $invoiceHandling = (float)($order->PlatformFee ?? 0);
                            $invoiceGrandTotal = $invoiceSubtotal + $invoiceShipping + $invoiceHandling;
                        @endphp

                        {{-- Items Table --}}
                        <table class="invoice-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Description</th>
                                    <th>SKU</th>
                                    <th class="text-center">Qty</th>
                                    <th class="text-end">MRP</th>
                                    <th class="text-end">Discount</th>
                                    <th class="text-end">GST</th>
                                    <th class="text-end">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($activeInvoiceItems as $index => $item)
                                    <tr>
                                        <td>{{ $index + 1 }}</td>
                                        <td>
                                            <span class="fw-bold">{{ $item->ProductTitle }}</span><br>
                                            <small class="text-muted">{{ $item->variant_name }}</small>
                                        </td>
                                        <td>{{ $item->variant_sku }}</td>
                                        <td class="text-center">{{ $item->Quantity }}</td>
                                        <td class="text-end">₹{{ number_format($item->UnitPrice, 2) }}</td>
                                        <td class="text-end text-danger">-₹{{ number_format($item->DiscountAmt, 2) }}</td>
                                        <td class="text-end text-success">+₹{{ number_format($item->Gst, 2) }}</td>
                                        <td class="text-end fw-bold">₹{{ number_format($item->TotalAmount, 2) }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>

                        {{-- Summary Section --}}
                        <div class="invoice-summary-grid">
                            <div>
                                <p class="text-muted small mt-4">Note: This is a computer-generated invoice and does not require a physical signature.</p>
                            </div>
                            <div>
                                <table class="summary-table">
                                    <tr>
                                        <td>Total MRP (Base)</td>
                                        <td class="text-end">₹{{ number_format($invoiceMRP, 2) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Product Discount</td>
                                        <td class="text-end text-danger">-₹{{ number_format($invoiceDiscount, 2) }}</td>
                                    </tr>
                                    @if($invoiceCouponShare > 0)
                                    <tr>
                                        <td class="text-success">Discount (Coupon)</td>
                                        <td class="text-end text-success">-₹{{ number_format($invoiceCouponShare, 2) }}</td>
                                    </tr>
                                    @endif
                                    <tr>
                                        <td>Shipping Fee</td>
                                        <td class="text-end">₹{{ number_format($invoiceShipping, 2) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Handling Fee</td>
                                        <td class="text-end">₹{{ number_format($invoiceHandling, 2) }}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Tax (GST)</td>
                                        <td class="text-end">₹{{ number_format($invoiceTax, 2) }}</td>
                                    </tr>
                                    <tr class="final-total-row">
                                        <td><h5 class="fw-black brand-pink">GRAND TOTAL</h5></td>
                                        <td class="text-end"><h5 class="fw-black brand-pink">₹{{ number_format($invoiceGrandTotal, 2) }}</h5></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <!-- END OF MAIN WRAPPER -->

                        <!-- FOOTER WRAPPER (Bottom) -->
                        <div class="invoice-footer-wrapper">
                            {{-- Legal & Customer Support Footer --}}
                        <div class="row mt-5 pt-4 border-top">
                            <div class="col-6 text-start">
                                <h6 class="brand-pink fw-bold mb-2">CUSTOMER SUPPORT</h6>
                                <p class="text-muted small mb-1">Email: <strong>{{ $cleanEmail }}</strong></p>
                                <p class="text-muted small mb-1">Helpline: <strong>{{ $cleanPhone }}</strong></p>
                                <p class="text-muted small mb-0">Web: <strong>www.{{ strtolower($cleanBrandName) }}.in</strong></p>
                            </div>
                            <div class="col-6 text-end">
                                <h6 class="text-dark fw-bold mb-2">For {{ strtoupper($cleanCompanyName) }}</h6>
                                <div class="digital-sign-box mt-1 float-end">
                                    <img src="{{ asset('assets/images/sign.png') }}" alt="Sign" style="width: 100px; opacity: 0.8; filter: grayscale(1);">
                                    <span class="sign-text">AUTHORIZED SIGNATORY</span>
                                </div>
                            </div>
                        </div>

                        <div class="text-center mt-5">
                            <p class="text-muted small mb-1" style="font-size: 10px; font-weight: 700; letter-spacing: 1px;">TERMS & CONDITIONS</p>
                            <p class="text-muted small mb-2" style="font-size: 9px; line-height: 1.4;">
                                1. Goods once sold will only be replaced as per policy. <br>
                                2. This is a computer-generated invoice and does not require a physical signature.
                            </p>
                            <h6 class="brand-pink fw-bold mt-2" style="font-size: 11px;">Happy Shopping with {{ $cleanBrandName }}!</h6>
                        </div>
                        <!-- END OF FOOTER WRAPPER -->
                    </div>
                </div>
                <div class="modal-footer bg-light border-0 shadow-sm">
                    <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary text-white rounded-pill px-4" onclick="window.print()">
                        <i class="ti ti-printer me-1"></i> Print / Save as PDF
                    </button>
                </div>
            </div>
        </div>
    </div>
@endsection



<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script>
    // ITEM STATUS UPDATE
    $(document).on('change', '.item-status-select', function() {
        let itemId = $(this).data('id');
        let status = $(this).val();
        let $select = $(this);

        if (confirm('Update status for this item?')) {
            $.ajax({
                url: "{{ route('admin.update-item-status') }}",
                method: "POST",
                data: {
                    _token: "{{ csrf_token() }}",
                    item_id: itemId,
                    status: status
                },
                success: function(response) {
                    if (response.success) {
                        alert('Status synced successfully');
                        location.reload();
                    }
                }
            });
        }
    });

    $(document).on('click', '.cancel-item-btn', function() {
        let itemId = $(this).data('id');

        if (confirm('Are you sure you want to cancel ONLY this item? Inventory will be restored and refund state will be triggered if paid.')) {
            $.ajax({
                url: "{{ route('admin.cancel-single-item') }}",
                method: "POST",
                data: {
                    _token: "{{ csrf_token() }}",
                    item_id: itemId
                },
                success: function(response) {
                    if (response.success) {
                        location.reload();
                    } else {
                        alert(response.message);
                    }
                }
            });
        }
    });

    // Redirect helper for refunds
    $(document).on('click', '.view-refund-redirect', function() {
        window.location.href = "{{ route('admin.refund-list-view') }}?search={{ $order->OrderNo }}";
    });
</script>
