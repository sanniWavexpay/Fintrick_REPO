 <div class="offcanvasNav offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample"
     aria-labelledby="offcanvasExampleLabel">
     <div class="offcanvas-header">

         <a class='d-flex align-items-center gap-2' href='index.html'>
             <img src="assets/images/brand/logo/logo-icon.svg" alt="" />
             <span class="fw-bold fs-4  site-logo-text">Dasher</span>
         </a>

         <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
     </div>
     <div class="offcanvas-body p-0">
         <ul class="navbar-nav flex-column">
             <li class="nav-item">
                 <a class="nav-link d-flex align-items-center {{ Request::is('dashboard') ? 'active' : '' }}"
                     href="{{ url('/') }}">
                     <i class="ti ti-smart-home nav-icon fs-4 me-2"></i>
                     <span class="nav-text text">Dashboard</span>
                 </a>
             </li>

             <li class="nav-item">
                 <a class="nav-link d-flex align-items-center {{ Request::is('customers*') ? 'active' : '' }}"
                     href="{{ url('admin/customers') }}">
                     <i class="ti ti-users nav-icon fs-4 me-2"></i>
                     <span class="nav-text text">Customers</span>
                 </a>
             </li>

             <li class="nav-item">
                 <a class="nav-link d-flex align-items-center {{ Request::is('categories*') ? 'active' : '' }}"
                     href="{{ url('admin/categories') }}">
                     <i class="ti ti-category nav-icon fs-4  me-2"></i>
                     <span class="nav-text text">Category & Sub</span>
                 </a>
             </li>

             <li class="nav-item">
                 <a class="nav-link d-flex align-items-center {{ Request::is('products*') ? 'active' : '' }}"
                     href="{{ url('admin/products') }}">
                     <i class="ti ti-shoe nav-icon fs-4 me-2"></i>
                     <span class="nav-text text">Products</span>
                 </a>
             </li>

             <li class="nav-item">
                 <a class="nav-link d-flex align-items-center {{ Request::is('orders*') ? 'active' : '' }}"
                     href="{{ url('admin/orders') }}">
                     <i class="ti ti-shopping-cart nav-icon fs-4 me-2"></i>
                     <span class="nav-text text">Orders</span>
                 </a>
             </li>

             <li class="nav-item">
                 <a class="nav-link d-flex align-items-center {{ Request::is('attributes*') ? 'active' : '' }}"
                     href="{{ url('/attributes') }}">
                     <i class="ti ti-settings-automation nav-icon fs-4 me-2"></i>
                     <span class="nav-text text">Attributes</span>
                 </a>
             </li>

             <li class="nav-item">
                 <a class="nav-link d-flex align-items-center {{ Request::is('coupons*') ? 'active' : '' }}"
                     href="{{ url('/coupons') }}">
                     <i class="ti ti-ticket nav-icon fs-4 me-2"></i>
                     <span class="nav-text text">Create Coupon</span>
                 </a>
             </li>

             <li class="nav-item">
                 <a class="nav-link d-flex align-items-center {{ Request::is('reviews*') ? 'active' : '' }}"
                     href="{{ url('/reviews') }}">
                     <i class="ti ti-star nav-icon fs-4 me-2"></i>
                     <span class="nav-text text">Pending Reviews</span>
                 </a>
             </li>

             <li class="nav-item">
                 <a class="nav-link d-flex align-items-center {{ Request::is('payments*') ? 'active' : '' }}"
                     href="{{ url('/payments') }}">
                     <i class="ti ti-credit-card nav-icon fs-4 me-2"></i>
                     <span class="nav-text text">Payments</span>
                 </a>
             </li>
         </ul>
     </div>
 </div>
