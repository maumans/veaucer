<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Caisse;
use App\Models\Departement;
use App\Models\RoleUser;
use App\Models\Societe;
use App\Models\SocieteConfiguration;
use App\Models\Stock;
use App\Models\Theme;
use App\Models\TypeCaisse;
use App\Models\TypeSociete;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class SocieteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($superAdmin)
    {
        $societes = Societe::/*where('status', true)->*/orderBy('nom')->with('typeSociete')->paginate(10);
        $typeSocietes = TypeSociete::/*where('status', true)->*/orderBy('nom')->get();

        return Inertia::render('SuperAdmin/Societe/Index',[
            'societes' => $societes,
            'typeSocietes' => $typeSocietes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $typeSocietes = TypeSociete::/*where('status', true)->*/orderBy('nom')->get();

        return Inertia::render("SuperAdmin/Societe/Create",[
            'typeSocietes' => $typeSocietes,
            'configuration' => new SocieteConfiguration(),
            'options' => [
                'langues_disponibles' => [
                    'fr' => 'Français',
                    'en' => 'English',
                ],
                'devises_disponibles' => [
                    'GNF' => 'Franc Guinéen',
                    'EUR' => 'Euro',
                    'USD' => 'Dollar US'
                ],
                'modules_disponibles' => [
                    'stocks' => 'Gestion des stocks',
                    'comptabilite' => 'Comptabilité',
                    'rapports' => 'Rapports et analyses',
                    'evenements' => 'Gestion des événements',
                    'reservations' => 'Système de réservation',
                ],
                'methodes_paiement_disponibles' => [
                    'especes' => 'Espèces',
                    'carte_bancaire' => 'Carte bancaire',
                    'orange_money' => 'Orange Money',
                    'mobile_money' => 'Mobile Money',
                    'virement' => 'Virement bancaire'
                ]
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required',
            'adresse' => 'required',
            'adresseMail' => 'email',
            'telephone1' => 'required',
            'typeSociete' => 'required',

            'modules_actifs' => 'array',
            'notifications' => 'array',
            'securite' => 'array',
            'methodes_paiement' => 'array',
            'general' => 'array',

            'couleur_primaire' => 'required|string|max:7',
            'couleur_secondaire' => 'required|string|max:7',
        ]);

        DB::beginTransaction();

        try {

            $societe=Societe::create([
                "nom" => $request->nom,
                "adresse" => $request->adresse,
                "description" => $request->description,
                "telephone1" => $request->telephone1,
                "telephone2" => $request->telephone2,
                "adresseMail" => $request->adresseMail,
                "solde" => $request->solde,
                "slug" => $request->slug,
                "type_societe_id" => $request->typeSociete['id'],
            ]);

            $user = User::create([
                "nom" => $request->nomAdmin,
                "prenom" => $request->prenomAdmin,
                "email" => $request->email,
                "login" => $request->login,
                "password" => Hash::make($request->password),
                "adresse" => $request->adresseAdmin,
                "telephone" => $request->telephoneAdmin,
            ]);

            $role = Role::where("name", "admin")->first();

            RoleUser::create([
                "user_id" => $user->id,
                "societe_id" => $societe->id,
                "role_id" => $role->id
            ]);

            $caissePrincipale=Caisse::create([
                "solde" =>$request->solde,
                "user_id"=>$user->id,
                "type"=>'PRINCIPAL',
                "societe_id"=>$societe->id
            ]);

            $departementPrincipal=Departement::create([
                "nom" =>'principal',
                "description" =>'Departement principal',
                "user_id"=>$user->id,
                "type"=>'PRINCIPAL',
                "telephone" => $request->telephoneAdmin,
                "societe_id"=>$societe->id,
            ]);

            $stockPrincipal=Stock::create([
                "departement_id"=>$departementPrincipal->id,
                "societe_id"=>$societe->id,
                
            ]);

            $caissePrincipale->departement_id=$departementPrincipal->id;
            $societe->caisse_principale_id=$caissePrincipale->id;
            $societe->departement_principal_id=$departementPrincipal->id;

            $caissePrincipale->save();
            $societe->save();

            $user->societeAdmin()->associate($societe)->save();


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

            Theme::create([
                'societe_id' => $societe->id,
                'nom' => 'Thème principal',
                'couleur_primaire' => $request->couleur_primaire,
                'couleur_secondaire' => $request->couleur_secondaire,
                'est_defaut' => true,
            ]);

            DB::commit();

            return redirect()->action([SocieteController::class, 'index'], Auth::id())->with("success", "Société ajoutée avec succés");

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user, Societe $societe)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,User $user, Societe $societe)
    {
        $request->validate([
            'nom' => 'required',
            'adresse' => 'required',
            'adresseMail' => 'email',
            'telephone1' => 'required',
            'typeSociete' => 'required',
        ]);

        DB::beginTransaction();

        try {

            $societe->update([
                "nom" => $request->nom,
                "adresse" => $request->adresse,
                "description" => $request->description,
                "telephone1" => $request->telephone1,
                "telephone2" => $request->telephone2,
                "adresseMail" => $request->adresseMail,
                "slug" => $request->slug,
                "type_societe_id" => $request->typeSociete['id'],
            ]);

            DB::commit();

            return redirect()->back()->with('success','Société modifiée avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($user, Societe $societe)
    {
        
        DB::beginTransaction();

        try {

            $societe->delete();

            DB::commit();

            return redirect()->back()->with('success','Societe supprimée avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }

    }

    public function paginationFiltre(Request $request, User $user): \Illuminate\Http\JsonResponse
    {
        $extraQuery = Societe::where(function($query) use ($request) {

            foreach ($request->filters as $filter)
            {
                if ($filter['id'] == 'typeSociete')
                {
                    $query->orWhereRelation('typeSociete','nom','like',"%".$filter['value']."%");
                }
                else
                {
                    $query->orWhere($filter['id'],'like', "%".$filter['value']."%");
                }
            }

            if($request->globalFilter)
            {
                $query->whereRelation('typeSociete','nom', "%".$request->globalFilter."%")->orWhere('nom','like', "%".$request->globalFilter."%")->orWhere('telephone1','like', "%".$request->globalFilter."%")->orWhere('telephone2','like', "%".$request->globalFilter."%")->orWhere('adresseMail','like', "%".$request->globalFilter."%")->orWhere('slug','like', "%".$request->globalFilter."%");
            }

        })->with('typeSociete')/*->where('status', true)*/->skip($request->start)->take($request->size);

        foreach ($request->sorting as $sort)
        {
            if ($sort['desc'])
            {
                $extraQuery->orderBy($sort['id'],'desc');
            }
            else
            {
                $extraQuery->orderBy($sort['id'],'asc');
            }
        }

        $societes = $extraQuery->get();
        $rowCount = $extraQuery->paginate($request->size)->total();

        return response()->json( ['data'=>$societes,'rowCount'=>$rowCount]);
    }
}
