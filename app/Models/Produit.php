<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function typeProduit()
    {
        return $this->belongsTo(TypeProduit::class);
    }

    public function sousCategorie()
    {
        return $this->belongsTo(SousCategorie::class);
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


}
