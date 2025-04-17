<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\Faq;
use App\Mail\ContactMessageMail;
use Illuminate\Support\Facades\Mail;


class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $faqs = Faq::latest()->paginate(3);

        return Inertia::render('auth/contact-faq', [
            'faqs' => $faqs,
        ]);
    }

    public function getFaq()
    {
        $faqs = Faq::latest()->paginate(5);

        return Inertia::render('contact', [
            'faqs' => $faqs,
        ]);
    }


    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);

        Mail::to('contact@guiloservices.fr')->send(new ContactMessageMail($validated));

        return redirect()->back()->with('success', 'Nous vous répondrons dans les plus brefs délais.');

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
            'question' => 'required|string|max:255',
            'answer'   => 'required|string',
        ]);

        Faq::create($validated);

        return redirect()->back()->with('success', 'FAQ ajoutée avec succès.');
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
    public function update(Request $request, Faq $contact_dashboard)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer'   => 'required|string',
        ]);

        $contact_dashboard->update($validated);

        return redirect()->back()->with('success', 'FAQ mise à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faq $contact_dashboard)
    {
        $contact_dashboard->delete();

        return redirect()->back()->with('success', 'FAQ supprimée avec succès.');

    }
}
