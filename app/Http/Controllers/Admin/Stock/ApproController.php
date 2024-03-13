<?php

namespace App\Http\Controllers\Admin\Stock;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use App\Models\Departement;
use App\Models\Depense;
use App\Models\Fournisseur;
use App\Models\Motif;
use App\Models\Operation;
use App\Models\OperationProduit;
use App\Models\Produit;
use App\Models\Societe;
use App\Models\Stock;
use App\Models\TypeOperation;
use App\Models\TypeProduit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ApproController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $appros = Operation::where('status', true)->whereRelation('typeOperation','libelle', "approvisionnement")->orderBy('created_at')->with('fournisseur')->paginate(10);

        $typeProduits = TypeProduit::where('status', true)->orderBy('nom')->get();
        $categorieProduits = Categorie::where('status', true)->orderBy('nom')->get();

        return Inertia::render('Admin/Stock/Appro/Index',[
            'appros' => $appros,
            /*'typeProduits' => $typeProduits,
            'categorieProduits' => $categorieProduits,*/
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $produits = Produit::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->get();
        $motifs = Motif::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->get();
        $fournisseurs = Fournisseur::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->get();

        $fournisseurPrincipal = Societe::where('id', session('societe')['id'])->where('status', true)->first()->fournisseurPrincipal;

        $departements = Departement::where('id', session('societe')['id'])->where('status', true)->get();
        $departementPrincipal = Departement::where('id', session('societe')['id'])->where('status', true)->where('type', 'PRINCIPAL')->first();

        return Inertia::render("Admin/Stock/Appro/Create",[
            'produits' => $produits,
            'motifs' => $motifs,
            'fournisseurs' => $fournisseurs,
            'fournisseurPrincipal' => $fournisseurPrincipal,
            'departements' => $departements,
            'departementPrincipal' => $departementPrincipal,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store($id,Request $request)
    {
        dd($request->date);

        $request->validate([
            "fournisseur" => 'required',
            "departement" => 'required',
            "commandes" => 'required',
        ]);

        DB::beginTransaction();

        try {

            $operation=Operation::create([
                "date" => Carbon::create($request->date),
                "total" => $request->totalCommande + $request->totalDepense,
                "montant" => $request->totalCommande + $request->totalDepense,
                "type_operation_id" => TypeOperation::where('nom','approvisionnement')->first()->id,
                "auteur_id" => Auth::id(),
                "societe_id" => session('societe')['id'],
                "fournisseur_id" => $request->fournisseur['id'],
                "status" => 'commandé',
            ]);

            foreach ($request->commandes as $commande)
            {
                OperationProduit::create([
                    'quantite' =>  $commande['quantite'],
                    'prixAchat' =>  $commande['prixAchat'],
                    'stock_id' => Stock::where('departement_id', $request->departement['id'])->where('status', true)->where('produit_id', $commande['produit']['id'])->where('societe_id', session('societe')['id'])->first()->id,
                    'produit_id' => $commande['produit']['id'],
                    'operation_id' => $operation->id,
                    "societe_id" => session('societe')['id'],
                ]);
            }

            foreach ($request->depenses as $depense)
            {
                Depense::create([
                    "total" => $depense['montant'],
                    "motif_id" => $depense['motif']['id'],
                    "auteur_id" => Auth::id(),
                    'operation_id' => $operation->id,
                    "societe_id" => session('societe')['id'],
                    "fournisseur_id" => $request->fournisseur['id'],
                ]);
            }

            DB::commit();

            return redirect()->action([\App\Http\Controllers\Admin\Stock\ApproController::class, 'index'], Auth::id())->with("success", "Commande effectué avec succés");

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
        $produit=Produit::where("id",$produitId)->with('fournisseurPrincipal','categorieProduit','typeProduit')->first();

        $typeProduits=TypeProduit::where("status",true)/*->where("societe_id",session('societe')['id'])->orWhere("societe_id",null)*/->get();
        $categorieProduits=CategorieProduit::where("status",true)/*->where("societe_id",session('societe')['id'])->orWhere("societe_id",null)*/->get();
        $fournisseurs=Fournisseur::where("status",true)/*->where("societe_id",session('societe')['id'])->orWhere("societe_id",null)*/->get();

        return Inertia::render("Admin/Catalogue/Produit/Edit",["produit"=>$produit,'typeProduits'=>$typeProduits,"fournisseurs"=>$fournisseurs,"categorieProduits"=>$categorieProduits]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Produit $produit)
    {
        $request->validate([
            'nom' => 'required',
            "typeProduit" => 'required',
            "categorieProduit" => 'required',
        ]);

        DB::beginTransaction();

        try {

            $produit->update([
                "nom" => $request->nom,
                "description" => $request->description,
                "prixAchat" => $request->prixAchat,
                "prixVente" => $request->prixVente,
                "stockInitial" => $request->stockInitial,
                "stockMinimal" => $request->stockMinimal,
                "image" => $request->image,
                "type_produit_id" => $request->typeProduit['id'],
                "categorie_produit_id" => $request->categorieProduit['id'],
                "fournisseur_principal_id" => $request->fournisseur['id'],
            ]);

            DB::commit();

            return redirect()->back()->with("success", "Inventaire modifié avec succés");

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

            return redirect()->back()->with('success','Inventaire suspendu avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    public function paginationFiltre(Request $request): \Illuminate\Http\JsonResponse
    {
        $extraQuery = Operation::where(function($query) use ($request) {

            foreach ($request->filters as $filter)
            {
                /*if ($filter['id'] == 'typeProduit')
                {
                    $query->whereRelation('typeProduit','nom','like',"%".$filter['value']."%");
                }
                else if($filter['id'] == 'categorieProduit')
                {
                    $query->whereRelation('categorieProduit','nom','like',"%".$filter['value']."%");
                }*/
                if ($filter['id'] == 'produit')
                {
                    $query->whereRelation('produit','nom','like',"%".$filter['value']."%");
                }
                else if($filter['id'] == 'fournisseur')
                {
                    $query->whereRelation('fournisseur','nom','like',"%".$filter['value']."%");
                }
                else
                {
                    $query->where($filter['id'],'like', "%".$filter['value']."%");
                }
            }

            if($request->globalFilter)
            {
                $query->whereRelation('produit','nom','like', "%".$request->globalFilter."%")->whereRelation('produit.typeProduit','nom','like', "%".$request->globalFilter."%")->orWhereRelation('produit.categorie','nom','like', "%".$request->globalFilter."%")->orWhereRelation('produit.fournisseur','nom','like', "%".$request->globalFilter."%")->orWhere('nom','like', "%".$request->globalFilter."%")->orWhere('prixAchat','like', "%".$request->globalFilter."%")->orWhere('prixVente','like', "%".$request->globalFilter."%");

                /*$colonnes = Schema::getColumnListing('produits'); // Obtient la liste des colonnes de la table 'produits'

                foreach ($colonnes as $colonne) {
                    $query->orWhere($colonne, 'like', "%".$request->globalFilter."%");
                }*/
            }

        })->with("fournisseur")/*->where('status', true)*/->skip($request->start)->take($request->size);

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

}
