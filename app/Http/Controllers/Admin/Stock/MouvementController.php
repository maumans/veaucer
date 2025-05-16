<?php

namespace App\Http\Controllers\Admin\Stock;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Caisse;
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
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
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
            ->with("fournisseur", 'typeOperation', 'departementSource', 'departementDestination', 'caisseSource', 'caisseDestination')
            ->when($request->get("globalFilter"), function ($query, $value) use ($request) {
                $query->where(function ($q) use ($request, $value) {
                    $q->where('date', 'like', "%" . $value . "%")
                        ->orWhere('montant', 'like', "%" . $value . "%");
                });
            })->when($request->get("filters"), function ($query, $filters) {
                // Déboguer les filtres reçus
                \Illuminate\Support\Facades\Log::info('Filtres reçus:', ['filters' => $filters]);
                
                foreach ($filters as $key => $value) {
                    // Ignorer les valeurs vides
                    if ((empty($value) && $value !== 0) || $value === null) {
                        continue;
                    }
                    
                    // Gestion des filtres avancés
                    if ($key === 'type_operation') {
                        // Assurez-vous que le filtre est appliqué sur l'ID du type d'opération
                        \Illuminate\Support\Facades\Log::info('Filtre type_operation:', ['value' => $value]);
                        $query->where('type_operation_id', $value);
                    } 
                    elseif ($key === 'departement') {
                        $query->where(function($q) use ($value) {
                            $q->where('departement_source_id', $value)
                              ->orWhere('departement_destination_id', $value);
                        });
                    }
                    elseif ($key === 'fournisseur') {
                        $query->where('fournisseur_id', $value);
                    }
                    elseif ($key === 'date_range') {
                        if (is_array($value) && isset($value['start']) && isset($value['end'])) {
                            // Assurez-vous que les dates sont au bon format
                            $startDate = $value['start'];
                            $endDate = $value['end'];
                            \Illuminate\Support\Facades\Log::info('Filtre date_range:', ['start' => $startDate, 'end' => $endDate]);
                            $query->whereBetween('date', [$startDate, $endDate]);
                        }
                    }
                    elseif ($key === 'min_montant') {
                        $query->where('montant', '>=', $value);
                    }
                    elseif ($key === 'max_montant') {
                        $query->where('montant', '<=', $value);
                    }
                    elseif ($key === 'etat') {
                        $query->where('etat', $value);
                    }
                    else {
                        $f = explode('.', $key);
                        if (isset($f[1])) {
                            $query->whererelation($f[0], $f[1], 'like', "%" . $value . "%");
                        } else {
                            $query->where($key, 'like', "%" . $value . "%");
                        }
                    }
                }
            })->when($request->get("sorting"), function ($query, $value) use ($request) {

                $id = $value[0]['id'];
                $desc = $value[1]['desc'];

                if (count(explode(".", $value[0]['id'])) == 0) {
                    $query->orderBy($id, $desc == 'true' ? 'desc' : 'asc');
                }
            });


        // Récupérer les départements pour les filtres
        $departements = Departement::where('societe_id', session('societe')['id'])
            ->where('status', true)
            ->select('id', 'nom')
            ->orderBy('nom')
            ->get();
            
        // Récupérer les fournisseurs pour les filtres
        $fournisseurs = Fournisseur::where('societe_id', session('societe')['id'])
            ->where('status', true)
            ->select('id', 'nom')
            ->orderBy('nom')
            ->get();
            
        // Récupérer les types d'opérations pour les filtres
        $typeOperations = TypeOperation::where('status', true)
            ->select('id', 'nom')
            ->orderBy('nom')
            ->get();

        $typeProduits = TypeProduit::where('status', true)
            ->select('id', 'nom')
            ->orderBy('nom')
            ->get();

        $categorieProduits = Categorie::where('status', true)
            ->select('id', 'nom')
            ->orderBy('nom')
            ->get();
            
        return Inertia::render('Admin/Stock/Mouvement/Index', [
            'operations' => $query->paginate($request->size ?? 10),
            'departements' => $departements,
            'fournisseurs' => $fournisseurs,
            'typeOperations' => $typeOperations,
            'typeProduits' => $typeProduits,
            'categorieProduits' => $categorieProduits,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {


        $motifsSorties = Motif::where('status', true)->whereRelation('typeOperation', 'nom', 'sortie')->where(function ($query) {
            $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
        })->where('type', 'OPERATION')->orderBy('nom')->get();

        $motifSortieDefaut = null;

        $motifsTransferts = Motif::where('status', true)->whereRelation('typeOperation', 'nom', 'transfert')->where(function ($query) {
            $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
        })->where('type', 'OPERATION')->orderBy('nom')->get();

        $motifTransfertDefaut = Motif::where('nom', 'ravitaillement')->whereRelation('typeOperation', 'nom', 'transfert')->where('status', true)->first() ?? null;

        $motifsDepenses = Motif::where('status', true)->where(function ($query) {
            $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
        })->where('type', 'DEPENSE')->orderBy('nom')->get();




        $fournisseurs = Fournisseur::where('status', true)->where(function ($query) {
            $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
        })->orderBy('nom')->get();

        $fournisseurPrincipal = Societe::where('id', session('societe')['id'])->where('status', true)->first()->fournisseurPrincipal;

        $departements = Departement::where('societe_id', session('societe')['id'])->where('status', true)->get();
        $departementPrincipal = Departement::where('societe_id', session('societe')['id'])->where('status', true)->where('type', 'PRINCIPAL')->first();
        $caisses = Caisse::where('societe_id', session('societe')['id'])->where('status', true)->with('departement')->get();
        $societe = Societe::where('id', session('societe')['id'])->first();
        $societe && $caissePrincipale = $societe->caissePrincipale;
        $typeOperations = TypeOperation::where('status', true)->get();
        $typeOperation = TypeOperation::where('status', true)->where('nom', $request->mouvement)->first();

        $produits = Produit::where('status', true)->where(function ($query) {
            $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
        })->orderBy('nom')->with('typeProduitAchat')->get();

        return Inertia::render("Admin/Stock/Mouvement/Create", [
            'produits' => $produits,
            'motifsSorties' => $motifsSorties,
            'motifsTransferts' => $motifsTransferts,
            'motifsDepenses' => $motifsDepenses,
            'motifSortieDefaut' => $motifSortieDefaut,
            'motifTransfertDefaut' => $motifTransfertDefaut,
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
    public function store($id, Request $request)
    {
        $request->validate([
            "date" => 'required',
            "typeOperation" => 'required',
            "fournisseur" => 'nullable',
            "departementSource" => [
                Rule::requiredIf(function () use ($request) {
                    return in_array($request->input('typeOperation_nom'), ['sortie', 'transfert']);
                })
            ],
            "departementDestination" => [
                Rule::requiredIf(function () use ($request) {
                    return in_array($request->input('typeOperation_nom'), ['entrée', 'transfert']);
                })
            ],
            "motifSortie" => [
                Rule::requiredIf(fn () => $request->input('typeOperation_nom') === 'sortie')
            ],
            "motifTransfert" => [
                Rule::requiredIf(fn () => $request->input('typeOperation_nom') === 'transfert')
            ],
            "caisse" => [
                Rule::requiredIf(fn () => $request->input('typeOperation_nom') === 'entrée')
            ],
            "operations" => 'required',
            "depenses" => 'nullable',
            "totalOperation" => [
                Rule::requiredIf(fn () => $request->input('typeOperation_nom') === 'entrée')
            ],
        ]);
        
        DB::beginTransaction();

        try {

            $operation = Operation::create([
                "date" => Carbon::make($request->date),
                "montant" => $request->totalOperation + $request->totalDepense,
                "type_operation_id" => $request->typeOperation,
                "societe_id" => session('societe')['id'],
                "fournisseur_id" => $request->fournisseur,
                "departement_source_id" => $request->departementSource ?? null,
                "departement_destination_id" => $request->departementDestination ?? null,
                "caisse_source_id" => $request->caisse ?? null,
                "etat" => $request->enregistrer ? 'EN ATTENTE' : 'VALIDE',
            ]);

            switch ($request->typeOperation_nom) {
                case 'sortie':
                    $this->sortie($operation, $request->motifSortie, $request->operations, $request->departementSource, $request->enregistrer);
                    break;
                case 'entrée':
                    $this->entree($operation, $request->caisse, $request->totalOperation, $request->totalDepense, $request->operations, $request->depenses, $request->departementDestination, $request->fournisseur, $request->enregistrer);
                    break;
                case 'transfert':
                    $this->transfert($operation, $request->motifTransfert, $request->operations, $request->departementSource, $request->departementDestination, $request->enregistrer);
                    break;
                default:
                    return redirect()->back()->with('error', 'Type d\'opération non reconnu');
                    break;
            }

            DB::commit();

            return redirect()->route('admin.stock.mouvement.index', Auth::id())->with("success", "Mouvement effectué avec succés");
        } catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());
        }
    }

    public function entree($operation, $caisse, $totalOperation, $totalDepense, $operations, $depenses, $departement, $fournisseur, $enregistrer)
    {

        if (!$enregistrer) {

            $caisse = Caisse::where('id', $caisse)->where('status', true)->first();

            if ($caisse) {
                if ($caisse->solde < $totalOperation + $totalDepense) {
                    return redirect()->back()->with('error', 'Solde insuffisant dans la caisse');
                }
            } else {
                return redirect()->back()->with('error', 'Caisse inexistante');
            }
        }

        foreach ($operations as $operationProduit) {
            $stock = Stock::where('departement_id', $departement)->where('status', true)->where('produit_id', $operationProduit['produit_id'])->where('societe_id', session('societe')['id'])->first();
            if(!$stock){
                $stock = Stock::create([
                    'quantite' =>  0,
                    'type' =>  Departement::where('id', $departement)->first()->type,
                    'departement_id' => $departement,
                    'user_id' => Auth::id(),
                    'produit_id' => $operationProduit['produit_id'],
                    "societe_id" => session('societe')['id'],
                ]);
            }
            OperationProduit::create([
                'type_produit_achat_id' => $operationProduit['type_produit_achat_id'],
                'quantiteAchat' => $operationProduit['quantiteAchat'],
                'prixAchat' => $operationProduit['prixAchat'],
                'produit_id' => $operationProduit['produit_id'],
                'stock_destination_id' => $stock->id,
                'operation_id' => $operation->id,
                "societe_id" => session('societe')['id'],
                "etat" => $enregistrer ? 'EN ATTENTE' : 'VALIDE',
            ]);
            if (!$enregistrer) {
                $stock->quantite += $operationProduit['quantiteAchat'];
                $stock->save();

                $stock->produit->stockGlobal += $operationProduit['quantiteAchat'];
                $stock->produit->save();

                if ($caisse) {
                    $caisse->solde -= $operationProduit['prixAchat'] * $operationProduit['quantiteAchat'];
                    $caisse->save();
                } else {
                    return redirect()->back()->with('error', 'Veuillez selectionner la caisse');
                }
            }
        }



        foreach ($depenses as $depense) {
            Depense::create([
                "total" => $depense['montant'],
                "motif_id" => $depense['motif_id'],
                "commentaire" => $depense['commentaire'] ?? "",
                "auteur_id" => Auth::id(),
                'operation_id' => $operation->id,
                "societe_id" => session('societe')['id'],
                "fournisseur_id" => $fournisseur,
                "etat" => $enregistrer ? 'EN ATTENTE' : 'VALIDE',
            ]);

            if (!$enregistrer) {
                if($caisse->solde < $depense['montant']){
                    return redirect()->back()->with('error', 'Solde insuffisant dans la caisse '.$caisse->departement->nom);
                }
                $caisse->solde -= $depense['montant'];
                $caisse->save();
            }
        }
    }

    public function sortie($operation, $motifSortie, $operations, $departementSource, $enregistrer)
    {
        foreach ($operations as $operationProduit) {
            $stock = Stock::where('departement_id', $departementSource)->where('status', true)->where('produit_id', $operationProduit['produit_id'])->where('societe_id', session('societe')['id'])->first();
            if(!$stock){
                return redirect()->back()->with('error', 'Stock source inexistant '.$operationProduit['produit_nom']);
            }
            OperationProduit::create([
                'quantiteAchat' => 0,
                'produit_id' => $operationProduit['produit_id'],
                'stock_source_id' => $stock->id,
                'operation_id' => $operation->id,
                "societe_id" => session('societe')['id'],
                "etat" => $enregistrer ? 'EN ATTENTE' : 'VALIDE',
            ]);
            if (!$enregistrer) {
                if($stock->quantite < $operationProduit['quantiteAchat']){
                    return redirect()->back()->with('error', 'Quantité insuffisante dans le stock '.$stock->produit->nom);
                }
                $stock->quantite -= $operationProduit['quantiteAchat'];
                $stock->save();

                $stock->produit->stockGlobal -= $operationProduit['quantiteAchat'];
                $stock->produit->save();
            }
        }
        $operation->motif_id = $motifSortie;
        $operation->save();
    }

    public function transfert($operation, $motifTransfert, $operations, $departementSource, $departementDestination, $enregistrer)
    {
        foreach ($operations as $operationProduit) {
            
            $stockSource = Stock::where('departement_id', $departementSource)->where('status', true)->where('produit_id', $operationProduit['produit_id'])->where('societe_id', session('societe')['id'])->first();
            if(!$stockSource){
                return redirect()->back()->with('error', 'Stock source inexistant '.$operationProduit['produit_nom']);
            }
            
            $stockDestination = Stock::where('departement_id', $departementDestination)->where('status', true)->where('produit_id', $operationProduit['produit_id'])->where('societe_id', session('societe')['id'])->first();
            if(!$stockDestination){
                $stockDestination = Stock::create([
                    'quantite' =>  $operationProduit['quantiteAchat'],
                    'type' =>  Departement::where('id', $departementDestination)->first()->type,
                    'departement_id' => $departementDestination,
                    'user_id' => Auth::id(),
                    'produit_id' => $operationProduit['produit_id'],
                    "societe_id" => session('societe')['id'],
                ]);
            }

            OperationProduit::create([
                'quantiteAchat' => 0,
                'produit_id' => $operationProduit['produit_id'],
                'stock_source_id' => $stockSource->id,
                'stock_destination_id' => $stockDestination->id,
                'operation_id' => $operation->id,
                "societe_id" => session('societe')['id'],
                "etat" => $enregistrer ? 'EN ATTENTE' : 'VALIDE',
            ]);

            if (!$enregistrer) {
                if($stockSource->quantite < $operationProduit['quantiteAchat']){
                    return redirect()->back()->with('error', 'Quantité insuffisante dans le stock source '.$stockSource->produit->nom);
                }
                $stockSource->quantite -= $operationProduit['quantiteAchat'];
                $stockSource->save();

                $stockDestination->quantite += $operationProduit['quantiteAchat'];
                $stockDestination->save();

                $stockSource->produit->stockGlobal -= $operationProduit['quantiteAchat'];
                $stockSource->produit->save();

                $stockDestination->produit->stockGlobal += $operationProduit['quantiteAchat'];
                $stockDestination->produit->save();
            }
        }
        $operation->motif_id = $motifTransfert;
        $operation->save();
    }

    /**
     * Display the specified resource.
     * Affiche les détails d'un mouvement de stock
     */
    public function show($userId, $id)
    {
        // Récupérer l'opération avec toutes ses relations nécessaires
        $operation = Operation::where('id', $id)
            ->with([
                'fournisseur',
                'typeOperation',
                'departementSource',
                'departementDestination',
                'caisseSource',
                'caisseDestination',
                'produits' => function ($query) {
                    $query->where('operation_produits.status', true)
                          ->with('produit');
                },
                'depenses' => function ($query) {
                    $query->with('motif');
                },
            ])
            ->where('status', true)
            ->firstOrFail();

        // Calculer le total des produits
        $totalProduits = 0;
        
        // Formater les données des produits pour la vue
        $produits = $operation->produits->map(function ($op) use (&$totalProduits) {
            $sousTotal = $op->quantiteAchat * $op->prixAchat;
            $totalProduits += $sousTotal;
            
            return [
                'id' => $op->id,
                'produit' => $op->produit,
                'quantiteAchat' => $op->quantiteAchat,
                'prixAchat' => $op->prixAchat,
                'total' => $sousTotal,
            ];
        });

        // Formater les données des dépenses pour la vue
        $depenses = $operation->depenses->map(function ($depense) {
            return [
                'id' => $depense->id,
                'motif' => $depense->motif,
                'montant' => $depense->total,
                'commentaire' => $depense->commentaire,
            ];
        });

        // Calculer le total des dépenses
        $totalDepense = $operation->depenses->sum('total');

        return Inertia::render('Admin/Stock/Mouvement/Show', [
            'operation' => [
                'id' => $operation->id,
                'fournisseur' => $operation->fournisseur,
                'typeOperation' => $operation->typeOperation,
                'departementSource' => $operation->departementSource,
                'departementDestination' => $operation->departementDestination,
                'caisseSource' => $operation->caisseSource,
                'caisseDestination' => $operation->caisseDestination,
                'date' => Carbon::make($operation->date)->format('Y-m-d'),
                'totalCommande' => $totalProduits,
                'totalDepense' => $totalDepense,
                'total' => $totalProduits + $totalDepense,
                'produits' => $produits,
                'depenses' => $depenses,
                'status' => $operation->status,
                'commentaire' => $operation->commentaire,
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($userId, $id)
    {
        // Récupérer l'opération à modifier avec toutes ses relations nécessaires
        $operation = Operation::where('id', $id)
            ->with([
                'fournisseur',
                'typeOperation',
                'departementSource',
                'departementDestination',
                'caisseSource',
                'caisseDestination',
                'produits' => function ($query) {
                    $query->where('operation_produits.status', true)
                          ->with('produit');
                },
                'depenses' => function ($query) {
                    $query->with('motif');
                },
            ])
            ->where('status', true)
            ->firstOrFail();

        // Calculer le total des produits
        $totalProduits = 0;
        
        // Formater les données des produits pour la vue
        $produits_operation = $operation->produits->map(function ($op) use (&$totalProduits) {
            $sousTotal = $op->quantiteAchat * $op->prixAchat;
            $totalProduits += $sousTotal;
            
            return [
                'id' => $op->id,
                'produit' => $op->produit,
                'quantiteAchat' => $op->quantiteAchat,
                'prixAchat' => $op->prixAchat,
                'total' => $sousTotal,
            ];
        });

        // Formater les données des dépenses pour la vue
        $depenses_operation = $operation->depenses->map(function ($depense) {
            return [
                'id' => $depense->id,
                'motif' => $depense->motif,
                'montant' => $depense->total,
                'commentaire' => $depense->commentaire,
            ];
        });

        // Calculer le total des dépenses
        $totalDepense = $operation->depenses->sum('total');

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
        $typeOperations = TypeOperation::where('status', true)->get();

        return Inertia::render('Admin/Stock/Mouvement/Edit', [
            'operation' => [
                'id' => $operation->id,
                'fournisseur' => $operation->fournisseur,
                'typeOperation' => $operation->typeOperation,
                'departementSource' => $operation->departementSource,
                'departementDestination' => $operation->departementDestination,
                'caisseSource' => $operation->caisseSource,
                'caisseDestination' => $operation->caisseDestination,
                'date' => Carbon::make($operation->date)->format('Y-m-d'),
                'totalCommande' => $totalProduits,
                'totalDepense' => $totalDepense,
                'total' => $totalProduits + $totalDepense,
                'produits' => $produits_operation,
                'depenses' => $depenses_operation,
                'status' => $operation->status,
                'commentaire' => $operation->commentaire,
            ],
            'produits' => $produits,
            'motifs' => $motifs,
            'fournisseurs' => $fournisseurs,
            'departements' => $departements,
            'caisses' => $caisses,
            'typeOperations' => $typeOperations,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $userId, $id)
    {
        $request->validate([
            "date" => 'required',
            "typeOperation" => 'required',
            "fournisseur" => 'nullable',
            "departementSource" => [
                Rule::requiredIf(function () use ($request) {
                    return in_array($request->typeOperation['nom'], ['sortie', 'transfert']);
                })
            ],
            "departementDestination" => [
                Rule::requiredIf(function () use ($request) {
                    return in_array($request->typeOperation['nom'], ['entrée', 'transfert']);
                })
            ],
            "produits" => 'required|array',
            "depenses" => 'nullable|array',
        ]);

        DB::beginTransaction();

        try {
            // Récupérer l'opération existante
            $operation = Operation::findOrFail($id);
            
            // Annuler les effets de l'opération précédente
            // Pour une entrée, réduire les stocks
            if ($operation->typeOperation->nom === 'entrée') {
                foreach ($operation->produits as $produit) {
                    if ($produit->status) { // Seulement si le produit a été reçu
                        $stock = Stock::where('produit_id', $produit->produit_id)
                            ->where('departement_id', $operation->departement_destination_id)
                            ->where('societe_id', session('societe')['id'])
                            ->first();
                        
                        if ($stock) {
                            $stock->quantite -= $produit->quantiteAchat;
                            $stock->save();
                        }
                    }
                }
            }
            // Pour une sortie, augmenter les stocks
            else if ($operation->typeOperation->nom === 'sortie') {
                foreach ($operation->produits as $produit) {
                    if ($produit->status) {
                        $stock = Stock::where('produit_id', $produit->produit_id)
                            ->where('departement_id', $operation->departement_source_id)
                            ->where('societe_id', session('societe')['id'])
                            ->first();
                        
                        if ($stock) {
                            $stock->quantite += $produit->quantiteAchat;
                            $stock->save();
                        }
                    }
                }
            }
            // Pour un transfert, annuler le transfert
            else if ($operation->typeOperation->nom === 'transfert') {
                foreach ($operation->produits as $produit) {
                    if ($produit->status) {
                        // Augmenter le stock source
                        $stockSource = Stock::where('produit_id', $produit->produit_id)
                            ->where('departement_id', $operation->departement_source_id)
                            ->where('societe_id', session('societe')['id'])
                            ->first();
                        
                        if ($stockSource) {
                            $stockSource->quantite += $produit->quantiteAchat;
                            $stockSource->save();
                        }
                        
                        // Réduire le stock destination
                        $stockDestination = Stock::where('produit_id', $produit->produit_id)
                            ->where('departement_id', $operation->departement_destination_id)
                            ->where('societe_id', session('societe')['id'])
                            ->first();
                        
                        if ($stockDestination) {
                            $stockDestination->quantite -= $produit->quantiteAchat;
                            $stockDestination->save();
                        }
                    }
                }
            }

            // Calculer les totaux
            $totalProduits = 0;
            foreach ($request->produits as $produit) {
                $totalProduits += $produit['quantiteAchat'] * $produit['prixAchat'];
            }
            
            $totalDepenses = 0;
            if ($request->depenses) {
                foreach ($request->depenses as $depense) {
                    $totalDepenses += $depense['montant'];
                }
            }

            // Mise à jour des informations de l'opération
            $operation->update([
                'date' => Carbon::make($request->date),
                'total' => $totalProduits + $totalDepenses,
                'montant' => $totalProduits + $totalDepenses,
                'fournisseur_id' => $request->fournisseur['id'] ?? null,
                'departement_source_id' => $request->departementSource['id'] ?? null,
                'departement_destination_id' => $request->departementDestination['id'] ?? null,
                'caisse_source_id' => $request->caisseSource['id'] ?? null,
                'caisse_destination_id' => $request->caisseDestination['id'] ?? null,
                'commentaire' => $request->commentaire ?? null,
            ]);

            // Supprimer les anciens produits et dépenses
            $operation->produits()->delete();
            $operation->depenses()->delete();

            // Ajouter les nouveaux produits
            foreach ($request->produits as $produit) {
                // Déterminer le stock selon le type d'opération
                $stockId = null;
                if ($request->typeOperation['nom'] === 'entrée' && $request->departementDestination) {
                    $stock = Stock::firstOrCreate(
                        [
                            'produit_id' => $produit['produit']['id'],
                            'departement_id' => $request->departementDestination['id'],
                            'societe_id' => session('societe')['id'],
                        ],
                        [
                            'quantite' => 0,
                            'status' => true,
                        ]
                    );
                    $stockId = $stock->id;
                    
                    // Mettre à jour le stock
                    $stock->quantite += $produit['quantiteAchat'];
                    $stock->save();
                }
                else if ($request->typeOperation['nom'] === 'sortie' && $request->departementSource) {
                    $stock = Stock::where('produit_id', $produit['produit']['id'])
                        ->where('departement_id', $request->departementSource['id'])
                        ->where('societe_id', session('societe')['id'])
                        ->first();
                    
                    if ($stock) {
                        $stockId = $stock->id;
                        
                        // Mettre à jour le stock
                        $stock->quantite -= $produit['quantiteAchat'];
                        $stock->save();
                    }
                }
                else if ($request->typeOperation['nom'] === 'transfert') {
                    // Réduire le stock source
                    $stockSource = Stock::where('produit_id', $produit['produit']['id'])
                        ->where('departement_id', $request->departementSource['id'])
                        ->where('societe_id', session('societe')['id'])
                        ->first();
                    
                    if ($stockSource) {
                        $stockId = $stockSource->id;
                        
                        // Mettre à jour le stock source
                        $stockSource->quantite -= $produit['quantiteAchat'];
                        $stockSource->save();
                    }
                    
                    // Augmenter le stock destination
                    $stockDestination = Stock::firstOrCreate(
                        [
                            'produit_id' => $produit['produit']['id'],
                            'departement_id' => $request->departementDestination['id'],
                            'societe_id' => session('societe')['id'],
                        ],
                        [
                            'quantite' => 0,
                            'status' => true,
                        ]
                    );
                    
                    // Mettre à jour le stock destination
                    $stockDestination->quantite += $produit['quantiteAchat'];
                    $stockDestination->save();
                }

                // Créer l'opération produit
                OperationProduit::create([
                    'quantiteAchat' => $produit['quantiteAchat'],
                    'prixAchat' => $produit['prixAchat'],
                    'stock_id' => $stockId,
                    'produit_id' => $produit['produit']['id'],
                    'operation_id' => $operation->id,
                    'societe_id' => session('societe')['id'],
                    'status' => true,
                ]);
            }

            // Ajouter les nouvelles dépenses (seulement pour les entrées)
            if ($request->typeOperation['nom'] === 'entrée' && $request->depenses) {
                foreach ($request->depenses as $depense) {
                    Depense::create([
                        'total' => $depense['montant'],
                        'motif_id' => $depense['motif']['id'],
                        'commentaire' => $depense['commentaire'] ?? null,
                        'auteur_id' => Auth::id(),
                        'operation_id' => $operation->id,
                        'societe_id' => session('societe')['id'],
                        'fournisseur_id' => $request->fournisseur['id'] ?? null,
                        'status' => true,
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('admin.stock.mouvement.index', Auth::id())
                ->with('success', 'Mouvement mis à jour avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Erreur lors de la mise à jour : ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     * Supprime un mouvement de stock et annule ses effets sur les quantités de stock
     */
    public function destroy($userId, $id)
    {
        DB::beginTransaction();

        try {
            // Récupérer l'opération
            $operation = Operation::with(['produits.produit', 'typeOperation'])->findOrFail($id);
            
            // Annuler les effets du mouvement sur les stocks selon le type d'opération
            if ($operation->typeOperation->nom === 'entrée') {
                // Pour une entrée, on réduit les quantités
                foreach ($operation->produits as $operationProduit) {
                    if ($operationProduit->status) { // Seulement si le produit a été reçu
                        $produit = $operationProduit->produit;
                        $produit->stockGlobal -= $operationProduit->quantite;
                        $produit->save();
                        
                        // Mettre à jour le stock dans le département de destination
                        $stock = Stock::where('produit_id', $produit->id)
                            ->where('departement_id', $operation->departement_destination_id)
                            ->first();
                            
                        if ($stock) {
                            $stock->quantite -= $operationProduit->quantite;
                            $stock->save();
                        }
                    }
                }
            } elseif ($operation->typeOperation->nom === 'sortie') {
                // Pour une sortie, on réaugmente les quantités
                foreach ($operation->produits as $operationProduit) {
                    $produit = $operationProduit->produit;
                    $produit->stockGlobal += $operationProduit->quantite;
                    $produit->save();
                    
                    // Mettre à jour le stock dans le département source
                    $stock = Stock::where('produit_id', $produit->id)
                        ->where('departement_id', $operation->departement_source_id)
                        ->first();
                        
                    if ($stock) {
                        $stock->quantite += $operationProduit->quantite;
                        $stock->save();
                    }
                }
            } elseif ($operation->typeOperation->nom === 'transfert') {
                // Pour un transfert, on inverse le transfert
                foreach ($operation->produits as $operationProduit) {
                    // Mettre à jour le stock dans le département source (augmenter)
                    $stockSource = Stock::where('produit_id', $operationProduit->produit_id)
                        ->where('departement_id', $operation->departement_source_id)
                        ->first();
                        
                    if ($stockSource) {
                        $stockSource->quantite += $operationProduit->quantite;
                        $stockSource->save();
                    }
                    
                    // Mettre à jour le stock dans le département destination (diminuer)
                    $stockDestination = Stock::where('produit_id', $operationProduit->produit_id)
                        ->where('departement_id', $operation->departement_destination_id)
                        ->first();
                        
                    if ($stockDestination) {
                        $stockDestination->quantite -= $operationProduit->quantite;
                        $stockDestination->save();
                    }
                }
            }
            
            // Marquer l'opération comme supprimée (soft delete) ou la supprimer définitivement
            $operation->status = false;
            $operation->save();
            
            // Vous pouvez également supprimer les enregistrements associés si nécessaire
            // $operation->produits()->delete();
            // $operation->depenses()->delete();
            // $operation->delete();

            DB::commit();

            return redirect()->route('admin.stock.mouvement.index', $userId)
                ->with('success', 'Mouvement supprimé avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Erreur lors de la suppression : ' . $e->getMessage()]);
        }
    }

    /**
     * Annule un mouvement de stock tout en conservant l'historique
     * Crée une nouvelle opération d'annulation qui inverse les effets du mouvement original
     */
    public function cancel($userId, $id)
    {
        DB::beginTransaction();

        try {
            // Récupérer l'opération à annuler
            $operation = Operation::with(['produits.produit', 'typeOperation', 'fournisseur', 'departementSource', 'departementDestination'])
                ->findOrFail($id);
            
            if (!$operation->status) {
                return redirect()->back()->withErrors(['error' => 'Ce mouvement a déjà été annulé ou supprimé.']);
            }
            
            // Créer une nouvelle opération d'annulation
            $annulation = new Operation();
            $annulation->date = Carbon::now();
            $annulation->description = 'Annulation du mouvement #' . $operation->id . ' du ' . Carbon::parse($operation->date)->format('d/m/Y');
            $annulation->societe_id = session('societe')['id'];
            $annulation->status = true;
            
            // Définir les relations selon le type d'opération original
            if ($operation->typeOperation->nom === 'entrée') {
                // Pour annuler une entrée, on crée une sortie
                $typeOperation = TypeOperation::where('nom', 'sortie')->first();
                $annulation->type_operation_id = $typeOperation->id;
                $annulation->departement_source_id = $operation->departement_destination_id;
                $annulation->fournisseur_id = $operation->fournisseur_id;
            } elseif ($operation->typeOperation->nom === 'sortie') {
                // Pour annuler une sortie, on crée une entrée
                $typeOperation = TypeOperation::where('nom', 'entrée')->first();
                $annulation->type_operation_id = $typeOperation->id;
                $annulation->departement_destination_id = $operation->departement_source_id;
                $annulation->fournisseur_id = $operation->fournisseur_id;
            } elseif ($operation->typeOperation->nom === 'transfert') {
                // Pour annuler un transfert, on crée un transfert inverse
                $typeOperation = TypeOperation::where('nom', 'transfert')->first();
                $annulation->type_operation_id = $typeOperation->id;
                $annulation->departement_source_id = $operation->departement_destination_id;
                $annulation->departement_destination_id = $operation->departement_source_id;
            }
            
            $annulation->save();
            
            // Créer les produits associés à l'annulation
            $totalAnnulation = 0;
            foreach ($operation->produits as $operationProduit) {
                if ($operationProduit->status) { // Seulement si le produit a été reçu/sorti/transféré
                    $produit = $operationProduit->produit;
                    
                    // Créer l'opération produit pour l'annulation
                    $annulationProduit = new OperationProduit();
                    $annulationProduit->produit_id = $operationProduit->produit_id;
                    $annulationProduit->operation_id = $annulation->id;
                    $annulationProduit->quantite = $operationProduit->quantite;
                    $annulationProduit->prixAchat = $operationProduit->prixAchat;
                    $annulationProduit->prixVente = $operationProduit->prixVente;
                    $annulationProduit->societe_id = session('societe')['id'];
                    $annulationProduit->status = true; // L'annulation est appliquée immédiatement
                    $annulationProduit->save();
                    
                    $totalAnnulation += $operationProduit->quantite * $operationProduit->prixAchat;
                    
                    // Mettre à jour les stocks selon le type d'opération
                    if ($operation->typeOperation->nom === 'entrée') {
                        // Annuler une entrée = réduire le stock
                        $produit->stockGlobal -= $operationProduit->quantite;
                        $produit->save();
                        
                        $stock = Stock::where('produit_id', $produit->id)
                            ->where('departement_id', $operation->departement_destination_id)
                            ->first();
                            
                        if ($stock) {
                            $stock->quantite -= $operationProduit->quantite;
                            $stock->save();
                        }
                    } elseif ($operation->typeOperation->nom === 'sortie') {
                        // Annuler une sortie = augmenter le stock
                        $produit->stockGlobal += $operationProduit->quantite;
                        $produit->save();
                        
                        $stock = Stock::where('produit_id', $produit->id)
                            ->where('departement_id', $operation->departement_source_id)
                            ->first();
                            
                        if ($stock) {
                            $stock->quantite += $operationProduit->quantite;
                            $stock->save();
                        }
                    } elseif ($operation->typeOperation->nom === 'transfert') {
                        // Annuler un transfert = transférer dans l'autre sens
                        $stockSource = Stock::where('produit_id', $produit->id)
                            ->where('departement_id', $operation->departement_destination_id)
                            ->first();
                            
                        if ($stockSource) {
                            $stockSource->quantite -= $operationProduit->quantite;
                            $stockSource->save();
                        }
                        
                        $stockDestination = Stock::where('produit_id', $produit->id)
                            ->where('departement_id', $operation->departement_source_id)
                            ->first();
                            
                        if ($stockDestination) {
                            $stockDestination->quantite += $operationProduit->quantite;
                            $stockDestination->save();
                        }
                    }
                }
            }
            
            // Mettre à jour le montant total de l'annulation
            $annulation->montant = $totalAnnulation;
            $annulation->save();
            
            // Marquer l'opération originale comme annulée
            $operation->status = false;
            $operation->description = $operation->description . ' (Annulé le ' . Carbon::now()->format('d/m/Y') . ')';
            $operation->save();

            DB::commit();

            return redirect()->route('admin.stock.mouvement.index', $userId)
                ->with('success', 'Mouvement annulé avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Erreur lors de l\'annulation : ' . $e->getMessage()]);
        }
    }

    /**
     * Affiche le tableau de bord des mouvements de stock
     * Présente des statistiques et graphiques sur les mouvements
     */
    public function dashboard($userId)
    {
        // Récupérer les données pour le tableau de bord
        
        // 1. Nombre total de mouvements par type (entrée, sortie, transfert)
        $mouvementsParType = DB::table('operations')
            ->join('type_operations', 'operations.type_operation_id', '=', 'type_operations.id')
            ->where('operations.societe_id', session('societe')['id'])
            ->where('operations.status', true)
            ->select('type_operations.nom as type', DB::raw('count(*) as total'))
            ->groupBy('type_operations.nom')
            ->get();
            
        // 2. Valeur totale des mouvements par mois (6 derniers mois)
        $dateDebut = Carbon::now()->subMonths(5)->startOfMonth();
        $mouvementsParMois = DB::table('operations')
            ->where('operations.societe_id', session('societe')['id'])
            ->where('operations.status', true)
            ->where('operations.date', '>=', $dateDebut)
            ->select(
                DB::raw('YEAR(date) as annee'),
                DB::raw('MONTH(date) as mois'),
                DB::raw('SUM(montant) as montant_total')
            )
            ->groupBy('annee', 'mois')
            ->orderBy('annee')
            ->orderBy('mois')
            ->get();
            
        // Formater les données pour le graphique
        $moisLabels = [];
        $montantData = [];
        
        // Créer un tableau avec tous les mois des 6 derniers mois
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $moisLabels[] = $date->format('M Y');
            $montantData[] = 0; // Valeur par défaut
        }
        
        // Remplir avec les données réelles
        foreach ($mouvementsParMois as $mouvement) {
            $date = Carbon::createFromDate($mouvement->annee, $mouvement->mois, 1);
            $index = 5 - Carbon::now()->diffInMonths($date, false);
            if ($index >= 0 && $index < 6) {
                $montantData[$index] = $mouvement->montant_total;
            }
        }
        
        // 3. Top 5 des produits les plus mouvementés
        $topProduits = DB::table('operation_produits')
            ->join('produits', 'operation_produits.produit_id', '=', 'produits.id')
            ->join('operations', 'operation_produits.operation_id', '=', 'operations.id')
            ->where('operations.societe_id', session('societe')['id'])
            ->where('operations.status', true)
            ->select(
                'produits.id',
                'produits.nom',
                DB::raw('SUM(operation_produits.quantiteAchat) as quantite_totale'),
                DB::raw('COUNT(DISTINCT operations.id) as nombre_mouvements')
            )
            ->groupBy('produits.id', 'produits.nom')
            ->orderBy('quantite_totale', 'desc')
            ->limit(5)
            ->get();
            
        // 4. Derniers mouvements (10 derniers)
        $derniersMouvements = Operation::with(['typeOperation', 'fournisseur', 'departementSource', 'departementDestination'])
            ->where('societe_id', session('societe')['id'])
            ->where('status', true)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
            
        // 5. Statistiques générales
        $statsGenerales = [
            'total_mouvements' => Operation::where('societe_id', session('societe')['id'])->where('status', true)->count(),
            'valeur_totale' => Operation::where('societe_id', session('societe')['id'])->where('status', true)->sum('montant'),
            'mouvements_mois_courant' => Operation::where('societe_id', session('societe')['id'])
                ->where('status', true)
                ->whereYear('date', Carbon::now()->year)
                ->whereMonth('date', Carbon::now()->month)
                ->count(),
            'valeur_mois_courant' => Operation::where('societe_id', session('societe')['id'])
                ->where('status', true)
                ->whereYear('date', Carbon::now()->year)
                ->whereMonth('date', Carbon::now()->month)
                ->sum('montant'),
        ];
        
        // 6. Mouvements par département
        $mouvementsParDepartement = DB::table('operations')
            ->leftJoin('departements as source', 'operations.departement_source_id', '=', 'source.id')
            ->leftJoin('departements as dest', 'operations.departement_destination_id', '=', 'dest.id')
            ->join('type_operations', 'operations.type_operation_id', '=', 'type_operations.id')
            ->where('operations.societe_id', session('societe')['id'])
            ->where('operations.status', true)
            ->select(
                'type_operations.nom as type',
                'source.nom as source',
                'dest.nom as destination',
                DB::raw('count(*) as total'),
                DB::raw('sum(operations.montant) as montant_total')
            )
            ->groupBy('type_operations.nom', 'source.nom', 'dest.nom')
            ->get();
        
        return Inertia::render('Admin/Stock/Mouvement/Dashboard', [
            'mouvementsParType' => $mouvementsParType,
            'moisLabels' => $moisLabels,
            'montantData' => $montantData,
            'topProduits' => $topProduits,
            'derniersMouvements' => $derniersMouvements,
            'statsGenerales' => $statsGenerales,
            'mouvementsParDepartement' => $mouvementsParDepartement,
        ]);
    }

    public function paginationFiltre(Request $request): \Illuminate\Http\JsonResponse
    {
        $extraQuery = Operation::where(function ($query) use ($request) {

            foreach ($request->filters as $filter) {
                if ($filter['id'] == 'produit') {
                    $query->whereRelation('produit', 'nom', 'like', "%" . $filter['value'] . "%");
                } else if ($filter['id'] == 'fournisseur') {
                    $query->whereRelation('fournisseur', 'nom', 'like', "%" . $filter['value'] . "%");
                } else {
                    $query->where($filter['id'], 'like', "%" . $filter['value'] . "%");
                }
            }

            if ($request->globalFilter) {
                $query->whereRelation('produit', 'nom', 'like', "%" . $request->globalFilter . "%")->whereRelation('produit.typeProduit', 'nom', 'like', "%" . $request->globalFilter . "%")->orWhereRelation('produit.categorie', 'nom', 'like', "%" . $request->globalFilter . "%")->orWhereRelation('produit.fournisseur', 'nom', 'like', "%" . $request->globalFilter . "%")->orWhere('nom', 'like', "%" . $request->globalFilter . "%")->orWhere('prixAchat', 'like', "%" . $request->globalFilter . "%")->orWhere('prixVente', 'like', "%" . $request->globalFilter . "%");

                /*$colonnes = Schema::getColumnListing('produits'); // Obtient la liste des colonnes de la table 'produits'

                foreach ($colonnes as $colonne) {
                    $query->orWhere($colonne, 'like', "%" . $request->globalFilter . "%");
                }*/
            }
        })->orderByDesc('created_at')->with("fournisseur")/*->where('status', true)*/->skip($request->start)->take($request->size);

        foreach ($request->sorting as $sort) {
            if ($sort['desc']) {
                $extraQuery->orderBy($sort['id'], 'desc');
            } else {
                $extraQuery->orderBy($sort['id'], 'asc');
            }
        }

        $produits = $extraQuery->get();
        $rowCount = $extraQuery->paginate($request->size)->total();

        return response()->json(['data' => $produits, 'rowCount' => $rowCount]);
    }
}
