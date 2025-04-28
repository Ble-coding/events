<?php

namespace App\Http\Controllers;


use App\Models\Contact;
use App\Models\Service;
use App\Models\Venue;
use Illuminate\Http\Request;
use Inertia\Inertia;


class VenueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $venueItems = Venue::latest()->paginate(6);

        return Inertia::render('auth/venue-manager', [
            'venues' => $venueItems,
        ]);
    }

    public function getVenues()
    {
        $venues = Venue::latest()->paginate(6);
        $contact = Contact::latest()->first();
        $servicesFooter = Service::latest()->take(6)->get();

        return Inertia::render('venues', [
            'venues' => $venues,
            'contact' => $contact,
            'servicesFooter' => $servicesFooter,
        ]);
    }


    public function getVenuesShow(Venue $venue)
    {
        $contact = Contact::latest()->first();
        $servicesFooter = Service::latest()->take(4)->get();

        return Inertia::render('venues-show', [
            'venue' => $venue,
            'contact' => $contact,
            'servicesFooter' => $servicesFooter,
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
            'name' => 'required|string|max:255',
            'capacity' => 'nullable|integer',
            'location' => 'required|string|max:255',
            'type' => 'required|in:image,video',
            'description' => 'required|string',
            'features' => 'nullable|string', // JSON string
            'availables' => 'nullable|string', // JSON string
            'is_active' => 'required',
            'file' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov,avi,avif|max:10240',
        ]);

        $data = $validated;

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('venues', 'public');
            $data['url'] = '/storage/' . $path;
        }

        $data['features'] = $request->features ? json_decode($request->features, true) : null;
        $data['availables'] = $request->availables ? json_decode($request->availables, true) : null;


        Venue::create($data);

        return redirect()->back()->with('success', 'Salle ajouté avec succès');
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

     public function update(Request $request,Venue $venues_dashboard)
     {
         $validated = $request->validate([
             'name' => 'required|string|max:255',
             'capacity' => 'nullable|integer',
             'location' => 'required|string|max:255',
             'type' => 'required|in:image,video',
             'description' => 'required|string',
             'features' => 'nullable|string', // JSON string
             'availables' => 'nullable|string', // JSON string
             'is_active' => 'required',
             'file' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov,avi,avif|max:10240',
         ]);

         $data = $validated;

         if ($request->hasFile('file')) {
             $path = $request->file('file')->store('venues', 'public');
             $data['url'] = '/storage/' . $path;
         }

         // ⚡ CORRECTION IMPORTANTE : Bien décoder les JSON
         $data['features'] = $request->features ? json_decode($request->features, true) : [];
         $data['availables'] = $request->availables ? json_decode($request->availables, true) : [];

         $venues_dashboard->update($data);

         return redirect()->back()->with('success', 'Salle mise à jour avec succès');
     }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Venue $venues_dashboard)
    {
        $venues_dashboard->delete();

        return redirect()->back()->with('success', 'Salle supprimée avec succès.');
    }
}
