<?php

namespace App\Http\Middleware;

use App\Models\Referentiel;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {

        $roles=[];
        $permissions=[];
        $admin = false;
        if($request->user())
        {
            $user=User::where('id',$request->user()->id)->first();

            $permissions=$user->getAllPermissions()->pluck('name');
            $roles=$user->roles()->pluck('name');
        }

        //dd(User::where("id",$request->user()->id)->with('roles.permissions')->get());
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                "profil"=>session("profil"),
                "societe"=>session("societe"),
                'superAdmin'=>session("profil")==="SuperAdmin",
                'admin'=>session("profil")==="Admin",
                'comptable'=>session("profil")==="Comptable",
                'employe'=>session("profil")==="Employe",
                'roles' => $roles,
                'permissions' => $permissions,
            ],
            'success'=> session('success'),
            'error'=> session('error'),
            'referentiels'=>Referentiel::where("status",true)->get(),
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
