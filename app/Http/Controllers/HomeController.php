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
use App\Models\FuelTransaction;


class HomeController extends Controller
{
    public function home(): Response
    {
        $approverStatus = Auth::user()->is_approver;
        $vehicles = Vehicle::where('is_active', 1)->get();
        $vehicleUsages = VehicleUsage::where('user_uuid', Auth::user()->id)->get();
        $vehicleRequestPending = VehicleUsage::where('application_status', 'pending')->get();
        $vehicleInProgress = VehicleUsage::where('application_status', 'progress')->get();
        $users = User::all();
        $fuelTransactions = FuelTransaction::all();
        $requestApproved = VehicleUsage::where('user_uuid', Auth::user()->id)->where('application_status', 'approved')->get();
        return Inertia::render('Home', [
            'vehicles' => $vehicles,
            'vehicle_usages' => $vehicleUsages,
            'vehicle_requests_pending' => $vehicleRequestPending,
            'vehicle_in_progress' => $vehicleInProgress,
            'approver_status' => $approverStatus,
            'users' => $users,
            'fuelTransactions' => $fuelTransactions,
            'requests_approved' => $requestApproved,
        ]);
    }

    public function requestVehicle(Request $request): RedirectResponse
    {
        $user_uuid = Auth::user()->id;
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
            'vehicle_usage_uuid' => 'required',
            'current_odometer' => 'nullable|string|max:255',
            'actual_start_datetime' => 'nullable|string',
        ]);
        $vehicleUsage = VehicleUsage::findOrFail($validated['vehicle_usage_uuid']);
        $vehicleUsage->start_odometer = $validated['current_odometer'];
        $vehicleUsage->actual_start_datetime = now();
        $vehicleUsage->application_status = 'progress';
        $vehicleUsage->save();
        
        return back()->with('success', 'Vehicle use started successfully.');
    }

    public function endUseVehicle(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'vehicle_usage_uuid' => 'required',
            'actual_start_datetime' => 'nullable|date',
            'end_odometer' => 'nullable|string|max:255',
            'notes_on_return' => 'nullable|string|max:255',
        ]);
        // dd($validated);
        $vehicleUsage = VehicleUsage::findOrFail($validated['vehicle_usage_uuid']);
        $vehicleUsage->end_odometer = $validated['end_odometer'];
        $vehicleUsage->application_status = 'finished';
        $vehicleUsage->actual_end_datetime = now();
        $vehicleUsage->notes_on_return = $validated['notes_on_return'];
        $vehicleUsage->return_datetime = now();
        $vehicleUsage->return_user_uuid = Auth::user()->id;
        $vehicleUsage->save();

        $vehicle = Vehicle::findOrFail($vehicleUsage->vehicle_uuid);
        $vehicle->current_odometer = $validated['end_odometer'];
        $vehicle->save();

        return back()->with('success', 'Vehicle use ended successfully.');
    }

    public function saveFuelTransaction(Request $request): RedirectResponse
    { 
        $validated = $request->validate([
            'vehicle_usage_uuid' => 'required',
            'fuel_type' => 'nullable|string|max:255',
            'fuel_total_price' => 'nullable|string|max:255',
            'fuel_liter' => 'nullable|string|max:255',
            'transaction_date' => 'nullable|date',
        ]);
        $fuelTransaction = new FuelTransaction();
        $fuelTransaction->vehicle_usage_uuid = $validated['vehicle_usage_uuid'];
        $fuelTransaction->fuel_type = $validated['fuel_type'];
        $fuelTransaction->fuel_total_price = $validated['fuel_total_price'];
        $fuelTransaction->fuel_liter = $validated['fuel_liter'];
        $fuelTransaction->transaction_date = $validated['transaction_date'];
        $fuelTransaction->save();
        
        return to_route('home');
    }
}