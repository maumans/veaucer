<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SuperAdmin\SocieteConfigurationController;
use App\Http\Controllers\SuperAdmin\ThemeController;
use App\Http\Controllers\Admin\PosteController;

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
    Route::get('superAdmin/dashboard/{user}', [\App\Http\Controllers\SuperAdmin\DashboardController::class, 'index'])->name('superAdmin.dashboard');
    
    // Routes de configuration société
    Route::prefix('superAdmin/societe')->name('superAdmin.societe.')->group(function () {
        // Configuration
        Route::get('/configuration/{user}', [SocieteConfigurationController::class, 'index'])
            ->name('configuration.index')
            ->middleware('permission:display-societe-configuration');
        Route::get('/configuration/{societe}/show', [SocieteConfigurationController::class, 'show'])
            ->name('configuration.show')
            ->middleware('permission:display-societe-configuration');
        Route::put('/configuration/{societe}', [SocieteConfigurationController::class, 'update'])
            ->name('configuration.update')
            ->middleware('permission:edit-societe-configuration');

        // Thème
        Route::get('/{societe}/theme', [ThemeController::class, 'index'])
            ->name('theme.index')
            ->middleware('permission:display-societe-themes');
        Route::get('/{societe}/theme/create', [ThemeController::class, 'create'])
            ->name('theme.create')
            ->middleware('permission:create-societe-themes');
        Route::post('/{societe}/theme', [ThemeController::class, 'store'])
            ->name('theme.store')
            ->middleware('permission:create-societe-themes');
        Route::get('/{societe}/theme/{theme}/edit', [ThemeController::class, 'edit'])
            ->name('theme.edit')
            ->middleware('permission:edit-societe-themes');
        Route::put('/{societe}/theme/{theme}', [ThemeController::class, 'update'])
            ->name('theme.update')
            ->middleware('permission:edit-societe-themes');
        Route::delete('/{societe}/theme/{theme}', [ThemeController::class, 'destroy'])
            ->name('theme.destroy')
            ->middleware('permission:delete-societe-themes');
    });

    Route::resource('superAdmin.referentiel', \App\Http\Controllers\SuperAdmin\ReferentielController::class);

    Route::resource('superAdmin.role', \App\Http\Controllers\SuperAdmin\RoleController::class);
    Route::resource('superAdmin.user', \App\Http\Controllers\SuperAdmin\UserController::class);


    Route::resource('superAdmin.parametre', \App\Http\Controllers\SuperAdmin\ParametreController::class);
    Route::resource('superAdmin.devise', \App\Http\Controllers\SuperAdmin\DeviseController::class);

    Route::resource('superAdmin.societe', \App\Http\Controllers\SuperAdmin\SocieteController::class);
    Route::post('superAdmin/{superAdmin}/societe/paginationFiltre',[\App\Http\Controllers\SuperAdmin\SocieteController::class,'paginationFiltre'])->name('superAdmin.societe.paginationFiltre');

    Route::resource('superAdmin.typeSociete', \App\Http\Controllers\SuperAdmin\TypeSocieteController::class);
    Route::post('superAdmin/typeSociete/paginationFiltre',[\App\Http\Controllers\SuperAdmin\TypeSocieteController::class,'paginationFiltre'])->name('superAdmin.typeSociete.paginationFiltre');
});

////////////////////////////////
Route::resource('user',\App\Http\Controllers\UserController::class);
Route::post('user/paginationFiltre',[\App\Http\Controllers\UserController::class,'paginationFiltre'])->name('user.paginationFiltre');
////////////////////////////////
Route::resource('role',\App\Http\Controllers\RoleController::class);
Route::post('role/paginationFiltre',[\App\Http\Controllers\RoleController::class,'paginationFiltre'])->name('role.paginationFiltre');


