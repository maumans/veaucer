<?php

namespace Database\Seeders;

use App\Models\TypeProduit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeProduitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('type_produits')->delete();

        TypeProduit::create([
            "nom"=>'unité',
            'libelle'=>"Unité"
        ]);

        TypeProduit::create([
            "nom"=>'ensemble',
            'libelle'=>"Ensemble"
        ]);
    }
}
