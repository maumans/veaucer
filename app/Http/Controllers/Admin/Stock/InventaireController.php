<?php

namespace App\Http\Controllers\Admin\Stock;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Categorie;
use App\Models\TypeProduit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventaireController extends Controller
{
    public function index()
    {
        $produits = Produit::where('status', true)->orderBy('nom')->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->paginate(10);


        $typeProduits = TypeProduit::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->orderBy('nom')->get();

        $categories = Categorie::where('status', true)->where(function ($query){
            $query->where("societe_id",session('societe')['id'])->orWhere("societe_id",null);
        })->with('categorie')->orderBy('nom')->get();

        return Inertia::render('Admin/Stock/Inventaire/Index',[
            'produits' => $produits,
            'typeProduits' => $typeProduits,
            'categories' => $categories,
        ]);
    }

    public function paginationFiltre(Request $request): \Illuminate\Http\JsonResponse
    {
        $extraQuery = Produit::where(function($query) use ($request) {

            foreach ($request->filters as $filter)
            {
                if ($filter['id'] == 'typeProduit')
                {
                    $query->whereRelation('typeProduit','nom','like',"%".$filter['value']."%");
                }
                else if($filter['id'] == 'categorie')
                {
                    $query->whereRelation('categorie','nom','like',"%".$filter['value']."%");
                }
                else if($filter['id'] == 'fournisseur')
                {
                    $query->whereRelation('fournisseurPrincipal','nom','like',"%".$filter['value']."%");
                }
                else
                {
                    $query->where($filter['id'],'like', "%".$filter['value']."%");
                }
            }

            if($request->globalFilter)
            {
                $query->whereRelation('typeProduit','nom','like', "%".$request->globalFilter."%")->orWhereRelation('categorie','nom','like', "%".$request->globalFilter."%")->orWhereRelation('fournisseurPrincipal','nom','like', "%".$request->globalFilter."%")->orWhere('nom','like', "%".$request->globalFilter."%")->orWhere('stockGlobal','like', "%".$request->globalFilter."%")->orWhere('stockMinimal','like', "%".$request->globalFilter."%");

                /*$colonnes = Schema::getColumnListing('produits'); // Obtient la liste des colonnes de la table 'produits'

                foreach ($colonnes as $colonne) {
                    $query->orWhere($colonne, 'like', "%".$request->globalFilter."%");
                }*/
            }

        })->with('typeProduit','categorie',"fournisseurPrincipal")/*->where('status', true)*/->skip($request->start)->take($request->size);

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

        $produits = $extraQuery->get();
        $rowCount = $extraQuery->paginate($request->size)->total();

        return response()->json( ['data'=>$produits,'rowCount'=>$rowCount]);
    }
}
