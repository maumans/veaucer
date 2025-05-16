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
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->nullable();
            $table->string('nom')->nullable();
            $table->longText('description')->nullable();
            
            
            $table->double('stockGlobal')->nullable();
            $table->double('stockCritique')->nullable();
            $table->double('seuilMaximal')->nullable();
            $table->string('image')->nullable();
            $table->integer('notes')->nullable();
            $table->enum('etat',['ACTIF','HORS STOCK','EN PROMOTION'])->default("ACTIF")->nullable();

            $table->foreignId('type_produit_achat_id')->nullable()->constrained('type_produits')->cascadeOnDelete();
            $table->integer('quantiteAchat')->nullable();
            $table->double('prixAchat')->nullable();

            $table->foreignId('type_produit_vente_id')->nullable()->constrained('type_produits')->cascadeOnDelete();
            $table->integer('quantiteVente')->nullable();
            $table->double('prixVente')->nullable();
            
            $table->boolean('status')->default(true)->nullable();
            $table->foreignId('categorie_id')->nullable()->constrained('categories')->cascadeOnDelete();
            $table->foreignId("fournisseur_principal_id")->nullable()->constrained("fournisseurs")->cascadeOnDelete();
            $table->foreignId("unite_mesure_id")->nullable()->constrained("unite_mesures")->cascadeOnDelete();
            $table->foreignId("devise_id")->nullable()->constrained("devises")->cascadeOnDelete();
            $table->foreignId("societe_id")->nullable()->constrained("societes")->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
