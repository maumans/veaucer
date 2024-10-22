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
        Schema::create('operations', function (Blueprint $table) {
            $table->id();
            $table->date("date")->nullable();
            $table->double('total')->nullable();
            $table->double("totalApresRemise")->nullable();
            $table->double('montant')->nullable();
            $table->double('montantRemise')->nullable();
            $table->double('soldeProgressif')->nullable();
            $table->string('pieceJustificative')->nullable();
            $table->string('reference')->nullable();
            $table->string('slug')->nullable();
            $table->longText('commentaire')->nullable();
            $table->foreignId('societe_id')->nullable()->constrained('societes')->cascadeOnDelete();
            $table->foreignId('type_operation_id')->nullable()->constrained('type_operations')->cascadeOnDelete();
            $table->foreignId('super_admin_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('auteur_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('client_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('admin_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('fournisseur_id')->nullable()->constrained('fournisseurs')->cascadeOnDelete();
            $table->foreignId('caisse_id')->nullable()->constrained('caisses')->cascadeOnDelete();
            $table->foreignId('caisse_destinataire_id')->nullable()->constrained('caisses')->cascadeOnDelete();
            $table->foreignId('stock_id')->nullable()->constrained('stocks')->cascadeOnDelete();
            $table->foreignId('stock_destinataire_id')->nullable()->constrained('stocks')->cascadeOnDelete();
            $table->enum('etat',['EN ATTENTE','COMMANDE','LIVRE',"ANNULE"])->default("EN ATTENTE")->nullable();
            $table->boolean('status')->default(true)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operations');
    }
};
