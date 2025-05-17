<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperationProduit extends Model
{
    use HasFactory;

    protected $guarded=[];
    
    protected $casts = [
        'type' => 'string',
    ];

    public function operation()
    {
        return $this->belongsTo(Operation::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    public function typeProduit()
    {
        return $this->belongsTo(TypeProduit::class, 'type_produit_id');
    }

    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    // Si la classe Reception n'existe pas ou n'est pas utilisée, nous pouvons commenter cette relation
    // public function receptions()
    // {
    //     return $this->hasMany(Reception::class);
    // }

    public function depense()
    {
        return $this->belongsTo(Depense::class);
    }
}
