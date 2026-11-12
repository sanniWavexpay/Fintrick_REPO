<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest'])->group(function () {
    Route::get('/', [AdminController::class, 'login'])->name('login');
    Route::get('/login', [AdminController::class, 'login'])->name('login');
    Route::post('/loginUser', [AdminController::class, 'loginUser'])->name('admin.loginUser');
    Route::get('/register', [AdminController::class, 'register'])->name('admin.register');
    Route::get('/forget-password', [AdminController::class, 'forgetPassword'])->name('admin.forgetPassword');
    Route::get('/otp-verification', [AdminController::class, 'otpVerification'])->name('admin.otpVerification');
    Route::get('/reset-password', [AdminController::class, 'resetPassword'])->name('admin.resetPassword');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/customers', [AdminController::class, 'customers'])->name('admin.customers');
    Route::post('/admin/customers/toggleStatus', [AdminController::class, 'customersStatus'])->name('admin.customer.toggleStatus');
    Route::get('/admin/categories', [AdminController::class, 'categories'])->name('admin.categories');
    Route::post('/admin/category/status-update', [AdminController::class, 'CategoryUpdateStatus'])->name('admin.category.updateStatus');
    Route::post('/admin/category/add', [AdminController::class, 'CategoryAdd'])->name('admin.category.add');
    Route::post('/admin/category/update', [AdminController::class, 'CategoryUpdate'])->name('admin.category.update');
    Route::get('/admin/subcategories/{id}', [AdminController::class, 'SubCategory'])->name('admin.subcategories');
    Route::post('/admin/subcategories/add', [AdminController::class, 'SubCategoryAdd'])->name('admin.subcategory.add');
    Route::post('/admin/subcategories/update', [AdminController::class, 'SubCategoryUpdate'])->name('admin.subcategory.update');
    Route::post('/admin/subcategories/status-update', [AdminController::class, 'SubCategoryUpdateStatus'])->name('admin.subcategory.updateStatus');
    Route::get('/admin/products', [AdminController::class, 'products'])->name('admin.products');
    Route::post('/admin/product/store', [AdminController::class, 'productStore'])->name('admin.product.store');
    Route::post('/admin/product/update-status', [AdminController::class, 'productUpdateStatus'])->name('product.update-status');

    Route::get('admin/products/variants/{id}', [AdminController::class, 'showVariants'])->name('admin.products.variants');
    Route::post('admin/products/variants/add', [AdminController::class, 'variantStore'])->name('admin.variants.store');
    Route::post('admin/variant/upload-image', [AdminController::class, 'VariantUploadImage'])->name('admin.variant.upload-images');
    Route::delete('admin/variant/delete-image/{id}', [AdminController::class, 'deleteInventoryImg'])->name('admin.variant.delete-images');
    Route::post('admin/variant/get-images/{id}', [AdminController::class, 'VariantGetImage'])->name('admin.variant.get-images');
    Route::post('admin/variant/toggle-status', [AdminController::class, 'VariantToggleStatus'])->name('admin.variant.toggle-status');
    Route::post('admin/inventory/update', [AdminController::class, 'inventoryUpdate'])->name('admin.inventory.update');
    Route::get('admin/product/reviews/{id}', [AdminController::class, 'getProductReviews'])->name('admin.product.reviews');
    Route::post('admin/reviews/store', [AdminController::class, 'storeProductReviews'])->name('admin.reviews.store');
    Route::post('admin/reviews/update', [AdminController::class, 'updateProductReviews'])->name('admin.reviews.update');
    Route::post('admin/productReview/toggle-status', [AdminController::class, 'productReviewToggleStatus'])->name('admin.productReview.toggle-status');
    Route::get('admin/product/offers', [AdminController::class, 'productOfferList'])->name('admin.product.offers.index');
    Route::post('admin/offers/save', [AdminController::class, 'productOfferSave'])->name('admin.offers.save');
    Route::post('admin/offers/updateStatus', [AdminController::class, 'productOfferUpdateStatus'])->name('admin.offer.update-status');
    Route::get('admin/assign-offers', [AdminController::class, 'assignOffersList'])->name('admin.assign-offers');
    Route::get('admin/offers/search-items', [AdminController::class, 'offersearchItem'])->name('admin.offers.search-items');
    Route::post('admin/offers/assign-save', [AdminController::class, 'offerAssignSave'])->name('admin.offers.assign-save');
    Route::get('admin/offers/assign-remove', [AdminController::class, 'offerAssignRemove'])->name('admin.offers.assign-remove');
    Route::get('admin/attributes/view', [AdminController::class, 'attributesView'])->name('admin.attributes.view');
    Route::get('admin/attributes/value/{id}', [AdminController::class, 'attributesValue'])->name('admin.attributes.value');
    Route::post('admin.attributes.save', [AdminController::class, 'attributesSave'])->name('admin.attributes.save');
    Route::post('admin.attributesValue.save', [AdminController::class, 'attributesValueSave'])->name('admin.attributesValue.save');
    Route::get('admin/orders', [AdminController::class, 'orderView'])->name('admin.orders');
    Route::get('admin/order-view', [AdminController::class, 'orderView'])->name('admin.order-view');
    Route::get('admin/order-details/{orderNo}', [AdminController::class, 'orderDetailsView'])->name('admin.order-details.view');
    Route::post('admin/update-order-status', [AdminController::class, 'updateOrderStatus'])->name('admin.update-order-status');
    Route::post('admin/update-order-payment-status', [AdminController::class, 'updateOrderPaymentStatus'])->name('admin.update-order-payment-status');
    Route::post('admin/cancel-single-item', [AdminController::class, 'cancelSingleItem'])->name('admin.cancel-single-item');
    Route::post('admin/update-item-status', [AdminController::class, 'updateItemStatus'])->name('admin.update-item-status');
    Route::post('admin/approve-item-refund', [AdminController::class, 'approveItemRefund'])->name('admin.approve-item-refund');
    Route::post('admin/get-refund-details', [AdminController::class, 'getRefundDetails'])->name('admin.get-refund-details');
    Route::get('admin/return-view', [AdminController::class, 'returnList'])->name('admin.return-list-view');
    Route::post('/admin/update-return-status', [AdminController::class, 'updateReturnStatus'])->name('admin.return-list-update');
    Route::get('/admin/get-return-images', [AdminController::class, 'getReturnImages']);

    
    Route::get('admin/coupon-view', [AdminController::class, 'couponView'])->name('admin.coupon-view');
    Route::post('admin/coupon/save', [AdminController::class, 'couponSave'])->name('admin.coupon.save');
    Route::post('admin/coupon/update-status', [AdminController::class, 'couponUpdateStatus'])->name('admin.coupon.update-status');
    Route::get('/admin/assign-coupon/{couponId}', [AdminController::class, 'couponHistory'])->name('admin.coupon-history');
    Route::get('/admin/panding-review', [AdminController::class, 'pendingReviews'])->name('admin.pending-reviews');
    Route::get('/admin/panding-review/approve', [AdminController::class, 'pendingReviewsApprove'])->name('admin.review.approve');
    Route::get('/admin/payment-detail/view', [AdminController::class, 'paymentDetails'])->name('admin.payment-details.view');
    Route::post('admin/update-payment-status', [AdminController::class, 'updatePaymentStatus'])->name('admin.update-payment-status');

    // Refund Management
    Route::get('admin/refund-view', [AdminController::class, 'refundRequestsView'])->name('admin.refund-list-view');
    Route::post('admin/update-refund-status', [AdminController::class, 'updateRefundStatus'])->name('admin.refund-status-update');



    Route::get("/logout", [AdminController::class, 'logout'])->name("admin.logout");
});
