<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Departement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departements = Departement::where('societe_id', auth()->user()->societe_id)
                                 ->with(['user'])
                                 ->paginate(10);

        return Inertia::render('Admin/Departement/Index', [
            'departements' => $departements
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Departement/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:PRINCIPAL,SECONDAIRE',
            'telephone' => 'nullable|string|max:20',
            'status' => 'required|boolean',
        ]);

        $departement = Departement::create([
            ...$validated,
            'societe_id' => auth()->user()->societe_id,
            'user_id' => auth()->id()
        ]);

        return redirect()->route('admin.departement.index')
                        ->with('success', 'Département créé avec succès');
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
    public function edit(Departement $departement)
    {
        return Inertia::render('Admin/Departement/Edit', [
            'departement' => $departement
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Departement $departement)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:PRINCIPAL,SECONDAIRE',
            'telephone' => 'nullable|string|max:20',
            'status' => 'required|boolean',
        ]);

        $departement->update($validated);

        return redirect()->route('admin.departement.index')
                        ->with('success', 'Département mis à jour avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Departement $departement)
    {
        $departement->delete();

        return redirect()->route('admin.departement.index')
                        ->with('success', 'Département supprimé avec succès');
    }
}
