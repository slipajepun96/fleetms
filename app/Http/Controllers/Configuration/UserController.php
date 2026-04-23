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
use App\Models\User;

class UserController extends Controller
{
    public function index(): Response
    {
        // dd('test');
        $users = User::all();
        return Inertia::render('User/User', [
            'users' => $users,
        ]);
    }

    public function editUser(Request $request): RedirectResponse
    {
        // dd($request->all());
        $validated = $request->validate([
            'id' => 'required',
            'name' => 'required|string|max:255',
            'actual_name' => 'nullable|string|max:255',
            'email' => 'required|string|max:255',
            'entity' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
        ]);
        // dd($validated);

        $users = User::findOrFail($validated['id']);
        $users->name = $validated['name'];
        $users->actual_name = $validated['actual_name'];
        $users->email = $validated['email'];
        $users->entity = $validated['entity'];
        $users->designation = $validated['designation'];
        $users->save();
        
        // dd($vehicle);

        return Redirect:: route('user.index');
    }

    public function changeAuthorisation(Request $request): RedirectResponse 
    {
        // dd($request->all());
        $user = User::findOrFail($request->id);
        if ($request->current_is_authorised === 0)
            {
            $user->is_authorised = 1;
            }
        else if ($request->current_is_authorised === 1)
            {
            $user->is_authorised = 0;
            }
        $user->save();

        return Redirect:: route('user.index');
    }
}
