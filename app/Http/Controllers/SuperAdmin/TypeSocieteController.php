<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\TypeSociete;
use App\Models\TypeSouscripteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TypeSocieteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $typeSocietes = TypeSouscripteur::/*where('status', true)->*/orderBy('nom')->paginate(10);

        return Inertia::render('SuperAdmin/TypeSociete/Index',[
            'typeSocietes' => $typeSocietes
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
        $request->validate([
            'nom' => 'required',
        ]);

        DB::beginTransaction();

        try {

            TypeSociete::create([
                "nom" => $request->nom,
                "slug" => $request->slug,
            ]);

            DB::commit();

            return redirect()->back()->with('success','Type de société ajouté avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    /**
     * Display the specified resource.
     */
    public function show(TypeSociete $typeSociete)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TypeSociete $typeSociete)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TypeSociete $typeSociete)
    {
        $request->validate([
            'nom' => 'required',
        ]);

        DB::beginTransaction();

        try {

            $typeSociete->update([
                "nom" => $request->nom,
                "slug" => $request->slug,
            ]);

            DB::commit();

            return redirect()->back()->with('success','Type de société modifié avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TypeSociete $typeSociete)
    {
        //
    }
}
