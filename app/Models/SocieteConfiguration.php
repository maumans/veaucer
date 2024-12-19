<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SocieteConfiguration extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'societe_id',
        'fuseau_horaire',
        'langue_par_defaut',
        'langues_activees',
        'devise_par_defaut',
        'devises_acceptees',
        'modules_actifs',
        'notifications',
        'methodes_paiement',
        'securite',
        'factures',
        'rapports'
    ];

    protected $casts = [
        'langues_activees' => 'array',
        'devises_acceptees' => 'array',
        'modules_actifs' => 'array',
        'notifications' => 'array',
        'methodes_paiement' => 'array',
        'securite' => 'array',
        'factures' => 'array',
        'rapports' => 'array'
    ];

    protected $attributes = [
        'langues_activees' => '["fr"]',
        'modules_actifs' => '{"evenements":true,"reservations":true,"stocks":true,"comptabilite":true,"rapports":true}',
        'notifications' => '{"email":{"actif":true,"evenements":["reservation","paiement","rappel"]},"sms":{"actif":false,"evenements":[]},"whatsapp":{"actif":false,"evenements":[]}}',
        'methodes_paiement' => '{"especes":true,"carte_bancaire":false,"mobile_money":true,"virement":false}',
        'securite' => '{"authentification_deux_facteurs":false,"duree_session":120,"tentatives_connexion_max":5,"complexite_mot_de_passe":"medium"}',
        'factures' => '{"prefixe":"","format_numero":"YYYY-MM-####","logo":true,"pied_de_page":"","conditions_generales":""}',
        'rapports' => '{"frequence_sauvegarde":"quotidien","formats_export":["pdf","excel"],"destinataires_automatiques":[]}'
    ];

    // Relations
    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    // Méthodes utiles
    public function isModuleActif($module)
    {
        return $this->modules_actifs[$module] ?? false;
    }

    public function isNotificationActive($type, $evenement)
    {
        $notifications = $this->notifications;
        return isset($notifications[$type]) && 
               $notifications[$type]['actif'] && 
               in_array($evenement, $notifications[$type]['evenements']);
    }

    public function isMethodePaiementActive($methode)
    {
        return $this->methodes_paiement[$methode] ?? false;
    }

    public function getParametreSecurite($parametre, $defaut = null)
    {
        return $this->securite[$parametre] ?? $defaut;
    }

    public function getParametreFacture($parametre, $defaut = null)
    {
        return $this->factures[$parametre] ?? $defaut;
    }

    public function getParametreRapport($parametre, $defaut = null)
    {
        return $this->rapports[$parametre] ?? $defaut;
    }
}
