<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TypeEvenement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'societe_id',
        'libelle',
        'description',
        'actif'
    ];

    protected $casts = [
        'actif' => 'boolean'
    ];

    // Relations
    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    public function evenements()
    {
        return $this->hasMany(Evenement::class);
    }
}
