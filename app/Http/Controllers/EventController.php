<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Service;
use App\Models\Event;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
     // Affiche la liste des événements (pagination)
     public function index()
     {
         $eventItems = Event::with('category')->latest()->paginate(6);
         $categories = Category::all();

         return Inertia::render('auth/event-calendar', [
            'categories' => $categories,
            'alleventItems' => Event::with('category')->latest()->get(),
            'events' => $eventItems,
         ]);
     }


     // Récupère les événements pour afficher dans la page "services"
    public function getEvents()
    {
        $events = Event::with('category')->latest()->paginate(6);
        $contact = Contact::latest()->first(); // Récupère les infos de contact
        $servicesFooter = Service::latest()->take(6)->get(); // Services pour le footer

        return Inertia::render('events', [
            'events' => $events,
            'alleventItems' => Event::with('category')->latest()->get(),
            'contact' => $contact,
            'servicesFooter' => $servicesFooter,
        ]);
    }

    public function getEventsShow(Event $event)
    {
        $contact = Contact::latest()->first(); // Récupère les infos de contact
        $servicesFooter = Service::latest()->take(4)->get(); // Services pour le footer

        return Inertia::render('events-show', [
            'event' => $event->load('category'),
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
            'title' => 'required|string|max:255',
            'date' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'location' => 'required|string',
            'type' => 'required|in:image,video',
            'description' => 'required|string',
            'schedule' => 'nullable|string', // JSON string
            'highlights' => 'nullable|string', // JSON string
            'isActive' => 'required',
            'file' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov,avi,avif|max:10240',
        ]);

        $data = $validated;

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('events', 'public');
            $data['url'] = '/storage/' . $path;
        }

        $data['schedule'] = $request->schedule ? json_decode($request->schedule, true) : null;
        $data['highlights'] = $request->highlights ? json_decode($request->highlights, true) : null;

        Event::create($data);

        return redirect()->back()->with('success', 'Événement ajouté avec succès');
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
    public function update(Request $request, Event $events_dashboard)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'location' => 'required|string',
            'type' => 'required|in:image,video',
            'description' => 'required|string',
            'schedule' => 'nullable|string', // JSON string
            'highlights' => 'nullable|string', // JSON string
            'isActive' => 'required',
            'file' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov,avi,avif|max:10240',
        ]);

        $data = $validated;

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('events', 'public');
            $data['url'] = '/storage/' . $path;
        }

        $data['schedule'] = $request->schedule ? json_decode($request->schedule, true) : null;
        $data['highlights'] = $request->highlights ? json_decode($request->highlights, true) : null;


        $events_dashboard->update($data);

        return redirect()->back()->with('success', 'Événement mis à jour avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $events_dashboard)
    {
        $events_dashboard->delete();

        return redirect()->back();
    }
}
