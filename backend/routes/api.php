<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Routes التي تحتاج إلى مصادقة
Route::middleware('auth:sanctum')->group(function () {
    
    // حذف منشور
    Route::delete('/posts/{id}', [PostController::class, 'destroy'])
        ->where('id', '[0-9]+')
        ->name('posts.destroy');
    
    // يمكنك إضافة المزيد من routes هنا
});

