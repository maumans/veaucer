<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable,HasSlug,HasRoles;

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

    public function roles(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
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
        if($this->roles()->where("name","SuperAdmin")->first())
            return true;
        else return false;
    }

    public function isAdmin()
    {
        if($this->roles()->where("name","Admin")->first())
            return true;
        else return false;

    }

    public function isEmploye()
    {
        if($this->roles()->where("name","Employe")->first())
            return true;
        else return false;

    }

    public function isComptable()
    {
        if($this->roles()->where("name","Comptable")->first())
            return true;
        else return false;
    }

    public function societeAdmin()
    {
        return $this->belongsTo(Societe::class,"societe_id");
    }
}
