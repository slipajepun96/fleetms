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
use App\Http\Controllers\Configuration\ConfigurationController;
use App\Http\Controllers\ManagementController;

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

    //request car
    Route::post('/home', [HomeController::class, 'requestVehicle'])->name('vehicle.request');
    Route::post('/home/delete', [HomeController::class, 'deleteRequestedVehicle'])->name('vehicle.deleteRequested');
    Route::get('/home/approve/{id}', [HomeController::class, 'approveRequestVehicle'])->name('vehicle.approve');
    Route::get('/home/reject/{id}', [HomeController::class, 'rejectRequestVehicle'])->name('vehicle.reject');

    //use vehicle
    Route::post('/home/start-use', [HomeController::class, 'startUseVehicle'])->name('vehicle.startUse');
    Route::post('/home/end-use', [HomeController::class, 'endUseVehicle'])->name('vehicle.endUse');
    Route::post('/home/fuel-use', [HomeController::class, 'saveFuelTransaction'])->name('vehicle.saveFuelTransaction');

    //vehicle
    Route::get('/car', [VehicleController::class, 'carIndex'])->name('vehicle.index');
    Route::post('/car', [VehicleController::class, 'saveVehicle'])->name('vehicle.save');
    Route::post('/car/edit', [VehicleController::class, 'editVehicle'])->name('vehicle.edit');
    Route::post('/car/delete', [VehicleController::class, 'deleteVehicle'])->name('vehicle.delete');

    //user
    Route::get('/user', [UserController::class, 'index'])->name('user.index');
    Route::post('/user/edit', [UserController::class, 'editUser'])->name('user.edit');
    Route::post('/user/authorised', [UserController::class, 'changeAuthorisation'])->name('user.authorise');
    Route::post('/user/delete', [UserController::class, 'deleteUser'])->name('user.delete');

    //configuration
    Route::get('/configuration', [ConfigurationController::class, 'configurationIndex'])->name('configuration.index');

    //management
    Route::get('/management', [ManagementController::class, 'managementIndex'])->name('management.index');
    Route::get('/management/{id}', [ManagementController::class, 'fleetDetail'])->name('fleetDetail');
    Route::post('/management/view', [ManagementController::class, 'viewReport'])->name('viewReport');

    //event
    Route::post('/events', [EventController::class, 'saveNewEvent'])->name('event.saveNewEvent');
    Route::post('/events/delete', [EventController::class, 'deleteEvent'])->name('event.deleteEvent');
});

Route::get('/e/{event_id}', [EventController::class, 'publicAttendanceRegisterForm'])->name('public.event.attendance.form');
Route::post('/e/{event_id}', [EventController::class, 'publicAttendanceRegisterFormSubmit'])->name('public.event.attendance.submitForm');

// Route::get('/test', [HomeController::class, 'test'])->name('test');

require __DIR__.'/auth.php';
