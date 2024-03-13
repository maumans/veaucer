<?php

namespace Database\Seeders;

use App\Models\TypeSociete;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeSocieteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('type_societes')->delete();

        TypeSociete::create([
            "nom"=>'duplex',
            'libelle'=>"Duplex"
        ]);

        TypeSociete::create([
            "nom"=>'complexe',
            'libelle'=>"Complexe"
        ]);

        TypeSociete::create([
            "nom"=>'boutique',
            'libelle'=>"Boutique"
        ]);

        TypeSociete::create([
            "nom"=>'restaurant',
            'libelle'=>"Restaurant"
        ]);

        TypeSociete::create([
            "nom"=>'boite de nuit',
            'libelle'=>"Boite de nuit"
        ]);

        TypeSociete::create([
            "nom"=>'hotel',
            'libelle'=>"Hotel"
        ]);

        TypeSociete::create([
            "nom"=>'bar',
            'libelle'=>"Bar"
        ]);
    }
}
