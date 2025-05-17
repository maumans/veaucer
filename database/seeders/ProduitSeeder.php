<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\Departement;
use App\Models\Produit;
use App\Models\Societe;
use App\Models\Stock;
use App\Models\TypeProduit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProduitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $societe=Societe::where("nom","Les îles Maurice")->first();

        $jus=Categorie::where("nom","jus")->first();
        $biere=Categorie::where("nom","bière")->first();
        $alcool=Categorie::where("nom","alcool")->first();
        $plat=Categorie::where("nom","plat")->first();

        // Récupérer les types de produits (unité et ensemble)
        $typeUnite = TypeProduit::where("nom", "unité")->first();
        $typeEnsemble = TypeProduit::where("nom", "ensemble")->first();

        $produits=[
            //Jus
            [
                "nom"=>"Coca cola",
                "description"=>"Jus coca cola",
                "categorie_id"=>$jus->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteEnsemble"=>24,
                "prixAchat"=>10000,
                "prixVente"=>15000,
                "prixEnsemble"=>160000,
            ],
            [
                "nom"=>"Fanta",
                "description"=>"Jus fanta",
                "categorie_id"=>$jus->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteEnsemble"=>24,
                "prixAchat"=>10000,
                "prixVente"=>15000,
                "prixEnsemble"=>160000,
            ],
            [
                "nom"=>"Red Bull",
                "description"=>"Red Bull",
                "categorie_id"=>$jus->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteEnsemble"=>24,
                "prixAchat"=>15000,
                "prixVente"=>25000,
                "prixEnsemble"=>160000,
            ],
            [
                "nom"=>"Sangria",
                "description"=>"Sangria",
                "categorie_id"=>$jus->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteEnsemble"=>24,
                "prixAchat"=>15000,
                "prixVente"=>30000,
                "prixEnsemble"=>360000,
            ],

            //Biere
            [
                "nom"=>"Beaufort",
                "description"=>"Beaufort",
                "categorie_id"=>$biere->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteEnsemble"=>24,
                "prixAchat"=>7000,
                "prixVente"=>10000,
                "prixEnsemble"=>168000,
            ],  
            [
                "nom"=>"Faxe blanc",
                "description"=>"Faxe blanc",
                "categorie_id"=>$biere->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteEnsemble"=>24,
                "prixAchat"=>140000,
                "prixVente"=>10000,
                "prixEnsemble"=>168000,
            ],
            [
                "nom"=>"Faxe noir",
                "description"=>"Faxe noir",
                "categorie_id"=>$biere->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteEnsemble"=>24,
                "prixAchat"=>10000,
                "prixVente"=>20000,
                "prixEnsemble"=>240000,
            ],

            //Alcool
            [
                "nom"=>"Vodka",
                "description"=>"Vodka",
                "categorie_id"=>$alcool->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteEnsemble"=>24,
                "prixAchat"=>50000,
                "prixVente"=>100000,
                "prixEnsemble"=>1200000,
            ],
            [
                "nom"=>"Jack Daniel",
                "description"=>"Jack Daniel",
                "categorie_id"=>$alcool->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteEnsemble"=>24,
                "prixAchat"=>120000,
                "prixVente"=>200000,
                "prixEnsemble"=>2880000,
            ], 
            [
                "nom"=>"JP Cheney",
                "description"=>"JP Cheney",
                "categorie_id"=>$alcool->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteEnsemble"=>24,
                "prixAchat"=>100000,
                "prixVente"=>180000,
                "prixEnsemble"=>900000,
            ],
        ];

        $departement=Departement::where("nom","principal")->first();
        
        foreach ($produits as $produit) {
            $produit = Produit::create([
                "nom" => $produit['nom'],
                "description" => $produit['description'],
                "stockCritique" => $produit['stockCritique'],
                "stockGlobal" => $produit['stockGlobal'],
                "image" => null,
                "prixAchat" => $produit['prixAchat'],
                "prixVente" => $produit['prixVente'],
                "quantiteEnsemble" => $produit['quantiteEnsemble'],
                "prixEnsemble" => $produit['prixEnsemble'],
                "categorie_id" => $produit['categorie_id'],
                "fournisseur_principal_id" => null,
                "unite_mesure_id" => null,
                "devise_id" => null,
                "societe_id" => $societe->id,
            ]);
            
            Stock::create([
                'produit_id' => $produit->id,
                'quantite' => $produit['stockGlobal'],
                'societe_id' => $societe->id,
                'departement_id' => $departement->id,
                'stockCritique'=>$produit['stockCritique'],
                "type"=>"PRINCIPAL"
            ]);
        }
    }
}
