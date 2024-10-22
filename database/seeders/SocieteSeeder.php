<?php

namespace Database\Seeders;

use App\Models\Caisse;
use App\Models\Departement;
use App\Models\Role;
use App\Models\RoleUser;
use App\Models\Societe;
use App\Models\TypeSociete;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SocieteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $typeSociete=TypeSociete::where('nom','duplex')->first();

        $societe=Societe::create([
            "nom" => "Les îles Maurice",
            "adresse" => 'Kountia CBA',
            "description" => "Plein air - Restaurant - Bar en bordure de mer",
            "telephone1" => "621993863",
            "telephone2" => "623150482",
            "adresseMail" => "mansaremaurice100@gmail.com",
            "solde" => 15000000,
            "type_societe_id" => $typeSociete->id,
        ]);

        $user = User::create([
            "nom" => 'Mansaré',
            "prenom" => "Maurice",
            "email" => 'mansaremaurice100@gmail.com',
            "login" => "adminMau",
            "password" => Hash::make("12345678"),
            "adresse" => "Kountia CBA",
            "telephone" => "621993863",
        ]);

        $userPierre=User::create([
            'prenom' =>'Pierre',
            'nom' =>'Mansaré',
            'login' =>'pimans',
            'email' =>'piman75@gmail.com',
            'password' =>Hash::make("12345678"),
            "adresse" => "Kountia CBA",
            "telephone" => "623150482",
        ]);

        $role = Role::where("name", "admin")->first();


        RoleUser::create([
            "user_id" => $user->id,
            "societe_id" => $societe->id,
            "role_id" => $role->id
        ]);

        $caissePrincipale=Caisse::create([
            "solde" =>15000000,
            "user_id"=>$user->id,
            "type"=>'PRINCIPAL',
            "societe_id"=>$societe->id
        ]);

        $departementPrincipal=Departement::create([
            "nom" =>'principal',
            "description" =>'Département principal',
            "user_id"=>$user->id,
            "type"=>'PRINCIPAL',
            "telephone" => '621993863',
            "societe_id"=>$societe->id,
        ]);

        $caissePrincipale->departement_id=$departementPrincipal->id;
        $societe->caisse_principale_id=$caissePrincipale->id;
        $societe->departement_principal_id=$departementPrincipal->id;

        $caissePrincipale->save();
        $societe->save();

        $user->societeAdmin()->associate($societe)->save();
        $userPierre->societeAdmin()->associate($societe)->save();

    }
}
