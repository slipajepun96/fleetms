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
use App\Models\Entity;

class EntityController extends Controller
{
    public function entityIndex(): Response
    {
        $entities = Entity::all();
        return Inertia::render('Configuration/Car/Entity',[
            'entities' => $entities,
        ]);
    }

    public function saveEntity(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'estate_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'abbroviation' => 'required|string|max:255',
            'entity_type' => 'required|string|max:255',
        ]);
        
        $entity = new Entity();
        $entity->estate_name = $validated['estate_name'];
        $entity->address = $validated['address'];
        $entity->abbroviation = $validated['abbroviation'];
        $entity->entity_type = $validated['entity_type'];
        
        $entity->save();

        return Redirect:: route('entity.index');
    }

    public function editEntity(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id' => 'required',
            'estate_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'abbroviation' => 'required|string|max:255',
            'entity_type' => 'required|string|max:255',
        ]);

        $entity = Entity::findOrFail($validated['id']);
        $entity->estate_name = $validated['estate_name'];
        $entity->address = $validated['address'];
        $entity->abbroviation = $validated['abbroviation'];
        $entity->entity_type = $validated['entity_type'];
        $entity->save();

        return Redirect:: route('entity.index');
    }

    public function deleteEntity(Request $requestd): RedirectResponse
    {
        Vehicle::findOrFail($requestd->id)->delete();
        return Redirect::route('entity.index')->with('success', 'Entity deleted successfully.');
    }
}
