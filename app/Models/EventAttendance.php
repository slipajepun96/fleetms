<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class EventAttendance extends Model
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

    protected $fillable = [
        'event_id',
        'participant_name',
        'participant_nric',
        'participant_entity',
        'participant_designation',
        'participant_attendance_datetime',
    ];
}
