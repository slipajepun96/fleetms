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
        $users = User::all();
        return Inertia::render('Configuration/User/User', [
            'users' => $users,
        ]);
    }

    public function editUser(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id' => 'required',
            'name' => 'required|string|max:255',
            'actual_name' => 'nullable|string|max:255',
            'email' => 'required|string|max:255',
            'entity' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'is_approver' => 'nullable|integer',
        ]);
        $users = User::findOrFail($validated['id']);
        $users->name = $validated['name'];
        $users->actual_name = $validated['actual_name'];
        $users->email = $validated['email'];
        $users->entity = $validated['entity'];
        $users->designation = $validated['designation'];
        $users->is_approver = $validated['is_approver'];
        $users->save();
        
        return back()->with('success', 'User edit successfully.');
    }

    public function changeAuthorisation(Request $request): RedirectResponse 
    {
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
        return back()->with('success', 'User authorised status updated successfully.');
    }

    public function deleteUser(Request $requestd): RedirectResponse
    {
        User::findOrFail($requestd->id)->delete();
        return Redirect::route('user.index')->with('success', 'User deleted successfully.');         
    }
}
