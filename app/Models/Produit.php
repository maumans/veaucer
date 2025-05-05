<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function typeProduitAchat()
    {
        return $this->belongsTo(TypeProduit::class,'type_produit_achat_id');
    }

    public function typeProduitVente()
    {
        return $this->belongsTo(TypeProduit::class,'type_produit_vente_id');
    }

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

}
