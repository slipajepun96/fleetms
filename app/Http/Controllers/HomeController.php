<?php

namespace App\Http\Controllers;

use App\Models\Event;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Vehicle;
use App\Models\VehicleUsage;
use App\Models\User;


class HomeController extends Controller
{
    public function home(): Response
    {
        $approverStatus = Auth::user()->is_approver;
        $vehicles = Vehicle::where('is_active', 1)->get();
        $vehicleUsages = VehicleUsage::where('user_uuid', Auth::user()->id)->get();
        $vehicleRequestPending = VehicleUsage::where('application_status', 'pending')->get();
        $users = User::all();
        $requestApproved = VehicleUsage::where('user_uuid', Auth::user()->id)->where('application_status', 'approved')->get();
        return Inertia::render('Home', [
            'vehicles' => $vehicles,
            'vehicle_usages' => $vehicleUsages,
            'vehicle_requests_pending' => $vehicleRequestPending,
            'approver_status' => $approverStatus,
            'users' => $users,
            'requests_approved' => $requestApproved,
        ]);
    }

    public function requestVehicle(Request $request): RedirectResponse
    {
        $user_uuid = Auth::user()->id;
        
        // dd($request->all());
        $validated = $request->validate([
            'vehicle_uuid' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);
        $vehicleUsage = new VehicleUsage();
        $vehicleUsage->vehicle_uuid = $validated['vehicle_uuid'];
        $vehicleUsage->destination = $validated['destination'];
        $vehicleUsage->purpose = $validated['purpose'];
        $vehicleUsage->start_date = $validated['start_date'];
        $vehicleUsage->end_date = $validated['end_date'];
        $vehicleUsage->user_uuid = $user_uuid;
        $vehicleUsage->save();

        return Redirect:: route('home');
    }

    public function deleteRequestedVehicle(Request $request): RedirectResponse
    {
        // dd($request->all());
        VehicleUsage::findOrFail($request->id)->delete();
        
        return Redirect::route('home')->with('success', 'Requested vehicle deleted successfully.');

         
    }

    public function approveRequestVehicle(Request $request): RedirectResponse
    {
        $vehicleUsage = VehicleUsage::findOrFail($request->id);
        $vehicleUsage->application_status = 'approved';
        $vehicleUsage->approver_uuid = Auth::user()->id;
        $vehicleUsage->approver_status_datetime = now();
        $vehicleUsage->save();

        return Redirect::route('home')->with('success', 'Vehicle request approved successfully.');
    }

    public function rejectRequestVehicle(Request $request): RedirectResponse
    {
        $vehicleUsage = VehicleUsage::findOrFail($request->id);
        $vehicleUsage->application_status = 'rejected';
        $vehicleUsage->approver_uuid = Auth::user()->id;
        $vehicleUsage->approver_status_datetime = now();
        $vehicleUsage->save();

        return Redirect::route('home')->with('success', 'Vehicle request rejected successfully.');
    }

    public function startUseVehicle(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id' => 'required',
            'current_odometer' => 'required|string|max:255',
        ]);

        $vehicle = Vehicle::findOrFail($validatedd['id']);
        $vehicle->current_odometer = $validated['current_odometer'];
        $vehicle->save();

        return back()->with('success', 'User edit successfully.');
    }
}
