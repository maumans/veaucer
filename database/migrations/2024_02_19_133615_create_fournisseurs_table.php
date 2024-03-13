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
        Schema::create('fournisseurs', function (Blueprint $table) {
            $table->id();
            $table->string("nom")->nullable();
            $table->string('slug')->nullable();
            $table->boolean("principal")->default(false)->nullable();
            $table->string("adresse")->nullable();
            $table->string("telephone")->nullable();
            $table->string("nomContact")->nullable();
            $table->string("prenomContact")->nullable();
            $table->boolean("status")->default(true)->nullable();
            $table->foreignId("societe_id")->nullable()->constrained("societes")->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::table('societes', function (Blueprint $table) {
            $table->foreignId("fournisseur_principal_id")->nullable()->constrained("fournisseurs")->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fournisseurs');
    }
};
