<?php

namespace App\Http\Controllers;

use App\Models\RoleUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfilController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        session("profil") && session()->forget("profil");
        session("societe") && session()->forget("societe");

        $authProfil=User::where('id',Auth::id())->with('profils.role',"profils.societe")->first();

        return Inertia::render("Profil",["authProfil"=>$authProfil]);
    }

    public function connect(RoleUser $roleUser)
    {
        session()->put("profil",$roleUser->role->nom);
        session()->put("societe",$roleUser->societe);

        switch ($roleUser->role->nom) {
            case "superAdmin":
                return redirect()->route("superAdmin.dashboard",Auth::id());
            case "admin":
                return redirect()->route("admin.dashboard",Auth::id());
            case "employe":
                return redirect()->route("employe.dashboard",Auth::id());
            case "client":
                return redirect()->route("client.dashboard",Auth::id());
            case "comptable":
                //session()->put("caisse",Caisse::where('user_id',Auth::id())->where("societe_id",$roleUser->societe->id)->whereRelation("typeCaisse","libelle","Caisse de zone")->first());
                //session()->put("zone",Caisse::where('user_id',Auth::id())->where("societe_id",$roleUser->societe->id)->whereRelation("typeCaisse","libelle","Caisse de zone")->first()->zone);
                return redirect()->route("comptable.dashboard",Auth::id());
        }

    }
}
