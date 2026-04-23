<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\GoogleAuthController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Configuration\VehicleController;
use App\Http\Controllers\Configuration\UserController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route to redirect to Google's OAuth page
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('auth.google.redirect');

// Route to handle the callback from Google
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');

Route::middleware('auth')->group(function () {
    Route::get('/home', [HomeController::class, 'home'])->name('home');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //vehicle
    Route::get('/car', [VehicleController::class, 'carIndex'])->name('vehicle.index');
    Route::post('/car', [VehicleController::class, 'saveVehicle'])->name('vehicle.save');
    Route::post('/car/edit', [VehicleController::class, 'editVehicle'])->name('vehicle.edit');
    Route::post('/car/delete', [VehicleController::class, 'deleteVehicle'])->name('vehicle.delete');

    //user
    Route::get('/user', [UserController::class, 'index'])->name('user.index');
    Route::post('/user/edit', [UserController::class, 'editUser'])->name('user.edit');
    Route::post('/user/authorised', [UserController::class, 'changeAuthorisation'])->name('user.authorise');
    
    //event
    Route::post('/events', [EventController::class, 'saveNewEvent'])->name('event.saveNewEvent');
    Route::post('/events/delete', [EventController::class, 'deleteEvent'])->name('event.deleteEvent');
});

Route::get('/e/{event_id}', [EventController::class, 'publicAttendanceRegisterForm'])->name('public.event.attendance.form');
Route::post('/e/{event_id}', [EventController::class, 'publicAttendanceRegisterFormSubmit'])->name('public.event.attendance.submitForm');

require __DIR__.'/auth.php';
