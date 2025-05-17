<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AjustementInventaire;
use App\Models\Categorie;
use App\Models\Departement;
use App\Models\Fournisseur;
use App\Models\InventairePhysique;
use App\Models\Operation;
use App\Models\OperationProduit;
use App\Models\Produit;
use App\Models\Stock;
use App\Models\TypeOperation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Récupérer les filtres de la requête
        $dateDebut = $request->input('date_debut') ? Carbon::parse($request->input('date_debut')) : Carbon::now()->subMonths(1);
        $dateFin = $request->input('date_fin') ? Carbon::parse($request->input('date_fin')) : Carbon::now();
        $departementId = $request->input('departement_id');
        
        // Récupérer les départements pour les filtres
        $departements = Departement::where('status', true)->get();
        
        // Statistiques des produits
        $produitsStats = $this->getProduitsStats($departementId);
        
        // Statistiques des mouvements
        $mouvementsStats = $this->getMouvementsStats($dateDebut, $dateFin, $departementId);
        
        // Statistiques des inventaires
        $inventairesStats = $this->getInventairesStats($dateDebut, $dateFin, $departementId);
        
        // Données pour les graphiques
        $graphiquesMouvements = $this->getGraphiquesMouvements($dateDebut, $dateFin, $departementId);
        $graphiquesStock = $this->getGraphiquesStock($departementId);
        
        return Inertia::render('Admin/Dashboard', [
            'produitsStats' => $produitsStats,
            'mouvementsStats' => $mouvementsStats,
            'inventairesStats' => $inventairesStats,
            'graphiquesMouvements' => $graphiquesMouvements,
            'graphiquesStock' => $graphiquesStock,
            'departements' => $departements,
            'filtres' => [
                'date_debut' => $dateDebut->format('Y-m-d'),
                'date_fin' => $dateFin->format('Y-m-d'),
                'departement_id' => $departementId,
            ],
        ]);
    }
    
    /**
     * Récupère les statistiques des produits
     */
    private function getProduitsStats($departementId = null)
    {
        // Requête de base pour les produits
        $produitsQuery = Produit::where('status', true);
        
        // Nombre total de produits
        $totalProduits = $produitsQuery->count();
        
        // Produits par catégorie
        $produitsParCategorie = Categorie::withCount(['produits' => function($query) {
            $query->where('status', true);
        }])->get();
        
        // Statistiques de stock
        $stockQuery = Stock::query();
        if ($departementId) {
            $stockQuery->where('departement_id', $departementId);
        }
        
        $stockCritique = $stockQuery->whereHas('produit', function($query) {
            $query->where('status', true);
        })->whereRaw('quantite <= stockCritique')->count();
        
        $stockEpuise = $stockQuery->whereHas('produit', function($query) {
            $query->where('status', true);
        })->where('quantite', 0)->count();
        
        return [
            'total' => $totalProduits,
            'par_categorie' => $produitsParCategorie,
            'stockCritique' => $stockCritique,
            'stock_epuise' => $stockEpuise,
        ];
    }
    
    /**
     * Récupère les statistiques des mouvements
     */
    private function getMouvementsStats($dateDebut, $dateFin, $departementId = null)
    {
        // Requête de base pour les opérations
        $operationsQuery = Operation::whereBetween('date', [$dateDebut, $dateFin]);
        
        // Filtrer par département si spécifié
        if ($departementId) {
            $operationsQuery->where(function($query) use ($departementId) {
                $query->where('departement_source_id', $departementId)
                      ->orWhere('departement_destination_id', $departementId);
            });
        }
        
        // Récupérer les types d'opérations
        $typesOperations = TypeOperation::all();
        
        // Compter les opérations par type
        $operationsParType = [];
        foreach ($typesOperations as $type) {
            $operationsParType[] = [
                'type' => $type->nom,
                'count' => $operationsQuery->clone()->where('type_operation_id', $type->id)->count(),
            ];
        }
        
        // Calculer la valeur totale des entrées et sorties
        $valeurEntrees = OperationProduit::whereHas('operation', function($query) use ($dateDebut, $dateFin, $departementId) {
            $query->whereBetween('date', [$dateDebut, $dateFin])
                  ->whereHas('typeOperation', function($q) {
                      $q->where('nom', 'like', '%entrée%');
                  });
                  
            if ($departementId) {
                $query->where(function($q) use ($departementId) {
                    $q->where('departement_destination_id', $departementId);
                });
            }
        })->sum(DB::raw('prix * quantite'));
        
        $valeurSorties = OperationProduit::whereHas('operation', function($query) use ($dateDebut, $dateFin, $departementId) {
            $query->whereBetween('date', [$dateDebut, $dateFin])
                  ->whereHas('typeOperation', function($q) {
                      $q->where('nom', 'like', '%sortie%');
                  });
                  
            if ($departementId) {
                $query->where(function($q) use ($departementId) {
                    $q->where('departement_source_id', $departementId);
                });
            }
        })->sum(DB::raw('prix * quantite'));
        
        return [
            'total' => $operationsQuery->count(),
            'par_type' => $operationsParType,
            'valeur_entrees' => $valeurEntrees,
            'valeur_sorties' => $valeurSorties,
        ];
    }
    
    /**
     * Récupère les statistiques des inventaires
     */
    private function getInventairesStats($dateDebut, $dateFin, $departementId = null)
    {
        // Requête de base pour les inventaires
        $inventairesQuery = InventairePhysique::whereBetween('date_debut', [$dateDebut, $dateFin]);
        
        // Filtrer par département si spécifié
        if ($departementId) {
            $inventairesQuery->where('departement_id', $departementId);
        }
        
        // Compter les inventaires par status
        $inventairesParStatut = [
            'planifie' => $inventairesQuery->clone()->where('status', 'planifié')->count(),
            'en_cours' => $inventairesQuery->clone()->where('status', 'en_cours')->count(),
            'termine' => $inventairesQuery->clone()->where('status', 'terminé')->count(),
            'annule' => $inventairesQuery->clone()->where('status', 'annulé')->count(),
        ];
        
        // Récupérer les ajustements d'inventaire
        $ajustementsQuery = AjustementInventaire::whereBetween('date_ajustement', [$dateDebut, $dateFin]);
        
        if ($departementId) {
            $ajustementsQuery->where('departement_id', $departementId);
        }
        
        $ajustementsParStatut = [
            'en_attente' => $ajustementsQuery->clone()->where('status', 'en_attente')->count(),
            'valide' => $ajustementsQuery->clone()->where('status', 'validé')->count(),
            'rejete' => $ajustementsQuery->clone()->where('status', 'rejeté')->count(),
        ];
        
        return [
            'total_inventaires' => $inventairesQuery->count(),
            'inventaires_par_statut' => $inventairesParStatut,
            'total_ajustements' => $ajustementsQuery->count(),
            'ajustements_par_statut' => $ajustementsParStatut,
        ];
    }
    
    /**
     * Récupère les données pour les graphiques de mouvements
     */
    private function getGraphiquesMouvements($dateDebut, $dateFin, $departementId = null)
    {
        // Données pour le graphique des mouvements par jour
        $mouvementsParJour = [];
        $currentDate = clone $dateDebut;
        
        while ($currentDate <= $dateFin) {
            $dateStr = $currentDate->format('Y-m-d');
            
            $entrees = Operation::whereDate('date', $dateStr)
                ->whereHas('typeOperation', function($query) {
                    $query->where('nom', 'like', '%entrée%');
                });
                
            $sorties = Operation::whereDate('date', $dateStr)
                ->whereHas('typeOperation', function($query) {
                    $query->where('nom', 'like', '%sortie%');
                });
                
            if ($departementId) {
                $entrees->where('departement_destination_id', $departementId);
                $sorties->where('departement_source_id', $departementId);
            }
            
            $mouvementsParJour[] = [
                'date' => $dateStr,
                'entrees' => $entrees->count(),
                'sorties' => $sorties->count(),
            ];
            
            $currentDate->addDay();
        }
        
        // Données pour le graphique des mouvements par fournisseur
        $mouvementsParFournisseur = DB::table('operations')
            ->join('fournisseurs', 'operations.fournisseur_id', '=', 'fournisseurs.id')
            ->whereBetween('operations.date', [$dateDebut, $dateFin])
            ->select('fournisseurs.nom', DB::raw('count(*) as total'))
            ->groupBy('fournisseurs.nom')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get();
            
        if ($departementId) {
            $mouvementsParFournisseur = DB::table('operations')
                ->join('fournisseurs', 'operations.fournisseur_id', '=', 'fournisseurs.id')
                ->whereBetween('operations.date', [$dateDebut, $dateFin])
                ->where(function($query) use ($departementId) {
                    $query->where('operations.departement_source_id', $departementId)
                          ->orWhere('operations.departement_destination_id', $departementId);
                })
                ->select('fournisseurs.nom', DB::raw('count(*) as total'))
                ->groupBy('fournisseurs.nom')
                ->orderBy('total', 'desc')
                ->limit(5)
                ->get();
        }
        
        return [
            'par_jour' => $mouvementsParJour,
            'par_fournisseur' => $mouvementsParFournisseur,
        ];
    }
    
    /**
     * Récupère les données pour les graphiques de stock
     */
    private function getGraphiquesStock($departementId = null)
    {
        // Produits les plus en stock
        $produitsTopStock = DB::table('stocks')
            ->join('produits', 'stocks.produit_id', '=', 'produits.id')
            ->select('produits.nom', 'stocks.quantite')
            ->where('produits.status', true);
            
        if ($departementId) {
            $produitsTopStock->where('stocks.departement_id', $departementId);
        }
        
        $produitsTopStock = $produitsTopStock->orderBy('stocks.quantite', 'desc')
            ->limit(10)
            ->get();
            
        // Produits en stock critique
        $produitsCritiques = DB::table('stocks')
            ->join('produits', 'stocks.produit_id', '=', 'produits.id')
            ->select('produits.nom', 'stocks.quantite', 'stocks.stockCritique')
            ->where('produits.status', true)
            ->whereRaw('stocks.quantite <= stocks.stockCritique');

            
        if ($departementId) {
            $produitsCritiques->where('stocks.departement_id', $departementId);
        }
        
        $produitsCritiques = $produitsCritiques->orderBy('stocks.quantite', 'asc')
            ->limit(10)
            ->get();
            
        // Répartition du stock par département
        $stockParDepartement = DB::table('stocks')
            ->join('departements', 'stocks.departement_id', '=', 'departements.id')
            ->select('departements.nom', DB::raw('SUM(stocks.quantite) as total_stock'))
            ->where('departements.status', true)
            ->groupBy('departements.nom')
            ->orderBy('total_stock', 'desc')
            ->get();
            
        // Répartition du stock par catégorie
        $stockParCategorie = DB::table('stocks')
            ->join('produits', 'stocks.produit_id', '=', 'produits.id')
            ->join('categories', 'produits.categorie_id', '=', 'categories.id')
            ->select('categories.nom', DB::raw('SUM(stocks.quantite) as total_stock'))
            ->where('produits.status', true)
            ->groupBy('categories.nom');
            
        if ($departementId) {
            $stockParCategorie->where('stocks.departement_id', $departementId);
        }
        
        $stockParCategorie = $stockParCategorie->orderBy('total_stock', 'desc')
            ->get();
            
        return [
            'produits_top' => $produitsTopStock,
            'produits_critiques' => $produitsCritiques,
            'par_departement' => $stockParDepartement,
            'par_categorie' => $stockParCategorie,
        ];
    }
}
