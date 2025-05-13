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
        Schema::create('inventaire_physique_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventaire_physique_id')->constrained('inventaires_physiques')->onDelete('cascade');
            $table->foreignId('produit_id')->constrained('produits');
            $table->decimal('quantite_theorique', 10, 2)->default(0);
            $table->decimal('quantite_comptee', 10, 2)->nullable();
            $table->decimal('difference', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['en_attente', 'validé', 'ajusté'])->default('en_attente');
            $table->foreignId('compteur_user_id')->nullable()->constrained('users');
            $table->foreignId('validateur_user_id')->nullable()->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventaire_physique_details');
    }
};
