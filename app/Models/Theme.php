<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Theme extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'societe_id',
        'nom',
        'couleur_primaire',
        'couleur_secondaire',
        'couleur_accent',
        'couleur_texte',
        'couleur_fond',
        'police_principale',
        'police_secondaire',
        'styles_personnalises',
        'actif',
        'est_defaut'
    ];

    protected $casts = [
        'styles_personnalises' => 'array',
        'actif' => 'boolean',
        'est_defaut' => 'boolean'
    ];

    // Relations
    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    // Méthodes utiles
    public function getCssVariables()
    {
        return [
            '--couleur-primaire' => $this->couleur_primaire,
            '--couleur-secondaire' => $this->couleur_secondaire,
            '--couleur-accent' => $this->couleur_accent,
            '--couleur-texte' => $this->couleur_texte,
            '--couleur-fond' => $this->couleur_fond,
            '--police-principale' => $this->police_principale,
            '--police-secondaire' => $this->police_secondaire,
        ];
    }

    public function getStylesPersonnalisesFormatted()
    {
        return $this->styles_personnalises ? json_encode($this->styles_personnalises, JSON_PRETTY_PRINT) : '{}';
    }
}
