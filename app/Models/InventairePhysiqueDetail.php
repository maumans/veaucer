<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InventairePhysiqueDetail extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'inventaire_physique_details';

    protected $fillable = [
        'inventaire_physique_id',
        'produit_id',
        'quantite_theorique',
        'quantite_comptee',
        'difference',
        'notes',
        'status', // en_attente, validé, ajusté
        'compteur_user_id',
        'validateur_user_id',
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

    public function compteur()
    {
        return $this->belongsTo(User::class, 'compteur_user_id');
    }

    public function validateur()
    {
        return $this->belongsTo(User::class, 'validateur_user_id');
    }
}
