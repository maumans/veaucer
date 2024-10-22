<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Caisse;
use App\Models\Departement;
use App\Models\Role;
use App\Models\RoleUser;
use App\Models\Societe;
use App\Models\TypeCaisse;
use App\Models\TypeSociete;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SocieteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
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

            $role = Role::where("nom", "admin")->first();

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
                "caisse_principale_id"=>$caissePrincipale->id,
                "societe_id"=>$societe->id,
            ]);

            $caissePrincipale->departement_id=$departementPrincipal->id;
            $societe->caisse_principale_id=$caissePrincipale->id;
            $societe->departement_principal_id=$departementPrincipal->id;

            $caissePrincipale->save();
            $societe->save();

            $user->societeAdmin()->associate($societe)->save();

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
    public function show(string $id)
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
    public function update(Request $request, Societe $societe)
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
    public function destroy(Societe $societe)
    {
        DB::beginTransaction();

        try {
            $societe->status= !$societe->status;

            $societe->save();

            DB::commit();

            return redirect()->back()->with('success','Societe suspendue avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }

    }

    public function paginationFiltre(Request $request): \Illuminate\Http\JsonResponse
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
