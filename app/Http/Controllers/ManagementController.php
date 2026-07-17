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
use App\Models\FuelTransaction;
use App\Models\Maintenance;
use Carbon\Carbon;
use Spatie\LaravelPdf\Facades\Pdf;
use function Spatie\LaravelPdf\Support\pdf;

class ManagementController extends Controller
{
    public function managementIndex(): Response
    {
        $approverStatus = Auth::user()->is_approver;
        if ($approverStatus == '1'){
            $currentEntity = Auth::user()->entity;
            // $vehicles = Vehicle::where('is_active', 1)->where('owner_entity', '=', $currentEntity)->get();
            $vehicleUsages = VehicleUsage::all();
            $users = User::all();
            return Inertia::render('Management/ManagementIndex', [
                'approver_status' => $approverStatus,
                'vehicle_usages' => $vehicleUsages,
                // 'vehicles' => $vehicles,
                'users' => $users,
                'current_entity' => $currentEntity,
                
            ]);
        }
        else {
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
    }

    public function fleetDetail($id): Response
    {
        $vehicles = Vehicle::findOrFail($id);
        $vehicle_usages =VehicleUsage::where('vehicle_uuid', $vehicles->id)
            ->where('application_status', '!=', 'rejected')
            ->get();
        
        $statement_dates = VehicleUsage::selectRaw("
            YEAR(actual_start_datetime) as year,
            MONTH(actual_start_datetime) as month,
            DATE_FORMAT(actual_start_datetime, '%M %Y') as month_year")
            ->where('vehicle_uuid', $vehicles->id)
            ->groupBy('year', 'month', 'month_year')
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->get();
        $maintenances = Maintenance::all();
        return Inertia::render('Management/ManagementLayout', [
            'vehicles' => $vehicles,
            'vehicle_usages' => $vehicle_usages,
            'statement_dates' => $statement_dates,
            'maintenances' => $maintenances,
        ]);
    }

    public function viewReport(Request $request): Response
    {
        try{
            // dd("test");
            $vehicles = Vehicle::findOrFail($request->vehicle_id);
            $date = Carbon::createFromFormat('F Y', $request->selectedMonthYear);
            $vehicle_usages = VehicleUsage::where('vehicle_uuid', $request->vehicle_id)
                ->where('application_status', 'finished')
                ->whereMonth('actual_start_datetime', $date->month)
                ->whereYear('actual_start_datetime', $date->year)
                ->orderBy('actual_start_datetime', 'asc')
                ->get();

            if ($date->month === 1){$year = $date->year-1; $month = 12;} else {$year = $date->year; $month = $date->month-1;}

            $latest_previous_month_vehicle_usage = VehicleUsage::where('vehicle_uuid', $request->vehicle_id)
                ->where('application_status', 'finished')
                ->whereMonth('actual_start_datetime', $month)
                ->whereYear('actual_start_datetime', $year)
                ->orderBy('actual_start_datetime', 'desc')
                ->get();

            $previous_month_odometer = $vehicles->initial_odometer;
            if($latest_previous_month_vehicle_usage->isNotEmpty()){
                $previous_month_odometer = $latest_previous_month_vehicle_usage[0]->end_odometer;
            }
            $users = User::all();
            $fuelTransactions = FuelTransaction::whereIn('vehicle_usage_uuid', $vehicle_usages->pluck('id'))->get();
            return Inertia::render('Management/ReportView', [
                'vehicles' => $vehicles,
                'vehicle_usages' => $vehicle_usages,
                'users' => $users,
                'fuelTransactions' => $fuelTransactions,
                'selectedMonthYear' => $request->selectedMonthYear,
                'previous_month_odometer' => $previous_month_odometer,
            ]);
        } catch(\Exception $e) {
            return to_route('home');
        }

    }

    public function reportPrintPdf(Request $request, $vehicle_id)
    {
        // dd($vehicle_id);
        $vehicles = Vehicle::findOrFail($vehicle_id);
        // $vehicles = Vehicle::findOrFail($vehicle_usages->vehicle_uuid);
        // dd($selectedMonthYear);
        $date = Carbon::createFromFormat('F Y', $request->selectedMonthYear);
        $vehicle_usages = VehicleUsage::where('vehicle_uuid', $vehicle_id)
            ->where('application_status', 'finished')
            ->whereMonth('actual_start_datetime', $date->month)
            ->whereYear('actual_start_datetime', $date->year)
            ->orderBy('actual_start_datetime', 'asc')
            ->get();

        if ($date->month === 1){$year = $date->year-1; $month = 12;} else {$year = $date->year; $month = $date->month-1;}
        $latest_previous_month_vehicle_usage = VehicleUsage::where('vehicle_uuid', $vehicle_id)
            ->where('application_status', 'finished')
            ->whereMonth('actual_start_datetime', $month)
            ->whereYear('actual_start_datetime', $year)
            ->orderBy('actual_start_datetime', 'desc')
            ->get();

        $previous_month_odometer = $vehicles->initial_odometer;
        if ($latest_previous_month_vehicle_usage->isNotEmpty()) {
            $previous_month_odometer = $latest_previous_month_vehicle_usage[0]->end_odometer;
        }

        // $users = User::all();
        $users = User::select('id', 'name')->get();
        $fuelTransactions = FuelTransaction::whereIn('vehicle_usage_uuid', $vehicle_usages->pluck('id'))->get();

        
        // return view('testpdf', [
        //     'vehicle_usages' => $vehicle_usages, 
        //     'vehicles' => $vehicles, 
        //     'fuelTransactions' => $fuelTransactions,
        //     'users' => $users,
        //     'selectedMonthYear' => $request->selectedMonthYear,
        //     'previous_month_odometer' => $previous_month_odometer,
        // ]);

        return pdf()->view('testpdf', [
            'vehicle_usages' => $vehicle_usages,
            'vehicles' => $vehicles,
            'fuelTransactions' => $fuelTransactions,
            'users' => $users,
            'selectedMonthYear' => $request->selectedMonthYear,
            'previous_month_odometer' => $previous_month_odometer,
        ])
        ->landscape()->download('report.pdf');
    } 
}
