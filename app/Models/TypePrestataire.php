<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypePrestataire extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function prestataires()
    {
        return $this->hasMany(Prestataire::class);
    }

    public function affections()
    {
        return $this->hasMany(Affection::class);
    }
}
