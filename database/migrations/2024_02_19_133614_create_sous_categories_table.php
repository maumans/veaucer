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
        Schema::create('sous_categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->nullable();
            $table->string('nom')->nullable();
            $table->string('libelle')->nullable();
            $table->boolean('status')->default(true)->nullable();
            $table->foreignId('categorie_id')->nullable()->constrained('categories')->cascadeOnDelete();
            $table->foreignId("societe_id")->nullable()->constrained("societes")->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sous_categories');
    }
};
