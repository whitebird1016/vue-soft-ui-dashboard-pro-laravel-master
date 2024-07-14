<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use App\Notifications\Auth\ResetPasswordNotification;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int                                                         $id
 * @property string                                                      $name
 * @property string                                                      $email
 *
 * @property \Illuminate\Database\Eloquent\Collection|\App\Models\Role[] $roles
 *
 * @method static \Illuminate\Database\Eloquent\Model|self create(array $attributes = [])
 */
class User extends Authenticatable
{
    use HasApiTokens, HasRoles, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'profile_image'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }

    public function password(): Attribute
    {
        return Attribute::make(
            set: fn(string $value) => Hash::make($value)
        );
    }

    /**
     * Send the password reset notification.
     *
     * @param string $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    public function scopeName(Builder $query, string $value): Builder
    {
        return $query->where('users.name', 'LIKE', "%{$value}%", 'or');
    }

    public function scopeEmail(Builder $query, string $value): Builder
    {
        return $query->where('users.email', 'LIKE', "%{$value}%", 'or');
    }

    public function scopeRoles(Builder $query, string $value): Builder
    {
        return $query->orWhereHas('roles', function ($query) use ($value) {
            $query->where('roles.name', 'LIKE', "%$value%");
        });
    }

    /**
     * @return bool|null
     * @throws \Exception
     */
    public function delete(): bool|null
    {
        if ($this->id === auth()->id()) {
            // @todo Should be ConstraintException
            throw new Exception('You cannot delete yourself.');
        }

        return parent::delete();
    }
}
