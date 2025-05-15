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
        Schema::table('operations', function (Blueprint $table) {
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
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('operations', function (Blueprint $table) {
            // Supprimer les champs ajoutés
            $table->dropColumn([
                'type_mouvement',
                'reference_externe',
                'quantite',
                'prix_unitaire'
            ]);
            
            // Supprimer les clés étrangères
            $table->dropConstrainedForeignId('produit_id');
            $table->dropConstrainedForeignId('inventaire_physique_id');
            $table->dropConstrainedForeignId('ajustement_inventaire_id');
        });
    }
};
