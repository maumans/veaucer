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
        Schema::create('souscripteurs', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->nullable();
            $table->string('prenom')->nullable();
            $table->string('nom')->nullable();
            $table->string('adresse')->nullable();
            $table->string('photoProfil')->nullable();
            $table->string('email')->nullable();
            $table->string('password')->nullable();
            $table->string('sexe')->nullable();
            $table->string('dateNaissance')->nullable();
            $table->string('lieuNaissance')->nullable();
            $table->string('telephone')->nullable();
            $table->boolean('status')->default(true)->nullable();
            $table->foreignId('type_souscripteur_id')->nullable()->constrained('type_souscripteurs')->cascadeOnDelete();
            $table->foreignId('categorie_souscripteur_id')->nullable()->constrained('categorie_souscripteurs')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('souscripteurs');
    }
};
