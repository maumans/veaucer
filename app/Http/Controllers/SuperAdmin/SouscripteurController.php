<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\CategorieSouscripteur;
use App\Models\Souscripteur;
use App\Models\TypeSouscripteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SouscripteurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $souscripteurs = Souscripteur::/*where('status', true)->*/orderBy('nom')->with('typeSouscripteur','categorieSouscripteur')->paginate(10);
        $typesSouscripteurs = TypeSouscripteur::/*where('status', true)->*/orderBy('nom')->get();
        $categoriesSouscripteurs = CategorieSouscripteur::/*where('status', true)->*/orderBy('nom')->get();

        return Inertia::render('SuperAdmin/Souscripteur/Index',[
            'souscripteurs' => $souscripteurs,
            'typesSouscripteurs' => $typesSouscripteurs,
            'categoriesSouscripteurs' => $categoriesSouscripteurs,
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
            'typeSouscripteur' => 'required',
            'categorieSouscripteur' => 'required',
        ]);

        DB::beginTransaction();

        try {

            Souscripteur::create([
                "nom" => $request->nom,
                "slug" => $request->slug,
                "type_souscripteur_id" => $request->typeSouscripteur['id'],
                "categorie_souscripteur_id" => $request->categorieSouscripteur['id'],
            ]);

            DB::commit();

            return redirect()->back()->with('success','Souscripteur ajouté avec succès');

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
    public function update(Request $request, Souscripteur $souscripteur)
    {
        $request->validate([
            'nom' => 'required',
            'typeSouscripteur' => 'required',
            'categorieSouscripteur' => 'required',
        ]);

        DB::beginTransaction();

        try {

            $souscripteur->update([
                "nom" => $request->nom,
                "slug" => $request->slug,
                "type_souscripteur_id" => $request->typeSouscripteur['id'],
                "categorie_souscripteur_id" => $request->categorieSouscripteur['id'],
            ]);

            DB::commit();

            return redirect()->back()->with('success','Souscripteur modifié avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Souscripteur $souscripteur)
    {
        DB::beginTransaction();

        try {
            $souscripteur->status= !$souscripteur->status;

            $souscripteur->save();

            DB::commit();

            return redirect()->back()->with('success','Souscripteur suspendu avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }

    }

    public function paginationFiltre(Request $request): \Illuminate\Http\JsonResponse
    {
        $extraQuery = Souscripteur::where(function($query) use ($request) {

            foreach ($request->filters as $filter)
            {
                //$query->orWhereRelation('typeSouscripteur','nom',$filter['value'])->orWhereRelation('categorieSouscripteur','nom',$filter['value'])->orWhere($filter['id'],'like', "%".$filter['value']."%");

                if ($filter['id'] == 'typeSouscripteur')
                {
                    $query->orWhereRelation('typeSouscripteur','nom','like',"%".$filter['value']."%");
                }
                else if($filter['id'] == 'categorieSouscripteur')
                {
                    $query->orWhereRelation('categorieSouscripteur','nom','like',"%".$filter['value']."%");
                }
                else
                {
                    $query->orWhere($filter['id'],'like', "%".$filter['value']."%");
                }
            }

            if($request->globalFilter)
            {
                $query->whereRelation('typeSouscripteur','nom', "%".$request->globalFilter."%")->orWhereRelation('categorieSouscripteur','nom', "%".$request->globalFilter."%")->orWhere('nom','like', "%".$request->globalFilter."%")->orWhere('slug','like', "%".$request->globalFilter."%");
            }

        })->with('typeSouscripteur','categorieSouscripteur')/*->where('status', true)*/->skip($request->start)->take($request->size);

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

        $souscripteurs = $extraQuery->get();
        $rowCount = $extraQuery->paginate($request->size)->total();

        return response()->json( ['data'=>$souscripteurs,'rowCount'=>$rowCount]);
    }
}
