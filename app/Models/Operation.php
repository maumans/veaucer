<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Operation extends Model
{
    use HasFactory;

    protected $guarded =[];

    public function typeOperation()
    {
        return $this->belongsTo(TypeOperation::class);
    }

    public function depenses()
    {
        return $this->hasMany(Depense::class);
    }

    public function produits()
    {
        return $this->hasMany(OperationProduit::class);
    }

    public function typePrix()
    {
        return $this->belongsTo(TypePrix::class);
    }

    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }
}
