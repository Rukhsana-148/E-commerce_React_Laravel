<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\ProductController;
use App\Http\Middleware\CorsMiddleware;

Route::post('/auth/register',[RegisterController::class, "register"]);
Route::post('/auth/login',[RegisterController::class, "login"]);
Route::post('/auth/forgetPassword',[RegisterController::class, "forgetPassword"]);
Route::get('/auth/reset-password/{token}', [RegisterController::class, 'showResetForm'])->name('reset-password');
Route::post('/auth/reset-password', [RegisterController::class, 'resetPassword']);
Route::get('/editProfile/{id}', [RegisterController::class, 'editProfile']);
Route::post('/myProfile/{id}', [RegisterController::class, 'myProfile']);
Route::post('/addProduct', [ProductController::class, 'addProduct']);
Route::get('/products', [ProductController::class, 'showProducts']);
Route::post('/addCart', [ProductController::class, 'addCart']);
Route::get('/search/{key}', [ProductController::class, 'search']);
Route::get('/getType/{type}', [ProductController::class, 'getType']);
Route::get('/allCart/{user_id}', [ProductController::class, 'allCart']);
Route::get('/totalCart/{user_id}', [ProductController::class, 'totalCart']);
Route::get('/cart/{id}', [ProductController::class, 'cart']);
Route::post('/sellProduct', [ProductController::class, 'sellProduct']);
Route::get('/myProducts/{id}', [ProductController::class, 'myProducts']);
Route::get('/delete/{id}', [ProductController::class, 'delete']);
Route::get('/getProduct/{id}', [ProductController::class, 'getProduct']);
Route::post('/productUpdate', [ProductController::class, 'productUpdate']);
Route::post('/review', [ProductController::class, 'review']);
Route::get('/deleteCart/{id}', [ProductController::class, 'deleteCart']);
Route::get('/inventory/{id}', [ProductController::class, 'inventory']);
Route::post('/increaseQuant', [ProductController::class, 'increaseQuant']);
Route::post('/increaseQuant', [ProductController::class, 'increaseQuant']);
Route::get('/getTotalSell/{id}', [ProductController::class, 'getTotalSell']);
Route::post('/sendRequest', [ProductController::class, 'sendRequest']);
Route::get('/allRequest', [ProductController::class, 'allRequest']);
Route::get('/deleteUser/{id}', [ProductController::class, 'deleteUser']);
Route::get('/approveUser/{id}', [ProductController::class, 'approveUser']);
Route::post('/discountProduct', [ProductController::class, 'discountProduct']);
Route::get('/resetDiscount/{id}', [ProductController::class, 'resetDiscount']);

Route::middleware([CorsMiddleware::class])->group(function () {
    Route::post('/auth/forgetPassword', [RegisterController::class, 'forgetPassword']);
   
});
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
