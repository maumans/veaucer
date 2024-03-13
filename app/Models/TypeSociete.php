<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeSociete extends Model
{
    use HasFactory;

    protected $guarded =[];

    public function societes()
    {
        return $this->hasMany(Societe::class);
    }
}
