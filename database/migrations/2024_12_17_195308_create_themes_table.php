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
        Schema::create('themes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('societe_id')->constrained('societes')->onDelete('cascade');
            $table->string('nom');
            $table->string('couleur_primaire')->default('#3B82F6'); // Bleu par défaut
            $table->string('couleur_secondaire')->default('#10B981'); // Vert par défaut
            $table->string('couleur_accent')->default('#F59E0B'); // Orange par défaut
            $table->string('couleur_texte')->default('#111827'); // Texte foncé par défaut
            $table->string('couleur_fond')->default('#FFFFFF'); // Fond blanc par défaut
            $table->string('police_principale')->default('Inter'); // Police moderne par défaut
            $table->string('police_secondaire')->default('Roboto');
            $table->json('styles_personnalises')->nullable(); // Pour des styles CSS personnalisés additionnels
            $table->boolean('actif')->default(true);
            $table->boolean('est_defaut')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('themes');
    }
};
