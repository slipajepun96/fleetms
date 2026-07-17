<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\GoogleAuthController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Configuration\EntityController;
use App\Http\Controllers\Configuration\UserController;
use App\Http\Controllers\Configuration\ConfigurationController;
use App\Http\Controllers\ManagementController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\Configuration\ParameterController;


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

    //home
    Route::get('/add', [ParameterController::class, 'addForeignWorker'])->name('fworker.add');
    Route::post('/home', [HomeController::class, 'saveFWorker'])->name('fworker.save');
    Route::post('/home/passport', [HomeController::class, 'savePassportWorker'])->name('passport.save');
    Route::post('/home/permit', [HomeController::class, 'savePermitWorker'])->name('permit.save');

    Route::post('/home/delete', [HomeController::class, 'deleteRequestedVehicle'])->name('vehicle.deleteRequested');
    Route::get('/home/approve/{id}', [HomeController::class, 'approveRequestVehicle'])->name('vehicle.approve');
    Route::get('/home/reject/{id}', [HomeController::class, 'rejectRequestVehicle'])->name('vehicle.reject');

    //use vehicle
    Route::post('/home/start-use', [HomeController::class, 'startUseVehicle'])->name('vehicle.startUse');
    Route::post('/home/end-use', [HomeController::class, 'endUseVehicle'])->name('vehicle.endUse');
    Route::post('/home/fuel-use', [HomeController::class, 'saveFuelTransaction'])->name('vehicle.saveFuelTransaction');

    //EntityController
    Route::get('/entity', [EntityController::class, 'entityIndex'])->name('entity.index');
    Route::post('/entity', [EntityController::class, 'saveEntity'])->name('entity.save');
    Route::post('/entity/edit', [EntityController::class, 'editEntity'])->name('entity.edit');
    Route::post('/entity/delete', [EntityController::class, 'deleteEntity'])->name('entity.delete');

    //user
    Route::get('/user', [UserController::class, 'index'])->name('user.index');
    Route::post('/user/edit', [UserController::class, 'editUser'])->name('user.edit');
    Route::post('/user/authorised', [UserController::class, 'changeAuthorisation'])->name('user.authorise');
    Route::post('/user/delete', [UserController::class, 'deleteUser'])->name('user.delete');
    Route::post('/user/disable', [UserController::class, 'disableUser'])->name('user.disable');

    //status parameter
    Route::get('/status', [ParameterController::class, 'statusIndex'])->name('status.index');
    Route::post('/status', [ParameterController::class, 'saveStatus'])->name('status.save');

    //country parameter
    Route::get('/country', [ParameterController::class, 'countryIndex'])->name('country.index');
    Route::post('/country', [ParameterController::class, 'saveCountry'])->name('country.save');

    //configuration
    Route::get('/configuration', [ConfigurationController::class, 'configurationIndex'])->name('configuration.index');

    //management
    Route::get('/management', [ManagementController::class, 'managementIndex'])->name('management.index');
    Route::get('/management/printtest/{vehicle_id}', [ManagementController::class, 'reportPrintPdf'])->name('reportPrintPdf');
    Route::get('/management/{id}', [ManagementController::class, 'fleetDetail'])->name('fleetDetail');
    Route::post('/management/view', [ManagementController::class, 'viewReport'])->name('viewReport');

    //maintenance 
    Route::get('/maintenance', [MaintenanceController::class, 'maintenanceRecord'])->name('maintenance.Record');
    Route::post('/maintenance/new-record', [MaintenanceController::class, 'saveMaintenance'])->name('maintenance.save');
    Route::post('/maintenance/record-edit', [MaintenanceController::class, 'editMaintenance'])->name('maintenance.edit');
    Route::post('/maintenance/record-delete', [MaintenanceController::class, 'deleteMaintenance'])->name('maintenance.delete');
    Route::get('/maintenance/attachment/{id}', [MaintenanceController::class, 'maintenanceAttachment'])->name('maintenance.attachment');

    //pdf
    Route::get('/testpdf', [ManagementController::class, 'testpdf'])->name('testpdf');
    

    //event
    Route::post('/events', [EventController::class, 'saveNewEvent'])->name('event.saveNewEvent');
    Route::post('/events/delete', [EventController::class, 'deleteEvent'])->name('event.deleteEvent');
});

Route::get('/e/{event_id}', [EventController::class, 'publicAttendanceRegisterForm'])->name('public.event.attendance.form');
Route::post('/e/{event_id}', [EventController::class, 'publicAttendanceRegisterFormSubmit'])->name('public.event.attendance.submitForm');

// Route::get('/test', [HomeController::class, 'test'])->name('test');

require __DIR__.'/auth.php';
