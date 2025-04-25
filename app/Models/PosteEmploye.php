<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosteEmploye extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'poste_id',
        'employe_id',
        'societe_id',
        'departement_id',
    ];

    public function employe()
    {
        return $this->belongsTo(User::class, 'employe_id');
    }

    public function poste()
    {
        return $this->belongsTo(Poste::class);
    }

    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }

    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }
}
