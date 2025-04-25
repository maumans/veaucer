<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Caisse;
use App\Models\Departement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CaisseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $caisses = Caisse::where('societe_id', auth()->user()->societe_id)
            ->with('departement')
            ->orderBy('nom')
            ->get();

        return Inertia::render('Admin/Caisse/Index', [
            'caisses' => $caisses
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departements = Departement::where('societe_id', auth()->user()->societe_id)
            ->orderBy('nom')
            ->get();

        return Inertia::render('Admin/Caisse/Create', [
            'departements' => $departements
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'required|in:PRINCIPAL,SECONDAIRE',
            'solde' => 'required|numeric|min:0',
            'status' => 'required|boolean',
            'departement_id' => 'nullable|exists:departements,id'
        ]);

        Caisse::create([
            'nom' => $request->nom,
            'slug' => Str::slug($request->nom),
            'type' => $request->type,
            'solde' => $request->solde,
            'status' => $request->status,
            'departement_id' => $request->departement_id,
            'user_id' => auth()->id(),
            'societe_id' => auth()->user()->societe_id
        ]);

        return redirect()->route('admin.caisse.index')
            ->with('success', 'Caisse créée avec succès.');
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
    public function edit(Caisse $caisse)
    {
        $departements = Departement::where('societe_id', auth()->user()->societe_id)
            ->orderBy('nom')
            ->get();

        return Inertia::render('Admin/Caisse/Edit', [
            'caisse' => $caisse,
            'departements' => $departements
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Caisse $caisse)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'required|in:PRINCIPAL,SECONDAIRE',
            'solde' => 'required|numeric|min:0',
            'status' => 'required|boolean',
            'departement_id' => 'nullable|exists:departements,id'
        ]);

        $caisse->update([
            'nom' => $request->nom,
            'slug' => Str::slug($request->nom),
            'type' => $request->type,
            'solde' => $request->solde,
            'status' => $request->status,
            'departement_id' => $request->departement_id
        ]);

        return redirect()->route('admin.caisse.index')
            ->with('success', 'Caisse mise à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Caisse $caisse)
    {
        $caisse->delete();

        return redirect()->route('admin.caisse.index')
            ->with('success', 'Caisse supprimée avec succès.');
    }
}
