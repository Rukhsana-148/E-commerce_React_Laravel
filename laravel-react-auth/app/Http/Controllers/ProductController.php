<?php

namespace App\Http\Controllers;
use App\Models\Product;
use App\Models\User;
use App\Models\Cart;
use App\Models\Sell;
use App\Models\AdminRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Add this line
use Illuminate\Support\Facades\Validator;


class ProductController extends Controller
{
    public function addProduct(Request $req){
        $product = new Product;
        $product->name = $req->input('name');
        $product->description = $req->input('desc');
        if ($req->hasFile('image')) {
            $product->image = 'storage/' . $req->file('image')->store('imageStorage', 'public');
        } else {
            // Handle missing image (optional)
            $product->image = null;
        }
          $product->price = $req->input('price');
        $product->quantity = $req->input('qunt');
        $product->type = $req->input('type');
        $product->owner = $req->input('owner');
        $product->save();
        return $product;
      }
  public function showProducts(){
    return Product::orderBy('id', 'desc')->get();
  }
    public function addCart(Request $req){
      $req->validate([
        'user_id' => 'required|exists:users,id',
        'product_id' => [
            'required',
            Rule::unique('carts')->where(function ($query) use ($req) {
                return $query->where('user_id', $req->input('user_id'));
            }),
        ],
    ], [
        'product_id.unique' => 'This product is already in your cart.',
    ]);

    // Create new cart entry
    $cart = new Cart;
    $cart->user_id = $req->input('user_id');
    $cart->product_id = $req->input('product_id');
    $cart->save();
    $totalCartItems = Cart::where('user_id', $req->input('user_id'))->count();

    return response()->json($totalCartItems, 201);
    }
    public function search($key){
        return Product::where('name', 'like', "%$key%")->get();
     }
     public function getType($type){
      return Product::where('type', $type)->get();
     }
     public function allCart($user_id){
      return Cart::where('user_id', $user_id)
               ->with(['users', 'products'])  // Eager load users and products
               ->get();  
               }
     public function totalCart($user_id){
      return Cart::where('user_id', $user_id)->count();
     }
     public function cart($id){
      return Cart::where('id', $id)
               ->with(['users', 'products'])  // Eager load users and products
               ->get();  
               }
     public function sellProduct(Request $req){

      $sell = new Sell;
      $cartId = $req->input('cartId');
      $sell->user_id = $req->input('user_id');
      $sell->product_id = $req->input('product_id');
      $sell->quantity = $req->input('quantity');
      $sell->price = $req->input('price');    
      $sell->save();
      if($sell){
          $delCart = Cart::where('id', $cartId)->delete();
          $product = Product::find($req->input('product_id'));
          $product->quantity = $req->input('remain');
          $product->save();
          if($delCart){
              return $req->input('remain');;
          }
      }

     }
public function myProducts($id){
  return Sell::where('user_id', $id)
               ->with(['users', 'products'])  // Eager load users and products
               ->get();
}

public function delete($id){
  $product = Product::where('id', $id)->delete();
  $cartdelete = Cart::where('product_id', $id)->delete();
  if($product){
   return 'product has been delete';
  }
}
public function getProduct($id){
  return Product::find($id);
}
public function productUpdate(Request $req){
        $id = $req->input('id');
        $product = Product::find($id);
       $product->name = $req->input('name');
       $product->description = $req->input('desc');
       if($req->file('image')){
        $product->image = 'storage/' . $req->file('image')->store('imageStorage', 'public');;
  
    }
       $product->price = $req->input('price');
       $recent =   $product->quantity;
       $product->quantity = $recent+$req->input('qunt');
       $product->type = $req->input('type');
       $product->save();
       return $product;
  }

  public function review(Request $req){
    $id = $req->input('id');
    $product = Product::find($id);

    // Check if product exists
    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }

    // Handle ratings array
    $ratings = $product->rating ? json_decode($product->rating, true) : [];
    $ratings[] = $req->rating;  // Assuming rating is passed as part of the request
    $product->rating = json_encode($ratings);  // Store updated ratings


    if ($req->hasFile('image')) {
       $imagePath = $req->file('image')->store('imageStorage', 'public');
    } else {
      // Handle missing image (optional)
      $imagePath = null;
  }
    // Handle comments array
    $comments = $product->comment ? json_decode($product->comment, true) : [];
    $new_comment = [
        'user_name' => $req->input('name'),
        'comment' => $req->input('comment'),
        'image'=>$imagePath // Assuming comment is passed in the request
    ];
    $comments[] = $new_comment;  // Append the new comment
    $product->comment = json_encode($comments);  // Store updated comments

    // Save the product with updated ratings and comments
    $product->save();

    return response()->json(['message' => 'Review added successfully'], 200);
}
public function deleteCart($id){
  $product = Cart::where('id', $id)->delete();
  if($product){
   return 'Cart has been deleted from your cart list';
  }
}
//inventory

public function inventory($id){
  return Product::where('owner', $id)->get();
} 

public function increaseQuant(Request $req){
  $id = $req->input('id');
  $product = Product::find($id);
  $quant = $product->quantity;
  $product->quantity =  $quant+  $req->input('quantity');
  $product->save();
  return response()->json(['message' => 'Product quantity is increased '], 200);
}

public function getTotalSell($id){
  $sales =Sell::selectRaw('SUM(quantity) as totalQuantity, SUM(price) as totalPrice')
        ->where('product_id', $id)
        ->groupBy('product_id')
        ->first(); // Use `get()` for multiple products

    return response()->json($sales);
}

public function sendRequest(Request $request){

  $validator = Validator::make($request->all(), [

    'id' => 'required|exists:users,id|unique:admin_requests,user_id', // Ensure the ID exists in users table and is unique in admin_requests table
    'cat'=> 'required'
]);
if ($validator->fails()) {
  return response()->json([
      'errors' => $validator->errors()
  ], 422); // 422 Unprocessable Entity
}

// Create a new request record
$requestInfo = new AdminRequest;
$requestInfo->user_id = $request->id; // Assign the id to the user_id column
$requestInfo->category = $request->cat;
$requestInfo->save();

// Return the saved request record as a response
return response()->json($requestInfo, 201); 
}

public function allRequest(){
  return AdminRequest::with(['users'])  // Eager load users and products
  ->get(); 
}

public function deleteUser($id){
  $product = AdminRequest::where('id', $id)->delete();
  if($product){
   return 'Seller Request has been deleted from your list';
  }
}

public function approveUser($id) {
  // Fetch a single user by ID
  $user = User::find($id);

  if ($user) {
      // Update the user's role
      $user->role = 'admin';
      $user->save(); // Save the updated user
 $product = AdminRequest::where('user_id', $id)->delete();
      // Return success message
      return 'Seller Request has been approved';
  } else {
      // Handle case where user is not found
      return 'User not found';
  }
}

}
