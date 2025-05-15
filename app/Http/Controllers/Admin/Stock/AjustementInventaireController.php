<?php

namespace App\Http\Controllers\Admin\Stock;

use App\Http\Controllers\Controller;
use App\Models\AjustementInventaire;
use App\Models\Departement;
use App\Models\InventairePhysique;
use App\Models\Operation;
use App\Models\Produit;
use App\Models\Stock;
use App\Models\TypeOperation;
use App\Services\StockMovementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AjustementInventaireController extends Controller
{
    /**
     * Affiche la liste des ajustements d'inventaire
     */
    public function index()
    {
        $ajustements = AjustementInventaire::with(['produit', 'departement', 'user', 'inventairePhysique'])
            ->where('societe_id', session('societe')['id'])
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('Admin/Stock/Inventaire/Ajustement/Index', [
            'ajustements' => $ajustements,
        ]);
    }

    /**
     * Affiche le formulaire de création d'un ajustement d'inventaire manuel
     */
    public function create()
    {
        $produits = Produit::with(['stocks' => function($query) {
            $query->where('societe_id', session('societe')['id']);
        }])
        ->where('status', true)
        ->where(function ($query) {
            $query->where('societe_id', session('societe')['id'])
                ->orWhere('societe_id', null);
        })
        ->orderBy('nom')
        ->get();

        $departements = Departement::where('societe_id', session('societe')['id'])
            ->where('status', true)
            ->orderBy('nom')
            ->get();

        return Inertia::render('Admin/Stock/Inventaire/Ajustement/Create', [
            'produits' => $produits,
            'departements' => $departements,
        ]);
    }

    /**
     * Enregistre un nouvel ajustement d'inventaire manuel
     */
    public function store(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite_apres' => 'required|numeric|min:0',
            'motif' => 'required|string',
            'departement_id' => 'nullable|exists:departements,id',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            // Récupérer le produit
            $produit = Produit::findOrFail($request->produit_id);
            
            // Calculer la différence
            if ($request->departement_id) {
                // Si un département est spécifié, récupérer le stock de ce département
                $stock = Stock::where('produit_id', $request->produit_id)
                    ->where('departement_id', $request->departement_id)
                    ->first();
                $quantite_avant = $stock ? $stock->quantite : 0;
            } else {
                // Sinon, utiliser le stock global
                $quantite_avant = $produit->stockGlobal ?? 0;
            }
            
            $difference = $request->quantite_apres - $quantite_avant;

            // Créer l'ajustement
            $ajustement = AjustementInventaire::create([
                'produit_id' => $request->produit_id,
                'quantite_avant' => $quantite_avant,
                'quantite_apres' => $request->quantite_apres,
                'difference' => $difference,
                'motif' => $request->motif,
                'date_ajustement' => now(),
                'societe_id' => session('societe')['id'],
                'departement_id' => $request->departement_id,
                'user_id' => auth()->id(),
                'status' => 'en_attente',
                'notes' => $request->notes,
            ]);

            DB::commit();

            return redirect()->route('admin.inventaire.ajustement.index', auth()->id())
                ->with('success', 'Ajustement d\'inventaire créé avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Une erreur est survenue lors de la création de l\'ajustement: ' . $e->getMessage());
        }
    }

    /**
     * Affiche les détails d'un ajustement d'inventaire
     */
    public function show($userId, $id)
    {
        $ajustement = AjustementInventaire::with(['produit', 'departement', 'user', 'inventairePhysique'])
            ->findOrFail($id);

        return Inertia::render('Admin/Stock/Inventaire/Ajustement/Show', [
            'ajustement' => $ajustement,
        ]);
    }

    /**
     * Valide un ajustement d'inventaire
     */
    public function valider(Request $request, $id)
    {
        $ajustement = AjustementInventaire::findOrFail($id);

        if ($ajustement->status !== 'en_attente') {
            return redirect()->back()->with('error', 'Cet ajustement ne peut pas être validé car il n\'est pas en attente.');
        }

        DB::beginTransaction();

        try {
            // Utiliser le service StockMovementService pour créer l'ajustement
            $stockMovementService = new StockMovementService();
            $operation = $stockMovementService->createAdjustment($ajustement);
            
            if (!$operation) {
                throw new \Exception('Erreur lors de la création du mouvement de stock');
            }

            // Mettre à jour le status de l'ajustement
            $ajustement->update([
                'status' => 'validé',
            ]);

            DB::commit();

            return redirect()->route('admin.inventaire.ajustement.index')->with('success', 'Ajustement validé avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Une erreur est survenue lors de la validation de l\'ajustement: ' . $e->getMessage());
        }
    }

    /**
     * Rejette un ajustement d'inventaire
     */
    public function rejeter(Request $request, $userId, $id)
    {
        $request->validate([
            'motif_rejet' => 'required|string',
        ]);

        $ajustement = AjustementInventaire::findOrFail($id);

        // Vérifier si l'ajustement peut être rejeté
        if ($ajustement->status !== 'en_attente') {
            return back()->with('error', 'Seuls les ajustements en attente peuvent être rejetés.');
        }

        $ajustement->update([
            'status' => 'rejeté',
            'notes' => ($ajustement->notes ? $ajustement->notes . "\n\n" : '') . 
                       'Motif de rejet: ' . $request->motif_rejet,
        ]);

        return back()->with('success', 'Ajustement rejeté avec succès.');
    }
}
