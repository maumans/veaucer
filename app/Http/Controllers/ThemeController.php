<?php

namespace App\Http\Controllers;

use App\Models\Theme;
use App\Models\Societe;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class ThemeController extends Controller
{
    public function index(Societe $societe)
    {
        $themes = $societe->themes()
            ->orderBy('est_defaut', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Themes/Index', [
            'themes' => $themes,
            'societe' => $societe->only('id', 'nom')
        ]);
    }

    public function create(Societe $societe)
    {
        return Inertia::render('Themes/Create', [
            'societe' => $societe->only('id', 'nom')
        ]);
    }

    public function store(Request $request, Societe $societe)
    {
        $validated = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'couleur_primaire' => 'required|string|max:7',
            'couleur_secondaire' => 'required|string|max:7',
            'couleur_accent' => 'required|string|max:7',
            'couleur_texte' => 'required|string|max:7',
            'couleur_fond' => 'required|string|max:7',
            'police_principale' => 'required|string|max:255',
            'police_secondaire' => 'required|string|max:255',
            'styles_personnalises' => 'nullable|array',
            'est_defaut' => 'boolean'
        ])->validate();

        if ($validated['est_defaut']) {
            // Désactiver les autres thèmes par défaut
            $societe->themes()->where('est_defaut', true)->update(['est_defaut' => false]);
        }

        $theme = $societe->themes()->create($validated);

        return redirect()->route('themes.edit', ['societe' => $societe->id, 'theme' => $theme->id])
            ->with('success', 'Thème créé avec succès.');
    }

    public function edit(Societe $societe, Theme $theme)
    {
        return Inertia::render('Themes/Edit', [
            'theme' => $theme,
            'societe' => $societe->only('id', 'nom'),
            'preview' => [
                'css' => $theme->getCssVariables(),
                'styles' => $theme->getStylesPersonnalisesFormatted()
            ]
        ]);
    }

    public function update(Request $request, Societe $societe, Theme $theme)
    {
        $validated = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'couleur_primaire' => 'required|string|max:7',
            'couleur_secondaire' => 'required|string|max:7',
            'couleur_accent' => 'required|string|max:7',
            'couleur_texte' => 'required|string|max:7',
            'couleur_fond' => 'required|string|max:7',
            'police_principale' => 'required|string|max:255',
            'police_secondaire' => 'required|string|max:255',
            'styles_personnalises' => 'nullable|array',
            'est_defaut' => 'boolean',
            'actif' => 'boolean'
        ])->validate();

        if ($validated['est_defaut']) {
            // Désactiver les autres thèmes par défaut
            $societe->themes()->where('id', '!=', $theme->id)->update(['est_defaut' => false]);
        }

        $theme->update($validated);

        return redirect()->back()->with('success', 'Thème mis à jour avec succès.');
    }

    public function destroy(Societe $societe, Theme $theme)
    {
        if ($theme->est_defaut) {
            return redirect()->back()->with('error', 'Impossible de supprimer le thème par défaut.');
        }

        $theme->delete();

        return redirect()->route('themes.index', ['societe' => $societe->id])
            ->with('success', 'Thème supprimé avec succès.');
    }

    public function preview(Societe $societe, Theme $theme)
    {
        return response()->json([
            'css' => $theme->getCssVariables(),
            'styles' => $theme->getStylesPersonnalisesFormatted()
        ]);
    }
}
