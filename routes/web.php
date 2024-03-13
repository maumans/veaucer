<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {

    return redirect()->route('login');

    /*return Inertia::render('/Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);*/
});

Route::get('/dashboard', function () {

    return Inertia::render('SuperAdmin/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get("/profil",[\App\Http\Controllers\ProfilController::class,"index"])->name("profil");
    Route::get("/profil/{roleUser}connect",[\App\Http\Controllers\ProfilController::class,"connect"])->name("profil.connect");
});

///SUPER ADMIN
Route::middleware(['auth',"userIsSuperAdmin","profilActif"])->group(function () {
    Route::resource('superAdmin.referentiel', \App\Http\Controllers\SuperAdmin\ReferentielController::class);

    Route::resource('superAdmin.role', \App\Http\Controllers\SuperAdmin\RoleController::class);
    Route::resource('superAdmin.user', \App\Http\Controllers\SuperAdmin\UserController::class);
    Route::resource('superAdmin.typeSouscripteur', \App\Http\Controllers\SuperAdmin\TypeSouscripteurController::class);
    Route::post('superAdmin/typeSouscripteur/paginationFiltre',[\App\Http\Controllers\SuperAdmin\TypeSouscripteurController::class,'paginationFiltre'])->name('superAdmin.typeSouscripteur.paginationFiltre');

    Route::resource('superAdmin.categorieSouscripteur', \App\Http\Controllers\SuperAdmin\CategorieSouscripteurController::class);
    Route::post('superAdmin/categorieSouscripteur/paginationFiltre',[\App\Http\Controllers\SuperAdmin\CategorieSouscripteurController::class,'paginationFiltre'])->name('superAdmin.categorieSouscripteur.paginationFiltre');

    Route::resource('superAdmin.souscripteur', \App\Http\Controllers\SuperAdmin\SouscripteurController::class);
    Route::post('superAdmin/souscripteur/paginationFiltre',[\App\Http\Controllers\SuperAdmin\SouscripteurController::class,'paginationFiltre'])->name('superAdmin.souscripteur.paginationFiltre');

    Route::resource('superAdmin.garantie', \App\Http\Controllers\SuperAdmin\GarantieController::class);
    Route::post('superAdmin/garantie/paginationFiltre',[\App\Http\Controllers\SuperAdmin\GarantieController::class,'paginationFiltre'])->name('superAdmin.garantie.paginationFiltre');

    Route::resource('superAdmin.affection', \App\Http\Controllers\SuperAdmin\AffectionController::class);
    Route::post('superAdmin/affection/paginationFiltre',[\App\Http\Controllers\SuperAdmin\AffectionController::class,'paginationFiltre'])->name('superAdmin.affection.paginationFiltre');

    Route::resource('superAdmin.parametre', \App\Http\Controllers\SuperAdmin\ParametreController::class);
    Route::resource('superAdmin.devise', \App\Http\Controllers\SuperAdmin\DeviseController::class);

    Route::resource('superAdmin.societe', \App\Http\Controllers\SuperAdmin\SocieteController::class);
    Route::post('superAdmin/societe/paginationFiltre',[\App\Http\Controllers\SuperAdmin\SocieteController::class,'paginationFiltre'])->name('superAdmin.societe.paginationFiltre');


    Route::resource('superAdmin.typeSociete', \App\Http\Controllers\SuperAdmin\TypeSocieteController::class);
    Route::post('superAdmin/typeSociete/paginationFiltre',[\App\Http\Controllers\SuperAdmin\TypeSocieteController::class,'paginationFiltre'])->name('superAdmin.typeSociete.paginationFiltre');

    Route::get("superAdmin/{id}/dashboard/",function(){
        return Inertia::render('SuperAdmin/Dashboard');
    })->name("superAdmin.dashboard");

});

Route::middleware(['auth',"userIsAdmin","profilActif"])->group(function () {
    Route::get("admin/{id}/dashboard/",[\App\Http\Controllers\Admin\DashboardController::class,'index'])->name("admin.dashboard");
    Route::post("admin/{id}/dashboard/filterDate",[\App\Http\Controllers\Admin\DashboardController::class,'filterDate'])->name("admin.dashboard.filterDate");

    Route::resource('admin.produit', \App\Http\Controllers\Admin\ProduitController::class);
    Route::post('admin/produit/paginationFiltre',[\App\Http\Controllers\Admin\ProduitController::class,'paginationFiltre'])->name('admin.produit.paginationFiltre');

    ///STOCK
    Route::resource('admin.stockInventaire', \App\Http\Controllers\Admin\Stock\InventaireController::class);
    Route::post('admin/stockInventaire/paginationFiltre',[\App\Http\Controllers\Admin\Stock\InventaireController::class,'paginationFiltre'])->name('admin.stockInventaire.paginationFiltre');

    Route::resource('admin.stockAppro', \App\Http\Controllers\Admin\Stock\ApproController::class);
    Route::post('admin/stockAppro/paginationFiltre',[\App\Http\Controllers\Admin\Stock\ApproController::class,'paginationFiltre'])->name('admin.stockAppro.paginationFiltre');

    Route::resource('admin.fournisseur', \App\Http\Controllers\Admin\FournisseurController::class);
    Route::post('admin/fournisseur/paginationFiltre',[\App\Http\Controllers\Admin\FournisseurController::class,'paginationFiltre'])->name('admin.fournisseur.paginationFiltre');

    ///VENTE
    Route::resource('admin.vente', \App\Http\Controllers\Admin\VenteController::class);
    Route::post('admin/vente/paginationFiltre',[\App\Http\Controllers\Admin\VenteController::class,'paginationFiltre'])->name('admin.vente.paginationFiltre');

    Route::resource('admin.paiement', \App\Http\Controllers\Admin\PaiementController::class);
    Route::post('admin/paiement/paginationFiltre',[\App\Http\Controllers\Admin\PaiementController::class,'paginationFiltre'])->name('admin.paiement.paginationFiltre');

    Route::resource('admin.departement', \App\Http\Controllers\Admin\DepartementController::class);
    Route::post('admin/departement/paginationFiltre',[\App\Http\Controllers\Admin\DepartementController::class,'paginationFiltre'])->name('admin.departement.paginationFiltre');

    Route::resource('admin.service', \App\Http\Controllers\Admin\ServiceController::class);
    Route::post('admin/service/paginationFiltre',[\App\Http\Controllers\Admin\ServiceController::class,'paginationFiltre'])->name('admin.service.paginationFiltre');

    Route::resource('admin.employe', \App\Http\Controllers\Admin\EmployeController::class);
    Route::post('admin/employe/paginationFiltre',[\App\Http\Controllers\Admin\EmployeController::class,'paginationFiltre'])->name('admin.employe.paginationFiltre');

    Route::resource('admin.stock', \App\Http\Controllers\Admin\StockController::class);
    Route::post('admin/stock/paginationFiltre',[\App\Http\Controllers\Admin\StockController::class,'paginationFiltre'])->name('admin.stock.paginationFiltre');

    Route::resource('admin.caisse', \App\Http\Controllers\Admin\CaisseController::class);
    Route::post('admin/caisse/paginationFiltre',[\App\Http\Controllers\Admin\CaisseController::class,'paginationFiltre'])->name('admin.caisse.paginationFiltre');

    Route::resource('admin.devise', \App\Http\Controllers\Admin\DeviseController::class);
    Route::post('admin/devise/paginationFiltre',[\App\Http\Controllers\Admin\DeviseController::class,'paginationFiltre'])->name('admin.devise.paginationFiltre');

    Route::resource('admin.typePrix', \App\Http\Controllers\Admin\TypePrixController::class);
    Route::post('admin/typePrix/paginationFiltre',[\App\Http\Controllers\Admin\TypePrixController::class,'paginationFiltre'])->name('admin.typePrix.paginationFiltre');

    Route::resource('admin.client', \App\Http\Controllers\Admin\ClientController::class);
    Route::post('admin/client/paginationFiltre',[\App\Http\Controllers\Admin\ClientController::class,'paginationFiltre'])->name('admin.client.paginationFiltre');

});


///CLIENT
Route::middleware(['auth',"userIsClient","profilActif"])->group(function () {

});

require __DIR__.'/auth.php';
