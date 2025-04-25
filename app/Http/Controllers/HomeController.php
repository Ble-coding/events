<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gallery;
use App\Models\Service;
use App\Models\Testimonial;
use Inertia\Inertia;
use App\Models\Contact;


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


        return Inertia::render('home', [
            'services' => $services,
            'contact' => $contact,
            'items' => $galleryItems,
            'servicesFooter' => $servicesFooter,
            'testimonials' => $testimonials,
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
