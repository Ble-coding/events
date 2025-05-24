<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use App\Models\Contact;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class TestimonialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $testimonialItems = Testimonial::latest()->paginate(5);

        return Inertia::render('auth/testimonial-section', [
            'testimonials' => $testimonialItems,
            'alltestimonialItems' => Testimonial::latest()->get(),
        ]);

    }

    // public function getTestimonial()
    // {
    //     $testimonials = Testimonial::latest()->paginate(5);
    //     $contact = Contact::latest()->first();
    //     $services = Service::latest()->take(4)->get();

    //     return Inertia::render('services', [
    //         'testimonials' => $testimonials,
    //         'contact' => $contact,
    //         'servicesFooter' => $services,
    //     ]);
    // }

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
        $data = $request->validate([
            'author' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'content' => 'required|string',
            'avatar' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('testimonials', 'public');
        }

        Testimonial::create($data);

        return redirect()->route('testimonials-dashboard.index')->with('success', 'Témoignage ajouté.');
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
    public function update(Request $request, Testimonial $testimonials_dashboard)
    {


        Log::info('Requête reçue pour mise à jour du témoignage', [
            'request' => $request->all(),
            'files' => $request->file(),
        ]);
        $validated = $request->validate([
            'author' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'content' => 'required|string',
            'avatar' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('testimonials', 'public');
        }



        $testimonials_dashboard->update($validated);

        return redirect()->route('testimonials-dashboard.index')->with('success', 'Témoignage mis à jour.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Testimonial $testimonials_dashboard)
    {
        $testimonials_dashboard->delete();
        return redirect()->back()->with('success', 'Témoignage supprimé.');
    }
}
