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
        Schema::create('motifs', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->nullable();
            $table->string('libelle')->nullable();
            $table->longText('description')->nullable();
            $table->enum('type',['DEPENSE','OPERATION'])->default("DEPENSE")->nullable();
            $table->string('slug')->nullable();
            $table->boolean('status')->default(true)->nullable();
            $table->foreignId('societe_id')->nullable()->constrained('societes')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('motifs');
    }
};
