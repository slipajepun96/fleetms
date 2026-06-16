<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Vehicle;

class VehicleController extends Controller
{
    public function carIndex(): Response
    {
        $vehicles = vehicle::all();
        return Inertia::render('Configuration/Car/Vehicle', [
           'vehicles' => $vehicles,
        ]);
    }

    public function saveVehicle(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'plateNum' => 'required|string|max:255',
            'vehicle_manufacturer' => 'required|string|max:255',
            'vehicle_model' => 'required|string|max:255',
            'insurance_expiry' => 'required|date',
            'roadtax_expiry' => 'required|date',
            'vehicle_type' => 'required|string|max:255',
            'designated_person' => 'nullable|string|max:255',
            'owner_entity' => 'required|string|max:255',
            'initial_odometer' => 'required|string|max:255',
        ]);
        
        $vehicle = new Vehicle();
        $vehicle->plateNum = $validated['plateNum'];
        $vehicle->vehicle_manufacturer = $validated['vehicle_manufacturer'];
        $vehicle->vehicle_model = $validated['vehicle_model'];
        $vehicle->insurance_expiry = $validated['insurance_expiry'];
        $vehicle->roadtax_expiry = $validated['roadtax_expiry'];
        $vehicle->vehicle_type = $validated['vehicle_type'];
        $vehicle->designated_person = $validated['designated_person'];
        $vehicle->owner_entity = $validated['owner_entity'];
        $vehicle->initial_odometer = $validated['initial_odometer'];
        $vehicle->current_odometer = $validated['initial_odometer'];
        
        $vehicle->save();

        return Redirect:: route('vehicle.index');
    }

    public function editVehicle(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id' => 'required',
            'plateNum' => 'required|string|max:255',
            'vehicle_manufacturer' => 'required|string|max:255',
            'vehicle_model' => 'required|string|max:255',
            'insurance_expiry' => 'required|date',
            'roadtax_expiry' => 'required|date',
            
            'vehicle_type' => 'required|string|max:255',
            'designated_person' => 'nullable|string|max:255',
            'owner_entity' => 'required|string|max:255',
            'current_odometer' => 'required|string|max:255',
        ]);

        $vehicle = Vehicle::findOrFail($validated['id']);
        $vehicle->plateNum = $validated['plateNum'];
        $vehicle->vehicle_manufacturer = $validated['vehicle_manufacturer'];
        $vehicle->vehicle_model = $validated['vehicle_model'];
        $vehicle->insurance_expiry = $validated['insurance_expiry'];
        $vehicle->roadtax_expiry = $validated['roadtax_expiry'];
        $vehicle->vehicle_type = $validated['vehicle_type'];
        $vehicle->designated_person = $validated['designated_person'];
        $vehicle->owner_entity = $validated['owner_entity'];
        $vehicle->current_odometer = $validated['current_odometer'];
        $vehicle->save();

        return Redirect:: route('vehicle.index');
    }

    public function deleteVehicle(Request $requestd): RedirectResponse
    {
        Vehicle::findOrFail($requestd->id)->delete();
        return Redirect::route('vehicle.index')->with('success', 'Vehicle deleted successfully.');
    }
}
