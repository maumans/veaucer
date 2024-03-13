<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Garantie extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function actes()
    {
        return $this->hasMany(Acte::class);
    }

    public function examens()
    {
        return $this->hasMany(Examen::class);
    }
}
