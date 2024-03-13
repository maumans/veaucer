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
        Schema::create('societes', function (Blueprint $table) {
            $table->id();
            $table->string("nom")->nullable();
            $table->double("solde")->nullable();
            $table->string("adresse")->nullable();
            $table->longText("description")->nullable();
            $table->string("logo")->nullable();
            $table->string("telephone1")->nullable();
            $table->string("telephone2")->nullable();
            $table->string("adresseMail")->nullable();
            $table->string("slug")->nullable();
            $table->boolean("status")->default(true)->nullable();
            $table->foreignId('type_societe_id')->nullable()->constrained('type_societes')->cascadeOnDelete();
            $table->foreignId('caisse_principal_id')->nullable()->constrained('type_societes')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('societes');
    }
};
