<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventAttendance;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function saveNewEvent(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'event_name' => 'required|string|max:255',
            'event_date' => 'required|string|max:255',
            'event_venue' => 'required|string|max:255',
            'event_participant_entity_organisation' => 'nullable|string|max:1000',
            'event_description' => 'nullable|string|max:1000',
        ]);

        $event = new Event();
        $event->event_name = $validated['event_name'];
        $event->event_date = $validated['event_date'];
        $event->event_venue = $validated['event_venue'];
        $event->event_participant_entity_organisation = $validated['event_participant_entity_organisation'] ?? '';
        $event->event_description = $validated['event_description'] ?? '';
        $event->event_creator_id = $request->user()->id;
        $event->event_status = 'upcoming';
        $event->save();

        return redirect()->route('home')->with('success', 'Event created successfully.');
    }

    public function deleteEvent(Request $request): RedirectResponse
    {
        // dd("test");
        // dd($request->all());
        $validated = $request->validate([
            'event_id' => 'required|uuid|exists:events,id',
        ]);
        $event = Event::findOrFail($validated['event_id']);
        $event->delete();
        return redirect()->route('home')->with('success', 'Event deleted successfully.');
    }
    
    public function publicAttendanceRegisterForm($event_id): Response
    {
        $event = Event::findOrFail($event_id);

        return Inertia::render('Public/PublicAttendanceRegisterForm', [
            'event' => $event,
        ]);
    }
    
    public function publicAttendanceRegisterFormSubmit(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'event_id' => 'required|uuid|exists:events,id',
            'participant_name' => 'required|string|max:255',
            'participant_nric' => 'nullable|string|max:13',
            'participant_entity' => 'required|string|max:255',
            'participant_designation' => 'nullable|string|max:255',
        ]);

        $event_attendance = new EventAttendance();
        $event_attendance->event_id = $validated['event_id'];
        $event_attendance->participant_name = $validated['participant_name'];
        $event_attendance->participant_nric = $validated['participant_nric'] ?? '';
        $event_attendance->participant_entity = $validated['participant_entity'];
        $event_attendance->participant_designation = $validated['participant_designation'] ?? '';
        $event_attendance->participant_attendance_datetime = now();
        $event_attendance->save();

        return redirect()->route('public.event.attendance.form', ['event_id' => $validated['event_id']])->with('success', 'Attendance registered successfully.');
    }
}
