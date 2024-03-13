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
        Schema::create('affections', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->nullable();
            $table->string('nom')->nullable();
            $table->string('code')->nullable();
            $table->boolean('surprime')->default(true)->nullable();
            $table->boolean('active')->default(true)->nullable();
            $table->boolean('status')->default(true)->nullable();
            $table->foreignId('type_prestataire_id')->nullable()->constrained('type_prestataires')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affections');
    }
};
