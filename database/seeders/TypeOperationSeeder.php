<?php

namespace Database\Seeders;

use App\Models\TypeOperation;
use App\Models\TypeProduit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeOperationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('type_operations')->delete();

        TypeOperation::create([
            "nom"=>'approvisionnement',
            'libelle'=>"Approvisionnement"
        ]);

        TypeOperation::create([
            "nom"=>'vente',
            'libelle'=>"Vente"
        ]);
    }
}
