<style>
    /* Default: Expanded Sidebar State */
    .logo-mini {
        display: none !important;
    }

    .logo-full {
        display: block !important;
    }

    /* Aggressive Collapse Logic (Forces 100% invisibility) */
    .collapsed .logo-full,
    .collapsed .nav-text,
    .mini-sidebar .logo-full,
    .mini-sidebar .nav-text,
    [data-sidebartype="mini-sidebar"] .logo-full,
    [data-sidebartype="mini-sidebar"] .nav-text {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        width: 0 !important;
    }

    /* Show Mini Favicon only when collapsed */
    .collapsed .logo-mini,
    .mini-sidebar .logo-mini,
    [data-sidebartype="mini-sidebar"] .logo-mini {
        display: block !important;
        margin: 0 auto !important;
        width: 35px !important;
        height: auto !important;
        opacity: 1 !important;
        visibility: visible !important;
    }

    /* Alignment & Spacing Fixes */
    .brand-logo {
        height: 70px;
        padding: 10px 1.5rem !important; /* Added 10px top/bottom padding to prevent overlap */
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        margin-bottom: 5px;
    }

    .collapsed .brand-logo,
    .mini-sidebar .brand-logo,
    [data-sidebartype="mini-sidebar"] .brand-logo {
        padding: 0 !important;
        justify-content: center !important;
    }
</style>

