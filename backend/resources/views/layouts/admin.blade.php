<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="author" content="Codescandy" />

    <title>@yield('title', config('app.name', 'Fintrick') . ' - Admin Control Panel')</title> 
    <meta name="theme-color" content="#ffffff" />

    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="57x57" href="{{ asset('assets/images/logo/favicon.png') }}">
    <link rel="icon" type="image/svg+xml" href="{{ asset('assets/images/logo/favicon.svg') }}">
    <link rel="icon" type="image/png" href="{{ asset('assets/images/logo/favicon.png') }}">

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

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet">

    <!-- Vendor CSS -->
    <link rel="stylesheet" href="{{ asset('assets/libs/simplebar/dist/simplebar.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/libs/swiper/swiper-bundle.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/libs/@tabler/icons-webfont/tabler-icons.min.css') }}">
    <!-- Theme CSS -->
    <link rel="stylesheet" href="{{ asset('assets/css/theme.min.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/libs/dropzone/dist/dropzone.css') }}">
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    @stack('styles')
    <style>
        /* Editor border highlight when invalid */
        .is-invalid .ql-container,
        .is-invalid .ql-toolbar {
            border-color: #dc3545 !important;
        }

        /* Quill Editor List Reset & Single Marker Fix */
        .ql-editor ol, .ql-editor ul {
            padding-left: 0 !important;
            counter-reset: ql-counter;
        }
        .ql-editor ol > li, .ql-editor ul > li {
            list-style-type: none !important;
            position: relative;
            padding-left: 1.5em !important;
        }
        .ql-editor ol > li[data-list="bullet"]::before,
        .ql-editor ul > li[data-list="bullet"]::before {
            content: "\2022" !important;
            position: absolute;
            left: 0;
            top: 0;
            font-weight: bold;
        }
        .ql-editor ol > li[data-list="ordered"],
        .ql-editor ul > li[data-list="ordered"] {
            counter-increment: ql-counter;
        }
        .ql-editor ol > li[data-list="ordered"]::before,
        .ql-editor ul > li[data-list="ordered"]::before {
            content: counter(ql-counter, decimal) "." !important;
            position: absolute;
            left: 0;
            top: 0;
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

        /* Dark/Light Adaptive Classes */
        .bg-light-subtle {
            background-color: var(--bs-tertiary-bg) !important;
        }

        .upload-container {
            background-color: var(--bs-secondary-bg);
            border-color: var(--bs-border-color) !important;
            transition: all 0.3s ease;
        }

        .upload-container:hover {
            border-color: var(--bs-primary) !important;
            background-color: var(--bs-tertiary-bg);
        }

        /* Modal Glass Effect for Dark Mode */
        [data-bs-theme="dark"] .modal-content {
            background-color: rgba(30, 30, 35, 0.95);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        /* Remove focus outline, use subtle shadow instead */
        .form-control:focus {
            box-shadow: none;
        }

        .input-group:focus-within {
            ring: 2px solid var(--bs-primary-border-subtle);
            border-color: var(--bs-primary) !important;
        }

        #page-preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            /* White glass effect */
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }

        .loader-content {
            text-align: center;
        }

        /* --- Skeleton Shimmer Effect --- */
        .skeleton {
            background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
            background-size: 200% 100%;
            animation: 1.5s shine linear infinite;
            border-radius: 4px;
        }

        .skeleton-text {
            height: 12px;
            margin: 5px 0;
            width: 100%;
        }

        .skeleton-avatar {
            height: 30px;
            width: 30px;
            border-radius: 50%;
        }

        @keyframes shine {
            to {
                background-position-x: -200%;
            }
        }

        /* --- Loading Overlay --- */
        .table-container {
            position: relative;
        }

        /* Table ke wrapper pe lagana hai */

        .table-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(2px);
            display: flex;
            justify-content: center;
            padding-top: 50px;
            /* Spinner thoda upar dikhega */
            z-index: 10;
        }

        /* --- Final Ultra Colorful Neon Loader (Clean & Aligned) --- */
        #page-preloader {
            position: fixed;
            inset: 0;
            background: #0f172a;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            transition: all 0.8s cubic-bezier(0.77, 0, 0.175, 1);
        }

        .premium-loader-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
        }

        /* 3D Cube Styling & Animation */
        .glass-cube {
            position: relative;
            width: 70px;
            height: 70px;
            transform-style: preserve-3d;
            animation: rotateCube 2.5s infinite linear;
            margin-bottom: 25px;
        }

        .cube-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(5px);
            border-radius: 15px;
            border: 3px solid transparent;
        }

        .cube-face:nth-child(1) {
            transform: translateZ(35px);
            background: rgba(236, 72, 153, 0.15);
            border-color: #ec4899;
            box-shadow: 0 0 20px #ec4899, inset 0 0 10px #ec4899;
        }

        .cube-face:nth-child(2) {
            transform: rotateY(180deg) translateZ(35px);
            background: rgba(168, 85, 247, 0.15);
            border-color: #a855f7;
            box-shadow: 0 0 20px #a855f7, inset 0 0 10px #a855f7;
        }

        .cube-face:nth-child(3) {
            transform: rotateY(90deg) translateZ(35px);
            background: rgba(59, 130, 246, 0.15);
            border-color: #3b82f6;
            box-shadow: 0 0 20px #3b82f6, inset 0 0 10px #3b82f6;
        }

        .cube-face:nth-child(4) {
            transform: rotateY(-90deg) translateZ(35px);
            background: rgba(34, 211, 238, 0.15);
            border-color: #22d3ee;
            box-shadow: 0 0 20px #22d3ee, inset 0 0 10px #22d3ee;
        }

        @keyframes rotateCube {
            0% {
                transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
            }

            100% {
                transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
            }
        }

        /* Brand Text Styling */
        .brand-text {
            font-size: 2.2rem;
            font-weight: 900;
            margin: 10px 0;
        }

        .brand-text span {
            display: inline-block;
            animation: bounce 1s infinite alternate;
        }

        .c1 {
            color: #ff5e62;
        }

        .c2 {
            color: #ff9966;
        }

        .c3 {
            color: #f2994a;
        }

        .c4 {
            color: #27ae60;
        }

        .c5 {
            color: #2980b9;
        }

        .c6 {
            color: #8e44ad;
        }

        .c7 {
            color: #ec4899;
        }

        .c8 {
            color: #22d3ee;
        }

        .brand-text .karo {
            color: #ffffff;
            font-weight: 300;
            font-size: 1.5rem;
            margin-left: 5px;
            animation: none;
            opacity: 0.8;
        }

        @keyframes bounce {
            to {
                transform: translateY(-10px);
                text-shadow: 0 0 15px currentColor;
            }
        }

        /* Progress Bar (Full 0 to 100%) */
        .progress-bar-wrap {
            width: 280px;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            margin-top: 20px;
            overflow: hidden;
            position: relative;
        }

        .progress-line {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background: linear-gradient(90deg, #ec4899, #a855f7, #3b82f6, #22d3ee);
            background-size: 200% 100%;
            border-radius: 20px;
            animation: fullProgress 2s infinite ease-in-out, shimmer 1.5s infinite linear;
        }

        @keyframes fullProgress {
            0% {
                width: 0%;
                left: 0;
            }

            45%,
            55% {
                width: 100%;
                left: 0;
            }

            95% {
                width: 0%;
                left: 100%;
            }

            100% {
                width: 0%;
                left: 0;
            }
        }

        @keyframes shimmer {
            0% {
                background-position: 0% 50%;
            }

            100% {
                background-position: 100% 50%;
            }
        }

        .loading-status {
            color: #64748b;
            font-size: 0.75rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-top: 15px;
            font-weight: 600;
        }
    </style>
</head>

<body>
    <div id="page-preloader">
        <div class="premium-loader-container">
            <div class="glass-cube">
                <div class="cube-face"></div>
                <div class="cube-face"></div>
                <div class="cube-face"></div>
                <div class="cube-face"></div>
            </div>

            <div class="brand-loader">
                <h2 class="brand-text">
                    <span class="c1">C</span><span class="c2">A</span><span class="c3">R</span><span
                        class="c4">T</span><span class="c5">N</span><span class="c6">O</span><span class="c7">V</span><span class="c8">A</span>
                </h2>
                <div class="progress-bar-wrap">
                    <div class="progress-line"></div>
                </div>
            </div>

            <p class="loading-status">Syncing with server....</p>
        </div>
    </div>
    <div>
        @include('layouts.sidebar')
        @include('layouts.offcanvas')
        <!-- Main Content -->
        <div id="content" class="position-relative h-100">
            @include('layouts.header')
            @yield('content')
        </div>
    </div>
    <!-- Libs JS -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="{{ asset('assets/libs/bootstrap/dist/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('assets/libs/simplebar/dist/simplebar.min.js') }}"></script>

    <!-- Vendor JS -->
    <script src="{{ asset('assets/libs/apexcharts/dist/apexcharts.min.js') }}"></script>
    <script src="{{ asset('assets/libs/swiper/swiper-bundle.min.js') }}"></script>

    <!-- Theme JS -->
    <script src="{{ asset('assets/js/theme.min.js') }}"></script>
    <script src="{{ asset('assets/js/vendors/sidebarnav.js') }}"></script>

    <!-- Page Level Scripts -->
    <script src="{{ asset('assets/js/vendors/chart.js') }}"></script>
    <script src="{{ asset('assets/js/vendors/swiper.js') }}"></script>

    <!-- flatpickr -->
    <script src="{{ asset('assets/libs/flatpickr/dist/flatpickr.min.js') }}"></script>
    <script src="{{ asset('assets/js/vendors/flatpickr.js') }}"></script>
    <!-- quill js -->
    <script src="{{ asset('assets/libs/quill/dist/quill.js') }}"></script>
    <!-- popper js -->
    <script src="{{ asset('assets/libs/%40popperjs/core/dist/umd/popper.min.js') }}"></script>
    <!-- tippy js -->
    <script src="{{ asset('assets/libs/tippy.js/dist/tippy-bundle.umd.min.js') }}"></script>
    <script src="{{ asset('assets/js/vendors/tippy.js') }}"></script>
    <script src="{{ asset('assets/libs/list.js/dist/list.min.js') }}"></script>
    <script src="{{ asset('assets/js/vendors/list.js') }}"></script>
    <script src="{{ asset('assets/libs/choices.js/public/assets/scripts/choices.min.js') }}"></script>
    <script src="{{ asset('assets/js/vendors/choice.js') }}"></script>
    <script src="{{ asset('assets/js/vendors/checkbox.js') }}"></script>
    <!-- password js -->
    <script src="{{ asset('assets/js/vendors/password.js') }}"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="{{ asset('assets/js/vendors/editor.js') }}"></script>
    <script src="{{ asset('assets/libs/dropzone/dist/dropzone-min.js') }}"></script>

    <script>
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
    </script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const loader = document.getElementById("page-preloader");
            if (loader) {
                setTimeout(() => {
                    loader.style.opacity = "0";
                    loader.style.transform = "scale(1.1)"; // Thoda zoom out effect
                    setTimeout(() => {
                        loader.style.display = "none";
                    }, 500);
                }, 800); // 0.8 sec tak dikhega
            }
        });
    </script>
    {{-- <script>
        function tableLoading(tableId, mode = 'overlay') {
            let table = $(tableId);
            let container = table.closest('.table-responsive'); // Dasher mein table-responsive hota hi hai

            if (mode === 'skeleton') {
                // --- SKELETON MODE (1st Time Load) ---
                let columnCount = table.find('thead th').length;
                let skeletonHtml = '';
                for (let i = 0; i < 6; i++) { // 6 rows dikhayega
                    skeletonHtml += '<tr>';
                    for (let j = 0; j < columnCount; j++) {
                        let type = (j === 0) ? 'skeleton-avatar' : 'skeleton-text';
                        skeletonHtml += `<td><div class="skeleton ${type}"></div></td>`;
                    }
                    skeletonHtml += '</tr>';
                }
                table.find('tbody').html(skeletonHtml);
            } else {
                // --- OVERLAY MODE (Search/Filter ke liye) ---
                if (container.find('.table-overlay').length === 0) {
                    container.prepend(`
                <div class="table-overlay">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>
            `);
                }
            }
        }

        function stopTableLoading(tableId) {
            $(tableId).closest('.table-responsive').find('.table-overlay').remove();
        }
    </script> --}}
    @stack('scripts')
</body>


</html>
