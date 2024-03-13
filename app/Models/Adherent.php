<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Adherent extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function lien()
    {
        return $this->belongsTo(Lien::class);
    }

    public function contrat()
    {
        return $this->belongsTo(Contrat::class);
    }

    public function souscripteur()
    {
        return $this->belongsTo(Souscripteur::class);
    }
}
