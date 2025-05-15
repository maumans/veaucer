<?php

namespace App\Http\Controllers\Admin\Stock;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Categorie;
use App\Models\Departement;
use App\Models\TypeProduit;
use Illuminate\Http\Request;
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

        return Inertia::render('Admin/Stock/Inventaire/Index',[
            'produits' => $produits,
            'typeProduits' => $typeProduits,
            'categories' => $categories,
            'departements' => $departements,
        ]);
    }

    public function paginationFiltre(Request $request): \Illuminate\Http\JsonResponse
    {
        $extraQuery = Produit::where(function($query) use ($request) {
            // Filtre par société
            $query->where("societe_id", session('societe')['id'])->orWhere("societe_id", null);
        })->where(function($query) use ($request) {
            // Traitement des filtres de colonnes
            if (!empty($request->filters)) {
                foreach ($request->filters as $filter) {
                    if ($filter['id'] == 'typeProduit') {
                        // Si c'est un ID numérique, on filtre par ID
                        if (is_numeric($filter['value'])) {
                            $query->whereHas('typeProduitAchat', function($q) use ($filter) {
                                $q->where('id', $filter['value']);
                            });
                        } else {
                            // Sinon on filtre par nom
                            $query->whereHas('typeProduitAchat', function($q) use ($filter) {
                                $q->where('nom', 'like', "%{$filter['value']}%");
                            });
                        }
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
                    else if($filter['id'] == 'fournisseur') {
                        $query->whereHas('fournisseurPrincipal', function($q) use ($filter) {
                            $q->where('nom', 'like', "%{$filter['value']}%");
                        });
                    }
                    else if($filter['id'] == 'seuil_minimal') {
                        // Filtre spécial pour les produits sous le seuil minimal
                        $query->whereRaw('stockGlobal < seuilMinimal');
                    }
                    else if($filter['id'] == 'stockGlobal' && $filter['value'] == '0') {
                        // Filtre pour les produits en rupture de stock
                        $query->where('stockGlobal', '=', 0);
                    }
                    else {
                        $query->where($filter['id'], 'like', "%{$filter['value']}%");
                    }
                }
            }

            // Filtre global (recherche)
            if($request->globalFilter) {
                $searchTerm = "%{$request->globalFilter}%";
                $query->where(function($q) use ($request, $searchTerm) {
                    $q->where('nom', 'like', $searchTerm)
                      ->orWhere('reference', 'like', $searchTerm)
                      ->orWhere('description', 'like', $searchTerm)
                      ->orWhere('stockGlobal', 'like', $searchTerm)
                      ->orWhere('prixAchat', 'like', $searchTerm)
                      ->orWhere('prixVente', 'like', $searchTerm)
                      ->orWhereHas('typeProduitAchat', function($subq) use ($searchTerm) {
                          $subq->where('nom', 'like', $searchTerm);
                      })
                      ->orWhereHas('categorie', function($subq) use ($searchTerm) {
                          $subq->where('nom', 'like', $searchTerm);
                      });
                    
                    // Ajouter la recherche par fournisseur seulement si la relation existe
                    if (method_exists('App\Models\Produit', 'fournisseurPrincipal')) {
                        $q->orWhereHas('fournisseurPrincipal', function($subq) use ($searchTerm) {
                            $subq->where('nom', 'like', $searchTerm);
                        });
                    }
                });
            }
        });
        
        // Variable pour stocker l'ID du département sélectionné
        $departement_id = null;
        
        // Filtre par département si spécifié
        if ($request->has('departement_id') && !empty($request->departement_id)) {
            $departement_id = $request->departement_id;
            
            // Vérification si le produit a des stocks dans ce département
            $extraQuery->whereHas('stocks', function($q) use ($departement_id) {
                $q->where('departement_id', $departement_id);
            });
        }
        
        // Chargement des relations
        $extraQuery = $extraQuery->with(['typeProduitAchat', 'categorie', 'fournisseurPrincipal'])
                                ->skip($request->start)
                                ->take($request->size);

        // Gestion du tri
        if (!empty($request->sorting)) {
            foreach ($request->sorting as $sort) {
                if ($sort['desc']) {
                    $extraQuery->orderBy($sort['id'], 'desc');
                } else {
                    $extraQuery->orderBy($sort['id'], 'asc');
                }
            }
        } else {
            // Tri par défaut si aucun tri n'est spécifié
            $extraQuery->orderBy('nom', 'asc');
        }

        try {
            // Récupération des données
            $produits = $extraQuery->get();
            
            // Si un département est sélectionné, remplacer le stockGlobal par le stock du département
            if ($departement_id) {
                foreach ($produits as $produit) {
                    // Récupérer le stock spécifique au département
                    $stockDepartement = $produit->stocks()
                        ->where('departement_id', $departement_id)
                        ->value('quantite') ?? 0;
                    
                    // Remplacer temporairement le stockGlobal par le stock du département
                    $produit->stockOriginal = $produit->stockGlobal;
                    $produit->stockGlobal = $stockDepartement;
                    
                    // Recalculer la valeur du stock pour ce département
                    $produit->valeurStock = $stockDepartement * ($produit->prixAchat ?? 0);
                }
            } else {
                // Calcul normal de la valeur du stock pour chaque produit
                foreach ($produits as $produit) {
                    $produit->valeurStock = ($produit->stockGlobal ?? 0) * ($produit->prixAchat ?? 0);
                }
            }
            
            // Comptage total pour la pagination
            $rowCount = $extraQuery->paginate($request->size)->total();
            
            return response()->json([
                'data' => $produits,
                'rowCount' => $rowCount,
                'departement_id' => $departement_id,
                'success' => true
            ]);
        } catch (\Exception $e) {
            // Gestion des erreurs
            return response()->json([
                'data' => [],
                'rowCount' => 0,
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
