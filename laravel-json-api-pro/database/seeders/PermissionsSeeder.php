<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        DB::table('permissions')->truncate();
        DB::table('role_has_permissions')->truncate();
        DB::table('model_has_permissions')->truncate();
        DB::table('model_has_roles')->truncate();
        DB::table('roles')->truncate();
        Schema::enableForeignKeyConstraints();

        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // User permissions
        Permission::create(['name' => 'view users']);
        Permission::create(['name' => 'create users']);
        Permission::create(['name' => 'edit users']);
        Permission::create(['name' => 'delete users']);

        // Role permissions
        Permission::create(['name' => 'view roles']);
        Permission::create(['name' => 'create roles']);
        Permission::create(['name' => 'edit roles']);
        Permission::create(['name' => 'delete roles']);

        // Permissions permissions
        Permission::create(['name' => 'view permissions']);

        // Category permissions
        Permission::create(['name' => 'view categories']);
        Permission::create(['name' => 'create categories']);
        Permission::create(['name' => 'edit categories']);
        Permission::create(['name' => 'delete categories']);

        // Tag permissions
        Permission::create(['name' => 'view tags']);
        Permission::create(['name' => 'create tags']);
        Permission::create(['name' => 'edit tags']);
        Permission::create(['name' => 'delete tags']);

        // Item permissions
        Permission::create(['name' => 'view items']);
        Permission::create(['name' => 'create items']);
        Permission::create(['name' => 'edit items']);
        Permission::create(['name' => 'delete items']);

        /** @var \Spatie\Permission\Models\Role $role */
        $role = Role::create(['name' => 'admin']);
        $role->givePermissionTo(Permission::all());

        /** @var \Spatie\Permission\Models\Role $role */
        $role = Role::create(['name' => 'creator']);
        $role->givePermissionTo([
            'view categories',
            'create categories',
            'edit categories',
            'delete categories',

            'view tags',
            'create tags',
            'edit tags',
            'delete tags',

            'view items',
            'create items',
            'edit items',
            'delete items',
        ]);

        /** @var \Spatie\Permission\Models\Role $role */
        $role = Role::create(['name' => 'member']);
        $role->givePermissionTo([
            'view categories',
            'view tags',
            'view items',
        ]);
    }
}
