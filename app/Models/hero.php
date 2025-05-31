<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hero extends Model
{
    /** @use HasFactory<\Database\Factories\HeroFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'button1_text',
        'button1_href',
        'button2_text',
        'button2_href',
        'url',
    ];
}
