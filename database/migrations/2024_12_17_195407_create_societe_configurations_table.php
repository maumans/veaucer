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
        Schema::create('societe_configurations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('societe_id')->constrained('societes')->onDelete('cascade');
            
            // Configurations générales
            $table->string('fuseau_horaire')->default('UTC');
            $table->string('langue_par_defaut')->default('fr');
            $table->json('langues_activees')->nullable();
            $table->string('devise_par_defaut')->nullable();
            $table->json('devises_acceptees')->nullable();
            
            // Configurations des modules
            $table->json('modules_actifs')->nullable();
            
            // Configurations des notifications
            $table->json('notifications')->nullable();
            
            // Configurations de paiement
            $table->json('methodes_paiement')->nullable();
            
            // Configurations de sécurité
            $table->json('securite')->nullable();
            
            // Configurations des factures
            $table->json('factures')->nullable();
            
            // Configurations des rapports
            $table->json('rapports')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('societe_configurations');
    }
};
