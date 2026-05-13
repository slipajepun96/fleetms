<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\VehicleUsage;
use App\Models\Vehicle;
use App\Models\User;

class ManagementController extends Controller
{
    public function managementIndex(): Response
    {
        $approverStatus = Auth::user()->is_approver;
        $currentEntity = Auth::user()->entity;
        $vehicles = Vehicle::where('is_active', 1)->where('owner_entity', '=', $currentEntity)->get();
        $vehicleUsages = VehicleUsage::all();
        $users = User::all();
        return Inertia::render('Management/ManagementIndex', [
            'approver_status' => $approverStatus,
            'vehicle_usages' => $vehicleUsages,
            'vehicles' => $vehicles,
            'users' => $users,
            'current_entity' => $currentEntity,
        ]);
    }


}
