@extends('layouts.admin')
@section('title', 'Coupon History')

@section('content')
    <div class="custom-container">
        <div class="row">
            <div class="col-12">
                <div class="mb-8 d-md-flex justify-content-between align-items-center">
                    <div>
                        <div class="d-flex">
                            <a href="{{ route('admin.coupon-view') }}"
                                class="btn btn-outline-secondary btn-sm rounded-circle me-3 shadow-sm"
                                title="Back to Attributes">
                                <i class="ti ti-arrow-left fs-2"></i>
                            </a>
                            <h1 class="mb-1 h2">Coupon History</h1>
                        </div>
                    </div>
                    <div>
                        {{-- <button class="btn btn-primary d-md-flex align-items-center gap-2 shadow-sm" data-bs-toggle="modal"
                            data-bs-target="#attributeModal">
                            <i class="ti ti-plus"></i> Add New Attribute
                        </button> --}}
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="card card-lg shadow-sm" id="customerList"
                    data-list="category_index,coupon_customername,coupon_details,coupon_orderId,coupon_usedAt">
                    <div class="card-header border-bottom-0">
                        <div class="row w-100 gx-md-0 gy-4 align-items-center">
                            <div class="col-lg-4 col-md-6">
                                <input type="search" class="form-control listjs-search" placeholder="Search..." />
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive" data-simplebar style="height: 500px">
                        <table class="table text-nowrap mb-0 table-centered table-hover">
                            <thead class="sticky-top bg-white">
                                <tr>
                                    <th class="listjs-sorter" data-sort="category_index">ID</th>
                                    <th class="listjs-sorter" data-sort="coupon_customername">Customer</th>
                                    <th class="listjs-sorter" data-sort="coupon_details">Coupon Details</th>
                                    <th class="listjs-sorter" data-sort="coupon_orderId">Order ID</th>
                                    <th class="listjs-sorter" data-sort="coupon_usedAt">Used At</th>
                                </tr>
                            </thead>
                            <tbody class="list">
                                @foreach ($couponUsages as $usage)
                                    <tr>
                                        <!-- ID -->
                                        <td class="category_index">
                                            {{ $loop->iteration }}
                                        </td>

                                        <!-- Customer -->
                                        <td class="coupon_customername">
                                            <div class="d-flex align-items-center">
                                                <div class="icon-shape icon-sm bg-light text-primary rounded me-2">
                                                    <i class="ti ti-user"></i>
                                                </div>
                                                <div>
                                                    <h6 class="mb-0">
                                                        {{ $usage->CustomerName ?? 'Guest User' }}
                                                    </h6>
                                                    <small class="text-muted">{{ $usage->Email ?? 'N/A' }}</small><br>
                                                    <small class="text-muted">UID: {{ $usage->UID ?? 'N/A' }}</small>
                                                </div>
                                            </div>
                                        </td>

                                        <!-- Coupon -->
                                        <td class="coupon_details">
                                            <span class="badge bg-primary-soft text-primary fw-bold">
                                                <i class="ti ti-ticket me-1"></i>
                                                {{ $usage->CouponCode?? '' }}
                                            </span>
                                        </td>

                                        <!-- Order -->
                                        <td class="coupon_orderId">
                                            <span class="text-dark fw-medium">
                                                {{ $usage->OID ?? 'N/A' }}
                                            </span>
                                        </td>

                                        <!-- Used At -->
                                        <td class="coupon_usedAt" ">
                                            <small class="text-muted">
                                                <i class="ti ti-calendar-event me-1"></i>
                                                {{ $usage->UsedAt ? date('d M Y, h:i A', strtotime($usage->UsedAt)) : 'N/A' }}
                                            </small>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>


                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
