<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $total=Role::count();
        $actif=Role::where('status',true)->count();
        $inactif=Role::where('status',false)->count();

        $roles=Role::with('permissions')->paginate(10);

        return Inertia::render('Role/Index',[
            'roles'=>$roles,"total"=>$total,"inactif"=>$inactif,"actif"=>$actif,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $total=Role::count();
        $actif=Role::where('status',true)->count();
        $inactif=Role::where('status',false)->count();

        $permissionsSt=Permission::where('status',true)->get()->groupBy('groupe');

        $permissions=collect();

        foreach ($permissionsSt as $key => $value)
        {
            $permissions->push([
                'groupe' => $key,
                "liste"=>$value
            ]);
        }

        return Inertia::render('Role/Create',[
            "total"=>$total,"inactif"=>$inactif,"actif"=>$actif,"permissions"=>$permissions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255','unique:roles'],
            'libelle' => ['required', 'string', 'max:255','unique:roles'],
        ]);

        DB::beginTransaction();

        try {
            $role=Role::create([
                'name' => $request->name,
                'libelle' => $request->libelle,
                'slug' => strtolower($request->name),
            ]);

            foreach ($request->permissions as $permission)
            {
                if($permission['status'])
                {
                    $role->givePermissionTo(Permission::find($permission['id'])->name);
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Role créé avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {

        return Inertia::render('Role/Show',['user'=>$role]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        $total=Role::count();
        $actif=Role::where('status',true)->count();
        $inactif=Role::where('status',false)->count();

        $role = Role::where('id',$role->id)->with('permissions')->first();

        $permissionsSt=Permission::where('status',true)->get()->groupBy('groupe');

        $permissions=collect();

        foreach ($permissionsSt as $key => $value)
        {
            $permissions->push([
                'groupe' => $key,
                "liste"=>$value
            ]);
        }
        return Inertia::render('Role/Edit',[
            "role"=>$role,"total"=>$total,"inactif"=>$inactif,"actif"=>$actif,"permissions"=>$permissions
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255',Rule::unique("roles")->ignore($role->id,'id')],
            'libelle' => ['required', 'string', 'max:255',Rule::unique("roles")->ignore($role->id,'id')]
        ]);

        DB::beginTransaction();

        try {

            $role->update([
                "name" => $request->name,
                'libelle' => $request->libelle,
                'slug' => strtolower($request->name),
            ]);

            foreach ($request->permissions as $permission)
            {
                if($permission['status'])
                {
                    $role->givePermissionTo(Permission::find($permission['id'])->name);
                }
                else
                {
                    $role->revokePermissionTo(Permission::find($permission['id'])->name);
                }
            }

            DB::commit();

            return redirect()->back()->with("success", "Role modifié avec succès");

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        DB::beginTransaction();

        try {
            $role->status = !$role->status;

            $role->save();

            DB::commit();

            return redirect()->back()->with('success','Role suspendu avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    public function paginationFiltre(Request $request): \Illuminate\Http\JsonResponse
    {
        $extraQuery = Role::where(function($query) use ($request) {

            foreach ($request->filters as $filter)
            {
                $query->where($filter['id'],'like', "%".$filter['value']."%");
            }

            if($request->globalFilter)
            {
                $query->where('name','like', "%".$request->globalFilter."%");
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

        $roles = $extraQuery->with('permissions')->get();

        $rowCount = $extraQuery->paginate($request->size)->total();

        return response()->json( ['data'=>$roles,'rowCount'=>$rowCount]);
    }
}
