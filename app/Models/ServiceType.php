<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceType extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name','description'];

    public function services()
    {
        return $this->hasMany(Service::class, 'type_id');
    }
}



