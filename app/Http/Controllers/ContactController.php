<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\Faq;
use App\Mail\ContactMessageMail;
use Illuminate\Support\Facades\Mail;
use App\Models\Contact;
use App\Models\Service;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $faqs = Faq::latest()->paginate(5);

        return Inertia::render('auth/contact-faq', [
            'faqs' => $faqs,
            'allfaqItems' => Faq::latest()->get(),
        ]);
    }

    // Afficher les informations (pour l'admin ou l'affichage public si besoin)
    public function indexInfo()
    {
        $contact = Contact::latest()->first();
        return Inertia::render('auth/contact-info', ['contact' => $contact]);
    }


    public function getFaq()
    {
        $faqs = Faq::latest()->paginate(5);
        $contact = Contact::latest()->first();
        $servicesFooter = Service::latest()->take(4)->get();

        return Inertia::render('contact', [
            'faqs' => $faqs,
            'contact' => $contact,
            'servicesFooter' => $servicesFooter
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

        $contact = Contact::first();
        $emails = $contact->email ?? [config('mail.from.address')];
        \Log::info('Formulaire reçu', $validated);

        Mail::to($emails)->send(new ContactMessageMail($validated));

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

     // Enregistrer les informations (cas si aucune n'existe encore)
     public function storeInfo(Request $request)
     {
         $validated = $request->validate([
             'address' => 'nullable|string|max:255',
             'text_footer' => 'nullable|string|max:255',
              'copyright' => 'nullable|string|max:255',
              'phone' => 'nullable|array',
              'phone.*' => 'nullable|string|max:50',
             'email' => 'nullable|email|max:255',
             'weekday_hours' => 'nullable|string|max:100',
             'saturday_hours' => 'nullable|string|max:100',
             'sunday_hours' => 'nullable|string|max:100',
             'map_src' => 'nullable|string|max:2048', // ✅ Ajout ici
             'social_links' => 'nullable|array',
             'social_links.*' => 'nullable|url|max:2048',
         ]);

         $validated['phones'] = $validated['phone'] ?? [];

         Contact::create($validated);

         return redirect()->route('contact-infos.index')->with('success', 'Informations ajoutées.');
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


    public function updateInfo(Request $request)
    {
        $validated = $request->validate([
            'address' => 'nullable|string|max:255',
            'text_footer' => 'nullable|string|max:255',
            'copyright' => 'nullable|string|max:255',
            'phones' => 'nullable|array',
            'phones.*' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'weekday_hours' => 'nullable|string|max:100',
            'saturday_hours' => 'nullable|string|max:100',
            'sunday_hours' => 'nullable|string|max:100',
            'map_src' => 'nullable|string|max:2048', // ✅ Ajout ici aussi
            'social_links' => 'nullable|array',
            'social_links.*' => 'nullable|url|max:2048',
        ]);


        $validated['phones'] = $validated['phones'] ?? [];

        $contact = Contact::latest()->first();

        if ($contact) {
            $contact->update($validated);
        } else {
            Contact::create($validated);
        }

        return redirect()->route('contact-infos.index')->with('success', 'Informations mises à jour.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faq $contact_dashboard)
    {
        $contact_dashboard->delete();

        return redirect()->back()->with('success', 'FAQ supprimée avec succès.');

    }

    // Supprimer un contact (soft delete)
    public function destroyInfo(Contact $contact)
    {
        $contact->delete();

        return redirect()->route('contact-infos.index')->with('success', 'Informations supprimées.');
    }
}
