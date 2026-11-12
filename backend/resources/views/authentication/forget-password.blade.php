<!DOCTYPE html>
<html lang="en">
<meta http-equiv="content-type" content="text/html;charset=UTF-8" />

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta content="Codescandy" name="author">
    <title>Forgot Password | {{ config('app.name', 'Fintrick') }} Admin</title>
    <!-- Favicon icon-->
    <link rel="apple-touch-icon" sizes="57x57" href="../../assets/images/favicon/apple-icon-57x57.png" />
    <link rel="apple-touch-icon" sizes="60x60" href="../../assets/images/favicon/apple-icon-60x60.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="../../assets/images/favicon/apple-icon-72x72.png" />
    <link rel="apple-touch-icon" sizes="76x76" href="../../assets/images/favicon/apple-icon-76x76.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="../../assets/images/favicon/apple-icon-114x114.png" />
    <link rel="apple-touch-icon" sizes="120x120" href="../../assets/images/favicon/apple-icon-120x120.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="../../assets/images/favicon/apple-icon-144x144.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="../../assets/images/favicon/apple-icon-152x152.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="../../assets/images/favicon/apple-icon-180x180.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="../../assets/images/favicon/android-icon-192x192.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="../../assets/images/favicon/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="96x96" href="../../assets/images/favicon/favicon-96x96.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="../../assets/images/favicon/favicon-16x16.png" />

    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta name="msapplication-TileImage" content="../../assets/images/favicon/ms-icon-144x144.png" />
    <meta name="theme-color" content="#ffffff" />
    <!-- Color modes -->
    <script src="../../assets/js/vendors/color-modes.js"></script>
    <script>
        if (localStorage.getItem('sidebarExpanded') === 'false') {
            document.documentElement.classList.add('collapsed');
            document.documentElement.classList.remove('expanded');
        } else {
            document.documentElement.classList.remove('collapsed');
            document.documentElement.classList.add('expanded');
        }
    </script>
    <!-- Libs CSS -->
    <link rel="preconnect" href="https://fonts.googleapis.com/" />
    <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin />
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800&amp;display=swap" />
    <link rel="stylesheet" href="../../assets/libs/simplebar/dist/simplebar.min.css" />
    <link rel="stylesheet" href="../../assets/libs/%40tabler/icons-webfont/tabler-icons.min.css" />

    <!-- Theme CSS -->
    <link rel="stylesheet" href="../../assets/css/theme.min.css">

    <style>
        /* Full Screen Center Alignment */
        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            /* Vertical Center */
            justify-content: center;
            /* Horizontal Center */
            padding: 20px;
        }

        /* Compact Card Styling */
        .compact-auth-card {
            /* background: #ffffff; */
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 40px #00c2ff;
            max-width: 850px;
            width: 100%;
            /* border: none; */
            border: 1px solid #00c2ff;
        }

        /* Left Side Polish */
        .brand-section {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            padding: 40px;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .feature-list-item {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            font-size: 0.9rem;
            background: rgba(255, 255, 255, 0.1);
            padding: 10px 15px;
            border-radius: 10px;
        }

        /* Right Side / Form Side */
        .form-section {
            padding: 40px;
        }

        .form-control {
            padding: 10px 15px;
            font-size: 0.9rem;
            border-radius: 8px;
            background-color: #f9fbff;
        }

        .btn-signup {
            padding: 10px;
            font-weight: 600;
            border-radius: 8px;
        }

        .logo-icon-wrapper {
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>

<body>
    <div class="compact-auth-card ">
        <div class="row g-0">
            <div class="col-lg-5 d-none d-lg-flex brand-section">
                <a class='fs-2 fw-bold d-flex align-items-center ' href='../../index.html'>
                    <img src="../../assets/images/brand/logo/logo-icon.svg" alt="" />
                    <span>{{ config('app.name', 'Fintrick') }}</span>
                </a>

                <h2 class="fw-bold text-white mb-2">Shop with Confidence!</h2>
                <p class="text-white-50 small mb-4">Join over 2 million shoppers and get access to exclusive deals every
                    day.</p>

                <div class="feature-list">
                    <div class="feature-list-item">
                        <i class="ti ti-truck-delivery fs-4 text-white"></i>
                        <span>Free Delivery on first 3 orders</span>
                    </div>
                    <div class="feature-list-item">
                        <i class="ti ti-rosette-discount fs-4 text-white"></i>
                        <span>Up to 40% Member-only discounts</span>
                    </div>
                    <div class="feature-list-item">
                        <i class="ti ti-refresh fs-4 text-white"></i>
                        <span>Hassle-free 30 days returns</span>
                    </div>

                </div>

                <div class="mt-5 p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10">
                    <div class="d-flex align-items-center gap-3">
                        <div class="avatar-group d-flex">
                            <div class="bg-light rounded-circle border border-2 border-primary d-flex align-items-center justify-content-center"
                                style="width: 32px; height: 32px;">
                                <i class="ti ti-user-check text-primary small"></i>
                            </div>
                        </div>
                        <div>
                            <p class="mb-0 text-white fw-bold small">Verified Shoppers</p>
                            <p class="mb-0 text-white-50 extra-small" style="font-size: 0.75rem;">10k+ reviews with
                                4.8/5 rating</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-7 col-12 form-section">
                <div class="mb-4">
                    <h1 class="mb-1">Forgot Password</h1>
                    <p class="mb-0 text-secondary">No worries, we will send you reset instruction.</p>
                </div>

                <form class="needs-validation mb-5" novalidate>
                    <div class="mb-3">
                        <label for="forgetEmailInput" class="form-label">
                            Email
                            <span class="text-danger">*</span>
                        </label>
                        <input type="email" class="form-control" id="forgetEmailInput"
                            placeholder="Enter your email" required />
                        <div class="invalid-feedback">Please enter email.</div>
                    </div>
                    <div class="d-grid">
                        <button class="btn btn-primary" type="submit">Reset Password</button>
                    </div>
                </form>
                <div class="text-center">
                    <a href='{{ route('admin.login') }}'>
                        <span>Back to Login</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
    </div>
    <div class="position-absolute end-0 bottom-0 m-4">
        <div class="dropdown">
            <button class="btn btn-light btn-icon rounded-circle d-flex align-items-center" type="button"
                aria-expanded="false" data-bs-toggle="dropdown" aria-label="Toggle theme (auto)">
                <i class="bi theme-icon-active lh-1"><i class="bi theme-icon bi-sun-fill"></i></i>
                <span class="visually-hidden bs-theme-text">Toggle theme</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow">
                <li>
                    <button type="button" class="dropdown-item d-flex align-items-center active"
                        data-bs-theme-value="light" aria-pressed="true">
                        <i class="ti theme-icon ti ti-sun"></i>
                        <span class="ms-2">Light</span>
                    </button>
                </li>
                <li>
                    <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="dark"
                        aria-pressed="false">
                        <i class="ti theme-icon ti-moon-stars"></i>
                        <span class="ms-2">Dark</span>
                    </button>
                </li>
                <li>
                    <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="auto"
                        aria-pressed="false">
                        <i class="ti theme-icon ti-circle-half-2"></i>
                        <span class="ms-2">Auto</span>
                    </button>
                </li>
            </ul>
        </div>
    </div>
    </div>
    <!-- Libs JS -->
    <script src="../../assets/libs/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../assets/libs/simplebar/dist/simplebar.min.js"></script>

    <!-- Theme JS -->
    <script src="../../assets/js/theme.min.js"></script>

    <script src="../../assets/js/vendors/password.js"></script>
</body>

</html>
