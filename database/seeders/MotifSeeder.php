<?php

namespace Database\Seeders;

use App\Models\Motif;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MotifSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('motifs')->delete();

        Motif::create([
            "nom"=>'transport',
            "libelle"=>'Transport',
            'description'=>"Frais de transport",
        ]);

        Motif::create([
            "nom"=>'taxe',
            "libelle"=>'Taxe',
            'description'=>"Taxes",
        ]);

        Motif::create([
            "nom"=>'autres',
            "libelle"=>'Autres',
            'description'=>"Autres frais",
        ]);
    }
}
