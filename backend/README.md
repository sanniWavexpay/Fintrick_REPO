<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

```
backend
├─ .editorconfig
├─ app
│  ├─ Http
│  │  └─ Controllers
│  │     ├─ AdminController.php
│  │     ├─ ApiController.php
│  │     └─ Controller.php
│  ├─ Models
│  │  └─ User.php
│  └─ Providers
│     └─ AppServiceProvider.php
├─ artisan
├─ bootstrap
│  ├─ app.php
│  ├─ cache
│  │  ├─ config.php
│  │  ├─ events.php
│  │  ├─ packages.php
│  │  └─ services.php
│  └─ providers.php
├─ composer.json
├─ composer.lock
├─ config
│  ├─ app.php
│  ├─ auth.php
│  ├─ cache.php
│  ├─ database.php
│  ├─ filesystems.php
│  ├─ logging.php
│  ├─ mail.php
│  ├─ queue.php
│  ├─ sanctum.php
│  ├─ services.php
│  └─ session.php
├─ database
│  ├─ database.sqlite
│  ├─ factories
│  │  └─ UserFactory.php
│  ├─ migrations
│  │  ├─ 0001_01_01_000000_create_users_table.php
│  │  ├─ 0001_01_01_000001_create_cache_table.php
│  │  ├─ 0001_01_01_000002_create_jobs_table.php
│  │  ├─ 2026_02_21_120045_create_personal_access_tokens_table.php
│  │  └─ 2026_02_23_113726_create_personal_access_tokens_table.php
│  └─ seeders
│     └─ DatabaseSeeder.php
├─ package.json
├─ phpunit.xml
├─ public
│  ├─ .htaccess
│  ├─ assets
│  │  ├─ css
│  │  │  └─ theme.min.css
│  │  ├─ images
│  │  │  ├─ avatar
│  │  │  │  ├─ avatar-1.jpg
│  │  │  │  ├─ avatar-10.jpg
│  │  │  │  ├─ avatar-11.jpg
│  │  │  │  ├─ avatar-12.jpg
│  │  │  │  ├─ avatar-13.jpg
│  │  │  │  ├─ avatar-14.jpg
│  │  │  │  ├─ avatar-15.jpg
│  │  │  │  ├─ avatar-16.jpg
│  │  │  │  ├─ avatar-17.jpg
│  │  │  │  ├─ avatar-19.jpg
│  │  │  │  ├─ avatar-2.jpg
│  │  │  │  ├─ avatar-21.jpg
│  │  │  │  ├─ avatar-3.jpg
│  │  │  │  ├─ avatar-4.jpg
│  │  │  │  ├─ avatar-5.jpg
│  │  │  │  ├─ avatar-6.jpg
│  │  │  │  ├─ avatar-7.jpg
│  │  │  │  ├─ avatar-8.jpg
│  │  │  │  └─ avatar-9.jpg
│  │  │  ├─ background
│  │  │  │  ├─ profile-cover-img.jpg
│  │  │  │  └─ profile-cover.jpg
│  │  │  ├─ blog
│  │  │  │  ├─ blog-img-1.jpg
│  │  │  │  ├─ blog-img-2.jpg
│  │  │  │  ├─ blog-img-3.jpg
│  │  │  │  ├─ blog-img-4.jpg
│  │  │  │  ├─ blog-img-5.jpg
│  │  │  │  ├─ blog-img-6.jpg
│  │  │  │  └─ blog-img-7.jpg
│  │  │  ├─ brand
│  │  │  │  ├─ 3dsmax-logo.svg
│  │  │  │  ├─ dropbox-logo.svg
│  │  │  │  ├─ github-logo.svg
│  │  │  │  ├─ layers-logo.svg
│  │  │  │  ├─ logo
│  │  │  │  │  ├─ logo-2.html
│  │  │  │  │  └─ logo-icon.svg
│  │  │  │  └─ slack-logo.svg
│  │  │  ├─ category
│  │  │  │  ├─ 1770202592_shoppingkarofav.png
│  │  │  │  ├─ 1770202666_shoppingkarofav.png
│  │  │  │  ├─ 1770274336_floblo_fav.png
│  │  │  │  ├─ 1770274337_floblo_fav.png
│  │  │  │  ├─ 1770276429_Gemini_Generated_Image_rg4r3qrg4r3qrg4r-Photoroom.png
│  │  │  │  └─ 1770276466_recharegeRight.png
│  │  │  ├─ docs
│  │  │  │  └─ block-figma.html
│  │  │  ├─ ecommerce
│  │  │  │  ├─ product-1.jpg
│  │  │  │  ├─ product-10.jpg
│  │  │  │  ├─ product-2.jpg
│  │  │  │  ├─ product-3.jpg
│  │  │  │  ├─ product-4.jpg
│  │  │  │  ├─ product-5.jpg
│  │  │  │  ├─ product-6.jpg
│  │  │  │  ├─ product-7.jpg
│  │  │  │  ├─ product-8.jpg
│  │  │  │  └─ product-9.jpg
│  │  │  ├─ favicon
│  │  │  │  ├─ android-icon-192x192.png
│  │  │  │  ├─ apple-icon-114x114.png
│  │  │  │  ├─ apple-icon-120x120.png
│  │  │  │  ├─ apple-icon-144x144.png
│  │  │  │  ├─ apple-icon-152x152.png
│  │  │  │  ├─ apple-icon-180x180.png
│  │  │  │  ├─ apple-icon-57x57.png
│  │  │  │  ├─ apple-icon-60x60.png
│  │  │  │  ├─ apple-icon-72x72.png
│  │  │  │  ├─ apple-icon-76x76.png
│  │  │  │  ├─ favicon-16x16.png
│  │  │  │  ├─ favicon-32x32.png
│  │  │  │  ├─ favicon-96x96.png
│  │  │  │  └─ ms-icon-144x144.png
│  │  │  ├─ logo
│  │  │  │  ├─ shoppingkarofav.png
│  │  │  │  ├─ shoppingkarowhite.png
│  │  │  │  └─ shoppinKarologo.png
│  │  │  ├─ placeholder
│  │  │  │  ├─ placeholder-4by3.svg
│  │  │  │  └─ placeholder-img.jpg
│  │  │  ├─ placeholder.jpg
│  │  │  ├─ png
│  │  │  │  ├─ dasher-ai.png
│  │  │  │  └─ dasher-ui-bootstrap-5.jpg
│  │  │  ├─ product
│  │  │  │  ├─ 1770623188_cpay.png
│  │  │  │  ├─ 1770628402_EconomicTimes.png
│  │  │  │  ├─ 1770628630_EconomicTimes.png
│  │  │  │  ├─ 1770628671_EconomicTimes.png
│  │  │  │  ├─ 1770642779_Gemini_Generated_Image_unviw0unviw0unvi-removebg-preview.png
│  │  │  │  ├─ 1770642836_mint.png
│  │  │  │  ├─ 1770660068_2334.webp
│  │  │  │  ├─ 1770660116_Gemini_Generated_Image_unviw0unviw0unvi-removebg-preview.png
│  │  │  │  ├─ 1770660226_cpay.png
│  │  │  │  ├─ 1770660329_gpay.png
│  │  │  │  ├─ 1770660380_ppay.png
│  │  │  │  ├─ 1770660463_png-clipart-kotak-mahindra-bank-logo-horizontal-bank-logos.png
│  │  │  │  ├─ 1770660546_favicon_joydek.png
│  │  │  │  ├─ 1770660616_favze (1).png
│  │  │  │  ├─ 1770660667_imagesss (1).png
│  │  │  │  ├─ 1770661121_ChatGPT Image Nov 19, 2025, 10_50_10 AM.png
│  │  │  │  ├─ 1770662364_mobilerecharge-removebg-preview.png
│  │  │  │  ├─ 1770662414_ChatGPT Image Nov 19, 2025, 10_50_08 AM.png
│  │  │  │  ├─ 1770707127_mobilerecharge.png
│  │  │  │  ├─ 1771833061_mobilerecharge.png
│  │  │  │  ├─ 1771833210_mobilerecharge.png
│  │  │  │  ├─ 1771838836_recharge api (1).png
│  │  │  │  ├─ 1771838849_recharge api (1).png
│  │  │  │  ├─ 1771838929_recharge api (1).png
│  │  │  │  ├─ 1771839227_recharge api (1).png
│  │  │  │  └─ 1771839330_recharge api (1).png
│  │  │  ├─ reviews
│  │  │  │  ├─ 1771068073_69905aa9069bd.png
│  │  │  │  ├─ 1771068073_69905aa9071fa.png
│  │  │  │  ├─ 1771068073_69905aa9078a5.png
│  │  │  │  ├─ 1771068938_69905e0a4bac3.png
│  │  │  │  ├─ 1771069134_69905ece647ee.png
│  │  │  │  ├─ 1771069580_6990608c03b79.png
│  │  │  │  ├─ 1771069905_699061d183e36.png
│  │  │  │  ├─ 1771069905_699061d184638.png
│  │  │  │  ├─ 1771069905_699061d184cca.png
│  │  │  │  ├─ 1771069905_699061d185507.png
│  │  │  │  ├─ 1771069905_699061d185f19.png
│  │  │  │  ├─ 1771069905_699061d186741.png
│  │  │  │  ├─ 1771069905_699061d186e97.jpg
│  │  │  │  ├─ 1771069905_699061d1874a6.png
│  │  │  │  ├─ 1771069905_699061d187aa6.png
│  │  │  │  ├─ 1771069905_699061d188145.png
│  │  │  │  ├─ 1771069905_699061d18884f.png
│  │  │  │  ├─ 1771069905_699061d188dd5.png
│  │  │  │  ├─ 1771069905_699061d189367.png
│  │  │  │  ├─ 1771069905_699061d189a25.png
│  │  │  │  ├─ 1771070543_6990644f4f809.png
│  │  │  │  ├─ 1771070543_6990644f4ff8f.png
│  │  │  │  ├─ 1771070543_6990644f50572.png
│  │  │  │  ├─ 1771070543_6990644f50d96.png
│  │  │  │  ├─ 1771070594_6990648214101.png
│  │  │  │  ├─ 1771070594_6990648214942.png
│  │  │  │  ├─ 1771070632_699064a866de6.png
│  │  │  │  ├─ 1771070632_699064a8676a9.png
│  │  │  │  ├─ 1771070632_699064a867e73.png
│  │  │  │  ├─ 1771070944_699065e009502.png
│  │  │  │  ├─ 1771070944_699065e00a06b.png
│  │  │  │  ├─ 1771071032_69906638141cb.png
│  │  │  │  ├─ 1771071032_6990663814806.png
│  │  │  │  ├─ 1771071032_6990663814d85.png
│  │  │  │  ├─ 1771071032_6990663815430.png
│  │  │  │  ├─ 1771073448_69906fa8c044e.png
│  │  │  │  ├─ 1771073468_69906fbcc8467.png
│  │  │  │  ├─ 1771073497_69906fd974c81.png
│  │  │  │  ├─ 1771073497_69906fd9755d0.png
│  │  │  │  ├─ 1771073521_69906ff11a51b.png
│  │  │  │  ├─ 1771073521_69906ff11ad02.png
│  │  │  │  ├─ 1771073521_69906ff11b582.png
│  │  │  │  ├─ 1771073552_69907010d4be2.png
│  │  │  │  ├─ 1771073552_69907010d54f7.png
│  │  │  │  ├─ 1771073574_699070267cdd9.png
│  │  │  │  ├─ 1771092836_6990bb6455b56.png
│  │  │  │  ├─ 1771222086_6992b44676a3a.png
│  │  │  │  ├─ 1771222086_6992b446772cb.png
│  │  │  │  ├─ 1771222086_6992b4467793c.png
│  │  │  │  ├─ 1771222086_6992b4467803d.png
│  │  │  │  ├─ 1771222149_6992b48595a0b.png
│  │  │  │  ├─ 1771222149_6992b4859613a.png
│  │  │  │  ├─ 1771222624_6992b660beda3.png
│  │  │  │  ├─ 1771222624_6992b660bf7d9.png
│  │  │  │  ├─ 1771222645_6992b675ea02d.png
│  │  │  │  ├─ 1771222645_6992b675eaa04.png
│  │  │  │  ├─ 1771222673_6992b691cac04.png
│  │  │  │  ├─ 1771222673_6992b691cb66d.png
│  │  │  │  ├─ 1771222673_6992b691cc04f.png
│  │  │  │  ├─ 1771225218_6992c0826d76a.png
│  │  │  │  ├─ 1771225218_6992c0826e232.png
│  │  │  │  ├─ 1771225218_6992c0826ebd8.png
│  │  │  │  ├─ 1771225218_6992c0826f3e4.png
│  │  │  │  ├─ 1771226141_6992c41de6249.png
│  │  │  │  ├─ 1771226141_6992c41de6c62.png
│  │  │  │  ├─ 1771226141_6992c41de75cc.png
│  │  │  │  ├─ 1771226170_6992c43ac710c.png
│  │  │  │  └─ 1771226170_6992c43ac799e.png
│  │  │  ├─ slide-img
│  │  │  │  ├─ carousel-img-1.jpg
│  │  │  │  ├─ carousel-img-2.jpg
│  │  │  │  └─ carousel-img-3.jpg
│  │  │  ├─ subcategory
│  │  │  │  ├─ 1770285349_imagess (1).png
│  │  │  │  ├─ 1770286172_imagess (1).png
│  │  │  │  ├─ 1770286499_imagess (1).png
│  │  │  │  ├─ 1770289088_imagess (1).png
│  │  │  │  └─ 1770289099_image (1).png
│  │  │  ├─ svg
│  │  │  │  ├─ 404.svg
│  │  │  │  ├─ americanexpress.svg
│  │  │  │  ├─ brand-logo-1.svg
│  │  │  │  ├─ brand-logo-2.svg
│  │  │  │  ├─ brand-logo-3.svg
│  │  │  │  ├─ brand-logo-4.svg
│  │  │  │  ├─ brand-logo-5.svg
│  │  │  │  ├─ brand-logo-6.svg
│  │  │  │  ├─ browser-svg
│  │  │  │  │  ├─ brave.svg
│  │  │  │  │  ├─ chrome.svg
│  │  │  │  │  ├─ firefox.svg
│  │  │  │  │  ├─ ie.svg
│  │  │  │  │  ├─ microsoft-edge.svg
│  │  │  │  │  ├─ opera.svg
│  │  │  │  │  └─ safari.svg
│  │  │  │  ├─ checked-mark.svg
│  │  │  │  ├─ file-cta.svg
│  │  │  │  ├─ google-meet.svg
│  │  │  │  ├─ maintenance.svg
│  │  │  │  ├─ mastercard.svg
│  │  │  │  ├─ path-bootstrap.svg
│  │  │  │  ├─ path-gulp.svg
│  │  │  │  ├─ path-nodejs.svg
│  │  │  │  ├─ path-sass.svg
│  │  │  │  ├─ payment-logo-dhl.svg
│  │  │  │  ├─ payment-logo-fedex.svg
│  │  │  │  ├─ seller-1.svg
│  │  │  │  ├─ seller-2.svg
│  │  │  │  ├─ seller-3.svg
│  │  │  │  ├─ seller-4.svg
│  │  │  │  ├─ seller-5.svg
│  │  │  │  ├─ seller-6.svg
│  │  │  │  ├─ visa.svg
│  │  │  │  └─ zoom.svg
│  │  │  └─ varriant
│  │  │     ├─ 1770890861_category8.png
│  │  │     ├─ 1770891254_category5.png
│  │  │     ├─ 1770891254_category6.png
│  │  │     ├─ 1770891254_category7.png
│  │  │     ├─ 1770891254_category8.png
│  │  │     ├─ 1770891254_Untitled design (73) 1 (1).png
│  │  │     ├─ 1770893337_category5.png
│  │  │     ├─ 1770893337_category6.png
│  │  │     ├─ 1770893337_category7.png
│  │  │     ├─ 1770968865_ChatGPT Image Feb 11, 2026, 05_40_33 PM.png
│  │  │     ├─ 1770968865_ChatGPT Image Feb 11, 2026, 05_43_56 PM.png
│  │  │     ├─ 1770968865_image.png
│  │  │     ├─ 1770968865_Untitled design (74).png
│  │  │     ├─ 1771242002_category2.png
│  │  │     ├─ 1771242002_category3.png
│  │  │     ├─ 1771242002_category4.png
│  │  │     ├─ 1771242002_category5.png
│  │  │     ├─ 1771242002_category6.png
│  │  │     ├─ 1771242004_category7.png
│  │  │     ├─ 1771831109_banner1.png
│  │  │     ├─ 1771831109_banner2.png
│  │  │     └─ 1771831109_image.png
│  │  ├─ js
│  │  │  └─ theme.min.js
│  │  └─ libs
│  │     ├─ @popperjs
│  │     │  └─ core
│  │     │     └─ dist
│  │     │        └─ umd
│  │     │           └─ popper.min.js
│  │     ├─ @tabler
│  │     │  └─ icons-webfont
│  │     │     ├─ fonts
│  │     │     │  ├─ tabler-icons8d6f.eot
│  │     │     │  ├─ tabler-icons8d6f.ttf
│  │     │     │  ├─ tabler-icons8d6f.woff2
│  │     │     │  ├─ tabler-iconsd41d.eot
│  │     │     │  └─ tabler-iconsd41d.woff
│  │     │     └─ tabler-icons.min.css
│  │     ├─ @yaireo
│  │     │  └─ tagify
│  │     │     └─ dist
│  │     │        └─ tagify.css
│  │     ├─ apexcharts
│  │     │  └─ dist
│  │     │     └─ apexcharts.min.js
│  │     ├─ bootstrap
│  │     │  └─ dist
│  │     │     └─ js
│  │     │        └─ bootstrap.bundle.min.js
│  │     ├─ bs-stepper
│  │     │  └─ dist
│  │     │     └─ js
│  │     │        └─ bs-stepper.min.js
│  │     ├─ choices.js
│  │     │  └─ public
│  │     │     └─ assets
│  │     │        └─ scripts
│  │     │           └─ choices.min.js
│  │     ├─ dragula
│  │     │  └─ dist
│  │     │     ├─ dragula.min.css
│  │     │     └─ dragula.min.js
│  │     ├─ dropzone
│  │     │  └─ dist
│  │     │     ├─ dropzone-min.js
│  │     │     └─ dropzone.css
│  │     ├─ flatpickr
│  │     │  └─ dist
│  │     │     └─ flatpickr.min.js
│  │     ├─ fullcalendar
│  │     │  └─ index.global.min.js
│  │     ├─ imask
│  │     │  └─ dist
│  │     │     └─ imask.min.js
│  │     ├─ jsvectormap
│  │     │  └─ dist
│  │     │     ├─ js
│  │     │     │  └─ jsvectormap.min.js
│  │     │     └─ maps
│  │     │        ├─ world-merc.js
│  │     │        └─ world.js
│  │     ├─ list.js
│  │     │  └─ dist
│  │     │     └─ list.min.js
│  │     ├─ prismjs
│  │     │  ├─ components
│  │     │  │  └─ prism-scss.min.js
│  │     │  ├─ plugins
│  │     │  │  ├─ copy-to-clipboard
│  │     │  │  │  └─ prism-copy-to-clipboard.min.js
│  │     │  │  └─ toolbar
│  │     │  │     └─ prism-toolbar.min.js
│  │     │  ├─ prism.js
│  │     │  └─ themes
│  │     │     └─ prism-okaidia.min.css
│  │     ├─ quill
│  │     │  └─ dist
│  │     │     └─ quill.js
│  │     ├─ simplebar
│  │     │  └─ dist
│  │     │     ├─ simplebar.min.css
│  │     │     └─ simplebar.min.js
│  │     ├─ sticky-sidebar
│  │     │  └─ dist
│  │     │     └─ sticky-sidebar.min.js
│  │     ├─ swiper
│  │     │  ├─ swiper-bundle.min.css
│  │     │  └─ swiper-bundle.min.js
│  │     ├─ tiny-slider
│  │     │  └─ dist
│  │     │     ├─ min
│  │     │     │  └─ tiny-slider.js
│  │     │     └─ tiny-slider.css
│  │     └─ tippy.js
│  │        └─ dist
│  │           └─ tippy-bundle.umd.min.js
│  ├─ favicon.ico
│  ├─ index.php
│  └─ robots.txt
├─ README.md
├─ resources
│  ├─ css
│  │  └─ app.css
│  ├─ js
│  │  ├─ app.js
│  │  └─ bootstrap.js
│  └─ views
│     ├─ assignOffer.blade.php
│     ├─ attribute.blade.php
│     ├─ attributeValue.blade.php
│     ├─ authentication
│     │  ├─ forget-password.blade.php
│     │  ├─ otp-verification.blade.php
│     │  ├─ reset-password.blade.php
│     │  ├─ sign-in.blade.php
│     │  └─ sign-up.blade.php
│     ├─ category.blade.php
│     ├─ coupon.blade.php
│     ├─ couponHistory.blade.php
│     ├─ customers.blade.php
│     ├─ layouts
│     │  ├─ admin.blade.php
│     │  ├─ header.blade.php
│     │  ├─ offcanvas.blade.php
│     │  └─ sidebar.blade.php
│     ├─ offers.blade.php
│     ├─ order.blade.php
│     ├─ orderDetails.blade.php
│     ├─ payments.blade.php
│     ├─ pendingReviews.blade.php
│     ├─ product.blade.php
│     ├─ productReviews.blade.php
│     ├─ SubCategory.blade.php
│     ├─ variants.blade.php
│     └─ welcome.blade.php
├─ routes
│  ├─ api.php
│  ├─ console.php
│  └─ web.php
├─ storage
│  ├─ app
│  │  ├─ private
│  │  └─ public
│  ├─ framework
│  │  ├─ cache
│  │  │  └─ data
│  │  ├─ sessions
│  │  │  ├─ Pr8KPsaH2R1z7Jcb18TnoDGxAjHrKLcEreDxKZrh
│  │  │  └─ S7wLfn2Ii2yryEZhJhj7CBXDPHFlY14nCVe02nGp
│  │  ├─ testing
│  │  └─ views
│  │     ├─ 072cb44a73505ffee4c2da3548e6775e.php
│  │     ├─ 07407783ef140e73d69819a1c6f75e76.php
│  │     ├─ 0784df7ad98d20c04c6460f7e8e0fa0c.php
│  │     ├─ 0d465307e374f58d1bf42dc139e3fbe4.php
│  │     ├─ 107b005b8b799a55c374bdd70c64b854.php
│  │     ├─ 108a0d0a57ea75c0cd6f30c87f57b9c6.php
│  │     ├─ 1532771a5d84f2617104ed0827aef3ae.php
│  │     ├─ 15686f02eb8834c6975cf0bc66f146e5.php
│  │     ├─ 165cc58d97a423447d1d0868a3026b05.php
│  │     ├─ 1882282cb48a7bfec36c6761222460af.php
│  │     ├─ 1d68ac7c556677db6fab422fe5e679d6.php
│  │     ├─ 1eb664526b0410f1da822762b9db9564.php
│  │     ├─ 20370ed415b7e1260b2161883d79d5e3.php
│  │     ├─ 20b80688a07241c78fd739148b3b2d1e.php
│  │     ├─ 20c6231484ec2f24fdead24d47e7b409.php
│  │     ├─ 2675dc6e6e71a8a6d35f62f96b5339a7.php
│  │     ├─ 294aa1dfad2a88a2a95fa81e49c1c896.php
│  │     ├─ 2c6aaac7119bd3f381359a48a4546b7a.php
│  │     ├─ 2cdc385d215d70e965b430b81d5605a7.php
│  │     ├─ 2d20fb8af1d05e9db1d95d2a45f18357.php
│  │     ├─ 2dd3a0f566df86c7736c840450d34679.php
│  │     ├─ 2ed0dd566091e2cf88430b2e00b77760.php
│  │     ├─ 2f95bb30644e34280ae476a027ea5697.php
│  │     ├─ 2fe1e28c776e0628dc4496daed06d753.php
│  │     ├─ 354a0359004fd96d1562cee1ed3540d2.php
│  │     ├─ 358899b1ee2b9004e4371787547ecf01.php
│  │     ├─ 36e294a65f122517bc09ad648faae145.php
│  │     ├─ 3786393ab50d3418eb940ce144b089e1.php
│  │     ├─ 3f37fd5f9efc3692468bd62ef5f8b731.php
│  │     ├─ 3f8bbaed85b24ad8380fb49de43cfacd.php
│  │     ├─ 42e32bc8045edfe47be371717a9fa0f8.php
│  │     ├─ 44745332499847146e7e1467a5d54051.php
│  │     ├─ 4533de0784c963275387917a010f627a.php
│  │     ├─ 481ff908aef47c568f082a1088dc0947.php
│  │     ├─ 49a6977009d79eadf7a68f5a41448bc4.php
│  │     ├─ 4a6dc52fd5ec576c651b1810cc0e3484.php
│  │     ├─ 4d3ef72542333c1f2990da3425b47fce.php
│  │     ├─ 4e5b42bef2a1db319481a1f17adabb81.php
│  │     ├─ 5041cf2f62ee4d4815526c645476d217.php
│  │     ├─ 50f975f111522bf90404ddf08bed9ff2.php
│  │     ├─ 51207311d5546480a71e467ee5cfe51d.php
│  │     ├─ 521d2e7962f7b18eff86ae15d32ed5cb.php
│  │     ├─ 53273423f6c9bac23648076675d45cee.php
│  │     ├─ 54af179885fbf008d265fcf8de2be4f0.php
│  │     ├─ 5ade3103f2ca301454b615bbce84d44d.php
│  │     ├─ 5b401e7045f3fa8fd88bdc54054b2d41.php
│  │     ├─ 5bd42662237b6872a2dab46e6b99395d.php
│  │     ├─ 5d4b74d0481d88da3b10c57e9422f14a.php
│  │     ├─ 5db9f0a14cc2ce245acfd4bb788d4126.php
│  │     ├─ 5fb73576c3eb2266d0beb066246a3047.php
│  │     ├─ 60c6322afd27e9a091ac7235ba1b9fd8.php
│  │     ├─ 63017573077f5e41215e40ca2401ebe2.php
│  │     ├─ 6469dc4a77787d9e334054c8697e4ac6.php
│  │     ├─ 64a72fa6235977a54da177b26049db1c.php
│  │     ├─ 664767aade845fdd825851c8c6105c2b.php
│  │     ├─ 6717d1cb0da6ccf6b785ed5ba3f3c07f.php
│  │     ├─ 6747e257f4cf6df2ec295591db41fcf6.php
│  │     ├─ 69677c16968ceed38e0780f36ee493e0.php
│  │     ├─ 69f375d966b54ec03f7259eb89001877.php
│  │     ├─ 6a7e6fe600bb24933886b3b2f44674f8.php
│  │     ├─ 6cf275428ea2c0189fddcc2cdc553a30.php
│  │     ├─ 6d61af59d5f432349159f6e5fffeaa2a.php
│  │     ├─ 6d85243e4eb91c6e857cf41d797f2d20.php
│  │     ├─ 6f625f18a9797e438734968a76a00ccf.php
│  │     ├─ 71b5ddf2feff103e67b7409c353b8bbe.php
│  │     ├─ 73e4952abe17e73c0ed04db71af38bea.php
│  │     ├─ 7470d2165d9f175c401e0273f8fb0e39.php
│  │     ├─ 7688cda0fbcfe2b84949930499d26644.php
│  │     ├─ 79830aec62c4a13a2bfcd513d80a7456.php
│  │     ├─ 7b70027fc475a22faaf0d53fa9641b6e.php
│  │     ├─ 7f4aa6b1ef63f524eb0142096f165342.php
│  │     ├─ 82217925304adf89d89dae8828209a72.php
│  │     ├─ 833febc9ec73ac9eb4a2cc27a5ea3e95.php
│  │     ├─ 84969f495011c4f6bffc1845115a4ef5.php
│  │     ├─ 86a9b5d8e483487ddc87bb4d543d3614.php
│  │     ├─ 89509a39eae791f45ebd70d772d8c566.php
│  │     ├─ 8969cff4133ad44bb4c7f184fd0f7d15.php
│  │     ├─ 8d2b5e6ae4a940855cbb134c16873b22.php
│  │     ├─ 8f1ffb8458daac8719dc1df19af4476a.php
│  │     ├─ 8fbc6ee3cb168feb6b260bbd71844b8e.php
│  │     ├─ 90075bcf8576e33a9f18fd29bd1ad577.php
│  │     ├─ 91354f0cd1bbd69441c1f69c20c9b824.php
│  │     ├─ 91c01e26188fe4f562e152dc958bff76.php
│  │     ├─ 942b8f55e18ca1e219e6a20326f91fff.php
│  │     ├─ 954859747154bd42feac358d2c63f4eb.php
│  │     ├─ 963e81b9935bbee9ea74d53e899fc0d5.php
│  │     ├─ 972d69984673519b305cba01e8116ace.php
│  │     ├─ 9aab43b4f41d3884e1bf1c4f67876f33.php
│  │     ├─ 9c2b8c82e76fad40b3d24793db6216f4.php
│  │     ├─ 9cdd629883eb824ca5c5948c5aff43fc.php
│  │     ├─ 9da68b5e98913be7626c8a9387f72424.php
│  │     ├─ a049dec798dcbf4cb2db60a442aba1fb.php
│  │     ├─ a143e925d872f9708cd853b17c9ab149.php
│  │     ├─ a1451d6a7f96c331b7f69d9b2a093fee.php
│  │     ├─ a376491a0f1c22b2730e327a35ede142.php
│  │     ├─ a3e1f1cb729bab5e5e3c6ca6ce64e674.php
│  │     ├─ a9f96aa7c114bb53e3dde9075dc4b650.php
│  │     ├─ ab7c89462aed9e8000bfc454f834f037.php
│  │     ├─ ad63f289b9a8b22b6e053236f16f0b02.php
│  │     ├─ b122e389ac53f5f4d7a19a852dac84a4.php
│  │     ├─ b27fb738f2ef17a249e74b1396f37258.php
│  │     ├─ b3396be9808f4ab0c5bfee54868d658c.php
│  │     ├─ b55da5bb5f8936eb67f9b00ee4f78d8a.php
│  │     ├─ b77f10e604b11c6bd2574ca259fdd0ed.php
│  │     ├─ bb9a64c36b6f0a5aa772db77053670a2.php
│  │     ├─ bddf8da4b72d96dac4db8493186f0e1a.php
│  │     ├─ be4844ce6420e939e2d372b4a25f294d.php
│  │     ├─ c0b62d3a50dd2f8aadd35bfa8d3129df.php
│  │     ├─ c2278168b61b0b106115596161778eb3.php
│  │     ├─ c44e5ef7da368bee48d42498fc9544f9.php
│  │     ├─ c770371e5812318fd3c9d943b9207bf4.php
│  │     ├─ ca928c6aafc88b21d238945ecadf2be7.php
│  │     ├─ cd64d304adc9b6dc9d4839d9bac51518.php
│  │     ├─ cdac3f4c14df9992cc402fa917f69e80.php
│  │     ├─ cfd7d1ed7a9e5854b4a3725e2f684629.php
│  │     ├─ d198b93b7ff381c545808a6411276ce7.php
│  │     ├─ d3c5e514765b5d6da0ac86b7c029b9f0.php
│  │     ├─ d4deb9bcc8db7c98c9b30a5651b15259.php
│  │     ├─ d503dfa6ce6ed938373766e03a0a3474.php
│  │     ├─ d6260c65edf77f76cfe4971ac2b144f8.php
│  │     ├─ d665436ebf5e8deca5389c64da1c16fc.php
│  │     ├─ d6e0a91a84bf3a4a28378a62cd2cc2ca.php
│  │     ├─ d9dfa015e81efeeb510c24f593c9c55d.php
│  │     ├─ de50eea10f7e594759ce9e2b9c2899ff.php
│  │     ├─ e2e6da39d4f64b2412ea21ee21852603.php
│  │     ├─ e395a3f30805356b6c03f40c224959c2.php
│  │     ├─ e3b2b6f2df0809ca71420fe32b59b506.php
│  │     ├─ e3c85652574732e2490d94eb127f3c96.php
│  │     ├─ e4915d167395d05ab8db50fd61d04b26.php
│  │     ├─ e5ad578a75947328e6f30eec103caa19.php
│  │     ├─ eb9597228038a1d38128bf3fbfa65c83.php
│  │     ├─ ebb36ff3582586de1b57657dd48e27b8.php
│  │     ├─ ecbb991cb9c8c997d7f1cb68c12203b4.php
│  │     ├─ ecd5a234dfd1bc84447b3ea74ec2e8f4.php
│  │     ├─ ed782c9ce1f6c1fae856365d36dd6fee.php
│  │     ├─ edec98d254e593e1f1baa9e284028bfd.php
│  │     ├─ f574da08cb862a93c510c0870a380623.php
│  │     ├─ fb6160d745b6ba04b9fcfee5445a7122.php
│  │     ├─ fd63aa663aeee34593931ac844de05ea.php
│  │     └─ fe7ee54ccb666490df61be44ea83a8b4.php
│  └─ logs
├─ tests
│  ├─ Feature
│  │  └─ ExampleTest.php
│  ├─ TestCase.php
│  └─ Unit
│     └─ ExampleTest.php
└─ vite.config.js

```
```
backend
├─ .editorconfig
├─ app
│  ├─ Http
│  │  └─ Controllers
│  │     ├─ AdminController.php
│  │     ├─ ApiController.php
│  │     └─ Controller.php
│  ├─ Models
│  │  └─ User.php
│  └─ Providers
│     └─ AppServiceProvider.php
├─ artisan
├─ bootstrap
│  ├─ app.php
│  ├─ cache
│  │  ├─ config.php
│  │  ├─ events.php
│  │  ├─ packages.php
│  │  └─ services.php
│  └─ providers.php
├─ composer.json
├─ composer.lock
├─ config
│  ├─ app.php
│  ├─ auth.php
│  ├─ cache.php
│  ├─ database.php
│  ├─ filesystems.php
│  ├─ logging.php
│  ├─ mail.php
│  ├─ queue.php
│  ├─ sanctum.php
│  ├─ services.php
│  └─ session.php
├─ database
│  ├─ database.sqlite
│  ├─ factories
│  │  └─ UserFactory.php
│  ├─ migrations
│  │  ├─ 0001_01_01_000000_create_users_table.php
│  │  ├─ 0001_01_01_000001_create_cache_table.php
│  │  ├─ 0001_01_01_000002_create_jobs_table.php
│  │  ├─ 2026_02_21_120045_create_personal_access_tokens_table.php
│  │  └─ 2026_02_23_113726_create_personal_access_tokens_table.php
│  └─ seeders
│     └─ DatabaseSeeder.php
├─ package.json
├─ phpunit.xml
├─ public
│  ├─ .htaccess
│  ├─ assets
│  │  ├─ css
│  │  │  └─ theme.min.css
│  │  ├─ images
│  │  │  ├─ avatar
│  │  │  │  ├─ avatar-1.jpg
│  │  │  │  ├─ avatar-10.jpg
│  │  │  │  ├─ avatar-11.jpg
│  │  │  │  ├─ avatar-12.jpg
│  │  │  │  ├─ avatar-13.jpg
│  │  │  │  ├─ avatar-14.jpg
│  │  │  │  ├─ avatar-15.jpg
│  │  │  │  ├─ avatar-16.jpg
│  │  │  │  ├─ avatar-17.jpg
│  │  │  │  ├─ avatar-19.jpg
│  │  │  │  ├─ avatar-2.jpg
│  │  │  │  ├─ avatar-21.jpg
│  │  │  │  ├─ avatar-3.jpg
│  │  │  │  ├─ avatar-4.jpg
│  │  │  │  ├─ avatar-5.jpg
│  │  │  │  ├─ avatar-6.jpg
│  │  │  │  ├─ avatar-7.jpg
│  │  │  │  ├─ avatar-8.jpg
│  │  │  │  └─ avatar-9.jpg
│  │  │  ├─ background
│  │  │  │  ├─ profile-cover-img.jpg
│  │  │  │  └─ profile-cover.jpg
│  │  │  ├─ blog
│  │  │  │  ├─ blog-img-1.jpg
│  │  │  │  ├─ blog-img-2.jpg
│  │  │  │  ├─ blog-img-3.jpg
│  │  │  │  ├─ blog-img-4.jpg
│  │  │  │  ├─ blog-img-5.jpg
│  │  │  │  ├─ blog-img-6.jpg
│  │  │  │  └─ blog-img-7.jpg
│  │  │  ├─ brand
│  │  │  │  ├─ 3dsmax-logo.svg
│  │  │  │  ├─ dropbox-logo.svg
│  │  │  │  ├─ github-logo.svg
│  │  │  │  ├─ layers-logo.svg
│  │  │  │  ├─ logo
│  │  │  │  │  ├─ logo-2.html
│  │  │  │  │  └─ logo-icon.svg
│  │  │  │  └─ slack-logo.svg
│  │  │  ├─ category
│  │  │  │  ├─ 1770202592_shoppingkarofav.png
│  │  │  │  ├─ 1770202666_shoppingkarofav.png
│  │  │  │  ├─ 1770274336_floblo_fav.png
│  │  │  │  ├─ 1770274337_floblo_fav.png
│  │  │  │  ├─ 1770276429_Gemini_Generated_Image_rg4r3qrg4r3qrg4r-Photoroom.png
│  │  │  │  └─ 1770276466_recharegeRight.png
│  │  │  ├─ docs
│  │  │  │  └─ block-figma.html
│  │  │  ├─ ecommerce
│  │  │  │  ├─ product-1.jpg
│  │  │  │  ├─ product-10.jpg
│  │  │  │  ├─ product-2.jpg
│  │  │  │  ├─ product-3.jpg
│  │  │  │  ├─ product-4.jpg
│  │  │  │  ├─ product-5.jpg
│  │  │  │  ├─ product-6.jpg
│  │  │  │  ├─ product-7.jpg
│  │  │  │  ├─ product-8.jpg
│  │  │  │  └─ product-9.jpg
│  │  │  ├─ favicon
│  │  │  │  ├─ android-icon-192x192.png
│  │  │  │  ├─ apple-icon-114x114.png
│  │  │  │  ├─ apple-icon-120x120.png
│  │  │  │  ├─ apple-icon-144x144.png
│  │  │  │  ├─ apple-icon-152x152.png
│  │  │  │  ├─ apple-icon-180x180.png
│  │  │  │  ├─ apple-icon-57x57.png
│  │  │  │  ├─ apple-icon-60x60.png
│  │  │  │  ├─ apple-icon-72x72.png
│  │  │  │  ├─ apple-icon-76x76.png
│  │  │  │  ├─ favicon-16x16.png
│  │  │  │  ├─ favicon-32x32.png
│  │  │  │  ├─ favicon-96x96.png
│  │  │  │  └─ ms-icon-144x144.png
│  │  │  ├─ logo
│  │  │  │  ├─ shoppingkarofav.png
│  │  │  │  ├─ shoppingkarowhite.png
│  │  │  │  └─ shoppinKarologo.png
│  │  │  ├─ placeholder
│  │  │  │  ├─ placeholder-4by3.svg
│  │  │  │  └─ placeholder-img.jpg
│  │  │  ├─ placeholder.jpg
│  │  │  ├─ png
│  │  │  │  ├─ dasher-ai.png
│  │  │  │  └─ dasher-ui-bootstrap-5.jpg
│  │  │  ├─ product
│  │  │  │  ├─ 1770623188_cpay.png
│  │  │  │  ├─ 1770628402_EconomicTimes.png
│  │  │  │  ├─ 1770628630_EconomicTimes.png
│  │  │  │  ├─ 1770628671_EconomicTimes.png
│  │  │  │  ├─ 1770642779_Gemini_Generated_Image_unviw0unviw0unvi-removebg-preview.png
│  │  │  │  ├─ 1770642836_mint.png
│  │  │  │  ├─ 1770660068_2334.webp
│  │  │  │  ├─ 1770660116_Gemini_Generated_Image_unviw0unviw0unvi-removebg-preview.png
│  │  │  │  ├─ 1770660226_cpay.png
│  │  │  │  ├─ 1770660329_gpay.png
│  │  │  │  ├─ 1770660380_ppay.png
│  │  │  │  ├─ 1770660463_png-clipart-kotak-mahindra-bank-logo-horizontal-bank-logos.png
│  │  │  │  ├─ 1770660546_favicon_joydek.png
│  │  │  │  ├─ 1770660616_favze (1).png
│  │  │  │  ├─ 1770660667_imagesss (1).png
│  │  │  │  ├─ 1770661121_ChatGPT Image Nov 19, 2025, 10_50_10 AM.png
│  │  │  │  ├─ 1770662364_mobilerecharge-removebg-preview.png
│  │  │  │  ├─ 1770662414_ChatGPT Image Nov 19, 2025, 10_50_08 AM.png
│  │  │  │  ├─ 1770707127_mobilerecharge.png
│  │  │  │  ├─ 1771833061_mobilerecharge.png
│  │  │  │  ├─ 1771833210_mobilerecharge.png
│  │  │  │  ├─ 1771838836_recharge api (1).png
│  │  │  │  ├─ 1771838849_recharge api (1).png
│  │  │  │  ├─ 1771838929_recharge api (1).png
│  │  │  │  ├─ 1771839227_recharge api (1).png
│  │  │  │  └─ 1771839330_recharge api (1).png
│  │  │  ├─ reviews
│  │  │  │  ├─ 1771068073_69905aa9069bd.png
│  │  │  │  ├─ 1771068073_69905aa9071fa.png
│  │  │  │  ├─ 1771068073_69905aa9078a5.png
│  │  │  │  ├─ 1771068938_69905e0a4bac3.png
│  │  │  │  ├─ 1771069134_69905ece647ee.png
│  │  │  │  ├─ 1771069580_6990608c03b79.png
│  │  │  │  ├─ 1771069905_699061d183e36.png
│  │  │  │  ├─ 1771069905_699061d184638.png
│  │  │  │  ├─ 1771069905_699061d184cca.png
│  │  │  │  ├─ 1771069905_699061d185507.png
│  │  │  │  ├─ 1771069905_699061d185f19.png
│  │  │  │  ├─ 1771069905_699061d186741.png
│  │  │  │  ├─ 1771069905_699061d186e97.jpg
│  │  │  │  ├─ 1771069905_699061d1874a6.png
│  │  │  │  ├─ 1771069905_699061d187aa6.png
│  │  │  │  ├─ 1771069905_699061d188145.png
│  │  │  │  ├─ 1771069905_699061d18884f.png
│  │  │  │  ├─ 1771069905_699061d188dd5.png
│  │  │  │  ├─ 1771069905_699061d189367.png
│  │  │  │  ├─ 1771069905_699061d189a25.png
│  │  │  │  ├─ 1771070543_6990644f4f809.png
│  │  │  │  ├─ 1771070543_6990644f4ff8f.png
│  │  │  │  ├─ 1771070543_6990644f50572.png
│  │  │  │  ├─ 1771070543_6990644f50d96.png
│  │  │  │  ├─ 1771070594_6990648214101.png
│  │  │  │  ├─ 1771070594_6990648214942.png
│  │  │  │  ├─ 1771070632_699064a866de6.png
│  │  │  │  ├─ 1771070632_699064a8676a9.png
│  │  │  │  ├─ 1771070632_699064a867e73.png
│  │  │  │  ├─ 1771070944_699065e009502.png
│  │  │  │  ├─ 1771070944_699065e00a06b.png
│  │  │  │  ├─ 1771071032_69906638141cb.png
│  │  │  │  ├─ 1771071032_6990663814806.png
│  │  │  │  ├─ 1771071032_6990663814d85.png
│  │  │  │  ├─ 1771071032_6990663815430.png
│  │  │  │  ├─ 1771073448_69906fa8c044e.png
│  │  │  │  ├─ 1771073468_69906fbcc8467.png
│  │  │  │  ├─ 1771073497_69906fd974c81.png
│  │  │  │  ├─ 1771073497_69906fd9755d0.png
│  │  │  │  ├─ 1771073521_69906ff11a51b.png
│  │  │  │  ├─ 1771073521_69906ff11ad02.png
│  │  │  │  ├─ 1771073521_69906ff11b582.png
│  │  │  │  ├─ 1771073552_69907010d4be2.png
│  │  │  │  ├─ 1771073552_69907010d54f7.png
│  │  │  │  ├─ 1771073574_699070267cdd9.png
│  │  │  │  ├─ 1771092836_6990bb6455b56.png
│  │  │  │  ├─ 1771222086_6992b44676a3a.png
│  │  │  │  ├─ 1771222086_6992b446772cb.png
│  │  │  │  ├─ 1771222086_6992b4467793c.png
│  │  │  │  ├─ 1771222086_6992b4467803d.png
│  │  │  │  ├─ 1771222149_6992b48595a0b.png
│  │  │  │  ├─ 1771222149_6992b4859613a.png
│  │  │  │  ├─ 1771222624_6992b660beda3.png
│  │  │  │  ├─ 1771222624_6992b660bf7d9.png
│  │  │  │  ├─ 1771222645_6992b675ea02d.png
│  │  │  │  ├─ 1771222645_6992b675eaa04.png
│  │  │  │  ├─ 1771222673_6992b691cac04.png
│  │  │  │  ├─ 1771222673_6992b691cb66d.png
│  │  │  │  ├─ 1771222673_6992b691cc04f.png
│  │  │  │  ├─ 1771225218_6992c0826d76a.png
│  │  │  │  ├─ 1771225218_6992c0826e232.png
│  │  │  │  ├─ 1771225218_6992c0826ebd8.png
│  │  │  │  ├─ 1771225218_6992c0826f3e4.png
│  │  │  │  ├─ 1771226141_6992c41de6249.png
│  │  │  │  ├─ 1771226141_6992c41de6c62.png
│  │  │  │  ├─ 1771226141_6992c41de75cc.png
│  │  │  │  ├─ 1771226170_6992c43ac710c.png
│  │  │  │  └─ 1771226170_6992c43ac799e.png
│  │  │  ├─ slide-img
│  │  │  │  ├─ carousel-img-1.jpg
│  │  │  │  ├─ carousel-img-2.jpg
│  │  │  │  └─ carousel-img-3.jpg
│  │  │  ├─ subcategory
│  │  │  │  ├─ 1770285349_imagess (1).png
│  │  │  │  ├─ 1770286172_imagess (1).png
│  │  │  │  ├─ 1770286499_imagess (1).png
│  │  │  │  ├─ 1770289088_imagess (1).png
│  │  │  │  └─ 1770289099_image (1).png
│  │  │  ├─ svg
│  │  │  │  ├─ 404.svg
│  │  │  │  ├─ americanexpress.svg
│  │  │  │  ├─ brand-logo-1.svg
│  │  │  │  ├─ brand-logo-2.svg
│  │  │  │  ├─ brand-logo-3.svg
│  │  │  │  ├─ brand-logo-4.svg
│  │  │  │  ├─ brand-logo-5.svg
│  │  │  │  ├─ brand-logo-6.svg
│  │  │  │  ├─ browser-svg
│  │  │  │  │  ├─ brave.svg
│  │  │  │  │  ├─ chrome.svg
│  │  │  │  │  ├─ firefox.svg
│  │  │  │  │  ├─ ie.svg
│  │  │  │  │  ├─ microsoft-edge.svg
│  │  │  │  │  ├─ opera.svg
│  │  │  │  │  └─ safari.svg
│  │  │  │  ├─ checked-mark.svg
│  │  │  │  ├─ file-cta.svg
│  │  │  │  ├─ google-meet.svg
│  │  │  │  ├─ maintenance.svg
│  │  │  │  ├─ mastercard.svg
│  │  │  │  ├─ path-bootstrap.svg
│  │  │  │  ├─ path-gulp.svg
│  │  │  │  ├─ path-nodejs.svg
│  │  │  │  ├─ path-sass.svg
│  │  │  │  ├─ payment-logo-dhl.svg
│  │  │  │  ├─ payment-logo-fedex.svg
│  │  │  │  ├─ seller-1.svg
│  │  │  │  ├─ seller-2.svg
│  │  │  │  ├─ seller-3.svg
│  │  │  │  ├─ seller-4.svg
│  │  │  │  ├─ seller-5.svg
│  │  │  │  ├─ seller-6.svg
│  │  │  │  ├─ visa.svg
│  │  │  │  └─ zoom.svg
│  │  │  └─ varriant
│  │  │     ├─ 1770890861_category8.png
│  │  │     ├─ 1770891254_category5.png
│  │  │     ├─ 1770891254_category6.png
│  │  │     ├─ 1770891254_category7.png
│  │  │     ├─ 1770891254_category8.png
│  │  │     ├─ 1770891254_Untitled design (73) 1 (1).png
│  │  │     ├─ 1770893337_category5.png
│  │  │     ├─ 1770893337_category6.png
│  │  │     ├─ 1770893337_category7.png
│  │  │     ├─ 1770968865_ChatGPT Image Feb 11, 2026, 05_40_33 PM.png
│  │  │     ├─ 1770968865_ChatGPT Image Feb 11, 2026, 05_43_56 PM.png
│  │  │     ├─ 1770968865_image.png
│  │  │     ├─ 1770968865_Untitled design (74).png
│  │  │     ├─ 1771242002_category2.png
│  │  │     ├─ 1771242002_category3.png
│  │  │     ├─ 1771242002_category4.png
│  │  │     ├─ 1771242002_category5.png
│  │  │     ├─ 1771242002_category6.png
│  │  │     ├─ 1771242004_category7.png
│  │  │     ├─ 1771831109_banner1.png
│  │  │     ├─ 1771831109_banner2.png
│  │  │     └─ 1771831109_image.png
│  │  ├─ js
│  │  │  └─ theme.min.js
│  │  └─ libs
│  │     ├─ @popperjs
│  │     │  └─ core
│  │     │     └─ dist
│  │     │        └─ umd
│  │     │           └─ popper.min.js
│  │     ├─ @tabler
│  │     │  └─ icons-webfont
│  │     │     ├─ fonts
│  │     │     │  ├─ tabler-icons8d6f.eot
│  │     │     │  ├─ tabler-icons8d6f.ttf
│  │     │     │  ├─ tabler-icons8d6f.woff2
│  │     │     │  ├─ tabler-iconsd41d.eot
│  │     │     │  └─ tabler-iconsd41d.woff
│  │     │     └─ tabler-icons.min.css
│  │     ├─ @yaireo
│  │     │  └─ tagify
│  │     │     └─ dist
│  │     │        └─ tagify.css
│  │     ├─ apexcharts
│  │     │  └─ dist
│  │     │     └─ apexcharts.min.js
│  │     ├─ bootstrap
│  │     │  └─ dist
│  │     │     └─ js
│  │     │        └─ bootstrap.bundle.min.js
│  │     ├─ bs-stepper
│  │     │  └─ dist
│  │     │     └─ js
│  │     │        └─ bs-stepper.min.js
│  │     ├─ choices.js
│  │     │  └─ public
│  │     │     └─ assets
│  │     │        └─ scripts
│  │     │           └─ choices.min.js
│  │     ├─ dragula
│  │     │  └─ dist
│  │     │     ├─ dragula.min.css
│  │     │     └─ dragula.min.js
│  │     ├─ dropzone
│  │     │  └─ dist
│  │     │     ├─ dropzone-min.js
│  │     │     └─ dropzone.css
│  │     ├─ flatpickr
│  │     │  └─ dist
│  │     │     └─ flatpickr.min.js
│  │     ├─ fullcalendar
│  │     │  └─ index.global.min.js
│  │     ├─ imask
│  │     │  └─ dist
│  │     │     └─ imask.min.js
│  │     ├─ jsvectormap
│  │     │  └─ dist
│  │     │     ├─ js
│  │     │     │  └─ jsvectormap.min.js
│  │     │     └─ maps
│  │     │        ├─ world-merc.js
│  │     │        └─ world.js
│  │     ├─ list.js
│  │     │  └─ dist
│  │     │     └─ list.min.js
│  │     ├─ prismjs
│  │     │  ├─ components
│  │     │  │  └─ prism-scss.min.js
│  │     │  ├─ plugins
│  │     │  │  ├─ copy-to-clipboard
│  │     │  │  │  └─ prism-copy-to-clipboard.min.js
│  │     │  │  └─ toolbar
│  │     │  │     └─ prism-toolbar.min.js
│  │     │  ├─ prism.js
│  │     │  └─ themes
│  │     │     └─ prism-okaidia.min.css
│  │     ├─ quill
│  │     │  └─ dist
│  │     │     └─ quill.js
│  │     ├─ simplebar
│  │     │  └─ dist
│  │     │     ├─ simplebar.min.css
│  │     │     └─ simplebar.min.js
│  │     ├─ sticky-sidebar
│  │     │  └─ dist
│  │     │     └─ sticky-sidebar.min.js
│  │     ├─ swiper
│  │     │  ├─ swiper-bundle.min.css
│  │     │  └─ swiper-bundle.min.js
│  │     ├─ tiny-slider
│  │     │  └─ dist
│  │     │     ├─ min
│  │     │     │  └─ tiny-slider.js
│  │     │     └─ tiny-slider.css
│  │     └─ tippy.js
│  │        └─ dist
│  │           └─ tippy-bundle.umd.min.js
│  ├─ favicon.ico
│  ├─ index.php
│  └─ robots.txt
├─ README.md
├─ resources
│  ├─ css
│  │  └─ app.css
│  ├─ js
│  │  ├─ app.js
│  │  └─ bootstrap.js
│  └─ views
│     ├─ assignOffer.blade.php
│     ├─ attribute.blade.php
│     ├─ attributeValue.blade.php
│     ├─ authentication
│     │  ├─ forget-password.blade.php
│     │  ├─ otp-verification.blade.php
│     │  ├─ reset-password.blade.php
│     │  ├─ sign-in.blade.php
│     │  └─ sign-up.blade.php
│     ├─ category.blade.php
│     ├─ coupon.blade.php
│     ├─ couponHistory.blade.php
│     ├─ customers.blade.php
│     ├─ layouts
│     │  ├─ admin.blade.php
│     │  ├─ header.blade.php
│     │  ├─ offcanvas.blade.php
│     │  └─ sidebar.blade.php
│     ├─ offers.blade.php
│     ├─ order.blade.php
│     ├─ orderDetails.blade.php
│     ├─ payments.blade.php
│     ├─ pendingReviews.blade.php
│     ├─ product.blade.php
│     ├─ productReviews.blade.php
│     ├─ SubCategory.blade.php
│     ├─ variants.blade.php
│     └─ welcome.blade.php
├─ routes
│  ├─ api.php
│  ├─ console.php
│  └─ web.php
├─ storage
│  ├─ app
│  │  ├─ private
│  │  └─ public
│  ├─ framework
│  │  ├─ cache
│  │  │  └─ data
│  │  ├─ sessions
│  │  │  ├─ Pr8KPsaH2R1z7Jcb18TnoDGxAjHrKLcEreDxKZrh
│  │  │  └─ S7wLfn2Ii2yryEZhJhj7CBXDPHFlY14nCVe02nGp
│  │  ├─ testing
│  │  └─ views
│  │     ├─ 072cb44a73505ffee4c2da3548e6775e.php
│  │     ├─ 07407783ef140e73d69819a1c6f75e76.php
│  │     ├─ 0784df7ad98d20c04c6460f7e8e0fa0c.php
│  │     ├─ 0d465307e374f58d1bf42dc139e3fbe4.php
│  │     ├─ 107b005b8b799a55c374bdd70c64b854.php
│  │     ├─ 108a0d0a57ea75c0cd6f30c87f57b9c6.php
│  │     ├─ 1532771a5d84f2617104ed0827aef3ae.php
│  │     ├─ 15686f02eb8834c6975cf0bc66f146e5.php
│  │     ├─ 165cc58d97a423447d1d0868a3026b05.php
│  │     ├─ 1882282cb48a7bfec36c6761222460af.php
│  │     ├─ 1d68ac7c556677db6fab422fe5e679d6.php
│  │     ├─ 1eb664526b0410f1da822762b9db9564.php
│  │     ├─ 20370ed415b7e1260b2161883d79d5e3.php
│  │     ├─ 20b80688a07241c78fd739148b3b2d1e.php
│  │     ├─ 20c6231484ec2f24fdead24d47e7b409.php
│  │     ├─ 2675dc6e6e71a8a6d35f62f96b5339a7.php
│  │     ├─ 294aa1dfad2a88a2a95fa81e49c1c896.php
│  │     ├─ 2c6aaac7119bd3f381359a48a4546b7a.php
│  │     ├─ 2cdc385d215d70e965b430b81d5605a7.php
│  │     ├─ 2d20fb8af1d05e9db1d95d2a45f18357.php
│  │     ├─ 2dd3a0f566df86c7736c840450d34679.php
│  │     ├─ 2ed0dd566091e2cf88430b2e00b77760.php
│  │     ├─ 2f95bb30644e34280ae476a027ea5697.php
│  │     ├─ 2fe1e28c776e0628dc4496daed06d753.php
│  │     ├─ 354a0359004fd96d1562cee1ed3540d2.php
│  │     ├─ 358899b1ee2b9004e4371787547ecf01.php
│  │     ├─ 36e294a65f122517bc09ad648faae145.php
│  │     ├─ 3786393ab50d3418eb940ce144b089e1.php
│  │     ├─ 3f37fd5f9efc3692468bd62ef5f8b731.php
│  │     ├─ 3f8bbaed85b24ad8380fb49de43cfacd.php
│  │     ├─ 42e32bc8045edfe47be371717a9fa0f8.php
│  │     ├─ 44745332499847146e7e1467a5d54051.php
│  │     ├─ 4533de0784c963275387917a010f627a.php
│  │     ├─ 481ff908aef47c568f082a1088dc0947.php
│  │     ├─ 49a6977009d79eadf7a68f5a41448bc4.php
│  │     ├─ 4a6dc52fd5ec576c651b1810cc0e3484.php
│  │     ├─ 4d3ef72542333c1f2990da3425b47fce.php
│  │     ├─ 4e5b42bef2a1db319481a1f17adabb81.php
│  │     ├─ 5041cf2f62ee4d4815526c645476d217.php
│  │     ├─ 50f975f111522bf90404ddf08bed9ff2.php
│  │     ├─ 51207311d5546480a71e467ee5cfe51d.php
│  │     ├─ 521d2e7962f7b18eff86ae15d32ed5cb.php
│  │     ├─ 53273423f6c9bac23648076675d45cee.php
│  │     ├─ 54af179885fbf008d265fcf8de2be4f0.php
│  │     ├─ 5ade3103f2ca301454b615bbce84d44d.php
│  │     ├─ 5b401e7045f3fa8fd88bdc54054b2d41.php
│  │     ├─ 5bd42662237b6872a2dab46e6b99395d.php
│  │     ├─ 5d4b74d0481d88da3b10c57e9422f14a.php
│  │     ├─ 5db9f0a14cc2ce245acfd4bb788d4126.php
│  │     ├─ 5fb73576c3eb2266d0beb066246a3047.php
│  │     ├─ 60c6322afd27e9a091ac7235ba1b9fd8.php
│  │     ├─ 63017573077f5e41215e40ca2401ebe2.php
│  │     ├─ 6469dc4a77787d9e334054c8697e4ac6.php
│  │     ├─ 64a72fa6235977a54da177b26049db1c.php
│  │     ├─ 664767aade845fdd825851c8c6105c2b.php
│  │     ├─ 6717d1cb0da6ccf6b785ed5ba3f3c07f.php
│  │     ├─ 6747e257f4cf6df2ec295591db41fcf6.php
│  │     ├─ 69677c16968ceed38e0780f36ee493e0.php
│  │     ├─ 69f375d966b54ec03f7259eb89001877.php
│  │     ├─ 6a7e6fe600bb24933886b3b2f44674f8.php
│  │     ├─ 6cf275428ea2c0189fddcc2cdc553a30.php
│  │     ├─ 6d61af59d5f432349159f6e5fffeaa2a.php
│  │     ├─ 6d85243e4eb91c6e857cf41d797f2d20.php
│  │     ├─ 6f625f18a9797e438734968a76a00ccf.php
│  │     ├─ 71b5ddf2feff103e67b7409c353b8bbe.php
│  │     ├─ 73e4952abe17e73c0ed04db71af38bea.php
│  │     ├─ 7470d2165d9f175c401e0273f8fb0e39.php
│  │     ├─ 7688cda0fbcfe2b84949930499d26644.php
│  │     ├─ 79830aec62c4a13a2bfcd513d80a7456.php
│  │     ├─ 7b70027fc475a22faaf0d53fa9641b6e.php
│  │     ├─ 7f4aa6b1ef63f524eb0142096f165342.php
│  │     ├─ 82217925304adf89d89dae8828209a72.php
│  │     ├─ 833febc9ec73ac9eb4a2cc27a5ea3e95.php
│  │     ├─ 84969f495011c4f6bffc1845115a4ef5.php
│  │     ├─ 86a9b5d8e483487ddc87bb4d543d3614.php
│  │     ├─ 89509a39eae791f45ebd70d772d8c566.php
│  │     ├─ 8969cff4133ad44bb4c7f184fd0f7d15.php
│  │     ├─ 8d2b5e6ae4a940855cbb134c16873b22.php
│  │     ├─ 8f1ffb8458daac8719dc1df19af4476a.php
│  │     ├─ 8fbc6ee3cb168feb6b260bbd71844b8e.php
│  │     ├─ 90075bcf8576e33a9f18fd29bd1ad577.php
│  │     ├─ 91354f0cd1bbd69441c1f69c20c9b824.php
│  │     ├─ 91c01e26188fe4f562e152dc958bff76.php
│  │     ├─ 942b8f55e18ca1e219e6a20326f91fff.php
│  │     ├─ 954859747154bd42feac358d2c63f4eb.php
│  │     ├─ 963e81b9935bbee9ea74d53e899fc0d5.php
│  │     ├─ 972d69984673519b305cba01e8116ace.php
│  │     ├─ 9aab43b4f41d3884e1bf1c4f67876f33.php
│  │     ├─ 9c2b8c82e76fad40b3d24793db6216f4.php
│  │     ├─ 9cdd629883eb824ca5c5948c5aff43fc.php
│  │     ├─ 9da68b5e98913be7626c8a9387f72424.php
│  │     ├─ a049dec798dcbf4cb2db60a442aba1fb.php
│  │     ├─ a143e925d872f9708cd853b17c9ab149.php
│  │     ├─ a1451d6a7f96c331b7f69d9b2a093fee.php
│  │     ├─ a376491a0f1c22b2730e327a35ede142.php
│  │     ├─ a3e1f1cb729bab5e5e3c6ca6ce64e674.php
│  │     ├─ a9f96aa7c114bb53e3dde9075dc4b650.php
│  │     ├─ ab7c89462aed9e8000bfc454f834f037.php
│  │     ├─ ad63f289b9a8b22b6e053236f16f0b02.php
│  │     ├─ b122e389ac53f5f4d7a19a852dac84a4.php
│  │     ├─ b27fb738f2ef17a249e74b1396f37258.php
│  │     ├─ b3396be9808f4ab0c5bfee54868d658c.php
│  │     ├─ b55da5bb5f8936eb67f9b00ee4f78d8a.php
│  │     ├─ b77f10e604b11c6bd2574ca259fdd0ed.php
│  │     ├─ bb9a64c36b6f0a5aa772db77053670a2.php
│  │     ├─ bddf8da4b72d96dac4db8493186f0e1a.php
│  │     ├─ be4844ce6420e939e2d372b4a25f294d.php
│  │     ├─ c0b62d3a50dd2f8aadd35bfa8d3129df.php
│  │     ├─ c2278168b61b0b106115596161778eb3.php
│  │     ├─ c44e5ef7da368bee48d42498fc9544f9.php
│  │     ├─ c770371e5812318fd3c9d943b9207bf4.php
│  │     ├─ ca928c6aafc88b21d238945ecadf2be7.php
│  │     ├─ cd64d304adc9b6dc9d4839d9bac51518.php
│  │     ├─ cdac3f4c14df9992cc402fa917f69e80.php
│  │     ├─ cfd7d1ed7a9e5854b4a3725e2f684629.php
│  │     ├─ d198b93b7ff381c545808a6411276ce7.php
│  │     ├─ d3c5e514765b5d6da0ac86b7c029b9f0.php
│  │     ├─ d4deb9bcc8db7c98c9b30a5651b15259.php
│  │     ├─ d503dfa6ce6ed938373766e03a0a3474.php
│  │     ├─ d6260c65edf77f76cfe4971ac2b144f8.php
│  │     ├─ d665436ebf5e8deca5389c64da1c16fc.php
│  │     ├─ d6e0a91a84bf3a4a28378a62cd2cc2ca.php
│  │     ├─ d9dfa015e81efeeb510c24f593c9c55d.php
│  │     ├─ de50eea10f7e594759ce9e2b9c2899ff.php
│  │     ├─ e2e6da39d4f64b2412ea21ee21852603.php
│  │     ├─ e395a3f30805356b6c03f40c224959c2.php
│  │     ├─ e3b2b6f2df0809ca71420fe32b59b506.php
│  │     ├─ e3c85652574732e2490d94eb127f3c96.php
│  │     ├─ e4915d167395d05ab8db50fd61d04b26.php
│  │     ├─ e5ad578a75947328e6f30eec103caa19.php
│  │     ├─ eb9597228038a1d38128bf3fbfa65c83.php
│  │     ├─ ebb36ff3582586de1b57657dd48e27b8.php
│  │     ├─ ecbb991cb9c8c997d7f1cb68c12203b4.php
│  │     ├─ ecd5a234dfd1bc84447b3ea74ec2e8f4.php
│  │     ├─ ed782c9ce1f6c1fae856365d36dd6fee.php
│  │     ├─ edec98d254e593e1f1baa9e284028bfd.php
│  │     ├─ f574da08cb862a93c510c0870a380623.php
│  │     ├─ fb6160d745b6ba04b9fcfee5445a7122.php
│  │     ├─ fd63aa663aeee34593931ac844de05ea.php
│  │     └─ fe7ee54ccb666490df61be44ea83a8b4.php
│  └─ logs
├─ tests
│  ├─ Feature
│  │  └─ ExampleTest.php
│  ├─ TestCase.php
│  └─ Unit
│     └─ ExampleTest.php
└─ vite.config.js

```