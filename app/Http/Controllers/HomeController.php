<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gallery;
use App\Models\Event;
use App\Models\Service;
use App\Models\hero;
use App\Models\Testimonial;
use Inertia\Inertia;
use App\Models\Contact;
use App\Models\Venue;
use Carbon\Carbon;


class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $services = Service::with('type')->latest()->paginate(4);
        // ✅ Paginer les médias à 5 par page
       $galleryItems = Gallery::with('category')->latest()->paginate(3);
       $contact = Contact::latest()->first();
       $servicesFooter = Service::latest()->take(4)->get();
         $testimonials = Testimonial::latest()->paginate(3);
         $events = Event::with('category')
         ->where('date', '>=', Carbon::now())
         ->orderBy('date', 'asc')
         ->paginate(2);
         $venue = Venue::where('type', 'image')
        //  ->where('is_active', 1)
         ->latest()
         ->first(); // ⚡ PRENDS LE PREMIER !! PAS ->get()


         $heroSlides = Hero::latest()->take(5)->get()->map(function ($slide) {
            return [
                'title' => $slide->title,
                'description' => $slide->description,
                'image' => $slide->url,
                'buttons' => [
                    [
                        'text' => $slide->button1_text,
                        'href' => \Route::has($slide->button1_href) ? route($slide->button1_href) : $slide->button1_href,
                    ],
                    [
                        'text' => $slide->button2_text,
                        'href' => \Route::has($slide->button2_href) ? route($slide->button2_href) : $slide->button2_href,
                    ],
                ],
            ];
        });

        //  dd($venue );
        return Inertia::render('home', [
            'services' => $services,
            'contact' => $contact,
            'items' => $galleryItems,
            'servicesFooter' => $servicesFooter,
            'heroSlides' => $heroSlides,
            'testimonials' => $testimonials,
            'events' => $events,
            'venue' => $venue, // ⬅️ pas de tableau "data"
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
        //
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
