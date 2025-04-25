<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Stock;
use App\Models\Produit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stocks = Stock::with(['produit'])
            ->where('societe_id', auth()->user()->societe_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Stock/Index', [
            'stocks' => $stocks
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $produits = Produit::where('societe_id', auth()->user()->societe_id)
            ->where('status', true)
            ->orderBy('nom')
            ->get();

        return Inertia::render('Admin/Stock/Create', [
            'produits' => $produits
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|numeric|min:0',
            'type' => 'required|in:ENTREE,SORTIE',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'status' => 'required|boolean'
        ]);

        $stock = Stock::create([
            'produit_id' => $request->produit_id,
            'quantite' => $request->quantite,
            'type' => $request->type,
            'date' => $request->date,
            'description' => $request->description,
            'status' => $request->status,
            'societe_id' => auth()->user()->societe_id,
            'slug' => Str::slug($request->produit_id . '-' . $request->type . '-' . now())
        ]);

        // Mettre à jour la quantité du produit
        $produit = Produit::find($request->produit_id);
        if ($request->type === 'ENTREE') {
            $produit->quantite += $request->quantite;
        } else {
            $produit->quantite -= $request->quantite;
        }
        $produit->save();

        return redirect()->route('admin.stock.index', [auth()->user()->id])
            ->with('success', 'Mouvement de stock enregistré avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Stock $stock)
    {
        $stock->load('produit');
        
        return Inertia::render('Admin/Stock/Show', [
            'stock' => $stock
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Stock $stock)
    {
        $produits = Produit::where('societe_id', auth()->user()->societe_id)
            ->where('status', true)
            ->orderBy('nom')
            ->get();

        return Inertia::render('Admin/Stock/Edit', [
            'stock' => $stock,
            'produits' => $produits
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Stock $stock)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|numeric|min:0',
            'type' => 'required|in:ENTREE,SORTIE',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'status' => 'required|boolean'
        ]);

        // Annuler l'ancien mouvement
        $ancienProduit = Produit::find($stock->produit_id);
        if ($stock->type === 'ENTREE') {
            $ancienProduit->quantite -= $stock->quantite;
        } else {
            $ancienProduit->quantite += $stock->quantite;
        }
        $ancienProduit->save();

        // Appliquer le nouveau mouvement
        $nouveauProduit = Produit::find($request->produit_id);
        if ($request->type === 'ENTREE') {
            $nouveauProduit->quantite += $request->quantite;
        } else {
            $nouveauProduit->quantite -= $request->quantite;
        }
        $nouveauProduit->save();

        $stock->update([
            'produit_id' => $request->produit_id,
            'quantite' => $request->quantite,
            'type' => $request->type,
            'date' => $request->date,
            'description' => $request->description,
            'status' => $request->status,
            'slug' => Str::slug($request->produit_id . '-' . $request->type . '-' . now())
        ]);

        return redirect()->route('admin.stock.index', [auth()->user()->id])
            ->with('success', 'Mouvement de stock mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stock $stock)
    {
        // Annuler le mouvement
        $produit = Produit::find($stock->produit_id);
        if ($stock->type === 'ENTREE') {
            $produit->quantite -= $stock->quantite;
        } else {
            $produit->quantite += $stock->quantite;
        }
        $produit->save();

        $stock->delete();

        return redirect()->route('admin.stock.index', [auth()->user()->id])
            ->with('success', 'Mouvement de stock supprimé avec succès.');
    }
}
