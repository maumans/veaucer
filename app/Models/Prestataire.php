<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prestataire extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function typePrestataire()
    {
        return $this->belongsTo(TypePrestataire::class);
    }

    public function conventionActe()
    {
        return $this->belongsTo(ConventionActe::class);
    }
}
