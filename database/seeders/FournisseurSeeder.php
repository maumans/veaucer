<?php

namespace Database\Seeders;

use App\Models\CategorieProduit;
use App\Models\Fournisseur;
use App\Models\Societe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FournisseurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('fournisseurs')->delete();

        $societe= Societe::first();

        $fournisseur=Fournisseur::create([
            "nom"=>'Kimberlite',
            'adresse'=>"Kountia CBA",
            'telephone'=>"622342390",
            'nomContact'=>"Kamano",
            'prenomContact'=>"Mathieu",
            'principal'=>true,
            "societe_id"=>$societe->id,
        ]);

        Fournisseur::create([
            "nom"=>'Depot Barrage',
            'adresse'=>"Lansanaya",
            'telephone'=>"621906342",
            'nomContact'=>"Barry",
            'prenomContact'=>"Aliou",
            'principal'=>false,
            "societe_id"=>$societe->id,
        ]);

        $societe->fournisseur_principal_id = $fournisseur->id;

    }
}
