<?php

namespace App\Http\Controllers\Admin\Stock;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use App\Models\Departement;
use App\Models\Fournisseur;
use App\Models\Produit;
use App\Models\Stock;
use App\Models\TypeProduit;
use App\Models\Operation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProduitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Récupérer les paramètres de pagination, tri et recherche
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);
        $search = $request->input('search', '');
        $sortField = $request->input('sort_field', 'nom');
        $sortDirection = $request->input('sort_direction', 'asc');
        $categorieFilter = $request->input('categorie_id');
        $typeProduitFilter = $request->input('type_produit_id');
        $stockFilter = $request->input('stock_filter'); // 'all', 'low', 'out'
        $departementFilter = $request->input('departement_id');
        
        // Construire la requête de base
        $query = Produit::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            });
            
        // Appliquer la recherche si elle est fournie
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereRelation('typeProduitAchat', 'nom', 'like', "%{$search}%")
                  ->orWhereRelation('typeProduitVente', 'nom', 'like', "%{$search}%")
                  ->orWhereRelation('categorie', 'nom', 'like', "%{$search}%")
                  ->orWhere('prixAchat', 'like', "%{$search}%")
                  ->orWhere('prixVente', 'like', "%{$search}%");
            });
        }
        
        // Filtre par catégorie
        if (!empty($categorieFilter)) {
            $query->where('categorie_id', $categorieFilter);
        }
        
        // Filtre par type de produit
        if (!empty($typeProduitFilter)) {
            $query->where(function ($q) use ($typeProduitFilter) {
                $q->where('type_produit_achat_id', $typeProduitFilter)
                  ->orWhere('type_produit_vente_id', $typeProduitFilter);
            });
        }
        
        // Filtre par niveau de stock
        if (!empty($stockFilter)) {
            switch ($stockFilter) {
                case 'low':
                    $query->whereRaw('stockGlobal <= stockCritique AND stockGlobal > 0');
                    break;
                case 'out':
                    $query->where('stockGlobal', '<=', 0);
                    break;
                // 'all' n'a pas besoin de filtre spécifique
            }
        }
        
        // Filtre par département (affecte les produits qui ont du stock dans ce département)
        if (!empty($departementFilter)) {
            $query->whereHas('stocks', function($q) use ($departementFilter) {
                $q->where('departement_id', $departementFilter);
            });
        }
        
        // Appliquer le tri
        $query->orderBy($sortField, $sortDirection);
        
        // Exécuter la requête avec pagination
        $produits = $query->with('typeProduitAchat', 'typeProduitVente', 'categorie')
            ->paginate($perPage);

        // Récupérer les types de produits et catégories pour les filtres
        $typeProduits = TypeProduit::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->orderBy('nom')
            ->get();

        $categories = Categorie::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->orderBy('nom')
            ->get();
            
        // Récupérer les départements pour le filtre
        $departements = Departement::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->orderBy('nom')
            ->get();
            
        // Statistiques globales
        // Si un filtre est appliqué, les statistiques doivent refléter les produits filtrés
        $statsQuery = clone $query; // Utiliser la même base de requête que pour les produits affichés
        
        $totalProduits = $statsQuery->count();
        
        $stockCritique = Produit::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            });
            
        // Appliquer les mêmes filtres que la requête principale
        if (!empty($categorieFilter)) {
            $stockCritique->where('categorie_id', $categorieFilter);
        }
        
        if (!empty($typeProduitFilter)) {
            $stockCritique->where(function ($q) use ($typeProduitFilter) {
                $q->where('type_produit_achat_id', $typeProduitFilter)
                  ->orWhere('type_produit_vente_id', $typeProduitFilter);
            });
        }
        
        if (!empty($departementFilter)) {
            $stockCritique->whereHas('stocks', function($q) use ($departementFilter) {
                $q->where('departement_id', $departementFilter);
            });
        }
        
        $stockCritique = $stockCritique->whereRaw('stockGlobal <= stockCritique AND stockGlobal > 0')
            ->count();
            
        $stockEpuise = Produit::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            });
            
        // Appliquer les mêmes filtres que la requête principale
        if (!empty($categorieFilter)) {
            $stockEpuise->where('categorie_id', $categorieFilter);
        }
        
        if (!empty($typeProduitFilter)) {
            $stockEpuise->where(function ($q) use ($typeProduitFilter) {
                $q->where('type_produit_achat_id', $typeProduitFilter)
                  ->orWhere('type_produit_vente_id', $typeProduitFilter);
            });
        }
        
        if (!empty($departementFilter)) {
            $stockEpuise->whereHas('stocks', function($q) use ($departementFilter) {
                $q->where('departement_id', $departementFilter);
            });
        }
        
        $stockEpuise = $stockEpuise->where('stockGlobal', '<=', 0)
            ->count();
            
        $valeurTotaleStockQuery = Produit::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            });
            
        // Appliquer les mêmes filtres que la requête principale
        if (!empty($categorieFilter)) {
            $valeurTotaleStockQuery->where('categorie_id', $categorieFilter);
        }
        
        if (!empty($typeProduitFilter)) {
            $valeurTotaleStockQuery->where(function ($q) use ($typeProduitFilter) {
                $q->where('type_produit_achat_id', $typeProduitFilter)
                  ->orWhere('type_produit_vente_id', $typeProduitFilter);
            });
        }
        
        if (!empty($departementFilter)) {
            $valeurTotaleStockQuery->whereHas('stocks', function($q) use ($departementFilter) {
                $q->where('departement_id', $departementFilter);
            });
        }
        
        $valeurTotaleStock = $valeurTotaleStockQuery->selectRaw('SUM(stockGlobal * prixAchat) as valeur_totale')
            ->first()
            ->valeur_totale ?? 0;

        // Statistiques par département si un filtre de département est appliqué
        $statsByDepartement = null;
        if (!empty($departementFilter)) {
            $departementInfo = Departement::find($departementFilter);
            if ($departementInfo) {
                // Statistiques par département avec les filtres appliqués
                $stocksQuery = DB::table('stocks')
                    ->join('produits', 'stocks.produit_id', '=', 'produits.id')
                    ->where('stocks.departement_id', $departementFilter)
                    ->where('produits.status', true)
                    ->where(function ($query) {
                        $query->where("produits.societe_id", session('societe')['id'])->orWhere("produits.societe_id", null);
                    });
                
                // Appliquer les mêmes filtres que la requête principale
                if (!empty($categorieFilter)) {
                    $stocksQuery->where('produits.categorie_id', $categorieFilter);
                }
                
                if (!empty($typeProduitFilter)) {
                    $stocksQuery->where(function ($q) use ($typeProduitFilter) {
                        $q->where('produits.type_produit_achat_id', $typeProduitFilter)
                          ->orWhere('produits.type_produit_vente_id', $typeProduitFilter);
                    });
                }
                
                if (!empty($search)) {
                    $stocksQuery->where(function ($q) use ($search) {
                        $q->where('produits.nom', 'like', "%{$search}%")
                          ->orWhere('produits.description', 'like', "%{$search}%");
                    });
                }
                
                // Compter les produits dans ce département (avec filtres)
                $totalProduitsByDept = $stocksQuery->count(DB::raw('DISTINCT produits.id'));
                
                // Stock critique par département (avec filtres)
                $stockCritiqueByDept = clone $stocksQuery;
                $stockCritiqueByDept = $stockCritiqueByDept
                    ->whereRaw('stocks.quantite <= produits.stockCritique AND stocks.quantite > 0')
                    ->count(DB::raw('DISTINCT produits.id'));
                    
                // Stock épuisé par département (avec filtres)
                $stockEpuiseByDept = clone $stocksQuery;
                $stockEpuiseByDept = $stockEpuiseByDept
                    ->where('stocks.quantite', '<=', 0)
                    ->count(DB::raw('DISTINCT produits.id'));
                    
                // Valeur totale du stock par département (avec filtres)
                $valeurTotaleStockByDept = clone $stocksQuery;
                $valeurTotaleStockByDept = $valeurTotaleStockByDept
                    ->selectRaw('SUM(stocks.quantite * produits.prixAchat) as valeur_totale')
                    ->first()
                    ->valeur_totale ?? 0;
                    
                $statsByDepartement = [
                    'nom_departement' => $departementInfo->nom,
                    'total_produits' => $totalProduitsByDept,
                    'stockCritique' => $stockCritiqueByDept,
                    'stock_epuise' => $stockEpuiseByDept,
                    'valeur_totale_stock' => $valeurTotaleStockByDept,
                ];
            }
        }
        
        return Inertia::render('Admin/Stock/Produit/Index', [
            'produits' => $produits,
            'typeProduits' => $typeProduits,
            'categories' => $categories,
            'departements' => $departements,
            'filters' => [
                'search' => $search,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'categorie_id' => $categorieFilter,
                'type_produit_id' => $typeProduitFilter,
                'stock_filter' => $stockFilter,
                'departement_id' => $departementFilter,
            ],
            'stats' => [
                'total_produits' => $totalProduits,
                'stockCritique' => $stockCritique,
                'stock_epuise' => $stockEpuise,
                'valeur_totale_stock' => $valeurTotaleStock,
                'departement' => $statsByDepartement,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $typeProduits = TypeProduit::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->orderBy('nom')
            ->get();

        $typeProduitAchat = TypeProduit::where('status', true)->where('nom', 'ensemble')->first();
        $typeProduitVente = TypeProduit::where('status', true)->where('nom', 'unité')->first();

        $categories = Categorie::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->orderBy('nom')
            ->get();

        $fournisseurs = Fournisseur::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->orderBy('nom')
            ->get();

        $departements = Departement::where('id', session('societe')['id'])->where('status', true)->get();
        $departementPrincipal = Departement::where('id', session('societe')['id'])->where('status', true)->where('type', 'PRINCIPAL')->first();

        return Inertia::render("Admin/Stock/Produit/Create", [
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
            "image" => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::beginTransaction();

        try {
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('produits', 'public');
            }

            $produit = Produit::create([
                "nom" => $request->nom,
                "description" => $request->description,
                "stockCritique" => $request->stockCritique,
                "stockGlobal" => $request->stockGlobal,
                "image" => $imagePath,
                "type_produit_achat_id" => $request->typeProduitAchat['id'],
                "quantiteAchat" => $request->quantiteAchat,
                "prixAchat" => $request->prixAchat,
                "type_produit_vente_id" => $request->typeProduitVente['id'],
                "quantiteVente" => $request->quantiteVente,
                "prixVente" => $request->prixVente,
                "categorie_id" => $request->categorie['id'],
                "fournisseur_principal_id" => $request->fournisseur ? $request->fournisseur['id'] : null,
                "unite_mesure_id" => $request->uniteMesure ? $request->uniteMesure['id'] : null,
                "devise_id" => $request->devise ? $request->devise['id'] : null,
                "societe_id" => session('societe')['id'],
            ]);

            // Création du stock initial
            Stock::create([
                'produit_id' => $produit->id,
                'quantite' => $request->stockGlobal,
                'societe_id' => session('societe')['id'],
            ]);

            DB::commit();

            return redirect()->route('admin.stock.produit.index', Auth::id())->with('success', 'Produit créé avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Erreur lors de la création du produit: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($userId, $produitId)
    {
        $produit = Produit::with([
            'typeProduitAchat', 
            'typeProduitVente', 
            'categorie', 
            'fournisseurPrincipal', 
            'stocks',
            'operations' => function($query) {
                $query->orderBy('created_at', 'desc')->limit(10);
            }
        ])->findOrFail($produitId);

        // Récupérer les mouvements de stock liés à ce produit
        $mouvements = Operation::where('produit_id', $produitId)
            ->orderBy('created_at', 'desc')
            ->with(['typeOperation', 'departementSource', 'departementDestination'])
            ->paginate(10);

        return Inertia::render('Admin/Stock/Produit/Show', [
            'produit' => $produit,
            'mouvements' => $mouvements
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($userId, $produitId)
    {
        $produit = Produit::with(['typeProduitAchat', 'typeProduitVente', 'categorie', 'fournisseurPrincipal', 'uniteMesure', 'devise'])->findOrFail($produitId);

        $typeProduits = TypeProduit::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->orderBy('nom')
            ->get();

        $categories = Categorie::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->orderBy('nom')
            ->get();

        $fournisseurs = Fournisseur::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->orderBy('nom')
            ->get();

        return Inertia::render('Admin/Stock/Produit/Edit', [
            'produit' => $produit,
            'typeProduits' => $typeProduits,
            'typeProduitAchat' => $produit->typeProduitAchat,
            'typeProduitVente' => $produit->typeProduitVente,
            'categories' => $categories,
            'fournisseurs' => $fournisseurs,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $userId, $produitId)
    {
        $produit = Produit::findOrFail($produitId);

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
            "image" => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::beginTransaction();

        try {
            $imagePath = $produit->image;
            if ($request->hasFile('image')) {
                // Supprimer l'ancienne image si elle existe
                if ($produit->image && Storage::disk('public')->exists($produit->image)) {
                    Storage::disk('public')->delete($produit->image);
                }
                $imagePath = $request->file('image')->store('produits', 'public');
            }

            $produit->update([
                "nom" => $request->nom,
                "description" => $request->description,
                "stockCritique" => $request->stockCritique,
                "stockGlobal" => $request->stockGlobal,
                "image" => $imagePath,
                "type_produit_achat_id" => $request->typeProduitAchat['id'],
                "quantiteAchat" => $request->quantiteAchat,
                "prixAchat" => $request->prixAchat,
                "type_produit_vente_id" => $request->typeProduitVente['id'],
                "quantiteVente" => $request->quantiteVente,
                "prixVente" => $request->prixVente,
                "categorie_id" => $request->categorie['id'],
                "fournisseur_principal_id" => $request->fournisseur ? $request->fournisseur['id'] : null,
                "unite_mesure_id" => $request->uniteMesure ? $request->uniteMesure['id'] : null,
                "devise_id" => $request->devise ? $request->devise['id'] : null,
            ]);

            // Mettre à jour le stock global si nécessaire
            $stock = Stock::where('produit_id', $produit->id)
                ->where('departement_id', null)
                ->first();

            if ($stock) {
                $stock->update([
                    'quantite' => $request->stockGlobal
                ]);
            } else {
                Stock::create([
                    'produit_id' => $produit->id,
                    'quantite' => $request->stockGlobal,
                    'societe_id' => session('societe')['id'],
                ]);
            }

            DB::commit();

            return redirect()->route('admin.stock.produit.index', Auth::id())->with('success', 'Produit mis à jour avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Erreur lors de la mise à jour du produit: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($userId, $produitId)
    {
        $produit = Produit::findOrFail($produitId);

        DB::beginTransaction();

        try {
            $produit->status = !$produit->status;
            $produit->save();

            DB::commit();

            return redirect()->back()->with('success', 'Statut du produit modifié avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Erreur lors de la modification du status: ' . $e->getMessage());
        }
    }

    /**
     * Filtrer et paginer les produits.
     */
    public function paginationFiltre(Request $request)
    {
        $extraQuery = Produit::where(function ($query) use ($request) {
            foreach ($request->filters as $filter) {
                if ($filter['id'] == 'typeProduit') {
                    $query->whereRelation('typeProduit', 'nom', 'like', "%" . $filter['value'] . "%");
                } else if ($filter['id'] == 'categorie') {
                    $query->whereRelation('categorie', 'nom', 'like', "%" . $filter['value'] . "%");
                } else if ($filter['id'] == 'fournisseur') {
                    $query->whereRelation('fournisseurPrincipal', 'nom', 'like', "%" . $filter['value'] . "%");
                } else if ($filter['id'] == 'quantiteAchat') {
                    $query->whereRelation('quantiteAchat', 'like', "%" . $filter['value'] . "%");
                } else if ($filter['id'] == 'quantiteVente') {
                    $query->whereRelation('quantiteVente', 'like', "%" . $filter['value'] . "%");
                } else {
                    $query->where($filter['id'], 'like', "%" . $filter['value'] . "%");
                }
            }

            if ($request->globalFilter) {
                $query->where(function ($q) use ($request) {
                    $q->whereRelation('typeProduitAchat', 'nom', 'like', "%" . $request->globalFilter . "%")
                        ->orWhereRelation('typeProduitVente', 'nom', 'like', "%" . $request->globalFilter . "%")
                        ->orWhereRelation('categorie', 'nom', 'like', "%" . $request->globalFilter . "%")
                        ->orWhereRelation('fournisseurPrincipal', 'nom', 'like', "%" . $request->globalFilter . "%")
                        ->orWhere('nom', 'like', "%" . $request->globalFilter . "%")
                        ->orWhere('prixAchat', 'like', "%" . $request->globalFilter . "%")
                        ->orWhere('prixVente', 'like', "%" . $request->globalFilter . "%");
                });
            }
        })->with('typeProduitAchat', 'typeProduitVente', 'categorie', "fournisseurPrincipal")
            ->skip($request->start)
            ->take($request->size);

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

    /**
     * Exporter les produits au format CSV.
     */
    public function exportCsv()
    {
        $produits = Produit::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->with('typeProduitAchat', 'typeProduitVente', 'categorie', 'fournisseurPrincipal')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="produits.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $callback = function () use ($produits) {
            $file = fopen('php://output', 'w');
            fputcsv($file, [
                'ID', 'Nom', 'Description', 'Stock Global', 'Seuil Minimal',
                'Type Achat', 'Quantité Achat', 'Prix Achat',
                'Type Vente', 'Quantité Vente', 'Prix Vente',
                'Catégorie', 'Fournisseur Principal'
            ]);

            foreach ($produits as $produit) {
                fputcsv($file, [
                    $produit->id,
                    $produit->nom,
                    $produit->description,
                    $produit->stockGlobal,
                    $produit->stockCritique,
                    $produit->typeProduitAchat ? $produit->typeProduitAchat->nom : '',
                    $produit->quantiteAchat,
                    $produit->prixAchat,
                    $produit->typeProduitVente ? $produit->typeProduitVente->nom : '',
                    $produit->quantiteVente,
                    $produit->prixVente,
                    $produit->categorie ? $produit->categorie->nom : '',
                    $produit->fournisseurPrincipal ? $produit->fournisseurPrincipal->nom : ''
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Importer des produits depuis un fichier CSV.
     */
    public function importCsv(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240',
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();

        DB::beginTransaction();

        try {
            $handle = fopen($path, 'r');
            $header = fgetcsv($handle); // Skip header row

            while (($row = fgetcsv($handle)) !== false) {
                $typeProduitAchat = TypeProduit::where('nom', $row[5])->first();
                $typeProduitVente = TypeProduit::where('nom', $row[8])->first();
                $categorie = Categorie::where('nom', $row[11])->first();
                $fournisseur = Fournisseur::where('nom', $row[12])->first();

                $produit = Produit::create([
                    "nom" => $row[1],
                    "description" => $row[2],
                    "stockGlobal" => $row[3],
                    "stockCritique" => $row[4],
                    "type_produit_achat_id" => $typeProduitAchat ? $typeProduitAchat->id : null,
                    "quantiteAchat" => $row[6],
                    "prixAchat" => $row[7],
                    "type_produit_vente_id" => $typeProduitVente ? $typeProduitVente->id : null,
                    "quantiteVente" => $row[9],
                    "prixVente" => $row[10],
                    "categorie_id" => $categorie ? $categorie->id : null,
                    "fournisseur_principal_id" => $fournisseur ? $fournisseur->id : null,
                    "societe_id" => session('societe')['id'],
                ]);

                // Création du stock initial
                Stock::create([
                    'produit_id' => $produit->id,
                    'quantite' => $row[3],
                    'societe_id' => session('societe')['id'],
                ]);
            }

            fclose($handle);
            DB::commit();

            return redirect()->route('admin.stock.produit.index', Auth::id())->with('success', 'Produits importés avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Erreur lors de l\'importation des produits: ' . $e->getMessage());
        }
    }
}
