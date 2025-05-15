<?php

namespace App\Console\Commands;

use App\Models\AjustementInventaire;
use App\Models\Operation;
use App\Models\TypeOperation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MigrateStockMovements extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stock:migrate-movements';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migre les ajustements d\'inventaire existants vers le nouveau système unifié de mouvements de stock';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Début de la migration des mouvements de stock...');

        // Récupérer ou créer le type d'opération pour les ajustements
        $typeOperation = $this->getOrCreateOperationType('Ajustement d\'inventaire', 'Ajustement du stock suite à un inventaire');
        
        // Migrer les ajustements d'inventaire
        $this->migrateAdjustments($typeOperation);
        
        $this->info('Migration des mouvements de stock terminée avec succès.');
        
        return Command::SUCCESS;
    }
    
    /**
     * Migre les ajustements d'inventaire vers le nouveau système
     */
    private function migrateAdjustments($typeOperation)
    {
        $this->info('Migration des ajustements d\'inventaire...');
        
        // Récupérer tous les ajustements validés qui n'ont pas encore été migrés
        $ajustements = AjustementInventaire::where('status', 'validé')
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('operations')
                    ->whereColumn('operations.ajustement_inventaire_id', 'ajustements_inventaire.id');
            })
            ->get();
            
        $this->info('Nombre d\'ajustements à migrer : ' . $ajustements->count());
        
        $bar = $this->output->createProgressBar($ajustements->count());
        $bar->start();
        
        foreach ($ajustements as $ajustement) {
            try {
                // Créer une opération pour cet ajustement
                Operation::create([
                    'date' => $ajustement->date_ajustement,
                    'montant' => $ajustement->difference * ($ajustement->produit->prixAchat ?? 0),
                    'type_operation_id' => $typeOperation->id,
                    'departement_source_id' => $ajustement->departement_id,
                    'departement_destination_id' => $ajustement->departement_id,
                    'description' => 'Ajustement d\'inventaire #' . $ajustement->id . ': ' . $ajustement->motif,
                    'etat' => 'Validé',
                    'societe_id' => $ajustement->societe_id,
                    'user_id' => $ajustement->user_id,
                    'status' => true,
                    'reference_externe' => 'AJUST-' . $ajustement->id,
                    'type_mouvement' => 'AJUSTEMENT',
                    'produit_id' => $ajustement->produit_id,
                    'quantite' => $ajustement->difference,
                    'prix_unitaire' => $ajustement->produit->prixAchat ?? 0,
                    'ajustement_inventaire_id' => $ajustement->id,
                    'inventaire_physique_id' => $ajustement->inventaire_physique_id
                ]);
            } catch (\Exception $e) {
                Log::error('Erreur lors de la migration de l\'ajustement #' . $ajustement->id . ': ' . $e->getMessage());
                $this->error('Erreur lors de la migration de l\'ajustement #' . $ajustement->id . ': ' . $e->getMessage());
            }
            
            $bar->advance();
        }
        
        $bar->finish();
        $this->newLine();
    }
    
    /**
     * Récupère ou crée un type d'opération
     */
    private function getOrCreateOperationType(string $nom, string $description)
    {
        $typeOperation = TypeOperation::where('nom', 'LIKE', '%' . $nom . '%')->first();
        
        if (!$typeOperation) {
            $this->info('Création du type d\'opération : ' . $nom);
            
            $typeOperation = TypeOperation::create([
                'nom' => $nom,
                'status' => true
            ]);
        }
        
        return $typeOperation;
    }
}
