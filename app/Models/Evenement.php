<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Evenement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'societe_id',
        'type_evenement_id',
        'service_id',
        'titre',
        'description',
        'date_debut',
        'date_fin',
        'capacite_max',
        'prix_standard',
        'prix_vip',
        'statut',
        'configuration',
        'actif'
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
        'capacite_max' => 'integer',
        'prix_standard' => 'decimal:2',
        'prix_vip' => 'decimal:2',
        'configuration' => 'array',
        'actif' => 'boolean'
    ];

    // Relations
    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    public function typeEvenement()
    {
        return $this->belongsTo(TypeEvenement::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    // Méthodes utiles
    public function nombrePlacesDisponibles()
    {
        if (!$this->capacite_max) {
            return null; // Capacité illimitée
        }

        $placesReservees = $this->reservations()
            ->whereIn('statut_paiement', ['en_attente', 'paye'])
            ->sum(DB::raw('nombre_places_standard + nombre_places_vip'));

        return max(0, $this->capacite_max - $placesReservees);
    }

    public function estComplet()
    {
        return $this->capacite_max && $this->nombrePlacesDisponibles() === 0;
    }
}
