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
use App\Models\Country;
use App\Models\StatusParameter;

class ParameterController extends Controller
{
    public function statusIndex(): Response
    {
        $statusParameter = StatusParameter::all();
        return Inertia::render('Configuration/Status_Parameter/StatusParameter',[
            'statusParameter' => $statusParameter,
        ]);
    }

    public function countryIndex(): Response
    {
        $countries = Country::all();
        return Inertia::render('Configuration/Country/CountryParameter', [
            'countries' => $countries,
        ]);
    }

    public function saveCountry(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'country_name' => 'required|string|max:255',
            'country_abbv' => 'required|string|max:255',
            'fw_country_abbv' => 'required|string|max:255',
            'color' => 'required|string|max:255',
        ]);

        $countries = new Country();
        $countries->country_name = $validated['country_name'];
        $countries->country_abbv = $validated['country_abbv'];
        $countries->fw_country_abbv = $validated['fw_country_abbv'];
        $countries->color = $validated['color'];
        $countries->save();

        return Redirect::route('country.index');
    } 

    public function saveStatus(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'status_value' => 'required|string|max:255',
            'color' => 'required|string|max:255',
        ]);

        $statusParameter = new StatusParameter();
        $statusParameter->status_value = $validated['status_value'];
        $statusParameter->color = $validated['color'];
        $statusParameter->save();

        return Redirect::route('status.index');
    } 

    public function addForeignWorker(): Response
    {
        // $entities = Entity::all();
        return Inertia::render('AddForeignWorker');
    }
}
