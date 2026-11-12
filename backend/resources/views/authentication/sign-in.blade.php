<!DOCTYPE html>
<html lang="en">
<meta http-equiv="content-type" content="text/html;charset=UTF-8" />

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta content="Codescandy" name="author">
    <title>Sign In - {{ config('app.name', 'Fintrick') }} Admin</title>
    <!-- Favicon icon-->
    <link rel="apple-touch-icon" sizes="57x57" href="{{ asset('assets/images/logo/favicon.png') }}" />
    <link rel="apple-touch-icon" sizes="60x60" href="{{ asset('assets/images/logo/favicon.png') }}" />
    <link rel="apple-touch-icon" sizes="72x72" href="{{ asset('assets/images/logo/favicon.png') }}" />
    <link rel="apple-touch-icon" sizes="76x76" href="{{ asset('assets/images/logo/favicon.png') }}" />
    <link rel="apple-touch-icon" sizes="114x114" href="{{ asset('assets/images/logo/favicon.png') }}" />
    <link rel="apple-touch-icon" sizes="120x120" href="{{ asset('assets/images/logo/favicon.png') }}" />
    <link rel="apple-touch-icon" sizes="144x144" href="{{ asset('assets/images/logo/favicon.png') }}" />
    <link rel="apple-touch-icon" sizes="152x152" href="{{ asset('assets/images/logo/favicon.png') }}" />
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('assets/images/logo/favicon.png') }}" />
    <link rel="icon" type="image/png" sizes="192x192" href="{{ asset('assets/images/logo/favicon.png') }}" />
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('assets/images/logo/favicon.png') }}" />
    <link rel="icon" type="image/png" sizes="96x96" href="{{ asset('assets/images/logo/favicon.png') }}" />
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('assets/images/logo/favicon.png') }}" />

    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta name="msapplication-TileImage" content="{{ asset('assets/images/logo/favicon.png') }}" />
    <meta name="theme-color" content="#ffffff" />
    <!-- Color modes -->
    <script src="{{ asset('assets/js/vendors/color-modes.js') }}"></script>
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
    <link rel="stylesheet" href="{{ asset('assets/libs/simplebar/dist/simplebar.min.css') }}" />
    <link rel="stylesheet" href="{{ asset('assets/libs/%40tabler/icons-webfont/tabler-icons.min.css') }}" />

    <!-- Theme CSS -->
    <link rel="stylesheet" href="{{ asset('assets/css/theme.min.css') }}">

    <style>
        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .compact-auth-card {
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 15px 40px rgba(197, 155, 39, 0.25);
            max-width: 850px;
            width: 100%;
            border: 1px solid #c59b27;
        }

        .brand-section {
            background: linear-gradient(135deg, #47474eff 0%, #38383aff 100%);
            padding: 40px;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-right: 1px solid rgba(197, 155, 39, 0.3);
        }

        .feature-list-item {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            font-size: 0.9rem;
            background: rgba(255, 255, 255, 0.08);
            padding: 10px 15px;
            border-radius: 10px;
            border: 1px solid rgba(197, 155, 39, 0.2);
        }

        .form-section {
            padding: 40px;
        }

        .form-control {
            padding: 10px 15px;
            font-size: 0.9rem;
            border-radius: 8px;
            background-color: #f9fbff;
        }

        .btn-signup, .btn-primary {
            padding: 10px;
            font-weight: 800;
            border-radius: 8px;
            background: linear-gradient(135deg, #c59b27 0%, #dfb15b 50%, #b8860b 100%) !important;
            border: none !important;
            color: #18181b !important;
            box-shadow: 0 4px 15px rgba(197, 155, 39, 0.3) !important;
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

        /* Toast Design Upgrade */
        .swal2-toast {
            background: #ffffff !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
            padding: 12px 16px !important;
        }

        /* Success Toast Border */
        .swal2-toast.swal2-icon-success {
            border-left: 5px solid #10b981 !important;
        }

        /* Error Toast Border */
        .swal2-toast.swal2-icon-error {
            border-left: 5px solid #ef4444 !important;
        }

        .swal2-title {
            font-size: 0.95rem !important;
            color: #1f2937 !important;
            font-weight: 600 !important;
        }

        .swal2-timer-progress-bar {
            background: rgba(0, 0, 0, 0.05) !important;
        }

        /* Premium Slider Captcha */
        .captcha-container {
            background: #f1f5f9;
            border-radius: 12px;
            position: relative;
            height: 50px;
            width: 100%;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            margin-bottom: 20px;
            user-select: none;
        }

        .captcha-text {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.85rem;
            color: #64748b;
            z-index: 1;
        }

        .captcha-slider {
            position: absolute;
            height: 40px;
            width: 40px;
            top: 5px;
            left: 5px;
            background: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 3;
            transition: background 0.3s;
        }

        .captcha-slider:hover {
            background: #f8fafc;
        }

        .captcha-slider i {
            color: #4f46e5;
            font-size: 1.2rem;
        }

        .captcha-track {
            position: absolute;
            height: 100%;
            width: 0;
            top: 0;
            left: 0;
            background: linear-gradient(90deg, #4f46e5, #7c3aed);
            z-index: 2;
        }

        .captcha-container.verified .captcha-text {
            color: 000;
            font-weight: 600;
            z-index: 3;
        }

        .captcha-container.verified .captcha-slider {
            cursor: default;
        }
    </style>
</head>

<body>
    <div class="compact-auth-card ">
        <div class="row g-0">
            <div class="col-lg-5 d-none d-lg-flex brand-section pt-0">
                <a class=' fw-bold d-flex align-items-center ' href='{{ url('/') }}'>
                    <img src="{{ asset('assets/images/logo/shopLogo.png') }}" width="100%" alt="logo" />
                </a>

                <h2 class="fw-bold fs-4 text-white mb-2 text-center">Shop with Confidence!</h2>
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
                    <h1 class="mb-1">Welcome Back</h1>
                </div>
                <form class="needs-validation loginForm mb-6" novalidate autocomplete="off">
                    <input type="text" name="fakeusernameremembered" style="display:none">
                    <input type="password" name="fakepasswordremembered" style="display:none">
                    <div class="mb-3">
                        <label for="signinEmailInput" class="form-label">
                            Email
                            <span class="text-danger">*</span>
                        </label>
                        <input type="email" name="login_email" class="form-control" id="signinEmailInput" required
                            autocomplete="off" />
                        <div class="invalid-feedback">Please enter email.</div>
                    </div>
                    <div class="mb-3">
                        <label for="formSigninPassword" class="form-label">Password</label>
                        <div class="password-field position-relative">
                            <input type="password" name="login_password" class="form-control fakePassword"
                                id="formSigninPassword" required autocomplete="off" />
                            <span><i class="ti ti-eye-off passwordToggler"></i></span>
                            <div class="invalid-feedback">Please enter password.</div>
                        </div>
                    </div>
                    <div class="captcha-wrapper mb-3">
                        <label class="form-label">Security Verification <span class="text-danger">*</span></label>
                        <div class="captcha-container" id="captchaContainer">
                            <div class="captcha-text text-black" id="captchaText">Slide to verify</div>
                            <div class="captcha-track" id="captchaTrack"></div>
                            <div class="captcha-slider" id="captchaHandle">
                                <i class="ti ti-chevrons-right" id="captchaIcon"></i>
                            </div>
                        </div>
                        <input type="hidden" id="captchaVerified" value="0">
                    </div>
                    <div class="mb-4 d-flex align-items-center justify-content-between">
                        <div class="form-check">
                            {{-- <input class="form-check-input" type="checkbox" id="rememberMeCheckbox" />
                            <label class="form-check-label" for="rememberMeCheckbox">Remember
                                me</label> --}}
                        </div>
                        {{-- <div><a class='text-primary' href='{{ route('admin.forgetPassword') }}'>Forgot Password</a>
                        </div> --}}
                    </div>

                    <div class="d-grid">
                        <button class="btn btn-primary" type="submit" id="loginButton">
                            <span class="button-text">Sign In</span>
                            <span class="spinner-border spinner-border-sm d-none" role="status"
                                aria-hidden="true"></span>
                        </button>
                    </div>
                </form>

                {{-- <p class="mb-0">
                    Don’t have an account yet?
                    <a class='text-primary' href='{{ route('admin.register') }}'>Register here</a>
                </p> --}}
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
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

    <script src="{{ asset('assets/libs/bootstrap/dist/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('assets/libs/simplebar/dist/simplebar.min.js') }}"></script>

    <!-- Theme JS -->
    <script src="{{ asset('assets/js/theme.min.js') }}"></script>

    <script src="{{ asset('assets/js/vendors/password.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
    </script>
    <script>
        $(document).ready(function() {
            let isVerified = false;
            const container = $("#captchaContainer");
            const handle = $("#captchaHandle");
            const track = $("#captchaTrack");
            const text = $("#captchaText");
            const icon = $("#captchaIcon");
            const maxSlide = container.width() - handle.width() - 10;

            // Slide Logic
            handle.on("mousedown touchstart", function(e) {
                if (isVerified) return;

                const startX = e.type === "mousedown" ? e.pageX : e.originalEvent.touches[0].pageX;

                $(document).on("mousemove.captcha touchmove.captcha", function(moveEvent) {
                    const currentX = moveEvent.type === "mousemove" ? moveEvent.pageX : moveEvent
                        .originalEvent.touches[0].pageX;
                    let diff = currentX - startX;

                    if (diff < 0) diff = 0;
                    if (diff > maxSlide) diff = maxSlide;

                    handle.css("left", diff + 5 + "px");
                    track.css("width", diff + 20 + "px");

                    if (diff >= maxSlide - 5) {
                        verifySuccess();
                    }
                });

                $(document).on("mouseup.captcha touchend.captcha", function() {
                    $(document).off(".captcha");
                    if (!isVerified) {
                        handle.animate({
                            left: "5px"
                        }, 200);
                        track.animate({
                            width: "0"
                        }, 200);
                    }
                });
            });

            function verifySuccess() {
                isVerified = true;
                $("#captchaVerified").val("1");
                container.addClass("verified");
                handle.css("left", maxSlide + 5 + "px");
                track.css("width", "100%");
                text.text("Verification Successful");
                icon.removeClass("ti-chevrons-right").addClass("ti-check");
                handle.css("background", "transparent");
                handle.css("box-shadow", "none");
                icon.css("color", "white");
            }

            // Updated Login Form Submit
            $(".loginForm").on("submit", function(e) {
                e.preventDefault();

                // Check if captcha is verified
                if (!isVerified) {
                    Toast.fire({
                        icon: 'error',
                        title: 'Please complete the slider verification'
                    });
                    return;
                }

                let email = $("#signinEmailInput").val();
                let password = $("#formSigninPassword").val();
                let btn = $("#loginButton");
                let btnText = btn.find(".button-text");
                let spinner = btn.find(".spinner-border");

                $.ajax({
                    url: "{{ route('admin.loginUser') }}",
                    method: "POST",
                    data: {
                        email: email,
                        password: password,
                        _token: '{{ csrf_token() }}'
                    },
                    beforeSend: function() {
                        btn.prop('disabled', true);
                        btnText.text('Logging in...');
                        spinner.removeClass('d-none');
                    },
                    success: function(response) {
                        if (response.status === 'success') {
                            Toast.fire({
                                icon: 'success',
                                title: response.message
                            }).then(() => {
                                window.location.href = response.redirect;
                            });
                        } else {
                            Toast.fire({
                                icon: 'error',
                                title: response.message
                            });
                            resetButton(btn, btnText, spinner);
                        }
                    },
                    error: function() {
                        Toast.fire({
                            icon: 'error',
                            title: "Invalid Credentials or Server Error"
                        });
                        resetButton(btn, btnText, spinner);
                    }
                });
            });
        });
    </script>
</body>

</html>
