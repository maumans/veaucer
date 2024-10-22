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
        session()->put("profil",$roleUser->role->name);
        session()->put("societe",$roleUser->societe);

        switch ($roleUser->role->name) {
            case "SuperAdmin":
                return redirect()->route("superAdmin.dashboard",Auth::id());
            case "Admin":
                return redirect()->route("admin.dashboard",Auth::id());
            case "Employe":
                return redirect()->route("employe.dashboard",Auth::id());
            case "comptable":
                return redirect()->route("comptable.dashboard",Auth::id());
            default:
                return null;
        }

    }
}
