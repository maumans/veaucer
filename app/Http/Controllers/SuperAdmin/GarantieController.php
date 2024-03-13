<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Garantie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GarantieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $garanties = Garantie::/*where('status', true)->*/orderBy('libelle')->paginate(10);

        return Inertia::render('SuperAdmin/Garantie/Index',[
            'garanties' => $garanties
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
            'libelle' => 'required',
            'type' => 'required',
        ]);

        DB::beginTransaction();

        try {

            Garantie::create([
                "libelle" => $request->libelle,
                "slug" => $request->slug,
                "base" => $request->type == 'base',
            ]);

            DB::commit();

            return redirect()->back()->with('success','Garantie ajoutée avec succès');
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
    public function update(Request $request, Garantie $garantie)
    {
        $request->validate([
            'libelle' => 'required',
            'type' => 'required',
        ]);

        DB::beginTransaction();

        try {

            $garantie->update([
                "libelle" => $request->libelle,
                "slug" => $request->slug,
                "type" => $request->type,
            ]);

            DB::commit();

            return redirect()->back()->with('success','Garantie modifiée avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Garantie $garantie)
    {
        DB::beginTransaction();

        try {
            $garantie->status= !$garantie->status;

            $garantie->save();

            DB::commit();

            return redirect()->back()->with('success','Garantie suspendue avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }

    }

    public function paginationFiltre(Request $request): \Illuminate\Http\JsonResponse
    {
        $extraQuery = Garantie::where(function($query) use ($request) {

            foreach ($request->filters as $filter)
            {
                $query->orWhere($filter['id'],'like', "%".$filter['value']."%");
            }


            if($request->globalFilter)
            {
                $query->where('libelle','like', "%".$request->globalFilter."%")->orWhere('slug','like', "%".$request->globalFilter."%");
            }

        })/*->where('status', true)*/->skip($request->start)->take($request->size);

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

        $garanties = $extraQuery->get();
        $rowCount = $extraQuery->paginate($request->size)->total();

        return response()->json( ['data'=>$garanties,'rowCount'=>$rowCount,"request"=>$request->all()]);
    }
}
