<?php

namespace App\Models;
use App\Models\Cart;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    // The table associated with the model
    protected $table = 'products';

    // The attributes that are mass assignable
    protected $fillable = ['name', 'description','image', 'price', 'quantity', 'mainType', 'type', 'user_name', 'rating', 'comment', 'reason', 'amount'];
 
    // If using soft deletes
    protected $dates = ['deleted_at'];
    public function carts()
    {
        return $this->hasMany(Cart::class, 'product_id');
    }
    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
   
}
