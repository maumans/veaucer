<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('operations', function (Blueprint $table) {
            $table->id();
            $table->date("date")->nullable();
            $table->double('montant')->nullable();
            $table->double('montantApresRemise')->nullable();
            $table->double('soldeProgressif')->nullable();
            $table->string('pieceJustificative')->nullable();
            $table->string('reference')->nullable();
            $table->string('slug')->nullable();
            $table->longText('description')->nullable();
            $table->longText('commentaire')->nullable();
            $table->foreignId('motif_id')->nullable()->constrained('motifs')->cascadeOnDelete();
            $table->foreignId('societe_id')->nullable()->constrained('societes')->cascadeOnDelete();
            $table->foreignId('type_operation_id')->nullable()->constrained('type_operations')->cascadeOnDelete();
            $table->foreignId('super_admin_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('auteur_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('client_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('admin_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('fournisseur_id')->nullable()->constrained('fournisseurs')->cascadeOnDelete();
            

            // Type de mouvement (AJUSTEMENT, TRANSFERT, ENTREE, SORTIE)
            $table->enum('type_mouvement', ['AJUSTEMENT', 'TRANSFERT', 'ENTREE', 'SORTIE'])->nullable();
            
            // Référence externe pour lier à d'autres tables (ajustements, inventaires, etc.)
            $table->string('reference_externe')->nullable();
            
            // Produit concerné par le mouvement
            $table->foreignId('produit_id')->nullable()->constrained('produits')->nullOnDelete();
            
            // Quantité du mouvement
            $table->decimal('quantite', 10, 2)->nullable();
            
            // Prix unitaire au moment du mouvement
            $table->decimal('prix_unitaire', 10, 2)->nullable();
            
            // Inventaire physique associé
            $table->foreignId('inventaire_physique_id')->nullable()->constrained('inventaires_physiques')->nullOnDelete();
            
            // Ajustement d'inventaire associé
            $table->foreignId('ajustement_inventaire_id')->nullable()->constrained('ajustements_inventaire')->nullOnDelete();

            $table->foreignId('departement_source_id')->nullable()->constrained('departements')->cascadeOnDelete();
            $table->foreignId('departement_destination_id')->nullable()->constrained('departements')->cascadeOnDelete();

            $table->foreignId('caisse_source_id')->nullable()->constrained('caisses')->cascadeOnDelete();
            $table->foreignId('caisse_destination_id')->nullable()->constrained('caisses')->cascadeOnDelete();
            $table->enum('etat',['EN ATTENTE','VALIDE','ARCHIVEE','ANNULE'])->default("EN ATTENTE")->nullable();
            $table->boolean('status')->default(true)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operations');
    }
};
