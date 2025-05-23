<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Caisse extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'slug',
        'type',
        'solde',
        'status',
        'departement_id',
        'user_id',
        'societe_id'
    ];

    protected $casts = [
        'solde' => 'double',
        'status' => 'boolean'
    ];

    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }
}