Route::middleware(['auth',"userIsAdmin","profilActif"])->group(function () {
    Route::get("admin/{id}/dashboard/",[\App\Http\Controllers\Admin\DashboardController::class,'index'])->name("admin.dashboard");
    Route::post("admin/{id}/dashboard/filterDate",[\App\Http\Controllers\Admin\DashboardController::class,'filterDate'])->name("admin.dashboard.filterDate");

    Route::resource('admin.produit', \App\Http\Controllers\Admin\ProduitController::class);
    Route::post('admin/produit/paginationFiltre',[\App\Http\Controllers\Admin\ProduitController::class,'paginationFiltre'])->name('admin.produit.paginationFiltre');

    ///STOCK

    // Routes pour les mouvements de stock
    Route::resource('admin.mouvement', \App\Http\Controllers\Admin\Stock\MouvementController::class);
    Route::get('admin/{userId}/mouvement/{id}/cancel', [\App\Http\Controllers\Admin\Stock\MouvementController::class, 'cancel'])->name('admin.mouvement.cancel');
    Route::get('admin/{userId}/mouvement-dashboard', [\App\Http\Controllers\Admin\Stock\MouvementController::class, 'dashboard'])->name('admin.mouvement.dashboard');


    // Routes pour l'inventaire standard
    Route::resource('admin.stockInventaire', \App\Http\Controllers\Admin\Stock\InventaireController::class);
    Route::post('admin/stockInventaire/paginationFiltre',[\App\Http\Controllers\Admin\Stock\InventaireController::class,'paginationFiltre'])->name('admin.stockInventaire.paginationFiltre');
    
    // Routes pour l'inventaire physique
    Route::prefix('admin/{userId}/inventaire')->name('admin.inventaire.')->group(function () {
        // Inventaire physique
        Route::get('/physique', [\App\Http\Controllers\Admin\Stock\InventairePhysiqueController::class, 'index'])->name('physique.index');
        Route::get('/physique/create', [\App\Http\Controllers\Admin\Stock\InventairePhysiqueController::class, 'create'])->name('physique.create');
        Route::post('/physique', [\App\Http\Controllers\Admin\Stock\InventairePhysiqueController::class, 'store'])->name('physique.store');
        Route::get('/physique/{id}', [\App\Http\Controllers\Admin\Stock\InventairePhysiqueController::class, 'show'])->name('physique.show');
        Route::get('/physique/{id}/edit', [\App\Http\Controllers\Admin\Stock\InventairePhysiqueController::class, 'edit'])->name('physique.edit');
        Route::put('/physique/{id}', [\App\Http\Controllers\Admin\Stock\InventairePhysiqueController::class, 'update'])->name('physique.update');
        
        // Actions spécifiques pour l'inventaire physique
        Route::get('/physique/{id}/demarrer', [\App\Http\Controllers\Admin\Stock\InventairePhysiqueController::class, 'demarrer'])->name('physique.demarrer');
        Route::get('/physique/{id}/terminer', [\App\Http\Controllers\Admin\Stock\InventairePhysiqueController::class, 'terminer'])->name('physique.terminer');
        Route::get('/physique/{id}/annuler', [\App\Http\Controllers\Admin\Stock\InventairePhysiqueController::class, 'annuler'])->name('physique.annuler');
        Route::post('/physique/{inventaireId}/detail/{detailId}/compter', [\App\Http\Controllers\Admin\Stock\InventairePhysiqueController::class, 'compterProduit'])->name('physique.compter');
        Route::post('/physique/{inventaireId}/detail/{detailId}/valider', [\App\Http\Controllers\Admin\Stock\InventairePhysiqueController::class, 'validerProduit'])->name('physique.valider');
        Route::get('/physique/{id}/generer-ajustements', [\App\Http\Controllers\Admin\Stock\InventairePhysiqueController::class, 'genererAjustements'])->name('physique.generer-ajustements');
        
        // Ajustements d'inventaire
        Route::get('/ajustement', [\App\Http\Controllers\Admin\Stock\AjustementInventaireController::class, 'index'])->name('ajustement.index');
        Route::get('/ajustement/create', [\App\Http\Controllers\Admin\Stock\AjustementInventaireController::class, 'create'])->name('ajustement.create');
        Route::post('/ajustement', [\App\Http\Controllers\Admin\Stock\AjustementInventaireController::class, 'store'])->name('ajustement.store');
        Route::get('/ajustement/{id}', [\App\Http\Controllers\Admin\Stock\AjustementInventaireController::class, 'show'])->name('ajustement.show');
        Route::get('/ajustement/{id}/valider', [\App\Http\Controllers\Admin\Stock\AjustementInventaireController::class, 'valider'])->name('ajustement.valider');
        Route::post('/ajustement/{id}/rejeter', [\App\Http\Controllers\Admin\Stock\AjustementInventaireController::class, 'rejeter'])->name('ajustement.rejeter');
    });


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

    // Routes pour les postes
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/admin/poste', [PosteController::class, 'index'])->name('admin.poste.index');
        Route::get('/admin/poste/create', [PosteController::class, 'create'])->name('admin.poste.create');
        Route::post('/admin/poste', [PosteController::class, 'store'])->name('admin.poste.store');
        Route::get('/admin/poste/{poste}/edit', [PosteController::class, 'edit'])->name('admin.poste.edit');
        Route::put('/admin/poste/{poste}', [PosteController::class, 'update'])->name('admin.poste.update');
        Route::delete('/admin/poste/{poste}', [PosteController::class, 'destroy'])->name('admin.poste.destroy');
    });
});

///CLIENT
Route::middleware(['auth',"userIsClient","profilActif"])->group(function () {

});

Route::middleware(['auth'])->group(function () {
    // Suppression des anciennes routes de configuration
});

require __DIR__.'/auth.php';
