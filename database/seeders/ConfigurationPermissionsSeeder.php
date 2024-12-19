<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class ConfigurationPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Configuration permissions
        $configurationPermissions = [
            'display-societe-configuration',
            'edit-societe-configuration',
        ];

        // Theme permissions
        $themePermissions = [
            'display-societe-themes',
            'create-societe-themes',
            'edit-societe-themes',
            'delete-societe-themes',
        ];

        // Create permissions
        $allPermissions = array_merge($configurationPermissions, $themePermissions);
        foreach ($allPermissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Assign permissions to SuperAdmin role
        $superAdminRole = Role::findByName('SuperAdmin');
        $superAdminRole->givePermissionTo($allPermissions);
    }
}
