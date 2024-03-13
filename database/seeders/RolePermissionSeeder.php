<?php

namespace Database\Seeders;

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

        $userAdmin=User::create([
            'prenom' =>'Pierre',
            'nom' =>'Mansaré',
            'login' =>'pimans',
            'email' =>'piman75@gmail.com',
            'password' =>Hash::make("12345678"),
        ]);

        Permission::create([
            'name' => 'create-users',
            'libelle' => 'Créer un utilisateur',
        ]);
        Permission::create([
            'name' => 'edit-users',
            'libelle' => 'Modifier un utilisateur',
        ]);
        Permission::create([
            'name' => 'delete-users',
            'libelle' => 'Supprimer un utilisateur',
            ]);

        Permission::create([
            'name' => 'create-roles',
            'libelle' => 'Créer un role',
            ]);
        Permission::create([
            'name' => 'edit-roles',
            'libelle' => 'Modifier un role',
        ]);

        Permission::create([
            'name' => 'delete-roles',
            'libelle' => 'Suppimer un role',
        ]);

        $superAdmin = Role::create(['name' => 'SuperAdmin']);
        $admin = Role::create(['name' => 'Admin']);

        $superAdmin->givePermissionTo([
            'create-users',
            'edit-users',
            'delete-users',
            'create-roles',
            'edit-roles',
            'delete-roles',
        ]);

        $admin->givePermissionTo([
            'create-users',
            'edit-users',
            'delete-users',
        ]);

        $user->assignRole($superAdmin);
        $user->assignRole($admin);
        $userAdmin->assignRole($admin);
    }
}
