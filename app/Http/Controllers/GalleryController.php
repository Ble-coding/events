<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\Contact;
use App\Models\Service;

class GalleryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::all();
        // ✅ Paginer les médias à 5 par page
       $galleryItems = Gallery::with('category')->latest()->paginate(6);

        return Inertia::render('auth/gallery-manager', [
            'categories' => $categories,
            'allgalleryItems' => Gallery::with('category')->latest()->get(),
            'items' => $galleryItems,
        ]);
    }

    public function getGaleries()
    {
        $galeries = Gallery::with('category')->latest()->get();
        $contact = Contact::latest()->first();
        $servicesFooter = Service::latest()->take(4)->get();

        return Inertia::render('galeries', [
            'galeries' => $galeries,
            'contact' => $contact,
            'servicesFooter' => $servicesFooter,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:image,video',
            'file' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov,avi,avif|max:10240',
            'url' => 'nullable|string',
        ]);

        // Gestion du fichier uploadé
        if ($request->hasFile('file')) {
            $file = $request->file('file');

            \Log::info('Fichier reçu', [
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'extension' => $file->getClientOriginalExtension(),
                'taille_ko' => $file->getSize() / 1024,
            ]);

            $path = $file->store('gallery', 'public');
            $validated['url'] = Storage::url($path);

            \Log::info('Fichier enregistré', [
                'path' => $path,
                'url' => $validated['url'],
            ]);
        }

        // Si aucun fichier ni URL
        if (empty($validated['url'])) {
            \Log::warning('Aucun fichier ni URL fourni');
            return back()->withErrors(['url' => 'Un fichier ou une URL est requis'])->withInput();
        }

        $gallery = Gallery::create($validated);
        \Log::info('Galerie enregistrée', ['id' => $gallery->id]);

        return redirect()->back()->with('success', 'Élément ajouté avec succès');
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
    public function update(Request $request, Gallery $gallery)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:image,video',
            'url' => 'nullable|string',
            'file' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov,avi|max:10240',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');

            // Supprimer l'ancien fichier s'il existait (et pas une URL externe)
            if ($gallery->url && str_starts_with($gallery->url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $gallery->url);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                    \Log::info('Ancien fichier supprimé', ['path' => $oldPath]);
                }
            }

            $path = $file->store('gallery', 'public');
            $data['url'] = Storage::url($path);

            \Log::info('Nouveau fichier enregistré', [
                'original_name' => $file->getClientOriginalName(),
                'mime' => $file->getMimeType(),
                'taille_ko' => $file->getSize() / 1024,
                'url' => $data['url'],
            ]);
        } elseif ($request->filled('url')) {
            $data['url'] = $request->input('url');
            \Log::info('URL manuelle utilisée', ['url' => $data['url']]);
        } else {
            unset($data['url']);
            \Log::info('Aucun fichier ou URL fourni, URL non modifiée');
        }

        $gallery->update($data);
        \Log::info('Galerie mise à jour', ['id' => $gallery->id]);

        return redirect()->back()->with('success', 'Élément mis à jour avec succès');
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Gallery $gallery)
    {
        $gallery->delete();
        return redirect()->back();
    }
}
