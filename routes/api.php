<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\VisitorBookingController;
use App\Http\Controllers\API\PreEnrollmentController;
use App\Http\Controllers\API\CourseController;
use App\Http\Controllers\API\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public routes
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Visitor Booking routes
    Route::post('/bookings', [VisitorBookingController::class, 'store']);
    Route::get('/bookings', [VisitorBookingController::class, 'index']);
    Route::get('/bookings/{id}', [VisitorBookingController::class, 'show']);

    // Pre-enrollment routes
    Route::post('/pre-enrollments', [PreEnrollmentController::class, 'store']);
    Route::get('/pre-enrollments', [PreEnrollmentController::class, 'index']);
    Route::get('/pre-enrollments/{id}', [PreEnrollmentController::class, 'show']);
    Route::put('/pre-enrollments/{id}', [PreEnrollmentController::class, 'update']);

    // Protected Course routes (admin only)
    Route::middleware('admin')->group(function () {
        Route::post('/courses', [CourseController::class, 'store']);
        Route::put('/courses/{id}', [CourseController::class, 'update']);
        Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
    });
});

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});
