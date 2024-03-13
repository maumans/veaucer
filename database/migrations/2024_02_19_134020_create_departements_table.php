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
        Schema::create('departements', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->nullable();
            $table->longText('description')->nullable();
            $table->enum("type",['PRINCIPAL','SECONDAIRE'])->nullable();
            $table->string('telephone')->nullable();
            $table->foreignId("user_id")->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId("societe_id")->nullable()->constrained("societes")->cascadeOnDelete();
            $table->boolean("status")->default(true)->nullable();
            $table->timestamps();
        });

        Schema::table('societes', function (Blueprint $table) {
            $table->foreignId("departement_principal_id")->nullable()->constrained("departements")->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departements');
    }
};
