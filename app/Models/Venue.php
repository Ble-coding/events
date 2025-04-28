<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Venue extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'capacity',
        'location',
        'url',
        'type',
        'description',
        'features',
        'availables',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'availables' => 'array',
        'is_active' => 'boolean',
    ];
}
