<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;

    protected $guarded=[];

    // Les relations typeProduitAchat et typeProduitVente ont été supprimées
    // car nous avons simplifié la structure de la table produits

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function operations()
    {
        return $this->hasMany(OperationProduit::class);
    }

    public function fournisseurPrincipal()
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function images()
    {
        return $this->hasMany(Produit::class);
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    public function uniteMesure()
    {
        return $this->belongsTo(UniteMesure::class);
    }

    public function devise()
    {
        return $this->belongsTo(Devise::class);
    }

}
