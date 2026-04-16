<?php

namespace App\Http\Controllers;

use App\Models\Event;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function home(): Response
    {
        $events = Event::where('event_creator_id', auth()->user()->id)->get();

        return Inertia::render('Home', [
            'events' => $events,
        ]);
    }
}
