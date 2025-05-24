<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use HasFactory, SoftDeletes;

    protected $casts = [
        'social_links' => 'array',
        'phones' => 'array',
    ];


    protected $fillable = [
        'address',
        'phones',
        'email',
        'weekday_hours',
        'saturday_hours',
        'sunday_hours',
        'map_src', // 👈 Ajout du champ ici
        'social_links','text_footer','copyright'
    ];
}
