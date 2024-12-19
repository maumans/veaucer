<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;

class Societe extends Model
{
    use HasFactory;

    protected $guarded =[];

    public function configuration()
    {
        return $this->hasOne(SocieteConfiguration::class);
    }

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
        return $this->belongsTo(Caisse::class, 'caisse_principale_id')->with('departement');
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

    public function themes()
    {
        return $this->hasMany(Theme::class);
    }

    public function themeActif()
    {
        return $this->hasOne(Theme::class)->where('actif', true)->where('est_defaut', true);
    }

    public function configurations()
    {
        return $this->hasMany(SocieteConfiguration::class);
    }
}
