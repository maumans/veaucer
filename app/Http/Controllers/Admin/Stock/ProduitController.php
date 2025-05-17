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
                  ->orWhereRelation('categorie', 'libelle', 'like', "%{$search}%")
                  ->orWhere('prixAchat', 'like', "%{$search}%")
                  ->orWhere('prixVente', 'like', "%{$search}%");
            });
        }
        
        // Filtre par catégorie
        if (!empty($categorieFilter)) {
            $query->where('categorie_id', $categorieFilter);
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
        $produits = $query->with('categorie', 'fournisseurPrincipal', 'uniteMesure', 'devise')
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
            ->orderBy('libelle')
            ->get();

        $departements = Departement::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->orderBy('nom')
            ->get();

        // Calculer les statistiques
        $baseStatsQuery = Produit::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            });
            
        // Appliquer les filtres aux statistiques
        if (!empty($categorieFilter)) {
            $baseStatsQuery->where('categorie_id', $categorieFilter);
        }
        
        // Statistiques globales
        $totalProduits = clone $baseStatsQuery;
        $totalProduits = $totalProduits->count();
        
        $stockCritique = clone $baseStatsQuery;
        $stockCritique = $stockCritique->whereRaw('stockGlobal <= stockCritique AND stockGlobal > 0')->count();
        
        $stockEpuise = clone $baseStatsQuery;
        $stockEpuise = $stockEpuise->where('stockGlobal', '<=', 0)->count();
        
        $valeurTotaleStock = clone $baseStatsQuery;
        $valeurTotaleStock = $valeurTotaleStock->sum(DB::raw('stockGlobal * prixAchat'));
        
        // Statistiques par département si un département est sélectionné
        $departementStats = null;
        if (!empty($departementFilter)) {
            $departement = Departement::find($departementFilter);
            
            $produitsDepartement = clone $baseStatsQuery;
            $produitsDepartement = $produitsDepartement->whereHas('stocks', function($q) use ($departementFilter) {
                $q->where('departement_id', $departementFilter);
            })->count();
            
            $stockCritiqueDepartement = clone $baseStatsQuery;
            $stockCritiqueDepartement = $stockCritiqueDepartement
                ->whereHas('stocks', function($q) use ($departementFilter) {
                    $q->where('departement_id', $departementFilter)
                      ->whereRaw('quantite <= produits.stockCritique AND quantite > 0');
                })
                ->count();
            
            $stockEpuiseDepartement = clone $baseStatsQuery;
            $stockEpuiseDepartement = $stockEpuiseDepartement
                ->whereHas('stocks', function($q) use ($departementFilter) {
                    $q->where('departement_id', $departementFilter)
                      ->where('quantite', '<=', 0);
                })
                ->count();
            
            $valeurTotaleStockDepartement = DB::table('stocks')
                ->where('departement_id', $departementFilter)
                ->join('produits', 'stocks.produit_id', '=', 'produits.id')
                ->sum(DB::raw('stocks.quantite * produits.prixAchat'));
            
            $departementStats = [
                'nom' => $departement->nom,
                'total_produits' => $produitsDepartement,
                'stockCritique' => $stockCritiqueDepartement,
                'stock_epuise' => $stockEpuiseDepartement,
                'valeur_totale_stock' => $valeurTotaleStockDepartement
            ];
        }
        
        // Préparer les statistiques à envoyer à la vue
        $stats = [
            'total_produits' => $totalProduits,
            'stockCritique' => $stockCritique,
            'stock_epuise' => $stockEpuise,
            'valeur_totale_stock' => $valeurTotaleStock,
            'departement' => $departementStats
        ];

        // Retourner la vue avec les données
        return Inertia::render('Admin/Stock/Produit/Index', [
            'produits' => $produits,
            'typeProduits' => $typeProduits,
            'categories' => $categories,
            'departements' => $departements,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'categorie_id' => $categorieFilter,
                'type_produit_id' => $typeProduitFilter,
                'stock_filter' => $stockFilter,
                'departement_id' => $departementFilter,
                'per_page' => $perPage,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
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

        $categories = Categorie::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->orderBy('libelle')
            ->get();

        $fournisseurs = Fournisseur::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->orderBy('nom')
            ->get();

        return Inertia::render('Admin/Stock/Produit/Create', [
            'typeProduits' => $typeProduits,
            'categories' => $categories,
            'fournisseurs' => $fournisseurs,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required',
            "prixAchat" => 'required',
            "prixVente" => 'required',
            "stockGlobal" => 'required',
            "stockCritique" => 'required',
            "quantiteEnsemble" => 'nullable|numeric',
            "prixEnsemble" => 'nullable|numeric',
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
                "prixAchat" => $request->prixAchat,
                "prixVente" => $request->prixVente,
                "quantiteEnsemble" => $request->quantiteEnsemble,
                "prixEnsemble" => $request->prixEnsemble,
                "categorie_id" => $request->categorie['id'],
                "fournisseur_principal_id" => $request->fournisseur ? $request->fournisseur['id'] : null,
                "unite_mesure_id" => $request->uniteMesure ? $request->uniteMesure['id'] : null,
                "devise_id" => $request->devise ? $request->devise['id'] : null,
                "societe_id" => session('societe')['id'],
            ]);

            $departement=Departement::where("nom","principal")->where("societe_id",session('societe')['id'])->first();

            // Création du stock initial
            Stock::create([
                'produit_id' => $produit->id,
                'quantite' => $request->stockGlobal,
                'societe_id' => session('societe')['id'],
                'departement_id' => $departement->id,
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
        $produit = Produit::with('categorie', 'fournisseurPrincipal', 'uniteMesure', 'devise', 'stocks.departement')
            ->findOrFail($produitId);

        return Inertia::render('Admin/Stock/Produit/Show', [
            'produit' => $produit,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($userId, $produitId)
    {
        $produit = Produit::with('categorie', 'fournisseurPrincipal', 'uniteMesure', 'devise')
            ->findOrFail($produitId);

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
            ->orderBy('libelle')
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
            "prixAchat" => 'required',
            "prixVente" => 'required',
            "stockGlobal" => 'required',
            "stockCritique" => 'required',
            "quantiteEnsemble" => 'nullable|numeric',
            "prixEnsemble" => 'nullable|numeric',
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
                "prixAchat" => $request->prixAchat,
                "prixVente" => $request->prixVente,
                "quantiteEnsemble" => $request->quantiteEnsemble,
                "prixEnsemble" => $request->prixEnsemble,
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
        try {
            $produit = Produit::findOrFail($produitId);
            $produit->update(['status' => false]);
            return redirect()->route('admin.stock.produit.index', Auth::id())->with('success', 'Produit supprimé avec succès');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erreur lors de la suppression du produit: ' . $e->getMessage());
        }
    }

    /**
     * Filtrer et paginer les produits.
     */
    public function paginationFiltre(Request $request)
    {
        // Récupérer les paramètres de pagination, tri et recherche
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);
        $search = $request->input('search', '');
        $sortField = $request->input('sort_field', 'nom');
        $sortDirection = $request->input('sort_direction', 'asc');
        $categorieFilter = $request->input('categorie_id');
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
                  ->orWhereRelation('categorie', 'libelle', 'like', "%{$search}%")
                  ->orWhere('prixAchat', 'like', "%{$search}%")
                  ->orWhere('prixVente', 'like', "%{$search}%");
            });
        }
        
        // Filtre par catégorie
        if (!empty($categorieFilter)) {
            $query->where('categorie_id', $categorieFilter);
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
        $produits = $query->with('categorie', 'fournisseurPrincipal', 'uniteMesure', 'devise')
            ->paginate($perPage);
            
        return response()->json($produits);
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
            ->with('categorie', 'fournisseurPrincipal')
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
                'ID', 'Nom', 'Description', 'Stock Global', 'Stock Critique',
                'Prix Achat', 'Prix Vente', 'Quantité Ensemble', 'Prix Ensemble',
                'Catégorie', 'Fournisseur Principal'
            ]);

            foreach ($produits as $produit) {
                fputcsv($file, [
                    $produit->id,
                    $produit->nom,
                    $produit->description,
                    $produit->stockGlobal,
                    $produit->stockCritique,
                    $produit->prixAchat,
                    $produit->prixVente,
                    $produit->quantiteEnsemble,
                    $produit->prixEnsemble,
                    $produit->categorie ? $produit->categorie->libelle : '',
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
                $categorie = Categorie::where('libelle', $row[9])->first();
                $fournisseur = Fournisseur::where('nom', $row[10])->first();

                $produit = Produit::create([
                    "nom" => $row[1],
                    "description" => $row[2],
                    "stockGlobal" => $row[3],
                    "stockCritique" => $row[4],
                    "prixAchat" => $row[5],
                    "prixVente" => $row[6],
                    "quantiteEnsemble" => $row[7],
                    "prixEnsemble" => $row[8],
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
