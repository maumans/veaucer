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

        $typeProduitAchat=TypeProduit::where("nom","ensemble")->first();
        $typeProduitVente=TypeProduit::where("nom","unité")->first();

        $produits=[
            //Jus
            [
                "nom"=>"Coca cola",
                "description"=>"Jus coca cola",
                "categorie_id"=>$jus->id,
                "typeProduitAchat_id"=>$typeProduitAchat->id,
                "typeProduitVente_id"=>$typeProduitVente->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteAchat"=>24,
                "quantiteVente"=>1,
                "prixAchat"=>160000,
                "prixVente"=>15000,
            ],
            [
                "nom"=>"Fanta",
                "description"=>"Jus fanta",
                "categorie_id"=>$jus->id,
                "typeProduitAchat_id"=>$typeProduitAchat->id,
                "typeProduitVente_id"=>$typeProduitVente->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteAchat"=>24,
                "quantiteVente"=>1,
                "prixAchat"=>160000,
                "prixVente"=>15000,
            ],
            [
                "nom"=>"Red Bull",
                "description"=>"Red Bull",
                "categorie_id"=>$jus->id,
                "typeProduitAchat_id"=>$typeProduitAchat->id,
                "typeProduitVente_id"=>$typeProduitVente->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteAchat"=>24,
                "quantiteVente"=>1,
                "prixAchat"=>160000,
                "prixVente"=>15000,
            ],
            [
                "nom"=>"Sangria",
                "description"=>"Sangria",
                "categorie_id"=>$jus->id,
                "typeProduitAchat_id"=>$typeProduitAchat->id,
                "typeProduitVente_id"=>$typeProduitVente->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteAchat"=>24,
                "quantiteVente"=>1,
                "prixAchat"=>160000,
                "prixVente"=>15000,
            ],

            //Biere
            [
                "nom"=>"Beaufort",
                "description"=>"Beaufort",
                "categorie_id"=>$biere->id,
                "typeProduitAchat_id"=>$typeProduitAchat->id,
                "typeProduitVente_id"=>$typeProduitVente->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteAchat"=>24,
                "quantiteVente"=>1,
                "prixAchat"=>160000,
                "prixVente"=>15000,
            ],  
            [
                "nom"=>"Faxe blanc",
                "description"=>"Faxe blanc",
                "categorie_id"=>$biere->id,
                "typeProduitAchat_id"=>$typeProduitAchat->id,
                "typeProduitVente_id"=>$typeProduitVente->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteAchat"=>24,
                "quantiteVente"=>1,
                "prixAchat"=>140000,
                "prixVente"=>10000,
            ],
            [
                "nom"=>"Faxe noir",
                "description"=>"Faxe noir",
                "categorie_id"=>$biere->id,
                "typeProduitAchat_id"=>$typeProduitAchat->id,
                "typeProduitVente_id"=>$typeProduitVente->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteAchat"=>24,
                "quantiteVente"=>1,
                "prixAchat"=>200000,
                "prixVente"=>20000,
            ],

            //Alcool
            [
                "nom"=>"Vodka",
                "description"=>"Vodka",
                "categorie_id"=>$alcool->id,
                "typeProduitAchat_id"=>$typeProduitAchat->id,
                "typeProduitVente_id"=>$typeProduitVente->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteAchat"=>24,
                "quantiteVente"=>1,
                "prixAchat"=>160000,
                "prixVente"=>15000,
            ],
            [
                "nom"=>"Jack Daniel",
                "description"=>"Jack Daniel",
                "categorie_id"=>$alcool->id,
                "typeProduitAchat_id"=>$typeProduitAchat->id,
                "typeProduitVente_id"=>$typeProduitVente->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteAchat"=>24,
                "quantiteVente"=>1,
                "prixAchat"=>160000,
                "prixVente"=>15000,
            ], 
            [
                "nom"=>"JP Cheney",
                "description"=>"JP Cheney",
                "categorie_id"=>$alcool->id,
                "typeProduitAchat_id"=>$typeProduitAchat->id,
                "typeProduitVente_id"=>$typeProduitVente->id,
                "stockGlobal"=>0,
                "stockCritique"=>10,
                "quantiteAchat"=>24,
                "quantiteVente"=>1,
                "prixAchat"=>160000,
                "prixVente"=>15000,
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
                "type_produit_achat_id" => $produit['typeProduitAchat_id'],
                "quantiteAchat" => $produit['quantiteAchat'],
                "prixAchat" => $produit['prixAchat'],
                "type_produit_vente_id" => $produit['typeProduitVente_id'],
                "quantiteVente" => $produit['quantiteVente'],
                "prixVente" => $produit['prixVente'],
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
