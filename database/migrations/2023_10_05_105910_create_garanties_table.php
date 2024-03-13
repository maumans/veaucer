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
        Schema::create('garanties', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->nullable();
            $table->string('libelle')->nullable();
            $table->boolean('base')->default(true)->nullable();
            $table->boolean('status')->default(true)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('garanties');
    }
};
