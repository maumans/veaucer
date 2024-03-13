<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\CategorieProduit;
use App\Models\SousCategorie;
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

        $categorie = Categorie::create([
            "nom"=>'restaurant',
            'libelle'=>"Restaurant"
        ]);

        SousCategorie::create([
            "nom"=>'jus',
            'libelle'=>"Jus",
            'categorie_id'=>$categorie->id
        ]);

        SousCategorie::create([
            "nom"=>'alcool',
            'libelle'=>"Alcool",
            'categorie_id'=>$categorie->id
        ]);

        SousCategorie::create([
            "nom"=>'plat',
            'libelle'=>"Plat",
            'categorie_id'=>$categorie->id
        ]);
    }
}
