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
        Schema::create('depenses', function (Blueprint $table) {
            $table->id();
            $table->date("date")->nullable();
            $table->double('total')->nullable();
            $table->longText("commentaire")->nullable();
            $table->string('slug')->nullable();

            $table->foreignId('societe_id')->nullable()->constrained('societes')->cascadeOnDelete();

            $table->foreignId('auteur_id')->nullable()->constrained('users')->cascadeOnDelete();

            $table->foreignId('client_id')->nullable()->constrained('users')->cascadeOnDelete();

            $table->foreignId('admin_id')->nullable()->constrained('users')->cascadeOnDelete();

            $table->foreignId('fournisseur_id')->nullable()->constrained('fournisseurs')->cascadeOnDelete();

            $table->foreignId('caisse_id')->nullable()->constrained('caisses')->cascadeOnDelete();

            $table->foreignId('stock_id')->nullable()->constrained('stocks')->cascadeOnDelete();

            $table->foreignId('motif_id')->nullable()->constrained('motifs')->cascadeOnDelete();

            $table->foreignId('operation_id')->nullable()->constrained('operations')->cascadeOnDelete();

            $table->enum('etat', ['EN ATTENTE', 'VALIDE', 'ANNULE'])->default("EN ATTENTE")->nullable();

            $table->boolean("status")->default(true)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('depenses');
    }
};
