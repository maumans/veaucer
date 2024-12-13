<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\CategorieProduit;
use App\Models\TypeOperation;
use App\Models\TypeProduit;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            RolePermissionSeeder::class,
            ReferentielSeeder::class,
            TypeSocieteSeeder::class,
            SocieteSeeder::class,
            FournisseurSeeder::class,
            TypeProduitSeeder::class,
            CategorieProduitSeeder::class,
            MotifSeeder::class,
            TypeOperationSeeder::class,
            //FastSeeder::class
        ]);

    }
}
