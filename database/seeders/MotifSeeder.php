<?php

namespace Database\Seeders;

use App\Models\Motif;
use App\Models\TypeOperation;
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

        $sortie = TypeOperation::where('nom', 'sortie')->first();
        $transfert = TypeOperation::where('nom', 'transfert')->first();


        Motif::create([
            "nom"=>'transport',
            "libelle"=>'Transport',
            'description'=>"Frais de transport",
            "type"=>'DEPENSE'
        ]);

        Motif::create([
            "nom"=>'autres',
            "libelle"=>'Autres',
            'description'=>"Autres frais",
            "type"=>'DEPENSE'
        ]);

        Motif::create([
            "nom"=>'vente',
            "libelle"=>'Vente',
            'description'=>"Vente",
            "type"=>'OPERATION',
            "type_operation_id"=>$sortie->id
        ]);

        Motif::create([
            "nom"=>'casse',
            "libelle"=>'Casse',
            'description'=>"Casse",
            "type"=>'OPERATION',
            "type_operation_id"=>$sortie->id
        ]);

        Motif::create([
            "nom"=>'vol',
            "libelle"=>'Vol',
            'description'=>"Vol",
            "type"=>'OPERATION',
            "type_operation_id"=>$sortie->id
        ]);

        Motif::create([
            "nom"=>'expiration',
            "libelle"=>'Expiration',
            'description'=>"Expiration",
            "type"=>'OPERATION',
            "type_operation_id"=>$sortie->id
        ]);

        Motif::create([
            "nom"=>'utilisation',
            "libelle"=>'Utilisation',
            'description'=>"Utilisation",
            "type"=>'OPERATION',
            "type_operation_id"=>$sortie->id
        ]);

        Motif::create([
            "nom"=>'don',
            "libelle"=>'Don',
            'description'=>"Don",
            "type"=>'OPERATION',
            "type_operation_id"=>$sortie->id
        ]);

        Motif::create([
            "nom"=>'ravitaillement',
            "libelle"=>'Ravitaillement',
            'description'=>"Ravitaillement",
            "type"=>'OPERATION',
            "type_operation_id"=>$transfert->id
        ]);

    }
}
