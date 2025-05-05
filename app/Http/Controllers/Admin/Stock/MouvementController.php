<?php

namespace App\Http\Controllers\Admin\Stock;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Caisse;
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
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MouvementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $query = Operation::query()->where('status', true)
            ->orderByDesc("created_at")
            ->with("fournisseur",'typeOperation','departementSource','departementDestination','caisseSource','caisseDestination')
            ->when($request->get("globalFilter"),function ($query,$value) use ($request){
                $query->where(function ($q) use ($request,$value) {
                    $q->where('date', 'like', "%" . $value . "%")
                        ->orWhere('montant', 'like', "%" .$value . "%");
                });
            })->when($request->get("filters"),function ($query,$filters){
                foreach ($filters as $key => $value) {

                    $f=explode('.',$key);
                    if (isset($f[1]))
                    {
                        $query->whererelation($f[0],$f[1], 'like', "%" . $value . "%");
                    }
                    else
                    {
                        $query->where($key, 'like', "%" . $value . "%");
                    }
                }
            })->when($request->get("sorting"),function ($query,$value)use($request){

                $id=$value[0]['id'];
                $desc=$value[1]['desc'];

                if(count(explode(".",$value[0]['id']))==0) {
                    $query->orderBy($id, $desc =='true' ? 'desc' : 'asc');
                }
            });


        return Inertia::render('Admin/Stock/Mouvement/Index',[
            'operations' => $query->paginate($request->size??10),
            /*'typeProduits' => $typeProduits,
            'categorieProduits' => $categorieProduits,*/
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {

        $motifs = Motif::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->get();
        $fournisseurs = Fournisseur::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->get();

        $fournisseurPrincipal = Societe::where('id', session('societe')['id'])->where('status', true)->first()->fournisseurPrincipal;

        $departements = Departement::where('societe_id', session('societe')['id'])->where('status', true)->get();
        $departementPrincipal = Departement::where('societe_id', session('societe')['id'])->where('status', true)->where('type', 'PRINCIPAL')->first();
        $caisses=Caisse::where('societe_id', session('societe')['id'])->where('status', true)->with('departement')->get();
        $societe= Societe::where('id',session('societe')['id'])->first();
        $societe && $caissePrincipale=$societe->caissePrincipale;
        $typeOperations=TypeOperation::where('status', true)->get();
        $typeOperation=TypeOperation::where('status', true)->where('nom', $request->mouvement)->first();

        $produits = Produit::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->with('typeProduitAchat')->get();

        return Inertia::render("Admin/Stock/Mouvement/Create",[
            'produits' => $produits,
            'motifs' => $motifs,
            'fournisseurs' => $fournisseurs,
            'fournisseurPrincipal' => $fournisseurPrincipal,
            'departements' => $departements,
            'departementPrincipal' => $departementPrincipal,
            'caisses' => $caisses,
            'caissePrincipale' => $caissePrincipale,
            'typeOperations' => $typeOperations,
            'typeOperation' => $typeOperation,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store($id,Request $request)
    {


        $request->validate([
            "date" => 'required',
            "typeOperation" => 'required',
            "fournisseur" => 'required',
            "departement" => 'required',
            "caisse" => 'required',
            "operations" => 'required',
            "depenses" => 'nullable',
            "totalOperation" => 'required',
            
        ]);

        DB::beginTransaction();

        try {

            $operation=Operation::create([
                "date" => Carbon::make($request->date),
                "montant" => $request->totalCommande + $request->totalDepense,
                "type_operation_id" => $request->typeOperation,
                "societe_id" => session('societe')['id'],
                "fournisseur_id" => $request->fournisseur,
                "departement_destination_id" => $request->departement,
                "caisse_source_id" => $request->caisse,
                "etat" => $request->enregistrer ? 'EN ATTENTE' : 'LIVREE',
            ]);


            if(!$request->enregistrer)
            {

                $caisse=Caisse::where('id',$request->caisse)->where('status',true)->first();

                if($caisse)
                {
                    if($caisse->solde < $request->totalCommande+$request->totalDepense)
                    {
                        return redirect()->back()->with('error','Solde insuffisant dans la caisse');
                    }
                }
                else
                {
                    return redirect()->back()->with('error','Caisse inexistante');
                }

            }

            
            foreach ($request->operations as $operationProduit)
            {
                $stock=Stock::where('departement_id', $request->departement)->where('status', true)->where('produit_id', $operationProduit['produit_id'])->where('societe_id', session('societe')['id'])->first();

                OperationProduit::create([
                    'type_produit_achat_id' => $operationProduit['type_produit_achat_id'],
                    'quantiteAchat' => $operationProduit['quantiteAchat'],
                    'prixAchat' => $operationProduit['prixAchat'],
                    'produit_id' => $operationProduit['produit_id'],
                    'stock_destination_id' => $stock->id,
                    'operation_id' => $operation->id,
                    "societe_id" => session('societe')['id'],
                    "etat" => $request->enregistrer ? 'EN ATTENTE' : 'LIVREE',
                ]);
                if(!$request->enregistrer)
                {
                    $stock->quantite += $operationProduit['quantiteAchat'];
                    $stock->save();

                    if($caisse)
                    {
                        $caisse->solde -= $operationProduit['prixAchat']*$operationProduit['quantiteAchat'];
                        $caisse->save();
                    }
                    else
                    {
                        return redirect()->back()->with('error','Veuillez selectionner la caisse');
                    }

                }
            }



            foreach ($request->depenses as $depense)
            {
                Depense::create([
                    "total" => $depense['montant'],
                    "motif_id" => $depense['motif_id'],
                    "commentaire" => $depense['commentaire'] ?? "",
                    "auteur_id" => Auth::id(),
                    'operation_id' => $operation->id,
                    "societe_id" => session('societe')['id'],
                    "fournisseur_id" => $request->fournisseur,
                    "etat" => $request->enregistrer ? 'EN ATTENTE' : 'LIVREE',
                ]);

                if(!$request->enregistrer)
                {
                    $caisse->solde -= $depense['montant'];
                    $caisse->save();
                }

            }

            DB::commit();

            return redirect()->route('admin.mouvement.index', Auth::id())->with("success", "Commande effectué avec succés");

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    /**
     * Display the specified resource.
     */
    public function show($userId,$id)
    {
        // Récupérer l'approvisionnement avec ses relations (fournisseur, produits, et dépenses)
        $operation = Operation::where('id', $id)
            ->with(['fournisseur', 'produits' => function ($query) {
                    $query->where('operation_produits.status', true);
            },
            'typeProduitAchat',
            'depenses' => function ($query) {
                $query->with('motif');
            },
        ])
        ->where('status', true)
        ->firstOrFail();

        // Formater les données des commandes et des dépenses pour la vue
        $produits = $operation->produits->map(function ($op) {
            return [
                'produit' => $op->produit,
                'type_produit_achat' => $op->type_produit_achat,
                'quantiteAchat' => $op->quantiteAchat,
                'prixAchat' => $op->prixAchat,
            ];
        });

        $depenses = $operation->depenses->map(function ($depense) {
            return [
                'motif' => $depense->motif,
                'montant' => $depense->total,
                'commentaire' => $depense->commentaire,
            ];
        });

       
        return Inertia::render('Admin/Stock/Mouvement/Show', [
            'operation' => [
                'id' => $operation->id,
                'fournisseur' => $operation->fournisseur,
                'date' => Carbon::make($operation->date)->format('Y-m-d'),
                'totalCommande' => $operation->montant ?? 0,
                'totalDepense' => $operation->depenses->sum('total'),
                'produits' => $produits,
                'depenses' => $depenses,
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($userId,$id)
    {
        // Récupérer l'approvisionnement à modifier avec ses relations
        $operation = Operation::with('produits', 'depenses', 'fournisseur')
            ->where('id', $id)
            ->where('status', '!=', 'annulé')
            ->firstOrFail();

        // Charger les produits, motifs, et autres données pour la modification
        $produits = Produit::where('status', true)
            ->where(function ($query) {
                $query->where('societe_id', session('societe')['id'])
                    ->orWhere('societe_id', null);
            })
            ->orderBy('nom')
            ->get();

        $motifs = Motif::where('status', true)
            ->where(function ($query) {
                $query->where('societe_id', session('societe')['id'])
                    ->orWhere('societe_id', null);
            })
            ->orderBy('nom')
            ->get();

        $fournisseurs = Fournisseur::where('status', true)
            ->where(function ($query) {
                $query->where('societe_id', session('societe')['id'])
                    ->orWhere('societe_id', null);
            })
            ->orderBy('nom')
            ->get();

        $departements = Departement::where('societe_id', session('societe')['id'])->get();
        $caisses = Caisse::where('societe_id', session('societe')['id'])->where('status', true)->with('departement')->get();
        $caissePrincipale = Societe::where('id', session('societe')['id'])->first()->caissePrincipale;

        return Inertia::render('Admin/Stock/Mouvement/Edit', [
            'operation' => $operation,
            'produits' => $produits,
            'motifs' => $motifs,
            'fournisseurs' => $fournisseurs,
            'departements' => $departements,
            'caisses' => $caisses,
            'caissePrincipale' => $caissePrincipale,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $userId, $id)
    {
        $request->validate([
            'fournisseur' => 'required',
            'departement' => 'required',
            'commandes' => 'required',
            'caisse' => !$request->enregistrer ? 'required' : '',
        ]);

        DB::beginTransaction();

        try {
            $operation = Operation::findOrFail($id);

            // Mise à jour des informations de l'opération
            $operation->update([
                'date' => Carbon::make($request->date),
                'total' => $request->totalCommande + $request->totalDepense,
                'montant' => $request->totalCommande + $request->totalDepense,
                'fournisseur_id' => $request->fournisseur['id'],
                'status' => $request->enregistrer ? 'commandé' : 'reçu',
            ]);

            // Mise à jour des produits et des dépenses
            $operation->produits()->delete();
            $operation->depenses()->delete();

            foreach ($request->commandes as $commande) {
                $stock = Stock::where('departement_id', $request->departement['id'])
                    ->where('status', true)
                    ->where('produit_id', $commande['produit']['id'])
                    ->where('societe_id', session('societe')['id'])
                    ->first();

                OperationProduit::create([
                    'quantite' => $commande['quantite'],
                    'prixAchat' => $commande['prixAchat'],
                    'stock_id' => $stock->id,
                    'produit_id' => $commande['produit']['id'],
                    'operation_id' => $operation->id,
                    'societe_id' => session('societe')['id'],
                    'status' => $request->enregistrer ? false : true,
                ]);

                if (!$request->enregistrer) {
                    $stock->quantite += $commande['quantite'];
                    $stock->save();
                }
            }

            foreach ($request->depenses as $depense) {
                Depense::create([
                    'total' => $depense['montant'],
                    'motif_id' => $depense['motif']['id'],
                    'auteur_id' => Auth::id(),
                    'operation_id' => $operation->id,
                    'societe_id' => session('societe')['id'],
                    'fournisseur_id' => $request->fournisseur['id'],
                    'status' => $request->enregistrer ? false : true,
                ]);
            }

            DB::commit();
            return redirect()->action([MouvementController::class, 'index'])
                ->with('success', 'Approvisionnement mis à jour avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Erreur lors de la mise à jour : ' . $e->getMessage()]);
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

        })->orderByDesc('created_at')->with("fournisseur")/*->where('status', true)*/->skip($request->start)->take($request->size);

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
