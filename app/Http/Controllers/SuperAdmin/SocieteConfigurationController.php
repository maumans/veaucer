<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Societe;
use App\Models\SocieteConfiguration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class SocieteConfigurationController extends Controller
{
    public function index($user)
    {
        $societes = Societe::with('configuration')->get()->map(function ($societe) {
            return [
                'id' => $societe->id,
                'nom' => $societe->nom,
                'configuration' => $societe->configuration ? [
                    'modules_actifs' => count(array_filter($societe->configuration->modules_actifs)),
                    'methodes_paiement' => count(array_filter($societe->configuration->methodes_paiement)),
                    'derniere_mise_a_jour' => $societe->configuration->updated_at?->diffForHumans(),
                ] : null
            ];
        });

        
        return Inertia::render('SuperAdmin/Societe/Configuration/Index', [
            'societes' => $societes
        ]);
    }

    public function show(Societe $societe)
    {
        $configuration = $societe->configuration ?? new SocieteConfiguration();
        
        return Inertia::render('SuperAdmin/Societe/Configuration/Show', [
            'societe' => $societe->only('id', 'nom'),
            'configuration' => $configuration,
            'options' => [
                'fuseaux_horaires' => \DateTimeZone::listIdentifiers(\DateTimeZone::AFRICA),
                'langues_disponibles' => [
                    'fr' => 'Français',
                    'en' => 'English',
                    'pular' => 'Pular',
                    'malinke' => 'Malinké',
                    'soussou' => 'Soussou'
                ],
                'devises_disponibles' => [
                    'GNF' => 'Franc Guinéen',
                    'EUR' => 'Euro',
                    'USD' => 'Dollar US'
                ],
                'modules_disponibles' => [
                    'evenements' => 'Gestion des événements',
                    'reservations' => 'Système de réservation',
                    'stocks' => 'Gestion des stocks',
                    'comptabilite' => 'Comptabilité',
                    'rapports' => 'Rapports et analyses'
                ],
                'methodes_paiement_disponibles' => [
                    'especes' => 'Espèces',
                    'carte_bancaire' => 'Carte bancaire',
                    'mobile_money' => 'Mobile Money',
                    'virement' => 'Virement bancaire'
                ]
            ]
        ]);
    }

    public function update(Request $request, Societe $societe)
    {
        $validator = Validator::make($request->all(), [
            'modules_actifs' => 'array',
            'notifications' => 'array',
            'securite' => 'array',
            'methodes_paiement' => 'array',
            'general' => 'array'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $configuration = $societe->configuration ?? new SocieteConfiguration();
        $configuration->societe_id = $societe->id;
        $configuration->modules_actifs = $request->input('modules_actifs', []);
        $configuration->notifications = $request->input('notifications', []);
        $configuration->securite = $request->input('securite', []);
        $configuration->methodes_paiement = $request->input('methodes_paiement', []);
        
        // Mise à jour des paramètres généraux
        if ($request->has('general')) {
            $general = $request->input('general');
            $configuration->langue_par_defaut = $general['default_language'] ?? 'fr';
            $configuration->devise_par_defaut = $general['currency'] ?? 'GNF';
            $configuration->fuseau_horaire = $general['timezone'] ?? 'Africa/Conakry';
        }
        
        $configuration->save();

        return back()->with('success', 'Configuration mise à jour avec succès');
    }
}
