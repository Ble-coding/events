<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class UtilisateurController extends Controller
{

    // public function __construct()
    // {
    //     $this->middleware('auth'); 
    // }

    public function index(): Response
    {
        $users = User::whereNotIn('role', ['admin'])->latest()->paginate(10);
        return Inertia::render('auth/utilisateur-manager', [
            'utilisateurs' => $users,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email',
            'tel' => 'nullable|string|max:20',
            'role' => 'required|string|in:admin,editor,viewer',
            // plus besoin de password ici
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'tel' => $validated['tel'],
            'role' => $validated['role'],
            'password' => Hash::make('12345678'), // mot de passe par défaut
        ]);

        return redirect()->back()->with('success', 'Utilisateur enregistré avec succès.');
    }


    public function edit(User $utilisateurs_dashboard): Response
    {
        return Inertia::render('auth/register', [
            'user' => $utilisateurs_dashboard,
        ]);
    }

    public function update(Request $request, User $utilisateurs_dashboard): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($utilisateurs_dashboard->id),
            ],
            'tel' => 'nullable|string|max:20',
            'role' => 'required|string|in:admin,editor,viewer',
            // on enlève password
        ]);

        $utilisateurs_dashboard->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'tel' => $validated['tel'],
            'role' => $validated['role'],
        ]);

        return redirect()->back()->with('success', 'Utilisateur mis à jour avec succès.');
    }

    public function destroy(User $utilisateurs_dashboard): RedirectResponse
    {
        $utilisateurs_dashboard->delete();
        return redirect()->back()->with('success', 'Utilisateur supprimé avec succès.');
    }
}
