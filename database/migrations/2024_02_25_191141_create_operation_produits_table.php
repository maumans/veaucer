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
            $table->double("quantite")->nullable();
            $table->double('quantiteLivree')->nullable();
            $table->double("prixAchat")->nullable();
            $table->double("prixVente")->nullable();
            $table->double("tva")->nullable();
            $table->double("remise")->nullable();
            $table->string('status')->default(true)->nullable();
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
