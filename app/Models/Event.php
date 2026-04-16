<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class Event extends Model
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
        'event_name',
        'event_date',
        'event_venue',
        'event_description',
        'event_participant_entity_organisation',
        'event_creator_id',
        'event_status',
        'is_closed',
        'is_active',
    ];
}
