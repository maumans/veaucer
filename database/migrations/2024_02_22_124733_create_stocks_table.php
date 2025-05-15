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
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->double("quantite")->nullable();
            $table->double('stockCritique')->nullable();
            $table->double('seuilMaximal')->nullable();
            $table->string('slug')->nullable();
            $table->enum("type",['PRINCIPAL','SECONDAIRE'])->nullable();
            $table->boolean("status")->default(true)->nullable();
            $table->foreignId("produit_id")->nullable()->constrained("produits")->cascadeOnDelete();
            $table->foreignId("user_id")->nullable()->constrained("users")->cascadeOnDelete();
            $table->foreignId("departement_id")->nullable()->constrained("departements")->cascadeOnDelete();
            $table->foreignId("societe_id")->nullable()->constrained("societes")->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
