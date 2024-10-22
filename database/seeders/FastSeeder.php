<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class FastSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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

        /*$superAdmin = Role::where('name', 'SuperAdmin')->first();

        $admin = Role::where('name', 'Admin')->first();

        $manager = Role::where('name', 'Manager')->first();

        $manager->givePermissionTo([
            // Permissions for options
            'transformer-en-devis',
            ]);*/
    }
}
