<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Affection extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function typePrestataire()
    {
        return $this->belongsTo(TypePrestataire::class);
    }
}
