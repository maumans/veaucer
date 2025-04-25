<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Poste;
use App\Models\Departement;
use App\Models\PosteEmploye;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class EmployeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employes = User::role('Employe')
                        ->where('societe_id', auth()->user()->societe_id)
                        ->with(['posteEmployes.poste', 'posteEmployes.departement'])
                        ->paginate(10);

        return Inertia::render('Admin/Employe/Index', [
            'employes' => $employes
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //$postes = Poste::where('societe_id', auth()->user()->societe_id)->get();
        $postes = Poste::where('status', true)->get();
        $departements = Departement::where('societe_id', auth()->user()->societe_id)->get();

        return Inertia::render('Admin/Employe/Create', [
            'postes' => $postes,
            'departements' => $departements,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
            'poste_id' => 'required|exists:postes,id',
            'departement_id' => 'required|exists:departements,id',
            'status' => 'required|boolean',
        ]);

        // Créer l'utilisateur
        $user = User::create([
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'telephone' => $validated['telephone'],
            'adresse' => $validated['adresse'],
            'societe_id' => auth()->user()->societe_id,
        ]);

        // Attribuer le rôle employé
        $role = Role::where('name', 'Employe')->first();
        $user->assignRole($role);

        // Créer le poste employé
        PosteEmploye::create([
            'employe_id' => $user->id,
            'poste_id' => $validated['poste_id'],
            'departement_id' => $validated['departement_id'],
            'societe_id' => auth()->user()->societe_id,
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.employe.index', [auth()->user()->id])
                        ->with('success', 'Employé créé avec succès');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $employe)
    {
        $postes = Poste::where('societe_id', auth()->user()->societe_id)->get();
        $departements = Departement::where('societe_id', auth()->user()->societe_id)->get();
        $posteEmploye = PosteEmploye::where('employe_id', $employe->id)->first();

        return Inertia::render('Admin/Employe/Edit', [
            'employe' => $employe,
            'postes' => $postes,
            'departements' => $departements,
            'posteEmploye' => $posteEmploye,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $employe)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $employe->id,
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
            'poste_id' => 'required|exists:postes,id',
            'departement_id' => 'required|exists:departements,id',
            'status' => 'required|boolean',
        ]);

        // Mettre à jour l'utilisateur
        $employe->update([
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'email' => $validated['email'],
            'telephone' => $validated['telephone'],
            'adresse' => $validated['adresse'],
        ]);

        // Mettre à jour le poste employé
        $posteEmploye = PosteEmploye::where('employe_id', $employe->id)->first();
        $posteEmploye->update([
            'poste_id' => $validated['poste_id'],
            'departement_id' => $validated['departement_id'],
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.employe.index', [auth()->user()->id])
                        ->with('success', 'Employé mis à jour avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $employe)
    {
        // Supprimer le poste employé
        PosteEmploye::where('employe_id', $employe->id)->delete();

        // Supprimer l'utilisateur
        $employe->delete();

        return redirect()->route('admin.employe.index', [auth()->user()->id])
                        ->with('success', 'Employé supprimé avec succès');
    }
}
