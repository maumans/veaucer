<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $services = Service::where('societe_id', auth()->user()->societe_id)
                         ->with(['typeService'])
                         ->paginate(10);


        return Inertia::render('Admin/Service/Index', [
            'services' => $services
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Service/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'duree' => 'required|integer|min:0',
            'nombreClients' => 'required|integer|min:0',
            'nombreTablesReservees' => 'required|integer|min:0',
            'recetteTotale' => 'required|numeric|min:0',
            'etat' => 'required|in:INITIE,ANNULE,PARTIEL,TOTAL',
            'type_service_id' => 'nullable|exists:type_services,id',
        ]);

        $service = Service::create([
            ...$validated,
            'societe_id' => auth()->user()->societe_id
        ]);

        return redirect()->route('admin.service.index')
                        ->with('success', 'Service créé avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        return Inertia::render('Admin/Service/Edit', [
            'service' => $service
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'duree' => 'required|integer|min:0',
            'nombreClients' => 'required|integer|min:0',
            'nombreTablesReservees' => 'required|integer|min:0',
            'recetteTotale' => 'required|numeric|min:0',
            'etat' => 'required|in:INITIE,ANNULE,PARTIEL,TOTAL',
            'type_service_id' => 'nullable|exists:type_services,id',
        ]);

        $service->update($validated);

        return redirect()->route('admin.service.index')
                        ->with('success', 'Service mis à jour avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->route('admin.service.index')
                        ->with('success', 'Service supprimé avec succès');
    }
}
