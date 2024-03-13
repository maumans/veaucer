<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperationProduit extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function operation()
    {
        return $this->belongsTo(Operation::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    public function receptions()
    {
        return $this->hasMany(Reception::class);
    }

    public function depense()
    {
        return $this->belongsTo(Depense::class);
    }
}
