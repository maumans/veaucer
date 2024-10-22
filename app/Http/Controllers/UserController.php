<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $total=User::count();
        $actif=User::where('status',true)->count();
        $inactif=User::where('status',false)->count();

        $users=User::with('roles.permissions')->paginate(10);

        $roles=Role::with('permissions')->get();

        return Inertia::render('User/Index',[
            'users'=>$users,"total"=>$total,"inactif"=>$inactif,"actif"=>$actif,'roles'=>$roles
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'prenom' => ['required', 'string', 'max:255'],
            'nom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255','unique:users'],
        ]);

        DB::beginTransaction();

        try {
            $user=User::create([
                'prenom' => $request->prenom,
                'nom' => $request->nom,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            foreach ($request->roles as $role)
            {
                if($role['status'])
                {
                    $user->assignRole(Role::find($role['id'])->name);
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'User créé avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {

        return Inertia::render('User/Show',['user'=>$user]);
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
    public function update(Request $request, User $user)
    {
        $request->validate([
            'prenom' => 'required',
            "nom" => 'required',
            "email" => 'required',
        ]);

        DB::beginTransaction();

        try {

            $user->update([
                "nom" => $request->nom,
                "prenom" => $request->prenom,
                "email" => $request->email,
            ]);

            foreach ($request->roles as $role)
            {
                if($role['status'])
                {
                    $user->assignRole(Role::find($role['id'])->name);
                }
                else
                {
                    $user->removeRole(Role::find($role['id'])->name);
                }
            }


            DB::commit();

            return redirect()->back()->with("success", "User modifié avec succès");

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        DB::beginTransaction();

        try {
            $user->status = !$user->status;

            $user->save();

            DB::commit();

            return redirect()->back()->with('success','User suspendu avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    public function paginationFiltre(Request $request): \Illuminate\Http\JsonResponse
    {
        $extraQuery = User::where(function($query) use ($request) {

            foreach ($request->filters as $filter)
            {
                $query->where($filter['id'],'like', "%".$filter['value']."%");
            }

            if($request->globalFilter)
            {
                $query->where('nom','like', "%".$request->globalFilter."%")->orWhere('prenom','like', "%".$request->globalFilter."%")->orWhere('email','like', "%".$request->globalFilter."%");
            }

        })->skip($request->start)->take($request->size);

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

        $users = $extraQuery->with('roles.permissions')->get();

        $rowCount = $extraQuery->paginate($request->size)->total();

        return response()->json( ['data'=>$users,'rowCount'=>$rowCount]);
    }
}
