<?php

namespace Database\Seeders;

use App\Models\RoleUser;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("users")->delete();

        DB::table("roles")->delete();

        DB::table("permissions")->delete();

        $user=User::create([
            'prenom' =>'Maurice',
            'nom' =>'Mansaré',
            'login' =>'milesmau',
            'email' =>'mansaremaurice10@gmail.com',
            'password' =>Hash::make("12345678"),
        ]);

        ///////////////////////////////
        /// USERS

        Permission::create([
            'name' => 'display-users',
            'libelle' => 'Affichage des utilisateurs',
            'groupe' => 'utilisateur',
        ]);

        Permission::create([
            'name' => 'create-users',
            'libelle' => 'Créer un utilisateur',
            'groupe' => 'utilisateur',
        ]);
        Permission::create([
            'name' => 'show-users',
            'libelle' => 'Voir un utilisateur',
            'groupe' => 'utilisateur',
        ]);
        Permission::create([
            'name' => 'edit-users',
            'libelle' => 'Modifier un utilisateur',
            'groupe' => 'utilisateur',
        ]);
        Permission::create([
            'name' => 'delete-users',
            'libelle' => 'Supprimer un utilisateur',
            'groupe' => 'utilisateur',
        ]);

        ////////////////////////////////
        /// ROLES

        Permission::create([
            'name' => 'display-roles',
            'libelle' => 'Affichage des roles',
            'groupe' => 'role',
        ]);
        Permission::create([
            'name' => 'create-roles',
            'libelle' => 'Créer un role',
            'groupe' => 'role',
        ]);
        Permission::create([
            'name' => 'show-roles',
            'libelle' => 'Voir un role',
            'groupe' => 'role',
        ]);
        Permission::create([
            'name' => 'edit-roles',
            'libelle' => 'Modifier un role',
            'groupe' => 'role',
        ]);

        Permission::create([
            'name' => 'delete-roles',
            'libelle' => 'Suppimer un role',
            'groupe' => 'role',
        ]);

        ////////////////////////////////
        /// SOCIETE

        Permission::create([
            'name' => 'display-societes',
            'libelle' => 'Affichage des sociétés',
            'groupe' => 'societe',
        ]);
        Permission::create([
            'name' => 'create-societes',
            'libelle' => 'Créer une société',
            'groupe' => 'societe',
        ]);
        Permission::create([
            'name' => 'show-societes',
            'libelle' => 'Voir une société',
            'groupe' => 'societe',
        ]);
        Permission::create([
            'name' => 'edit-societes',
            'libelle' => 'Modifier une société',
            'groupe' => 'societe',
        ]);

        Permission::create([
            'name' => 'delete-societes',
            'libelle' => 'Suppimer une société',
            'groupe' => 'societe',
        ]);

        ////////////////////////////////
        /// Dashboard
        Permission::create([
            'name' => 'display-dashboard',
            'libelle' => 'Affichage du dashboard',
            'groupe' => 'dashboard',
        ]);

        Permission::create([
            'name' => 'display-dashboard-super-admin',
            'libelle' => 'Affichage du dashboard super admin',
            'groupe' => 'dashboard',
        ]);

        Permission::create([
            'name' => 'display-dashboard-admin',
            'libelle' => 'Affichage du dashboard admin',
            'groupe' => 'dashboard',
        ]);

        Permission::create([
            'name' => 'display-dashboard-comptable',
            'libelle' => 'Affichage du dashboard comptable',
            'groupe' => 'dashboard',
        ]);

        Permission::create([
            'name' => 'display-dashboard-employes',
            'libelle' => 'Affichage du dashboard employé',
            'groupe' => 'dashboard',
        ]);

        ////////////////////////////////
        /// Referentiels
        Permission::create([
            'name' => 'display-referentiels',
            'libelle' => 'Affichage des référentiels',
            'groupe' => 'référentiel',
        ]);

        $superAdmin = Role::create(['name' => 'SuperAdmin','libelle' => 'super admin','slug' => 'super-admin']);
        $admin = Role::create(['name' => 'Admin','libelle' => 'admin','slug' => 'admin']);
        $comptable = Role::create(['name' => 'Comptable','libelle' => 'comptable','slug' => 'comptable']);
        $employe = Role::create(['name' => 'Employe','libelle' => 'employé','slug' => 'employe']);

        $superAdmin->givePermissionTo([

            ///DASHBOARD
            'display-dashboard',
            'display-dashboard-super-admin',

            ///USER
            'display-users',
            'create-users',
            'edit-users',
            'delete-users',

            ///ROLES
            'display-roles',
            'create-roles',
            'edit-roles',
            'delete-roles',

            ///REFERENTIELS
            'display-referentiels',

            ///SOCIETE
            'display-societes',
            'create-societes',
            'show-societes',
            'edit-societes',
            'delete-societes',

        ]);

        $admin->givePermissionTo([
            ///DASHBOARD
            'display-dashboard',
            'display-dashboard-admin',
            ///USER
            'display-users',
            'create-users',
            'edit-users',
            'delete-users',
            ///ROLES
            'display-roles',
            //'create-roles',
            //'edit-roles',
            //'delete-roles',

            ///REFERENTIELS
            'display-referentiels'
        ]);

        $comptable->givePermissionTo([
            ///DASHBOARD
            'display-dashboard',
            'display-dashboard-comptable',
        ]);

        $employe->givePermissionTo([
            ///DASHBOARD
            'display-dashboard',
            'display-dashboard-employe',
        ]);


        RoleUser::create([
            'user_id'=>$user->id,
            'role_id'=>$superAdmin->id,
        ]);


        $user->assignRole($superAdmin);
        $user->assignRole($admin);
    }
}
