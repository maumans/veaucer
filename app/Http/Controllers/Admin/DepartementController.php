<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Departement;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departements = Departement::where('societe_id', session('societe')['id'])
            ->with(['user'])
            ->paginate(10);


        return Inertia::render('Admin/Departement/Index', [
            'departements' => $departements
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(User $user)
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
            //'type' => 'required|in:PRINCIPAL,SECONDAIRE',
            'telephone' => 'nullable|string|max:20',
            'status' => 'required|boolean',
        ]);

        $departement = Departement::create([
            ...$validated,
            'societe_id' => auth()->user()->societe_id,
            'user_id' => auth()->id()
        ]);

        return redirect()->route('admin.departement.index', auth()->id())
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
    public function edit($userId, $departementId)
    {
        $departement = Departement::findOrFail($departementId);

        return Inertia::render('Admin/Departement/Edit', [
            'departement' => $departement
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $userId, $departementId)
    {
        $departement = Departement::findOrFail($departementId);
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            //'type' => 'required|in:PRINCIPAL,SECONDAIRE',
            'telephone' => 'nullable|string|max:20',
            'status' => 'required|boolean',
        ]);

        $departement->update($validated);

        return redirect()->route('admin.departement.index', $userId)
            ->with('success', 'Département mis à jour avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($userId, $departementId)
    {
        $departement = Departement::findOrFail($departementId);

        $departement->delete();

        return redirect()->route('admin.departement.index')
            ->with('success', 'Département supprimé avec succès');
    }
}
