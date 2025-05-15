<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InventairePhysique extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'inventaires_physiques';

    protected $fillable = [
        'date_debut',
        'date_fin',
        'status', // planifié, en_cours, terminé, annulé
        'description',
        'societe_id',
        'departement_id',
        'user_id',
        'notes',
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
    ];

    // Relations
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

    public function details()
    {
        return $this->hasMany(InventairePhysiqueDetail::class);
    }

    public function ajustements()
    {
        return $this->hasMany(AjustementInventaire::class);
    }
}
