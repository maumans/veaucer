<?php

namespace App\Http\Controllers\Admin\Stock;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Categorie;
use App\Models\Departement;
use App\Models\TypeProduit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InventaireController extends Controller
{
    public function index()
    {
        $produits = Produit::where('status', true)->orderBy('nom')->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->paginate(10);


        $typeProduits = TypeProduit::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->get();

        $categories = Categorie::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->with('categorie')->orderBy('nom')->get();

        $departements = Departement::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->get();

        // Calcul des statistiques globales
        $totalProduits = Produit::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->count();
            
        $sousstockCritique = Produit::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->whereRaw('stockGlobal < stockCritique')
            ->count();
            
        $enRupture = Produit::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->where('stockGlobal', '=', 0)
            ->count();
            
        $valeurTotale = Produit::where('status', true)
            ->where(function ($query) {
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            })
            ->selectRaw('SUM(stockGlobal * prixAchat) as valeur_totale')
            ->value('valeur_totale') ?? 0;
            
        // Préparation des statistiques globales
        $statsGlobales = [
            'totalProduits' => $totalProduits,
            'sousstockCritique' => $sousstockCritique,
            'enRupture' => $enRupture,
            'valeurTotale' => $valeurTotale
        ];

        return Inertia::render('Admin/Stock/Inventaire/Index',[
            'produits' => $produits,
            'typeProduits' => $typeProduits,
            'categories' => $categories,
            'departements' => $departements,
            'statsGlobales' => $statsGlobales,
        ]);
    }

    public function paginationFiltre(Request $request, $userId = null): \Illuminate\Http\JsonResponse
    {
        try {
            // Construction de la requête de base
            $baseQuery = Produit::where(function($query) use ($request) {
                // Filtre par société
                $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
            });
            
            // Cloner la requête pour le comptage total (avant d'appliquer skip/take)
            $countQuery = clone $baseQuery;
            
            // Appliquer les filtres sur la requête principale
            $this->applyFilters($baseQuery, $request);
            
            // Variable pour stocker l'ID du département sélectionné
            $departement_id = null;
            
            // Filtre par département si spécifié
            if ($request->has('departement_id') && !empty($request->departement_id)) {
                $departement_id = $request->departement_id;
                
                // Vérifier si la relation stocks existe
                if (method_exists('App\\Models\\Produit', 'stocks')) {
                    // Vérification si le produit a des stocks dans ce département
                    $baseQuery->whereHas('stocks', function($q) use ($departement_id) {
                        $q->where('departement_id', $departement_id);
                    });
                    
                    // Appliquer le même filtre à la requête de comptage
                    $countQuery->whereHas('stocks', function($q) use ($departement_id) {
                        $q->where('departement_id', $departement_id);
                    });
                }
            }
            
            // Appliquer les mêmes filtres à la requête de comptage
            $this->applyFilters($countQuery, $request);
            
            // Chargement des relations
            $baseQuery->with(['categorie']);
            
            // Ajouter la relation fournisseurPrincipal seulement si elle existe
            if (method_exists('App\\Models\\Produit', 'fournisseurPrincipal')) {
                $baseQuery->with('fournisseurPrincipal');
            }
            
            // Gestion du tri
            if (!empty($request->sorting)) {
                foreach ($request->sorting as $sort) {
                    $direction = ($sort['desc']) ? 'desc' : 'asc';
                    $baseQuery->orderBy($sort['id'], $direction);
                }
            } else {
                // Tri par défaut si aucun tri n'est spécifié
                $baseQuery->orderBy('nom', 'asc');
            }
            
            // Pagination
            $baseQuery->skip($request->start)->take($request->size);
            
            // Récupération des données
            $produits = $baseQuery->get();
            
            // Comptage total pour la pagination (avant skip/take)
            $rowCount = $countQuery->count();
            
            // Si un département est sélectionné, remplacer le stockGlobal par le stock du département
            if ($departement_id) {
                foreach ($produits as $produit) {
                    try {
                        // Récupérer le stock spécifique au département
                        $stockDepartement = $produit->stocks()
                            ->where('departement_id', $departement_id)
                            ->value('quantite');
                        
                        // Remplacer temporairement le stockGlobal par le stock du département
                        $produit->stockOriginal = $produit->stockGlobal;
                        $produit->stockGlobal = $stockDepartement ?? 0;
                        
                        // Recalculer la valeur du stock pour ce département
                        $produit->valeurStock = ($stockDepartement ?? 0) * ($produit->prixAchat ?? 0);
                    } catch (\Exception $e) {
                        // En cas d'erreur, utiliser des valeurs par défaut
                        $produit->stockOriginal = $produit->stockGlobal;
                        $produit->stockGlobal = 0;
                        $produit->valeurStock = 0;
                    }
                }
            } else {
                // Calcul normal de la valeur du stock pour chaque produit
                foreach ($produits as $produit) {
                    $produit->valeurStock = ($produit->stockGlobal ?? 0) * ($produit->prixAchat ?? 0);
                }
            }
            
            // Calcul des statistiques globales ou par département
            $statsQuery = Produit::where('status', true)
                ->where(function ($query) {
                    $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
                });
                
            // Appliquer les filtres sur la requête de statistiques
            $this->applyFilters($statsQuery, $request);
            
            // Si un département est sélectionné, filtrer les statistiques par département
            if ($departement_id) {
                $statsQuery->whereHas('stocks', function($q) use ($departement_id) {
                    $q->where('departement_id', $departement_id);
                });
                
                // Calcul des statistiques pour le département sélectionné
                $totalProduits = $statsQuery->count();
                
                $sousstockCritiqueQuery = clone $statsQuery;
                $sousstockCritique = $sousstockCritiqueQuery->whereHas('stocks', function($q) use ($departement_id) {
                    $q->where('departement_id', $departement_id)
                      ->whereRaw('quantite < produits.stockCritique');
                })->count();
                
                $enRuptureQuery = clone $statsQuery;
                $enRupture = $enRuptureQuery->whereHas('stocks', function($q) use ($departement_id) {
                    $q->where('departement_id', $departement_id)
                      ->where('quantite', '=', 0);
                })->count();
                
                $valeurTotale = DB::table('stocks')
                    ->where('departement_id', $departement_id)
                    ->join('produits', 'stocks.produit_id', '=', 'produits.id')
                    ->where('produits.status', true)
                    ->where(function ($query) {
                        $query->where("produits.societe_id", session('societe')['id'])->orWhere("produits.societe_id", null);
                    })
                    ->sum(DB::raw('stocks.quantite * produits.prixAchat')) ?? 0;
            } else {
                // Calcul des statistiques globales
                $totalProduits = $statsQuery->count();
                
                $sousstockCritiqueQuery = clone $statsQuery;
                $sousstockCritique = $sousstockCritiqueQuery->whereRaw('stockGlobal < stockCritique AND stockGlobal > 0')->count();
                
                $enRuptureQuery = clone $statsQuery;
                $enRupture = $enRuptureQuery->where('stockGlobal', '=', 0)->count();
                
                $valeurTotaleQuery = clone $statsQuery;
                $valeurTotale = $valeurTotaleQuery->selectRaw('SUM(stockGlobal * prixAchat) as valeur_totale')->value('valeur_totale') ?? 0;
            }
            
            // Préparation des statistiques
            $stats = [
                'totalProduits' => $totalProduits,
                'sousstockCritique' => $sousstockCritique,
                'enRupture' => $enRupture,
                'valeurTotale' => $valeurTotale
            ];

            return response()->json([
                'data' => $produits,
                'rowCount' => $rowCount,
                'departement_id' => $departement_id,
                'stats' => $stats,
                'success' => true
            ]);
        } catch (\Exception $e) {
            // Gestion des erreurs
            return response()->json([
                'data' => [],
                'rowCount' => 0,
                'success' => false,
                'error' => 'Erreur lors du chargement des données: ' . $e->getMessage() . ' dans ' . $e->getFile() . ' à la ligne ' . $e->getLine()
            ], 500);
        }
    }
    
    /**
     * Applique les filtres à une requête
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param Request $request
     * @return void
     */
    private function applyFilters($query, $request): void
    {
        $query->where(function($query) use ($request) {
            // Traitement des filtres de colonnes
            if (!empty($request->filters)) {
                foreach ($request->filters as $filter) {
                    // Le filtre par typeProduit a été désactivé car la relation n'existe plus
                    if ($filter['id'] == 'typeProduit') {
                        // Ne rien faire, la relation typeProduit n'existe plus
                    }
                    else if($filter['id'] == 'categorie') {
                        // Si c'est un ID numérique, on filtre par ID
                        if (is_numeric($filter['value'])) {
                            $query->whereHas('categorie', function($q) use ($filter) {
                                $q->where('id', $filter['value']);
                            });
                        } else {
                            // Sinon on filtre par nom
                            $query->whereHas('categorie', function($q) use ($filter) {
                                $q->where('nom', 'like', "%{$filter['value']}%");
                            });
                        }
                    }
                    else if($filter['id'] == 'fournisseur' && method_exists('App\\Models\\Produit', 'fournisseurPrincipal')) {
                        $query->whereHas('fournisseurPrincipal', function($q) use ($filter) {
                            $q->where('nom', 'like', "%{$filter['value']}%");
                        });
                    }
                    else if($filter['id'] == 'stock_critique') {
                        // Filtre spécial pour les produits sous le seuil critique
                        $query->whereRaw('stockGlobal < stockCritique');
                    }
                    else if($filter['id'] == 'stockGlobal' && $filter['value'] == '0') {
                        // Filtre pour les produits en rupture de stock
                        $query->where('stockGlobal', '=', 0);
                    }
                    else if($filter['id'] == 'stockGlobal' && is_numeric($filter['value'])) {
                        // Filtre par valeur de stock
                        $query->where('stockGlobal', '=', $filter['value']);
                    }
                    else {
                        // Filtre standard pour les autres colonnes
                        $query->where($filter['id'], 'like', "%{$filter['value']}%");
                    }
                }
            }

            // Traitement du filtre global
            if (!empty($request->globalFilter)) {
                $searchTerm = "%{$request->globalFilter}%";
                $query->where(function($q) use ($request, $searchTerm) {
                    $q->where('nom', 'like', $searchTerm)
                      ->orWhere('reference', 'like', $searchTerm)
                      ->orWhere('description', 'like', $searchTerm)
                      ->orWhere('stockGlobal', 'like', $searchTerm)
                      ->orWhere('prixAchat', 'like', $searchTerm)
                      ->orWhere('prixVente', 'like', $searchTerm)
                      ->orWhereHas('categorie', function($subq) use ($searchTerm) {
                          $subq->where('nom', 'like', $searchTerm);
                      });
                    
                    // Ajouter la recherche par fournisseur seulement si la relation existe
                    if (method_exists('App\\Models\\Produit', 'fournisseurPrincipal')) {
                        $q->orWhereHas('fournisseurPrincipal', function($subq) use ($searchTerm) {
                            $subq->where('nom', 'like', $searchTerm);
                        });
                    }
                });
            }
        });
    }
}
