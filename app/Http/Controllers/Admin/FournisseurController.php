<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fournisseur;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FournisseurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $fournisseurs = Fournisseur::where('societe_id', auth()->user()->societe_id)
                                 ->paginate(10);

        return Inertia::render('Admin/Fournisseur/Index', [
            'fournisseurs' => $fournisseurs
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Fournisseur/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'adresse' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'nomContact' => 'nullable|string|max:255',
            'prenomContact' => 'nullable|string|max:255',
            'principal' => 'required|boolean',
            'status' => 'required|boolean',
        ]);

        $fournisseur = Fournisseur::create([
            ...$validated,
            'societe_id' => auth()->user()->societe_id
        ]);

        return redirect()->route('admin.fournisseur.index')
                        ->with('success', 'Fournisseur créé avec succès');
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
    public function edit(Fournisseur $fournisseur)
    {
        return Inertia::render('Admin/Fournisseur/Edit', [
            'fournisseur' => $fournisseur
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Fournisseur $fournisseur)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'adresse' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'nomContact' => 'nullable|string|max:255',
            'prenomContact' => 'nullable|string|max:255',
            'principal' => 'required|boolean',
            'status' => 'required|boolean',
        ]);

        $fournisseur->update($validated);

        return redirect()->route('admin.fournisseur.index')
                        ->with('success', 'Fournisseur mis à jour avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Fournisseur $fournisseur)
    {
        $fournisseur->delete();

        return redirect()->route('admin.fournisseur.index')
                        ->with('success', 'Fournisseur supprimé avec succès');
    }
}
