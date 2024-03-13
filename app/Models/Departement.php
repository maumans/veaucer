<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departement extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function caisses()
    {
        return $this->hasMany(Caisse::class);
    }

    public function stocks()
    {
        return $this->hasMany(Caisse::class);
    }
}
