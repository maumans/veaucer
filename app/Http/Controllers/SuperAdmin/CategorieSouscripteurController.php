<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\CategorieSouscripteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CategorieSouscripteurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categorieSouscripteurs = CategorieSouscripteur::/*where('status', true)->*/orderBy('nom')->paginate(10);

        return Inertia::render('SuperAdmin/CategorieSouscripteur/Index',[
            'categorieSouscripteurs' => $categorieSouscripteurs
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

            CategorieSouscripteur::create([
                "nom" => $request->nom,
                "slug" => $request->slug,
            ]);

            DB::commit();

            return redirect()->back()->with('success','Catégorie de souscripteur ajoutée avec succès');

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
    public function update(Request $request, CategorieSouscripteur $categorieSouscripteur)
    {
        $request->validate([
            'nom' => 'required',
        ]);

        DB::beginTransaction();

        try {

            $categorieSouscripteur->update([
                "nom" => $request->nom,
                "slug" => $request->slug,
            ]);

            DB::commit();

            return redirect()->back()->with('success','Catégorie de souscripteur modifiée avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CategorieSouscripteur $categorieSouscripteur)
    {
        DB::beginTransaction();

        try {
            $categorieSouscripteur->status= !$categorieSouscripteur->status;

            $categorieSouscripteur->save();

            DB::commit();

            return redirect()->back()->with('success','Catégorie de souscripteur suspendue avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }

    }

    public function paginationFiltre(Request $request): \Illuminate\Http\JsonResponse
    {
        $extraQuery = CategorieSouscripteur::where(function($query) use ($request) {

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

        $categorieSouscripteurs = $extraQuery->get();
        $rowCount = $extraQuery->paginate($request->size)->total();

        return response()->json( ['data'=>$categorieSouscripteurs,'rowCount'=>$rowCount,"request"=>$request->all()]);
    }
}
