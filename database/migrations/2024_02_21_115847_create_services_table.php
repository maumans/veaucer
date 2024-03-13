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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->nullable();
            $table->date('date')->nullable();
            $table->double('prix')->nullable();
            $table->integer('duree')->nullable();
            $table->integer('nombreClients')->nullable();
            $table->integer('nombreTablesReservees')->nullable();
            $table->double('recetteTotale')->default(true)->nullable();
            $table->longText('commentaire')->nullable();
            $table->boolean('status')->default(true)->nullable();
            $table->enum('etat',['ANNULE','INITIE','PARTIEL','TOTAL'])->default("INITIE")->nullable();
            $table->integer('notes')->nullable();
            $table->foreignId('type_service_id')->nullable()->constrained('type_services')->cascadeOnDelete();
            $table->foreignId("societe_id")->nullable()->constrained("societes")->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
