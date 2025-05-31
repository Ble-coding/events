<?php

namespace App\Http\Controllers;

use App\Models\Hero;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HeroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $slides = Hero::latest()->paginate(1);
        return Inertia::render('auth/hero-manager', [
            'slides' => Hero::latest()->paginate(5),
            'allSlides' => Hero::latest()->get(), // ✅
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
            'button1_text' => 'required|string|max:255',
            'button1_href' => 'required|string|max:255',
            'button2_text' => 'nullable|string|max:255',
            'button2_href' => 'nullable|string|max:255',
            'file' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov,avi,avif|max:10240',
            'url' => 'nullable|string',
        ]);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('heros', 'public');
            $validated['url'] = Storage::url($path);
        }

        Hero::create($validated);

        return redirect()->back()->with('success', 'Slide ajouté avec succès!');
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
    public function update(Request $request, Hero $slide)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'button1_text' => 'required|string|max:255',
            'button1_href' => 'required|string|max:255',
            'button2_text' => 'nullable|string|max:255',
            'button2_href' => 'nullable|string|max:255',
            'file' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov,avi,avif|max:10240',
            'url' => 'nullable|string',
        ]);

        $data = $validated;

        if ($request->hasFile('file')) {
            if ($slide->url && str_starts_with($slide->url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $slide->url);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $path = $request->file('file')->store('heros', 'public');
            $data['url'] = Storage::url($path);
        } elseif ($request->filled('url')) {
            $data['url'] = $request->input('url');
        } else {
            unset($data['url']);
        }

        $slide->update($data);

        return redirect()->back()->with('success', 'Slide modifié avec succès!');
        // ▲ ici tu avais oublié les parenthèses !

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hero $slide)
    {
        $slide->delete();
        return back()->with('success', 'Slide supprimé avec succès!');
    }
}
