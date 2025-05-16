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
        Schema::create('inventaires_physiques', function (Blueprint $table) {
            $table->id();
            $table->dateTime('date_debut');
            $table->dateTime('date_fin')->nullable();
            $table->enum('status', ['planifié', 'en_cours', 'terminé', 'annulé'])->default('planifié');
            $table->text('description')->nullable();
            $table->foreignId('societe_id')->constrained('societes');
            $table->foreignId('departement_id')->nullable()->constrained('departements');
            $table->foreignId('user_id')->constrained('users');
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
        Schema::dropIfExists('inventaires_physiques');
    }
};
