<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Poste;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PosteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $postes = Poste::where('status', true)
            ->orderBy('libelle')
            ->get();

        return Inertia::render('Admin/Poste/Index', [
            'postes' => $postes
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Poste/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        Poste::create([
            'libelle' => $request->libelle,
            'description' => $request->description,
            'societe_id' => auth()->user()->societe_id
        ]);

        return redirect()->route('admin.poste.index')
            ->with('success', 'Poste créé avec succès.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Poste $poste)
    {
        return Inertia::render('Admin/Poste/Edit', [
            'poste' => $poste
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Poste $poste)
    {
        $request->validate([
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $poste->update([
            'libelle' => $request->libelle,
            'description' => $request->description
        ]);

        return redirect()->route('admin.poste.index')
            ->with('success', 'Poste mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Poste $poste)
    {
        $poste->delete();

        return redirect()->route('admin.poste.index')
            ->with('success', 'Poste supprimé avec succès.');
    }
} 