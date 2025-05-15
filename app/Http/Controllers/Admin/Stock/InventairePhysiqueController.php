<?php

namespace App\Http\Controllers\Admin\Stock;

use App\Http\Controllers\Controller;
use App\Models\AjustementInventaire;
use App\Models\Departement;
use App\Models\InventairePhysique;
use App\Models\InventairePhysiqueDetail;
use App\Models\Operation;
use App\Models\Produit;
use App\Models\Stock;
use App\Services\StockMovementService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InventairePhysiqueController extends Controller
{
    /**
     * Affiche la liste des inventaires physiques
     */
    public function index()
    {
        $inventaires = InventairePhysique::with(['departement', 'user'])
            ->where('societe_id', session('societe')['id'])
            ->orderByDesc('created_at')
            ->paginate(10);

        $departements = Departement::where('societe_id', session('societe')['id'])
            ->where('status', true)
            ->orderBy('nom')
            ->get();

        return Inertia::render('Admin/Stock/Inventaire/Physique/Index', [
            'inventaires' => $inventaires,
            'departements' => $departements,
        ]);
    }

    /**
     * Affiche le formulaire de création d'un inventaire physique
     */
    public function create()
    {
        $departements = Departement::where('societe_id', session('societe')['id'])
            ->where('status', true)
            ->orderBy('nom')
            ->get();

        return Inertia::render('Admin/Stock/Inventaire/Physique/Create', [
            'departements' => $departements,
        ]);
    }

    /**
     * Enregistre un nouvel inventaire physique
     */
    public function store(Request $request)
    {
        $request->validate([
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'description' => 'nullable|string',
            'departement_id' => 'nullable|exists:departements,id',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            // Créer l'inventaire physique
            $inventaire = InventairePhysique::create([
                'date_debut' => $request->date_debut,
                'date_fin' => $request->date_fin,
                'statut' => 'planifié',
                'description' => $request->description,
                'societe_id' => session('societe')['id'],
                'departement_id' => $request->departement_id,
                'user_id' => auth()->id(),
                'notes' => $request->notes,
            ]);

            // Récupérer tous les produits actifs pour cet inventaire
            $query = Produit::where('status', true)
                ->where(function ($query) {
                    $query->where('societe_id', session('societe')['id'])
                        ->orWhere('societe_id', null);
                });

            // Si un département est spécifié, filtrer les produits par département
            if ($request->departement_id) {
                $query->whereHas('stocks', function($q) use ($request) {
                    $q->where('departement_id', $request->departement_id);
                });
            }

            $produits = $query->get();

            // Créer les détails d'inventaire pour chaque produit
            foreach ($produits as $produit) {
                // Déterminer la quantité théorique en fonction du département
                $quantiteTheorique = 0;
                
                if ($request->departement_id) {
                    // Récupérer le stock spécifique au département
                    $stock = Stock::where('produit_id', $produit->id)
                        ->where('departement_id', $request->departement_id)
                        ->first();
                        
                    $quantiteTheorique = $stock ? $stock->quantite : 0;
                } else {
                    // Si pas de département spécifié, utiliser le stock global
                    $quantiteTheorique = $produit->stockGlobal ?? 0;
                }
                
                InventairePhysiqueDetail::create([
                    'inventaire_physique_id' => $inventaire->id,
                    'produit_id' => $produit->id,
                    'quantite_theorique' => $quantiteTheorique,
                    'status' => 'en_attente',
                ]);
            }

            DB::commit();

            return redirect()->route('admin.inventaire.physique.show', [auth()->id(), $inventaire->id])
                ->with('success', 'Inventaire physique créé avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Une erreur est survenue lors de la création de l\'inventaire physique: ' . $e->getMessage());
        }
    }

    /**
     * Affiche les détails d'un inventaire physique
     */
    public function show($userId, $id)
    {
        $inventaire = InventairePhysique::with(['departement', 'user', 'details.produit', 'details.compteur', 'details.validateur'])
            ->findOrFail($id);

        // Statistiques
        $stats = [
            'total_produits' => $inventaire->details->count(),
            'produits_comptes' => $inventaire->details->whereNotNull('quantite_comptee')->count(),
            'produits_a_compter' => $inventaire->details->whereNull('quantite_comptee')->count(),
            'ecarts_positifs' => $inventaire->details->where('difference', '>', 0)->count(),
            'ecarts_negatifs' => $inventaire->details->where('difference', '<', 0)->count(),
            'progression' => $inventaire->details->count() > 0 
                ? round(($inventaire->details->whereNotNull('quantite_comptee')->count() / $inventaire->details->count()) * 100, 2) 
                : 0,
        ];

        return Inertia::render('Admin/Stock/Inventaire/Physique/Show', [
            'inventaire' => $inventaire,
            'stats' => $stats,
            'details' => $inventaire->details,
        ]);
    }

    /**
     * Affiche le formulaire d'édition d'un inventaire physique
     */
    public function edit($userId, $id)
    {
        $inventaire = InventairePhysique::with(['departement', 'user'])
            ->findOrFail($id);

        $departements = Departement::where('societe_id', session('societe')['id'])
            ->where('status', true)
            ->orderBy('nom')
            ->get();

        return Inertia::render('Admin/Stock/Inventaire/Physique/Edit', [
            'inventaire' => $inventaire,
            'departements' => $departements,
        ]);
    }

    /**
     * Met à jour un inventaire physique
     */
    public function update(Request $request, $userId, $id)
    {
        $request->validate([
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'description' => 'nullable|string',
            'departement_id' => 'nullable|exists:departements,id',
            'notes' => 'nullable|string',
        ]);

        $inventaire = InventairePhysique::findOrFail($id);

        // Vérifier si l'inventaire peut être modifié
        if ($inventaire->statut !== 'planifié') {
            return back()->with('error', 'Seuls les inventaires planifiés peuvent être modifiés.');
        }

        $inventaire->update([
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'description' => $request->description,
            'departement_id' => $request->departement_id,
            'notes' => $request->notes,
        ]);

        return redirect()->route('admin.inventaire.physique.show', [auth()->id(), $inventaire->id])
            ->with('success', 'Inventaire physique mis à jour avec succès.');
    }

    /**
     * Démarre un inventaire physique
     */
    public function demarrer($userId, $id)
    {
        $inventaire = InventairePhysique::findOrFail($id);

        // Vérifier si l'inventaire peut être démarré
        if ($inventaire->statut !== 'planifié') {
            return back()->with('error', 'Seuls les inventaires planifiés peuvent être démarrés.');
        }

        $inventaire->update([
            'statut' => 'en_cours',
            'date_debut' => now(),
        ]);

        return back()->with('success', 'Inventaire physique démarré avec succès.');
    }

    /**
     * Termine un inventaire physique
     */
    public function terminer($userId, $id)
    {
        $inventaire = InventairePhysique::findOrFail($id);

        // Vérifier si l'inventaire peut être terminé
        if ($inventaire->statut !== 'en_cours') {
            return back()->with('error', 'Seuls les inventaires en cours peuvent être terminés.');
        }

        $inventaire->update([
            'statut' => 'terminé',
            'date_fin' => now(),
        ]);

        return back()->with('success', 'Inventaire physique terminé avec succès.');
    }

    /**
     * Annule un inventaire physique
     */
    public function annuler($userId, $id)
    {
        $inventaire = InventairePhysique::findOrFail($id);

        // Vérifier si l'inventaire peut être annulé
        if ($inventaire->statut === 'terminé') {
            return back()->with('error', 'Les inventaires terminés ne peuvent pas être annulés.');
        }

        $inventaire->update([
            'statut' => 'annulé',
        ]);

        return back()->with('success', 'Inventaire physique annulé avec succès.');
    }

    /**
     * Enregistre les quantités comptées pour un produit
     */
    public function compterProduit(Request $request, $userId, $inventaireId, $detailId)
    {
        $request->validate([
            'quantite_comptee' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $detail = InventairePhysiqueDetail::findOrFail($detailId);
        $inventaire = InventairePhysique::findOrFail($inventaireId);

        // Vérifier si l'inventaire est en cours
        if ($inventaire->statut !== 'en_cours') {
            return back()->with('error', 'Les produits ne peuvent être comptés que pour les inventaires en cours.');
        }

        // Calculer la différence
        $difference = $request->quantite_comptee - $detail->quantite_theorique;

        $detail->update([
            'quantite_comptee' => $request->quantite_comptee,
            'difference' => $difference,
            'notes' => $request->notes,
            'compteur_user_id' => auth()->id(),
            'status' => 'en_attente',
        ]);

        return back()->with('success', 'Produit compté avec succès.');
    }

    /**
     * Valide les quantités comptées pour un produit
     */
    public function validerProduit(Request $request, $userId, $inventaireId, $detailId)
    {
        $detail = InventairePhysiqueDetail::findOrFail($detailId);
        $inventaire = InventairePhysique::findOrFail($inventaireId);

        // Vérifier si l'inventaire est en cours
        if ($inventaire->statut !== 'en_cours') {
            return back()->with('error', 'Les produits ne peuvent être validés que pour les inventaires en cours.');
        }

        $detail->update([
            'validateur_user_id' => auth()->id(),
            'status' => 'validé',
        ]);

        return back()->with('success', 'Produit validé avec succès.');
    }

    /**
     * Génère les ajustements d'inventaire pour tous les produits validés
     */
    public function genererAjustements($userId, $id)
    {
        $inventaire = InventairePhysique::findOrFail($id);

        // Vérifier si l'inventaire est terminé
        if ($inventaire->statut !== 'terminé') {
            return back()->with('error', 'Les ajustements ne peuvent être générés que pour les inventaires terminés.');
        }

        DB::beginTransaction();

        try {
            // Récupérer tous les détails validés avec des différences
            $details = InventairePhysiqueDetail::where('inventaire_physique_id', $id)
                ->where('status', 'validé')
                ->whereRaw('ABS(difference) > 0')
                ->get();

            // Initialiser le service de gestion des mouvements de stock
            $stockMovementService = new StockMovementService();
            
            // Créer une opération principale pour l'inventaire
            $operation = Operation::create([
                'date' => now(),
                'description' => 'Inventaire physique #' . $id,
                'status' => 'VALIDE',
                'societe_id' => session('societe')['id'],
                'auteur_id' => auth()->id(),
                'status' => true,
                'departement_source_id' => $inventaire->departement_id,
                'departement_destination_id' => $inventaire->departement_id,
                'reference_externe' => 'INV-' . $id,
                'type_mouvement' => 'AJUSTEMENT',
                'inventaire_physique_id' => $id
            ]);

            foreach ($details as $detail) {
                // Créer un ajustement pour chaque détail
                $ajustement = AjustementInventaire::create([
                    'inventaire_physique_id' => $id,
                    'produit_id' => $detail->produit_id,
                    'quantite_avant' => $detail->quantite_theorique,
                    'quantite_apres' => $detail->quantite_comptee,
                    'difference' => $detail->difference,
                    'motif' => 'Ajustement suite à inventaire physique #' . $id,
                    'date_ajustement' => now(),
                    'societe_id' => session('societe')['id'],
                    'departement_id' => $inventaire->departement_id,
                    'user_id' => auth()->id(),
                    'status' => 'en_attente',
                    'notes' => $detail->notes,
                ]);

                // Mettre à jour le statut du détail
                $detail->update(['status' => 'ajusté']);
            }

            DB::commit();

            return back()->with('success', 'Ajustements générés avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Une erreur est survenue lors de la génération des ajustements: ' . $e->getMessage());
        }
    }
}
