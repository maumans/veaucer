<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\RoleUser;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("users")->delete();

        DB::table("roles")->delete();

        $userSuperAdmin=User::create([
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

        $superAdmin=Role::create([
            'nom'=>'superAdmin',
            'libelle'=>'Super administrateur',
            ]
        );

        $admin=Role::create([
            'nom'=>'admin',
            'libelle'=>'Administrateur',
            ]
        );

        $employe=Role::create([
            'nom'=>'employe',
            'libelle'=>'Employé',
            ]
        );

        $client=Role::create([
            'nom'=>'client',
            'libelle'=>'Client',
            ]
        );

        RoleUser::create([
            'user_id'=>$userSuperAdmin->id,
            'role_id'=>$superAdmin->id,
        ]);

    }
}
