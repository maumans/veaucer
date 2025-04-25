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
        Schema::create('poste_employes', function (Blueprint $table) {
            $table->id();
            $table->boolean('status')->default(true)->nullable();
            $table->foreignId('poste_id')->nullable()->constrained('postes')->cascadeOnDelete();
            $table->foreignId('departement_id')->nullable()->constrained('departements')->cascadeOnDelete();
            $table->foreignId('employe_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('societe_id')->nullable()->constrained('societes')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('poste_employes');
    }
};
