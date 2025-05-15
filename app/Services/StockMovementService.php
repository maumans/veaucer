<?php

namespace App\Services;

use App\Models\AjustementInventaire;
use App\Models\Operation;
use App\Models\Produit;
use App\Models\Stock;
use App\Models\TypeOperation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StockMovementService
{
    /**
     * Crée un mouvement de stock pour un ajustement d'inventaire
     * 
     * @param AjustementInventaire $ajustement
     * @return Operation|null
     */
    public function createAdjustment(AjustementInventaire $ajustement)
    {
        try {
            // Récupérer ou créer le type d'opération pour les ajustements
            $typeOperation = $this->getOrCreateOperationType('ajustement', 'Ajustement du stock suite à un inventaire');
            
            // Créer l'opération
            $operation = $this->createOperation([
                'date' => now(),
                'montant' => $ajustement->difference * ($ajustement->produit->prixAchat ?? 0),
                'type_operation_id' => $typeOperation->id,
                'departement_source_id' => $ajustement->departement_id,
                'departement_destination_id' => $ajustement->departement_id,
                'description' => 'Ajustement d\'inventaire #' . $ajustement->id . ': ' . $ajustement->motif,
                'etat' => 'Validé',
                'societe_id' => session('societe')['id'],
                'user_id' => auth()->id(),
                'status' => true,
                'reference_externe' => 'AJUST-' . $ajustement->id,
                'type_mouvement' => 'AJUSTEMENT',
                'produit_id' => $ajustement->produit_id,
                'quantite' => $ajustement->difference,
                'prix_unitaire' => $ajustement->produit->prixAchat ?? 0,
                'ajustement_inventaire_id' => $ajustement->id
            ]);
            
            // Mettre à jour le stock
            $this->updateStock($ajustement->produit_id, $ajustement->departement_id, $ajustement->difference);
            
            return $operation;
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du mouvement d\'ajustement: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Crée un mouvement de stock pour un transfert entre départements
     * 
     * @param array $data
     * @return Operation|null
     */
    public function createTransfer(array $data)
    {
        try {
            DB::beginTransaction();
            
            // Récupérer ou créer le type d'opération pour les transferts
            $typeOperation = $this->getOrCreateOperationType('Transfert de stock', 'Transfert de stock entre départements');
            
            // Créer l'opération
            $operation = $this->createOperation([
                'date' => now(),
                'montant' => $data['quantite'] * ($data['prix_unitaire'] ?? 0),
                'type_operation_id' => $typeOperation->id,
                'departement_source_id' => $data['departement_source_id'],
                'departement_destination_id' => $data['departement_destination_id'],
                'description' => 'Transfert de stock: ' . $data['description'] ?? '',
                'etat' => 'Validé',
                'societe_id' => session('societe')['id'],
                'user_id' => auth()->id(),
                'status' => true,
                'reference_externe' => 'TRANSF-' . time(),
                'type_mouvement' => 'TRANSFERT',
                'produit_id' => $data['produit_id'],
                'quantite' => $data['quantite'],
                'prix_unitaire' => $data['prix_unitaire'] ?? 0
            ]);
            
            // Mettre à jour le stock source (diminution)
            $this->updateStock($data['produit_id'], $data['departement_source_id'], -$data['quantite']);
            
            // Mettre à jour le stock destination (augmentation)
            $this->updateStock($data['produit_id'], $data['departement_destination_id'], $data['quantite']);
            
            DB::commit();
            return $operation;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la création du mouvement de transfert: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Crée un mouvement de stock pour une entrée de stock
     * 
     * @param array $data
     * @return Operation|null
     */
    public function createEntry(array $data)
    {
        try {
            // Récupérer ou créer le type d'opération pour les entrées
            $typeOperation = $this->getOrCreateOperationType('Entrée de stock', 'Entrée de produits en stock');
            
            // Créer l'opération
            $operation = $this->createOperation([
                'date' => now(),
                'montant' => $data['quantite'] * ($data['prix_unitaire'] ?? 0),
                'type_operation_id' => $typeOperation->id,
                'departement_destination_id' => $data['departement_id'],
                'fournisseur_id' => $data['fournisseur_id'] ?? null,
                'description' => 'Entrée de stock: ' . $data['description'] ?? '',
                'etat' => 'Validé',
                'societe_id' => session('societe')['id'],
                'user_id' => auth()->id(),
                'status' => true,
                'reference_externe' => 'ENTREE-' . time(),
                'type_mouvement' => 'ENTREE',
                'produit_id' => $data['produit_id'],
                'quantite' => $data['quantite'],
                'prix_unitaire' => $data['prix_unitaire'] ?? 0
            ]);
            
            // Mettre à jour le stock (augmentation)
            $this->updateStock($data['produit_id'], $data['departement_id'], $data['quantite']);
            
            return $operation;
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du mouvement d\'entrée: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Crée un mouvement de stock pour une sortie de stock
     * 
     * @param array $data
     * @return Operation|null
     */
    public function createExit(array $data)
    {
        try {
            // Récupérer ou créer le type d'opération pour les sorties
            $typeOperation = $this->getOrCreateOperationType('Sortie de stock', 'Sortie de produits du stock');
            
            // Créer l'opération
            $operation = $this->createOperation([
                'date' => now(),
                'montant' => $data['quantite'] * ($data['prix_unitaire'] ?? 0),
                'type_operation_id' => $typeOperation->id,
                'departement_source_id' => $data['departement_id'],
                'description' => 'Sortie de stock: ' . $data['description'] ?? '',
                'etat' => 'Validé',
                'societe_id' => session('societe')['id'],
                'user_id' => auth()->id(),
                'status' => true,
                'reference_externe' => 'SORTIE-' . time(),
                'type_mouvement' => 'SORTIE',
                'produit_id' => $data['produit_id'],
                'quantite' => $data['quantite'],
                'prix_unitaire' => $data['prix_unitaire'] ?? 0
            ]);
            
            // Mettre à jour le stock (diminution)
            $this->updateStock($data['produit_id'], $data['departement_id'], -$data['quantite']);
            
            return $operation;
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du mouvement de sortie: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Méthode commune pour créer une opération
     * 
     * @param array $data
     * @return Operation
     */
    protected function createOperation(array $data)
    {
        return Operation::create($data);
    }
    
    /**
     * Récupère ou crée un type d'opération
     * 
     * @param string $nom
     * @param string $description
     * @return TypeOperation
     */
    protected function getOrCreateOperationType(string $nom, string $description)
    {
        $typeOperation = TypeOperation::where('nom', 'LIKE', '%' . $nom . '%')->first();
        
        if (!$typeOperation) {
            $typeOperation = TypeOperation::create([
                'nom' => $nom,
                'libelle' => ucfirst($nom),
                'description' => $description,
                'status' => true
            ]);
        }
        
        return $typeOperation;
    }
    
    /**
     * Met à jour le stock d'un produit dans un département
     * 
     * @param int $produitId
     * @param int|null $departementId
     * @param float $quantite
     * @return Stock|null
     */
    protected function updateStock(int $produitId, ?int $departementId, float $quantite)
    {
        try {
            $produit = Produit::findOrFail($produitId);
            
            if ($departementId) {
                // Mise à jour du stock spécifique au département
                $stock = Stock::firstOrNew([
                    'produit_id' => $produitId,
                    'departement_id' => $departementId,
                    'societe_id' => session('societe')['id']
                ]);
                
                $stock->quantite = ($stock->quantite ?? 0) + $quantite;
                $stock->save();
                
                return $stock;
            } else {
                // Mise à jour du stock global (tous les départements)
                $stocks = Stock::where('produit_id', $produitId)
                    ->where('societe_id', session('societe')['id'])
                    ->get();
                
                if ($stocks->isEmpty()) {
                    // Si aucun stock n'existe, créer un stock sans département
                    $stock = Stock::create([
                        'produit_id' => $produitId,
                        'departement_id' => null,
                        'societe_id' => session('societe')['id'],
                        'quantite' => $quantite
                    ]);
                    
                    return $stock;
                } else {
                    // Répartir la quantité proportionnellement entre les stocks existants
                    $totalStock = $stocks->sum('quantite');
                    
                    foreach ($stocks as $stock) {
                        if ($totalStock > 0) {
                            $proportion = $stock->quantite / $totalStock;
                            $stock->quantite += $quantite * $proportion;
                        } else {
                            // Si le stock total est 0, répartir équitablement
                            $stock->quantite += $quantite / $stocks->count();
                        }
                        
                        $stock->save();
                    }
                    
                    return $stocks->first();
                }
            }
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du stock: ' . $e->getMessage());
            return null;
        }
    }
}
