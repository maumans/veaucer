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
            $table->double('prixUnitaire')->nullable();
            $table->double('prixAchat')->nullable();
            $table->double('prixVente')->nullable();
            $table->double('stockGlobal')->nullable();
            $table->double('stockMinimal')->nullable();
            $table->string('image')->nullable();
            $table->integer('notes')->nullable();
            $table->enum('etat',['ACTIF','HORS STOCK','EN PROMOTION'])->default("ACTIF")->nullable();
            $table->boolean('status')->default(true)->nullable();
            $table->foreignId('sous_categorie_id')->nullable()->constrained('sous_categories')->cascadeOnDelete();
            $table->foreignId('type_produit_id')->nullable()->constrained('type_produits')->cascadeOnDelete();
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