<div id="miniSidebar">
    <div class="brand-logo">
        <a href="{{ url('/dashboard') }}" class="text-nowrap logo-img">
            <!-- Mini Logo (Visible only on Collapsed) -->
            <img src="{{ asset('assets/images/logo/favicon.svg') }}" onerror="this.onerror=null; this.src='{{ asset('assets/images/logo/favicon.png') }}';" class="logo-mini" alt="Fintrick Mini" />

            <!-- Full Logo (Visible only on Expanded) -->
            <span class="logo-full">
                <img src="{{ asset('assets/images/logo/fintrick-logo.svg') }}" onerror="this.onerror=null; this.src='{{ asset('assets/images/logo/shopLogo.png') }}';" class="sidebartoggler-name"
                    style="width: 140px; height: auto;" alt="Full Logo">
            </span>
        </a>
    </div>
    <ul class="navbar-nav flex-column">
        <li class="nav-item">
            <a class="nav-link d-flex align-items-center {{ Request::is('dashboard') ? 'active' : '' }}"
                href="{{ url('/') }}">
                <i class="ti ti-smart-home nav-icon fs-4 me-2"></i>
                <span class="nav-text text">Dashboard</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link d-flex align-items-center {{ Request::is('admin/customers*') ? 'active' : '' }}"
                href="{{ url('admin/customers') }}">
                <i class="ti ti-users nav-icon fs-4 me-2"></i>
                <span class="nav-text text">Customers</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link d-flex align-items-center {{ Request::is('admin/categories*') ? 'active' : '' }}"
                href="{{ url('admin/categories') }}">
                <i class="ti ti-category nav-icon fs-4  me-2"></i>
                <span class="nav-text text">Category & Sub</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link d-flex align-items-center {{ Request::is('admin/products*') ? 'active' : '' }}"
                href="{{ url('admin/products') }}">
                <i class="ti ti-shoe nav-icon fs-4 me-2"></i>
                <span class="nav-text text">Products</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link d-flex align-items-center {{ Request::is('admin/order-view*') ? 'active' : '' }}"
                href="{{ url('admin/order-view') }}">
                <i class="ti ti-shopping-cart nav-icon fs-4 me-2"></i>
                <span class="nav-text text">Orders</span>
            </a>
        </li>
        <?php
        $pendingOrderCount = DB::table('order_returns')->where('status', 44)->count();
        ?>
        <li class="nav-item">
            <a class="nav-link d-flex align-items-center justify-content-between {{ Request::is('admin/return-view*') ? 'active' : '' }}"
                href="{{ url('/admin/return-view') }}">
                <div class="d-flex align-items-center">
                    <i class="ti ti-star nav-icon fs-4 me-2"></i>
                    <span class="nav-text text">Return Orders</span>
                </div>

                {{-- Badge logic here --}}
                @if ($pendingOrderCount > 0)
                    <span class="badge bg-danger rounded-pill ml-auto" style="font-size: 10px;">
                        {{ $pendingOrderCount }}
                    </span>
                @endif
            </a>
        </li>
        <?php
        $pendingRefundCount = DB::table('refunds')->where('Status', 51)->count();
        ?>
        <li class="nav-item">
            <a class="nav-link d-flex align-items-center justify-content-between {{ Request::is('admin/refund-view*') ? 'active' : '' }}"
                href="{{ route('admin.refund-list-view') }}">
                <div class="d-flex align-items-center">
                    <i class="ti ti-receipt-refund nav-icon fs-4 me-2"></i>
                    <span class="nav-text text">Refund Settlements</span>
                </div>

                @if ($pendingRefundCount > 0)
                    <span class="badge bg-danger rounded-pill ml-auto" style="font-size: 10px;">
                        {{ $pendingRefundCount }}
                    </span>
                @endif
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link d-flex align-items-center {{ Request::is('admin/attributes/view*') ? 'active' : '' }}"
                href="{{ url('/admin/attributes/view') }}">
                <i class="ti ti-settings-automation nav-icon fs-4 me-2"></i>
                <span class="nav-text text">Attributes</span>
            </a>
        </li>
    <!-- -- OFFERS DROPDOWN — Filhal hidden hai, kal use karna ho to uncomment karo -->
        <!-- <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="ti ti-gift nav-icon fs-4 me-2"></i>
                <span class="text">Offers</span>
            </a>
            <ul class="dropdown-menu flex-column">
                <li class="nav-item">
                    <a class="nav-link d-flex align-items-center {{ Request::is('admin/product/offers*') ? 'active' : '' }}"
                        href="{{ url('/admin/product/offers') }}">
                        <i class="ti ti-gift nav-icon fs-4 me-2"></i>
                        <span class="text">Offers List</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link d-flex align-items-center {{ Request::is('admin/assign-offers*') ? 'active' : '' }}"
                        href="{{ url('/admin/assign-offers') }}">
                        <i class="ti ti-gift nav-icon fs-4 me-2"></i>
                        <span class="text"> Assign Offers</span>
                    </a>
                </li>

            </ul>
        </li> -->
        <li class="nav-item">
            <a class="nav-link d-flex align-items-center {{ Request::is('admin/coupon-view*') ? 'active' : '' }}"
                href="{{ url('/admin/coupon-view') }}">
                <i class="ti ti-ticket nav-icon fs-4 me-2"></i>
                <span class="nav-text text">Create Coupon</span>
            </a>
        </li>
        <?php
        $pendingReviewCount = DB::table('product_reviews')->where('IsActive', 0)->count();
        ?>
        <li class="nav-item">
            <a class="nav-link d-flex align-items-center justify-content-between {{ Request::is('admin/panding-review*') ? 'active' : '' }}"
                href="{{ url('/admin/panding-review') }}">
                <div class="d-flex align-items-center">
                    <i class="ti ti-star nav-icon fs-4 me-2"></i>
                    <span class="nav-text text">Pending Reviews</span>
                </div>

                {{-- Badge logic here --}}
                @if ($pendingReviewCount > 0)
                    <span class="badge bg-danger rounded-pill ml-auto" style="font-size: 10px;">
                        {{ $pendingReviewCount }}
                    </span>
                @endif
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link d-flex align-items-center {{ Request::is('admin/payment-detail/view*') ? 'active' : '' }}"
                href="{{ url('/admin/payment-detail/view') }}">
                <i class="ti ti-credit-card nav-icon fs-4 me-2"></i>
                <span class="nav-text text">Payments</span>
            </a>
        </li>

       
    </ul>
</div>

<script>
    // JS se bhi handle kar lete hain extra safety ke liye
    document.addEventListener("DOMContentLoaded", function() {
        var currentUrl = window.location.href;
        document.querySelectorAll('.nav-link').forEach(function(link) {
            if (link.href === currentUrl) {
                link.classList.add('active');
            }
        });
    });
</script>
