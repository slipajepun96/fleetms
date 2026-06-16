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
use App\Models\Maintenance;
use Illuminate\Support\Facades\Storage;

class MaintenanceController extends Controller
{
    public function maintenanceRecord(): response
    {
        // $vehicles = Vehicle::where('is_active', 1)->get();
        // $vehicle_usages = VehicleUsage::all();
        // $user = Auth::user();
        $maintenances = Maintenance::all();

        // $attachment_url = isset($maintenances['attachment_address'])
        //     ? URL::temporarySignedRoute('admin.fleet.file', now()->addMinutes(30), ['path' => base64_encode($maintenances['attachment_address'])]) 
        //     : null;
            
        return Inertia::render('Management/FleetUsage', [
           'maintenances' => $maintenances,
        //    'attachment_url' => $attachment_url,
        //    'vehicles' => $vehicles,
        //    'vehicle_usages' => $vehicle_usages,
        //    'user' => $user,
        ]);
    }

    public function saveMaintenance(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'vehicle_uuid' => 'required|string|max:255',
            'maintenance_date' => 'nullable|date',
            'workshop_name' => 'required|string|max:255',
            'summary' => 'required|string|max:255',
            'attachment_address' => 'nullable|file|mimes:pdf,png,jpg,jpeg|max:2048',
        ]);
        $maintenance = new Maintenance();
        $maintenance->vehicle_uuid = $validated['vehicle_uuid'];
        $maintenance->maintenance_date = $validated['maintenance_date'];
        $maintenance->workshop_name = $validated['workshop_name'];
        $maintenance->summary = $validated['summary'];

        if ($request->hasFile('attachment_address')) 
        {
            $maintenance->attachment_address = $request->file('attachment_address')
            ->store('maintenance', 'local');
        }

        $maintenance->save();

        // return Redirect::route('back')->with('success', 'Maintenance record saved successfully.');
        return back()->with('success', 'Maintenance record saved successfully.');
    }

    public function editMaintenance(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id' => 'required',
            'vehicle_uuid' => 'required|string|max:255',
            'maintenance_date' => 'nullable|date',
            'workshop_name' => 'required|string|max:255',
            'summary' => 'required|string|max:255',
            'attachment_address' => 'nullable|file|mimes:pdf,png,jpg,jpeg|max:2048',
        ]);
        $maintenance = Maintenance::findOrFail($validated['id']);
        $maintenance->vehicle_uuid = $validated['vehicle_uuid'];
        $maintenance->maintenance_date = $validated['maintenance_date'];
        $maintenance->workshop_name = $validated['workshop_name'];
        $maintenance->summary = $validated['summary'];

        if ($request->hasFile('attachment_address')) {
            $maintenance->attachment_address = $request->file('attachment_address')->store('maintenance');
        }

        $maintenance->save();
        return back()->with('success', 'Maintenance record edited successfully.');;
    }

    public function deleteMaintenance(Request $request): RedirectResponse
    {
        Maintenance::findOrFail($request->id)->delete();
        
        return back()->with('success', 'Maintenance deleted successfully.');
    }

    public function maintenanceAttachment($id)
    {
        $maintenance = Maintenance::findOrFail($id);
        $attachment_address = $maintenance['attachment_address'];
       
        return Storage::disk('local')->response($attachment_address);
    }
}
