<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // 1. Laravel ko batayein ki table mein Primary Key 'ID' hai (Capital)
    protected $primaryKey = 'ID';

    // 2. Agar aapki table ka naam 'users' nahi kuch aur hai, toh niche line uncomment karein:
    // protected $table = 'your_table_name';

    /**
     * The attributes that are mass assignable.
     */
    const CREATED_AT = 'CreatedDtTm';
    const UPDATED_AT = 'ModifiedDtTm';
    protected $fillable = [
        'Name',         // Capital 'N'
        'Email',        // Capital 'E'
        'Phone',        // Capital 'P' (Critical Fix)
        'ProfileImage', // Capital 'P'
        'Password',     // Capital 'P'
        'CreatedDtTm',  // Optional: Agar aap manual bhar rahe ho
        'ModifiedDtTm'
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'Password',  // Capital 'P'
        'remember_token',
    ];

    /**
     * ✅ Laravel ko batayein ki password kis column mein hai
     */
    public function getAuthPassword()
    {
        return $this->Password;
    }

    /**
     * ✅ Laravel ko batayein ki primary key ka naam 'ID' hai
     */
    public function getAuthIdentifierName()
    {
        return 'ID';
    }

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'Password' => 'hashed', // Ensure capital 'P'
        ];
    }
}
