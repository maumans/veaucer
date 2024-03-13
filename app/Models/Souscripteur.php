<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Souscripteur extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function typeSouscripteur()
    {
        return $this->belongsTo(TypeSouscripteur::class);
    }

    public function categorieSouscripteur()
    {
        return $this->belongsTo(CategorieSouscripteur::class);
    }

    public function contrats()
    {
        return $this->hasMany(Contrat::class);
    }

    public function adherents()
    {
        return $this->hasMany(Adherent::class);
    }
}
