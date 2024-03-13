<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable,HasSlug;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'login',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(['prenom','nom'])
            ->saveSlugsTo('slug');
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function posteEmployes()
    {
        return $this->hasMany(PosteEmploye::class);
    }


    //////USER ROLES PROFILS
    public function profils()
    {
        return $this->hasMany(RoleUser::class);
    }

    public function isSuperAdmin()
    {
        if($this->roles()->where("nom","superAdmin")->first())
            return true;
        else return false;
    }

    public function isAdmin()
    {
        if($this->roles()->where("nom","admin")->first())
            return true;
        else return false;

    }

    public function isClient()
    {
        if($this->roles()->where("nom","client")->first())
            return true;
        else return false;

    }

    public function isEmploye()
    {
        if($this->roles()->where("nom","employe")->first())
            return true;
        else return false;

    }

    public function isComptable()
    {
        if($this->roles()->where("nom","comptable")->first())
            return true;
        else return false;
    }

    public function societeAdmin()
    {
        return $this->belongsTo(Societe::class,"societe_id");
    }
}
