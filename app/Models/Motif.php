<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Motif extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function typeOperation()
    {
        return $this->belongsTo(TypeOperation::class);
    }

    public function depenses()
    {
        return $this->hasMany(Depense::class);
    }
}
