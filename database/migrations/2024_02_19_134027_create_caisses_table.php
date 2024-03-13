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
        Schema::create('caisses', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->nullable();
            $table->string('slug')->nullable();
            $table->enum("type",['PRINCIPAL','SECONDAIRE'])->nullable();
            $table->double("solde")->nullable();
            $table->boolean("status")->default(true)->nullable();
            $table->foreignId("departement_id")->nullable()->constrained("departements")->cascadeOnDelete();
            $table->foreignId("user_id")->nullable()->constrained("users")->cascadeOnDelete();
            $table->foreignId("societe_id")->nullable()->constrained("societes")->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::table('societes', function (Blueprint $table) {
            $table->foreignId("caisse_principale_id")->nullable()->constrained("caisses")->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('caisses');
    }
};
