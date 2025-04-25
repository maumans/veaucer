<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'adresse',
        'status',
        'societe_id'
    ];

    protected $casts = [
        'status' => 'boolean'
    ];

    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    public function ventes()
    {
        return $this->hasMany(Vente::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }
} 