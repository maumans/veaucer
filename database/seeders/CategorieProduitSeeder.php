<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\CategorieProduit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorieProduitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->delete();

        $jus=Categorie::create([
            "nom"=>'jus',
            'libelle'=>"Jus",
        ]);

        $biere=Categorie::create([
            "nom"=>'bière',
            'libelle'=>"Bière",
        ]);

        $alcool=Categorie::create([
            "nom"=>'alcool',
            'libelle'=>"Alcool",
        ]);

        $plat=Categorie::create([
            "nom"=>'plat',
            'libelle'=>"Plat",
        ]);
    }
}
