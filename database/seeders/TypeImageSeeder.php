<?php

namespace Database\Seeders;

use App\Models\TypeImage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('type_images')->delete();

        TypeImage::create([
            "nom"=>'user',
            'libelle'=>"Image de l'utilisateur",
        ]);

        TypeImage::create([
            "nom"=>'société',
            'libelle'=>"Logo de la société",
        ]);

        TypeImage::create([
            "nom"=>'produit',
            'libelle'=>"Image du produit"
        ]);

        TypeImage::create([
            "nom"=>'catégorie',
            'libelle'=>"Image de la catégorie"
        ]);

        TypeImage::create([
            "nom"=>'sous-catégorie',
            'libelle'=>"Image de la sous-catégorie"
        ]);
    }
}
