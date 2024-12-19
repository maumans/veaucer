<?php

namespace App\Http\Controllers;

use App\Models\Societe;
use App\Models\SocieteConfiguration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class SocieteConfigurationController extends Controller
{
    public function index(Societe $societe)
    {
        $configuration = $societe->configuration ?? new SocieteConfiguration();
        
        return Inertia::render('SuperAdmin/Societe/Configuration/Index', [
            'societe' => $societe->only('id', 'nom'),
            'configuration' => $configuration,
            'options' => [
                'fuseaux_horaires' => \DateTimeZone::listIdentifiers(),
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

    public function edit(Societe $societe)
    {
        $configuration = $societe->configuration ?? new SocieteConfiguration();
        
        return Inertia::render('SocieteConfiguration/Edit', [
            'societe' => $societe->only('id', 'nom'),
            'configuration' => $configuration,
            'options' => [
                'fuseaux_horaires' => \DateTimeZone::listIdentifiers(),
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
        $validated = Validator::make($request->all(), [
            'fuseau_horaire' => 'required|string',
            'langue_par_defaut' => 'required|string',
            'langues_activees' => 'required|array',
            'devise_par_defaut' => 'required|string',
            'devises_acceptees' => 'required|array',
            'modules_actifs' => 'required|array',
            'notifications' => 'required|array',
            'methodes_paiement' => 'required|array',
            'securite' => 'required|array',
            'factures' => 'required|array',
            'rapports' => 'required|array'
        ])->validate();

        $configuration = $societe->configuration()->updateOrCreate(
            ['societe_id' => $societe->id],
            $validated
        );

        return redirect()->back()->with('success', 'Configuration mise à jour avec succès.');
    }

    public function updateModule(Request $request, Societe $societe, $module)
    {
        $validated = Validator::make($request->all(), [
            'actif' => 'required|boolean'
        ])->validate();

        $configuration = $societe->configuration;
        $modules = $configuration->modules_actifs;
        $modules[$module] = $validated['actif'];
        
        $configuration->update(['modules_actifs' => $modules]);

        return response()->json(['success' => true]);
    }

    public function updateNotifications(Request $request, Societe $societe)
    {
        $validated = Validator::make($request->all(), [
            'type' => 'required|string|in:email,sms,whatsapp',
            'actif' => 'required|boolean',
            'evenements' => 'required|array'
        ])->validate();

        $configuration = $societe->configuration;
        $notifications = $configuration->notifications;
        $notifications[$validated['type']] = [
            'actif' => $validated['actif'],
            'evenements' => $validated['evenements']
        ];

        $configuration->update(['notifications' => $notifications]);

        return response()->json(['success' => true]);
    }

    public function updateSecurite(Request $request, Societe $societe)
    {
        $validated = Validator::make($request->all(), [
            'authentification_deux_facteurs' => 'required|boolean',
            'duree_session' => 'required|integer|min:15|max:1440',
            'tentatives_connexion_max' => 'required|integer|min:3|max:10',
            'complexite_mot_de_passe' => 'required|string|in:faible,medium,fort'
        ])->validate();

        $configuration = $societe->configuration;
        $configuration->update(['securite' => $validated]);

        return response()->json(['success' => true]);
    }
}
