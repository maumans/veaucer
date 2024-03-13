<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\TypeSouscripteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TypeSouscripteurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $typeSouscripteurs = TypeSouscripteur::/*where('status', true)->*/orderBy('nom')->paginate(10);

        return Inertia::render('SuperAdmin/TypeSouscripteur/Index',[
            'typeSouscripteurs' => $typeSouscripteurs
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

            TypeSouscripteur::create([
               "nom" => $request->nom,
               "slug" => $request->slug,
            ]);

            DB::commit();

            return redirect()->back()->with('success','Type de souscripteur ajouté avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
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
    public function update(Request $request, TypeSouscripteur $typeSouscripteur)
    {
        $request->validate([
            'nom' => 'required',
        ]);

        DB::beginTransaction();

        try {

            $typeSouscripteur->update([
                "nom" => $request->nom,
                "slug" => $request->slug,
            ]);

            DB::commit();

            return redirect()->back()->with('success','Type de souscripteur modifié avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TypeSouscripteur $typeSouscripteur)
    {
        DB::beginTransaction();

        try {
            $typeSouscripteur->status= !$typeSouscripteur->status;

            $typeSouscripteur->save();

            DB::commit();

            return redirect()->back()->with('success','Type de souscripteur suspendu avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }

    }

    public function paginationFiltre(Request $request): \Illuminate\Http\JsonResponse
    {
        $extraQuery = TypeSouscripteur::where(function($query) use ($request) {

            foreach ($request->filters as $filter)
            {
                $query->orWhere($filter['id'],'like', "%".$filter['value']."%");
            }

            if($request->globalFilter)
            {
                $query->where('nom','like', "%".$request->globalFilter."%")->orWhere('slug','like', "%".$request->globalFilter."%");
            }

        })/*->where('status', true)*/->skip($request->start)->take($request->size);

        foreach ($request->sorting as $sort)
        {
            if ($sort['desc'])
            {
                $extraQuery->orderBy($sort['id'],'desc');
            }
            else
            {
                $extraQuery->orderBy($sort['id'],'asc');
            }
        }

        $typeSouscripteurs = $extraQuery->get();
        $rowCount = $extraQuery->paginate($request->size)->total();

        return response()->json( ['data'=>$typeSouscripteurs,'rowCount'=>$rowCount]);
    }
}
