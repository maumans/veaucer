<?php

namespace Database\Seeders;

use App\Models\Referentiel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReferentielSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("referentiels")->delete();

        Referentiel::create([
            "nom" => 'Rôle',
            "route" => 'superAdmin.role.index',
        ]);

        Referentiel::create([
            "nom" => 'Utilisateur',
            "route" => 'superAdmin.user.index',
        ]);

        Referentiel::create([
            "nom" => 'Type de société',
            "route" => 'superAdmin.typeSociete.index',
        ]);

        Referentiel::create([
            "nom" => 'Société',
            "route" => 'superAdmin.societe.index',
        ]);


        Referentiel::create([
            "nom" => 'Fournisseur',
            "route" => 'superAdmin.fournisseur.index',
        ]);

        Referentiel::create([
            "nom" => 'Inventaire',
            "route" => 'admin.stock.produit.index',
        ]);


        Referentiel::create([
            "nom" => 'Devise',
            "route" => 'superAdmin.devise.index',
        ]);

        Referentiel::create([
            "nom" => 'Caisse',
            "route" => 'admin.caisse.index',
        ]);

        Referentiel::create([
            "nom" => 'Stock',
            "route" => 'admin.stock.index',
        ]);

        Referentiel::create([
            "nom" => 'Unité de mesure',
            "route" => 'admin.uniteMesure.index',
        ]);

        Referentiel::create([
            "nom" => 'Employé',
            "route" => 'admin.employe.index',
        ]);

        Referentiel::create([
            "nom" => 'Type de prix',
            "route" => 'admin.typePrix.index',
        ]);

        Referentiel::create([
            "nom" => 'Type de produit',
            "route" => 'admin.typeProduit.index',
        ]);


        Referentiel::create([
            "nom" => 'Produits',
            "route" => 'admin.produit.index',
        ]);

        Referentiel::create([
            "nom" => 'Paramètres',
            "route" => 'parametre.index',
        ]);

    }
}
