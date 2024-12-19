<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'societe_id',
        'evenement_id',
        'user_id',
        'nom_client',
        'email_client',
        'telephone_client',
        'nombre_places_standard',
        'nombre_places_vip',
        'montant_total',
        'statut_paiement',
        'methode_paiement',
        'reference_paiement',
        'date_paiement',
        'notes',
        'details_supplementaires'
    ];

    protected $casts = [
        'nombre_places_standard' => 'integer',
        'nombre_places_vip' => 'integer',
        'montant_total' => 'decimal:2',
        'date_paiement' => 'datetime',
        'details_supplementaires' => 'array'
    ];

    // Relations
    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    public function evenement()
    {
        return $this->belongsTo(Evenement::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Méthodes utiles
    public function nombreTotalPlaces()
    {
        return $this->nombre_places_standard + $this->nombre_places_vip;
    }

    public function estPayee()
    {
        return $this->statut_paiement === 'paye';
    }

    public function peutEtreModifiee()
    {
        return in_array($this->statut_paiement, ['en_attente', 'paye']) &&
               $this->evenement->date_debut->isFuture();
    }
}
