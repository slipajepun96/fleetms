<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class VehicleUsage extends Authenticatable
{
    use HasFactory, Notifiable;
    
    protected $keyType = 'string'; // Set the key type to UUID
    public $incrementing = false; // Disable auto-incrementing
   
    public static function booted()
    {
        static::creating(function($model)
        {
            $model->id = Str::uuid();
        });
    }
    /** @use HasFactory<\Database\Factories\UserFactory> */

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_uuid',
        'vehicle_uuid',
        'start_date',
        'end_date',
        'actual_start_datetime',
        'actual_end_datetime',
        'destination',
        'purpose',
        'status',
        'application_status',
        'approver_uuid',
        'approver_status_datetime',
        'start_odometer',
        'end_odometer',
        'fuel_purchase',
        'notes_on_return',
        'return_datetime',
        'return_user_uuid',
    ];
}
