<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;


class Service extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['title', 'type_id', 'description', 'image'];

    public function type()
    {
        return $this->belongsTo(ServiceType::class, 'type_id');
    }
}


