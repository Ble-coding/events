<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\ServiceType;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\Contact;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $types = ServiceType::all();
        $serviceItems = Service::with('type')->latest()->paginate(5);

        return Inertia::render('auth/gallery-service', [
            'types' => $types,
            'items' => $serviceItems,
        ]);
    }

    public function getServices()
    {
        $services = Service::with('type')->latest()->paginate(5);
        $contact = Contact::latest()->first();

        return Inertia::render('services', [
            'services' => $services,
            'contact' => $contact,
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
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type_id' => 'required|exists:service_types,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('services', 'public');
            $validated['image'] = Storage::url($path);
        }

        Service::create($validated);

        return redirect()->back()->with('success', 'Service ajouté avec succès');
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
    public function update(Request $request, Service $services_dashboard)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type_id' => ['required', Rule::exists('service_types', 'id')],
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,avif|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('services', 'public');
            $validated['image'] = Storage::url($path);
        }

        \Log::info('Content Length', [
            'length' => $request->server('CONTENT_LENGTH'),
        ]);

        $services_dashboard->update($validated);

        return redirect()->back()->with('success', 'Service mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $services_dashboard)
    {
        $services_dashboard->delete();

        return redirect()->back()->with('success', 'Service supprimé avec succès.');
    }
}
