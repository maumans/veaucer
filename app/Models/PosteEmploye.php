<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosteEmploye extends Model
{
    use HasFactory;

    public function employe()
    {
        return $this->belongsTo(User::class,'employe_id');
    }

    public function poste()
    {
        return $this->belongsTo(Poste::class);
    }

    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }
}
