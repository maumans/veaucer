<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Affection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AffectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $affections = Affection::/*where('status', true)->*/orderBy('nom')->paginate(10);

        return Inertia::render('SuperAdmin/Affection/Index',[
            'affections' => $affections
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
            'nom' => 'required',
            'code' => 'required',
        ]);

        DB::beginTransaction();

        try {

            Affection::create([
                "nom" => $request->nom,
                "code" => $request->code,
                "slug" => $request->slug,
            ]);

            DB::commit();

            return redirect()->back()->with('success','Affection ajouté avec succès');
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
    public function update(Request $request, Affection $affection)
    {
        $request->validate([
            'nom' => 'required',
            'code' => 'required',
        ]);

        DB::beginTransaction();

        try {

            $affection->update([
                "nom" => $request->nom,
                "code" => $request->code,
                "slug" => $request->slug,
            ]);

            DB::commit();

            return redirect()->back()->with('success','Affection modifié avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Affection $affection)
    {
        DB::beginTransaction();

        try {
            $affection->status= !$affection->status;

            $affection->save();

            DB::commit();

            return redirect()->back()->with('success','Affection suspendu avec succès');

        }
        catch (\Exception $e) {
            DB::rollBack();
            dd($e->getMessage());

        }

    }

    public function paginationFiltre(Request $request): \Illuminate\Http\JsonResponse
    {
        $extraQuery = Affection::where(function($query) use ($request) {

            foreach ($request->filters as $filter)
            {
                $query->orWhere($filter['id'],'like', "%".$filter['value']."%");
            }


            if($request->globalFilter)
            {
                $query->where('nom','like', "%".$request->globalFilter."%")->orWhere('slug','like', "%".$request->globalFilter."%");
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

        $affections = $extraQuery->get();
        $rowCount = $extraQuery->paginate($request->size)->total();

        return response()->json( ['data'=>$affections,'rowCount'=>$rowCount,"request"=>$request->all()]);
    }
}
