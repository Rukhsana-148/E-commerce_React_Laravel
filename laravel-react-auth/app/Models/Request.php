<?php

namespace App\Models;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    //
    protected $fillable = [
        'user_id',
        
    ];
    public function users(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
