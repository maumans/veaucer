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
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->nullable();
            $table->string('url')->nullable();
            $table->string('description')->nullable();
            $table->string('model')->nullable();
            $table->string('slug')->nullable();
            $table->boolean('status')->default(true)->nullable();
            $table->foreignId("type_image_id")->nullable()->constrained("type_images")->cascadeOnDelete();
            $table->foreignId("user_id")->nullable()->constrained("users")->cascadeOnDelete();
            $table->foreignId("produit_id")->nullable()->constrained("produits")->cascadeOnDelete();
            $table->foreignId("societe_id")->nullable()->constrained("societes")->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');
    }
};
