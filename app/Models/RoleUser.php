<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;

class RoleUser extends Model
{
    use HasFactory;

    protected $table = 'role_user';

    protected $guarded=[];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }
}
