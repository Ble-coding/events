<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ServiceType;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ServiceTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $types = ServiceType::latest()->paginate(5);

        return Inertia::render('auth/service-type', [
            'types' => $types,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255','unique:service_types'],
            'description' => ['nullable', 'string'],
        ]);

        ServiceType::create($validated);

        return redirect()->back()->with('success', 'Type de service ajouté avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ServiceType $services_type)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('service_types')->ignore($services_type->id)],
            'description' => ['nullable', 'string'],
        ]);

        $services_type->update($validated);

        return redirect()->back()->with('success', 'Type de service modifié avec succès.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ServiceType $services_type)
    {
        $services_type->delete();

        return redirect()->back()->with('success', 'Type de service supprimé avec succès.');
    }

}
