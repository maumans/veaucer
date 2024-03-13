<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Societe extends Model
{
    use HasFactory;

    protected $guarded =[];

    public function typeSociete()
    {
        return $this->belongsTo(TypeSociete::class);
    }

    public function fournisseurPrincipal()
    {
        return $this->belongsTo(Fournisseur::class, 'fournisseur_principal_id');
    }

    public function departementPrincipal()
    {
        return $this->belongsTo(Departement::class, 'departement_principal_id');
    }

    public function caissePrincipale()
    {
        return $this->hasOne(Caisse::class, 'caisse_principale_id');
    }

    /*public function roleUsers()
    {
        return $this->hasMany(RoleUser::class);
    }*/

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function posteEmployes()
    {
        return $this->hasMany(PosteEmploye::class);
    }
}
