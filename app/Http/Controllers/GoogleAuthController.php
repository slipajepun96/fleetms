<?php

namespace App\Http\Controllers;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Throwable;

use Illuminate\Http\Request;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')
            ->with(['prompt' => 'select_account'])
            ->redirect();
    }

    public function callback()
    {
        try {
            // Get the user information from Google
            $user = Socialite::driver('google')->stateless()->user();
        } catch (Throwable $e) {
            // dd($e);
            \Log::error('Google OAuth Error: ' . $e->getMessage());
            return redirect('/')->with('error', 'Google authentication failed: ' . $e->getMessage());
        }

        $existingUser = User::where('email', $user->email)->first();

        if ($existingUser) {
            Auth::login($existingUser, true);
        } else {
            $newUser = User::updateOrCreate([
                'email' => $user->email
            ], [
                'name' => $user->name,
                'password' => bcrypt(Str::random(16)), // Set a random password
                'email_verified_at' => now()
            ]);

            Auth::login($newUser, true);
        }

        return redirect('/home');
    }
}
