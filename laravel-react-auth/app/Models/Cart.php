<?php

namespace App\Models;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    //
    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'totalPrice'
    ];

    public function users(){
        return $this->belongsTo(User::class, 'user_id');
    }
    public function products(){
        return $this->belongsTo(Product::class, "product_id");
    }
    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
    public function product(){
        return $this->belongsTo(Product::class, "product_id");
    }
}