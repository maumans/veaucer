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
        Schema::create('type_operations', function (Blueprint $table) {
            $table->id();
            $table->string("nom")->nullable();
            $table->string("libelle")->nullable();
            $table->string("slug")->nullable();
            $table->boolean('status')->default(true)->nullable();
            $table->timestamps();
        });

        Schema::table('motifs', function (Blueprint $table) {
            $table->foreignId('type_operation_id')->nullable()->constrained('type_operations')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('type_operations');
    }
};
