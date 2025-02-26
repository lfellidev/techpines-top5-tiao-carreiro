<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\AuthController;

Route::post('/user/signup', [AuthController::class, 'userSignup']);
Route::post('/user/login', [AuthController::class, 'userLogin']);

Route::middleware('auth:sanctum')->group(function () {
	Route::post('/user/logout', [AuthController::class, 'userLogout']);
	Route::post('/post/suggest', [PostController::class, 'postSuggest']);
	Route::get('/admin/post/get', [PostController::class, 'adminPostGet']);
	Route::delete('/admin/post/delete/{post}' , [PostController::class, 'adminPostDelete']);
	Route::post('/admin/post/suggest', [PostController::class, 'postSuggestAdmin']);
	Route::put('/admin/post/update/visibility/{post}', [PostController::class, 'adminPostUpdateVisibility']);
	Route::put('/admin/post/update/url/{post}', [PostController::class, 'adminPostUpdateUrl']);
});

Route::get('/post/get', [PostController::class, 'postGet']);
Route::get('/posts/{post}', [PostController::class, 'show']);
