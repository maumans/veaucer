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
        Schema::create('ajustements_inventaire', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventaire_physique_id')->nullable()->constrained('inventaires_physiques');
            $table->foreignId('produit_id')->constrained('produits');
            $table->decimal('quantite_avant', 10, 2);
            $table->decimal('quantite_apres', 10, 2);
            $table->decimal('difference', 10, 2);
            $table->string('motif');
            $table->dateTime('date_ajustement');
            $table->foreignId('societe_id')->constrained('societes');
            $table->foreignId('departement_id')->nullable()->constrained('departements');
            $table->foreignId('user_id')->constrained('users');
            $table->enum('status', ['en_attente', 'validé', 'rejeté'])->default('en_attente');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ajustements_inventaire');
    }
};
