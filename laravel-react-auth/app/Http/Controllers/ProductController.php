<?php

namespace App\Http\Controllers;
use App\Models\Product;
use App\Models\User;
use App\Models\Cart;
use App\Models\Sell;
use Carbon\Carbon;

use App\Models\AdminRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Add this line
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;

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
        $product->mainType = $req->input('mainType');
        $product->type = $req->input('type');
        $product->owner = $req->input('owner');
        $product->save();
        return $product;
      }
  public function showProducts(){
    return Product::orderBy('id', 'desc')->get();

  }

  
  public function showProductsHome(){
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
     public function searchPrice(Request $request){
      $max = $request->input('max');
      $min  = $request->input('min');
      return Product::whereBetween('price', [$min, $max])->get();
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

  public function review(Request $request)
  {
      $id = $request->input('id');
      $product = Product::find($id);
  
      // Check if product exists
      if (!$product) {
          return response()->json(['message' => 'Product not found'], 404);
      }
  
      // Validate the incoming request
      $validate = $request->validate([
          'rating' => 'numeric|min:0',  // Rating must be provided and >= 1
          'image' => 'nullable|image|mimes:jpg,gif,png|max:2048',  // Image is optional but if provided, it must be a valid image
      ]);
  
      // Validate comment if provided
      if ($request->input('comment')) {
          $request->validate([
              'comment' => 'nullable|string|max:255',  // Comment is optional, but if provided, it must be a string with max length 255
          ]);
      }
  
      // Handle ratings array
      $ratings = $product->rating ? json_decode($product->rating, true) : [];
      if ($request->input('rating') && $request->input('rating')>0) {
          $ratings[] = $validate['rating'];  // Add the rating to the ratings array
          $product->rating = json_encode($ratings);  // Store updated ratings
      }
  
      // Handle image upload (if any)
      if ($request->hasFile('image')) {
          $imagePath = $request->file('image')->store('imageStorage', 'public');
      } else {
          $imagePath = null;  // If no image is provided, set it to null
      }
  
      // Handle comments array if a comment is provided
      if ($request->input('comment')) {
          $comments = $product->comment ? json_decode($product->comment, true) : [];
          $new_comment = [
              'user_name' => $request->input('name'),
              'comment' => $request->input('comment'),
              'image' => $imagePath,  // Store the image path (or null if no image is provided)
          ];
          $comments[] = $new_comment;  // Append the new comment to the comments array
          $product->comment = json_encode($comments);  // Store updated comments
      }
  
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


  public function getTotalSellOwner($userId)
  {
      // Find all products that belong to the specified user (owner)
      $productIds = Product::where('owner', $userId)->pluck('id');
  
      // Calculate the total sales (quantity and price) for these products
      $sales = Sell::selectRaw('SUM(quantity) as totalQuantity, SUM(price) as totalPrice')
          ->whereIn('product_id', $productIds)  // Filter sales for the product IDs that belong to the user
          ->groupBy('product_id')  // Group by product_id to get totals for each product
          ->get();  // Get the result for all products
  
      // Return the result as a JSON response
      return response()->json($sales);
  }
  public function getSalesWithTime($userId)
  {
     
      $productIds = Product::where('owner', $userId)->pluck('id');
  
      // Calculate the total sales (quantity and price) for these products
      $sales = Sell::selectRaw('price, DATE(created_at) as time')
          ->whereIn('product_id', $productIds)->get();  // Get the result for all products
  
      // Return the result as a JSON response
      return response()->json($sales);
  }


  public function getTotalOwnProduct($userId)
  {
      // Calculate the total sales (quantity and price) for these products
      $sales = Product::selectRaw('SUM(quantity) as totalQuantity')
          ->where('owner', $userId)  
          ->get(); 
  
      // Return the result as a JSON response
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
 
 

  $recentRequest = AdminRequest::orderBy('created_at', 'desc')->first();
  if($recentRequest){
   $lastRequest = Carbon::parse($recentRequest->created_at);
   $current = Carbon::parse(now());
     if($current>$lastRequest){
      $isBig = true;
     }
     $timeDiff = $lastRequest->diffInMinutes($current); // No need for 'false' here

   $time = 1-$timeDiff;
   if($timeDiff<1){
     return response()->json(['message'=>"You can send request after ${time}"]);
   }else{
 // Create a new request record
 $requestInfo = new AdminRequest;
 $requestInfo->user_id = $request->id; // Assign the id to the user_id column
 $requestInfo->category = $request->cat;
 $requestInfo->save();
 
 // Return the saved request record as a response,
 return response()->json(['message'=>"Request is sent successfully"]); 
   }
 }else{
  $requestInfo = new AdminRequest;
 $requestInfo->user_id = $request->id; // Assign the id to the user_id column
 $requestInfo->category = $request->cat;
 $requestInfo->save();
 
 // Return the saved request record as a response,
 return response()->json(['message'=>'Send request'], 201); 
 }



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

public function approveUser(Request $request) {
  // Fetch a single user by ID
  $validator = Validator::make($request->all(), [
    'id' => 'required', // Ensure the ID exists in users table and is unique in admin_requests table
    'sellerType'=> 'required'
]);
  $id = $request->input('id');
  $user = User::find($id);

  if ($user) {
      // Update the user's role
      $user->role = 'admin';
      $user->sellerType = $request->input('sellerType');
      $user->save(); // Save the updated user
      $product = AdminRequest::where('user_id', $id)->delete();
      // Return success message
      return 'Seller Request has been approved';
  } else {
      // Handle case where user is not found
      return 'User not found';
  }
}

public function discountProduct(Request $request){
  $id = $request->input('id');
  $product = Product::find($id);

  $product->reason = $request->input('reason');
  $product->amount = $request->input('amount');
  $product->save();
  return $product;

}


public function resetDiscount($id){
 $product = Product::find($id);
 $product->amount = null;
 $product->reason = null;
 $product->save();
 return 'Discount is Reset';
}

public function isInCarts($id, $userId){
  $exist  = Cart::where('product_id', $id)->where('user_id', $userId)->exists();
  $cartId =Cart::where('product_id', $id)->where('user_id', $userId)->value('id');
   return response()->json(['exist'=>$exist,
                            'cartId'=> $cartId
                           ]);
}

}
