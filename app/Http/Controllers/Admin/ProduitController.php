<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\SuperAdmin\SocieteController;
use App\Models\Departement;
use App\Models\Categorie;
use App\Models\Fournisseur;
use App\Models\Produit;
use App\Models\Stock;
use App\Models\TypeProduit;
use App\Models\TypeSociete;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class ProduitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $produits = Produit::where('status', true)->orderBy('nom')->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->with('typeProduitAchat','typeProduitVente','categorie')->paginate(10);


        $typeProduits = TypeProduit::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->get();

        $categories = Categorie::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->get();

        return Inertia::render('Admin/Stock/Produit/Index',[
            'produits' => $produits,
            'typeProduits' => $typeProduits,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $typeProduits = TypeProduit::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->get();

        $typeProduitAchat = TypeProduit::where('status', true)->where('nom', 'ensemble')->first();
        $typeProduitVente = TypeProduit::where('status', true)->where('nom', 'unité')->first();

        $categories = Categorie::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->get();

        $fournisseurs = Fournisseur::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->get();

        $departements = Departement::where('id', session('societe')['id'])->where('status', true)->get();
        $departementPrincipal = Departement::where('id', session('societe')['id'])->where('status', true)->where('type', 'PRINCIPAL')->first();

        return Inertia::render("Admin/Stock/Produit/Create",[
            'typeProduits' => $typeProduits,
            'typeProduitAchat' => $typeProduitAchat,
            'typeProduitVente' => $typeProduitVente,
            'categories' => $categories,
            'fournisseurs' => $fournisseurs,
            'departements' => $departements,
            'departementPrincipal' => $departementPrincipal,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required',
            "typeProduitAchat" => 'required',
            "typeProduitVente" => 'required',
            "prixAchat" => 'required',
            "prixVente" => 'required',
            "stockGlobal" => 'required',
            "stockCritique" => 'required',
            "quantiteAchat" => 'required',
            "quantiteVente" => 'required',
            "categorie" => 'required',
        ]);

        DB::beginTransaction();

        try {

            $produit=Produit::create([
                "nom" => $request->nom,
                "description" => $request->description,
                "stockCritique" => $request->stockCritique,
                "stockGlobal" => $request->stockGlobal,
                "image" => $request->image,

                "type_produit_achat_id" => $request->typeProduitAchat['id'],
                "quantiteAchat" => $request->quantiteAchat,
                "prixAchat" => $request->prixAchat,

                "type_produit_vente_id" => $request->typeProduitVente['id'],
                "quantiteVente" => $request->quantiteVente,
                "prixVente" => $request->prixVente,

                "categorie_id" => $request->categorie['id'],
                "fournisseur_principal_id" => $request->fournisseur? $request->fournisseur['id'] : null,
                "societe_id" => session('societe')['id'],
            ]);

            Stock::create([
                'quantite' =>  $request->stockGlobal,
                'type' =>  'PRINCIPAL',
                'departement_id' => session('societe')->departementPrincipal->id,
                'user_id' => Auth::id(),
                'produit_id' => $produit->id,
                "societe_id" => session('societe')['id'],
            ]);

            DB::commit();

            return redirect()->action([ProduitController::class, 'index'], Auth::id())->with("success", "Produit ajouté avec succés");

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
    public function edit($userId,$produitId)
    {
        $produit=Produit::where("id",$produitId)->with('fournisseurPrincipal','categorie','typeProduitAchat','typeProduitVente')->first();

        $typeProduits=TypeProduit::where("status",true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->get();

        $categories = Categorie::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->get();

        $fournisseurs=Fournisseur::where("status",true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->get();

        return Inertia::render("Admin/Stock/Produit/Edit",["produit"=>$produit,'typeProduits'=>$typeProduits,"fournisseurs"=>$fournisseurs,"categories"=>$categories]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Produit $produit)
    {
        $request->validate([
            'nom' => 'required',
            "typeProduit" => 'required',
            "categorie" => 'required',
            "quantite" => 'nullable',
            "stockCritique" => 'required',
            "stockGlobal" => 'required',
            "image" => 'nullable',
            "prixAchat" => 'required',
            "prixVente" => 'required',
            "quantiteAchat" => 'required',
            "quantiteVente" => 'required',
            "typeProduitAchat" => 'required',
            "typeProduitVente" => 'required',
            "fournisseur" => 'nullable',
            "uniteMesure" => 'required',
            "devise" => 'required',

        ]);

        DB::beginTransaction();

        try {

            $produit->update([
                "nom" => $request->nom,
                "description" => $request->description,
                "stockGlobal" => $request->stockGlobal,
                "stockCritique" => $request->stockCritique,
                "image" => $request->image,
                "quantite" => $request->quantite,
                "type_produit_achat_id" => $request->typeProduitAchat['id'],
                "quantiteAchat" => $request->quantiteAchat,
                "prixAchat" => $request->prixAchat,
                "type_produit_vente_id" => $request->typeProduitVente['id'],
                "quantiteVente" => $request->quantiteVente,
                "prixVente" => $request->prixVente,
                "categorie_id" => $request->categorie['id'],
                "fournisseur_principal_id" => $request->fournisseur['id'],
                "societe_id" => session('societe')['id'],
            ]);

            Stock::where('produit_id', $produit->id)->update([
                "quantite" => $request->stockGlobal,
            ]);

            DB::commit();

            return redirect()->back()->with("success", "Produit modifié avec succès");

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Produit $produit)
    {
        DB::beginTransaction();

        try {
            $produit->status = !$produit->status;

            $produit->save();

            DB::commit();

            return redirect()->back()->with('success','Produit suspendu avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    public function paginationFiltre(Request $request): \Illuminate\Http\JsonResponse
    {
        $extraQuery = Produit::where(function($query) use ($request) {

            foreach ($request->filters as $filter)
            {
                if ($filter['id'] == 'typeProduit')
                {
                    $query->whereRelation('typeProduit','nom','like',"%".$filter['value']."%");
                }
                else if($filter['id'] == 'categorie')
                {
                    $query->whereRelation('categorie','nom','like',"%".$filter['value']."%");
                }
                else if($filter['id'] == 'fournisseur')
                {
                    $query->whereRelation('fournisseurPrincipal','nom','like',"%".$filter['value']."%");
                }
                else if($filter['id'] == 'quantiteAchat')
                {
                    $query->whereRelation('quantiteAchat','like',"%".$filter['value']."%");
                }
                else if($filter['id'] == 'quantiteVente')
                {
                    $query->whereRelation('quantiteVente','like',"%".$filter['value']."%");
                }
                else
                {
                    $query->where($filter['id'],'like', "%".$filter['value']."%");
                }
            }

            if($request->globalFilter)
            {
                $query->whereRelation('typeProduitAchat','typeProduitVente','nom','like', "%".$request->globalFilter."%")->orWhereRelation('categorie','nom','like', "%".$request->globalFilter."%")->orWhereRelation('fournisseurPrincipal','nom','like', "%".$request->globalFilter."%")->orWhere('nom','like', "%".$request->globalFilter."%")->orWhere('prixAchat','like', "%".$request->globalFilter."%")->orWhere('prixVente','like', "%".$request->globalFilter."%");

                /*$colonnes = Schema::getColumnListing('produits'); // Obtient la liste des colonnes de la table 'produits'

                foreach ($colonnes as $colonne) {
                    $query->orWhere($colonne, 'like', "%".$request->globalFilter."%");
                }*/
            }

        })->with('typeProduitAchat','typeProduitVente','categorie',"fournisseurPrincipal")/*->where('status', true)*/->skip($request->start)->take($request->size);

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

        $produits = $extraQuery->get();
        $rowCount = $extraQuery->paginate($request->size)->total();

        return response()->json( ['data'=>$produits,'rowCount'=>$rowCount]);
    }

    public function stockIndex()
    {
        $produits = Produit::where('status', true)->orderBy('nom')->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->with('typeProduit','categorie')->paginate(10);

        $typeProduits = TypeProduit::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->get();

        $categories = Categorie::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->with('categorie')->orderBy('nom')->get();

        return Inertia::render('Inventaire',[
            'produits' => $produits,
            'typeProduits' => $typeProduits,
            'categories' => $categories,
        ]);
    }


}
