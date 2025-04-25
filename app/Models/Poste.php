<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Poste extends Model
{
    use HasFactory;

    protected $fillable = [
        'libelle',
        'description',
        'societe_id'
    ];

    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    public function employes()
    {
        return $this->hasMany(User::class);
    }

    public function posteEmployes()
    {
        return $this->hasMany(PosteEmploye::class);
    }
}
