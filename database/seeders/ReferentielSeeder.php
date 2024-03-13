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
            "route" => 'superAdmin.produit.index',
        ]);


        Referentiel::create([
            "nom" => 'Devise',
            "route" => 'superAdmin.devise.index',
        ]);

        Referentiel::create([
            "nom" => 'Caisse',
            "route" => 'superAdmin.caisse.index',
        ]);

        Referentiel::create([
            "nom" => 'Stock',
            "route" => 'superAdmin.stock.index',
        ]);

        Referentiel::create([
            "nom" => 'Unité de mesure',
            "route" => 'superAdmin.uniteMesure.index',
        ]);

        Referentiel::create([
            "nom" => 'Employé',
            "route" => 'superAdmin.employe.index',
        ]);

        Referentiel::create([
            "nom" => 'Type de prix',
            "route" => 'superAdmin.typePrix.index',
        ]);

        Referentiel::create([
            "nom" => 'Type de produit',
            "route" => 'superAdmin.typeProduit.index',
        ]);

        Referentiel::create([
            "nom" => 'Types souscripteurs',
            "route" => 'superAdmin.typeSouscripteur.index',
        ]);

        Referentiel::create([
            "nom" => 'Catégories souscripteurs',
            "route" => 'superAdmin.categorieSouscripteur.index',
        ]);

        Referentiel::create([
            "nom" => 'Souscripteurs',
            "route" => 'superAdmin.souscripteur.index',
        ]);

        Referentiel::create([
            "nom" => 'Garanties',
            "route" => 'superAdmin.garantie.index',
        ]);

        Referentiel::create([
            "nom" => 'Affections',
            "route" => 'superAdmin.affection.index',
        ]);


        Referentiel::create([
            "nom" => 'Produits',
            "route" => 'superAdmin.produit.index',
        ]);

        Referentiel::create([
            "nom" => 'Paramètres',
            "route" => 'superAdmin.parametre.index',
        ]);

        Referentiel::create([
            "nom" => 'Devises',
            "route" => 'superAdmin.devise.index',
        ]);

    }
}
