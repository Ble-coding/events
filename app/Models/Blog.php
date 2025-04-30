<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'excerpt',
        'content',
        'date',
        'is_active',
        'category_id',
        'url', 'type'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'date' => 'date',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}

