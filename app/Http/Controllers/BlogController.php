<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Blog;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\Contact;
use App\Models\Service;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $blogItems = Blog::with('category')->latest()->paginate(6);
        $categories = Category::all();

        return Inertia::render('auth/blog-manager', [
            'blogs' => $blogItems,
            'categories' => $categories,
            'allblogItems' => Blog::latest()->get(),
        ]);
    }

    public function getBlogs()
{
    $blogs = Blog::with('category')->where('is_active', true)->latest()->paginate(6);
    $contact = Contact::latest()->first();
    $servicesFooter = Service::latest()->take(6)->get();

    return Inertia::render('blogs', [
        'blogs' => $blogs,
        'contact' => $contact,
        'allblogItems' => Blog::latest()->get(),
        'servicesFooter' => $servicesFooter,
    ]);
}

    public function getBlogsShow(Blog $blog)
    {
        $otherBlogs = Blog::with('category')->where('id', '!=', $blog->id)
            ->latest()
            ->take(2)
            ->get(['id', 'title', 'date']);
            $contact = Contact::latest()->first();
            $servicesFooter = Service::latest()->take(4)->get();

        return Inertia::render('blogs-show', [
            'blog' => $blog->load('category'),
            'otherBlogs' => $otherBlogs,
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
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'date' => 'required|date',
            'is_active' => 'required|boolean',
            'type' => 'required|in:image,video',
            'category_id' => 'nullable|exists:categories,id',
            'file' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov,avi|max:10240',
        ]);

        $data = $validated;

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('blogs', 'public');
            $data['url'] = '/storage/' . $path;
        }

        Blog::create($data);

        return redirect()->back()->with('success', 'Article créé avec succès.');
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
    public function update(Request $request, Blog $blogs_dashboard)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'date' => 'required|date',
            'is_active' => 'required|boolean',
            'type' => 'required|in:image,video',
            'category_id' => 'nullable|exists:categories,id',
            'file' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov,avi,avif|max:10240',
        ]);

        $data = $validated;

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('blogs', 'public');
            $data['url'] = '/storage/' . $path;
        }

        $blogs_dashboard->update($data);

        return redirect()->back()->with('success', 'Article mis à jour avec succès.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blog $blogs_dashboard)
    {
        $blogs_dashboard->delete();

        return redirect()->back()->with('success', 'Article supprimé avec succès.');
    }
}
