<?php

namespace App\Http\Controllers\Api\Auth;

use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB; // Correct place at the top of the file

use App\Models\PasswordReset;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class RegisterController extends Controller
{
    public function register(Request $request){
        try {
            $validate = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
                'phone' => 'required|string|max:11',
                'image' => 'nullable|image|mimes:jpg,gif,png|max:2048',
                'role'=> 'required|string|in:user,admin',
            ]);
    
            $user = User::create([
                'name' => $validate['name'],
                'email' => $validate['email'],
                'password' => bcrypt($validate['password']),
                'role' => $validate['role'],
                'phone' => $validate['phone'],
            ]);
    
            if ($request->hasFile('image')) {
                $user->image = 'storage/' . $request->file('image')->store('imageStorage', 'public');
                $user->save();
            }
             
            return response()->json([
            
                'user' => $user
            ], 201);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'User registration failed'], 500);
        }
    }

    public function login(Request $request)
    {
        $validate = $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:6',
        ]);

        $user = User::where('email', $validate['email'])->first();

        if (!$user || !Hash::check($validate['password'], $user->password)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'user' => $user,
            'message'=>'You have successfully logged in'
        ], 201);
    }
    

    public function forgetPassword(Request $request) {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found'], 404);
        }

        // Generate token
        $token = Str::random(60);
        $hashedToken = Hash::make($token);
        // Store token in password_resets table
        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => $hashedToken,
                'created_at' => Carbon::now(),
            ]
        );

        // Generate reset link
        $resetLink = url("http://localhost:3000/reset-password/$token?email=" . urlencode($request->email));

        // Send the reset link via email
        Mail::to($request->email)->send(new ResetPasswordMail($resetLink));

        return response()->json([
            'success' => true,
            'message' => 'Reset link sent successfully.',
            'reset_link' => $resetLink
        ]);
    }

    public function resetPassword(Request $request) {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required',
            'password' => 'required|min:6',
        ]);

        $resetEntry = PasswordReset::where('email', $request->email)->first();

        if (!$resetEntry || !Hash::check($request->token, $resetEntry->token)) {
            return response()->json(['success' => false, 'message' => 'Invalid token'], 400);
        }

        // Update user password
        $hashedPassword = Hash::make($request->password);
        \Log::info("Hashed Password: " . $hashedPassword);
    
        // Update password
        User::where('email', $request->email)->update([
            'password' => Hash::make($request->password),
        ]);

        // Delete token after reset
        PasswordReset::where('email', $request->email)->delete();

        return response()->json(['success' => true, 'message' => 'Password has been reset successfully']);
    }

    public function showResetForm(Request $request)
    {
        $token = $request->query('token'); // Get token from query parameters
        $email = $request->query('email'); // Get email from query parameters

        if (!$token || !$email) {
            return response()->json([
                'success' => false,
                'message' => 'Token or email is missing.'
            ], 400);
        }

        // Proceed with any additional logic, such as validating the token

        return response()->json([
            'success' => true,
            'message' => 'Token and email received.',
            'token' => $token,
            'email' => $email
        ]);
    }

    public function editProfile($id){
        $user =  User::find($id);
        if(!$user){
    return response()->json([
        'error'=>'User not found'
    ], 404);

        }
      return response()->json($user, 200);
    }



    public function myProfile(Request $request, $id) {
        $profile = User::find($id);
        
        if (!$profile) {
            return response()->json(['error' => 'User not found'], 404);
        }
    
        try {
            $validate = $request->validate([
                'name' => 'sometimes|string|max:200',
                'email' => 'sometimes|string|email|max:255',
                'phone' => 'sometimes|string|max:11',
                'image' => 'nullable|image|mimes:jpg,gif,png|max:2048',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        }
    
        if (isset($validate['name'])) {
            $profile->name = $validate['name'];
        }
        if (isset($validate['email'])) {
            $profile->email = $validate['email'];
        }
        if (isset($validate['phone'])) {
            $profile->phone = $validate['phone'];
        }
        if ($request->hasFile('image')) {
            $profile->image = 'storage/' . $request->file('image')->store('imageStorage', 'public');
        }
    
        $profile->save();
    
        return response()->json(['user' => $profile], 200);
    }
    
}

