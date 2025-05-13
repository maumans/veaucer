<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AjustementInventaire extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ajustements_inventaire';

    protected $fillable = [
        'inventaire_physique_id',
        'produit_id',
        'quantite_avant',
        'quantite_apres',
        'difference',
        'motif',
        'date_ajustement',
        'societe_id',
        'departement_id',
        'user_id',
        'status', // en_attente, validé, rejeté
        'notes',
    ];

    protected $casts = [
        'date_ajustement' => 'datetime',
    ];

    // Relations
    public function inventairePhysique()
    {
        return $this->belongsTo(InventairePhysique::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

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
}
