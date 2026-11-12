<?php

use App\Http\Controllers\ApiController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;


Route::prefix('v1')->group(function () {

    // ==========================================
    // 1. GUEST ROUTES (Store Data)
    // ==========================================
    Route::get('/categories', [ApiController::class, 'getCategory']);
    Route::get('/category/{catSlug}/{subSlug?}', [ApiController::class, 'getBySlugCategory']);
    Route::get('/products/filter', [ApiController::class, 'getFilteredproduct']);
    Route::get('/product/{slug}', [ApiController::class, 'getProductDetails']);
    Route::post('/calculate-summary', [ApiController::class, 'calculateSummary']);
    Route::post('/contact-us', [\App\Http\Controllers\ContactController::class, 'store']);

    // ==========================================
    // 2. CUSTOMER AUTH (OTP & Google)
    // ==========================================
    Route::prefix('auth')->group(function () {
        Route::post('/send-otp', [ApiController::class, 'sendOtp']);
        Route::post('/verify-otp', [ApiController::class, 'verifyOtp']);
        Route::post('/register', [ApiController::class, 'customerRegister']); // Name, Email, Phone

        // Google OAuth endpoints for Frontend
        Route::get('/google', [ApiController::class, 'redirectToGoogle']);
        Route::get('/google/callback', [ApiController::class, 'handleGoogleCallback']);
    });

    // ==========================================
    // 3. PROTECTED CUSTOMER ROUTES (Sanctum)
    // ==========================================
    Route::middleware('auth:sanctum', 'checkStatus')->group(function () {

        // Profile & Auth Management
        Route::get('/user', [ApiController::class, 'user']);
        Route::post('/user/update', [ApiController::class, 'updateProfile']);
        Route::post('/logout', [ApiController::class, 'logout']);
        Route::post('/deactivate-account', [ApiController::class, 'deactivateAccount']);

        // Wishlist
        Route::post('/wishlist/toggle', [ApiController::class, 'toggleWishlist']);
        Route::get('/wishlist', [ApiController::class, 'getWishlist']);
        Route::post('/reviews/store', [ApiController::class, 'storeReview']);
        // Cart Management (DB Persistence)
        Route::prefix('cart')->group(function () {
            Route::get('/', [ApiController::class, 'getCart']);
            Route::post('/add', [ApiController::class, 'addToCart']);
            Route::post('/update-quantity', [ApiController::class, 'updateQuantity']);
            Route::delete('/remove/{id}', [ApiController::class, 'removeItem']);
            Route::post('/merge', [ApiController::class, 'mergeCart']);
        });
        // Protected routes mein ye add karne honge humein:
        Route::prefix('checkout')->group(function () {
            Route::get('/addresses', [ApiController::class, 'getAddresses']); // Saved addresses fetch karo
            Route::post('/address/store', [ApiController::class, 'storeAddress']); // Naya address save karo
            Route::post('/address/update', [ApiController::class, 'updateAddress']); // Naya address save karo
            Route::post('/address/remove', [ApiController::class, 'removeAddress']); // Naya address save karo
            Route::post('/place-order', [ApiController::class, 'placeOrder']); // Main Order API
        });
        Route::prefix('orders')->group(function () {
            Route::get('/my-orders', [ApiController::class, 'myOrders']);
            Route::post('/cancel-order', [ApiController::class, 'cancelOrder']);
            Route::post('/cancel-single-item', [ApiController::class, 'cancelSingleOrderItem']);
            Route::post('/return-request', [ApiController::class, 'returnRequest']);
        });
        Route::prefix('coupon')->group(function () {
            Route::get('/my-coupon', [ApiController::class, 'myCoupons']);
            Route::get('/apply-coupon', [ApiController::class, 'applyCoupon']);
        });
        Route::prefix('payment')->group(function () {
            Route::post('/initiate', [ApiController::class, 'paymentInitiate']);
            Route::get('/check-status/{txnId}', [ApiController::class, 'checkStatus']);
            Route::post('/cancel', [ApiController::class, 'cancelPayment']);
        });
    });
    Route::post('/payment/webhook', [ApiController::class, 'handleWebhook']);

    Route::get('/v1/cron-cleanup/{key}', function ($key) {
        if ($key !== 'mySecret123') { // 👈 Apni pasand ka koi bhi code rakh lo
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        Artisan::call('app:cleanup-pending-orders');
        return response()->json(['status' => 'success']);
    });
});
