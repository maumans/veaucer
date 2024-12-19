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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('societe_id')->constrained('societes')->onDelete('cascade');
            $table->foreignId('evenement_id')->constrained('evenements')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // L'utilisateur qui a fait la réservation
            $table->string('nom_client');
            $table->string('email_client')->nullable();
            $table->string('telephone_client');
            $table->integer('nombre_places_standard')->default(0);
            $table->integer('nombre_places_vip')->default(0);
            $table->decimal('montant_total', 15, 2);
            $table->string('statut_paiement')->default('en_attente'); // en_attente, paye, annule, rembourse
            $table->string('methode_paiement')->nullable();
            $table->string('reference_paiement')->nullable();
            $table->dateTime('date_paiement')->nullable();
            $table->text('notes')->nullable();
            $table->json('details_supplementaires')->nullable(); // Pour stocker des informations supplémentaires
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
