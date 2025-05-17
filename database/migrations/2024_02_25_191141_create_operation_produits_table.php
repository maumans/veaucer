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
        Schema::create('operation_produits', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('type_produit_id')->constrained('type_produits')->cascadeOnDelete();
            $table->enum('type', ['achat', 'vente', 'transfert', 'ajustement']); 
            $table->integer('quantite');
            $table->double('prix_unitaire');

            $table->double('quantiteLivree')->nullable();

            $table->foreignId('stock_source_id')->nullable()->constrained('stocks')->cascadeOnDelete();
            $table->foreignId('stock_destination_id')->nullable()->constrained('stocks')->cascadeOnDelete();

            $table->double("tva")->nullable();
            $table->double("remise")->nullable();
            $table->enum('etat', ['EN ATTENTE', 'VALIDE', 'ANNULE'])->default("EN ATTENTE")->nullable();
            $table->boolean('status')->default(true)->nullable();
            $table->foreignId('stock_id')->nullable()->constrained('stocks')->cascadeOnDelete();
            $table->foreignId("operation_id")->nullable()->constrained("operations")->cascadeOnDelete();
            $table->foreignId("produit_id")->nullable()->constrained("produits")->cascadeOnDelete();
            $table->foreignId("societe_id")->nullable()->constrained("societes")->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operation_produits');
    }
};
