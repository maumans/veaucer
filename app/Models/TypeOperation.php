<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeOperation extends Model
{
    use HasFactory;

    protected $guarded =[];

    public function operations()
    {
        return $this->hasMany(Operation::class);
    }
}
