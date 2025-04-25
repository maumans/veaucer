<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = User::whereHas('roles', function ($query) {
            $query->where('name', 'Client');
        })
            ->where('societe_id', auth()->user()->societe_id)
            ->orderBy('nom')
            ->get();

        return Inertia::render('Admin/Client/Index', [
            'clients' => $clients
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Client/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string',
            'password' => ['required', 'confirmed', Password::defaults()],
            'status' => 'required|boolean'
        ]);

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'adresse' => $request->adresse,
            'password' => Hash::make($request->password),
            'status' => $request->status,
            'societe_id' => auth()->user()->societe_id
        ]);

        // Attribuer le rôle Client
        $clientRole = Role::where('name', 'Client')->first();
        $user->assignRole($clientRole);

        return redirect()->route('admin.client.index', [auth()->user()->id])
            ->with('success', 'Client créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $client)
    {
        return Inertia::render('Admin/Client/Show', [
            'client' => $client
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $client)
    {
        return Inertia::render('Admin/Client/Edit', [
            'client' => $client
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $client)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $client->id,
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string',
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'status' => 'required|boolean'
        ]);

        $data = [
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'adresse' => $request->adresse,
            'status' => $request->status
        ];

        // Mettre à jour le mot de passe seulement s'il est fourni
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $client->update($data);

        return redirect()->route('admin.client.index', [auth()->user()->id])
            ->with('success', 'Client mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $client)
    {
        // Vérifier si l'utilisateur a le rôle Client
        if (!$client->hasRole('Client')) {
            return redirect()->route('admin.client.index', [auth()->user()->id])
                ->with('error', 'Cet utilisateur n\'est pas un client.');
        }

        $client->delete();

        return redirect()->route('admin.client.index', [auth()->user()->id])
            ->with('success', 'Client supprimé avec succès.');
    }
}
