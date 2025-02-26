<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function userSignup(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
            'is_admin' => 'sometimes|boolean'
        ]);
        $fields['is_admin'] = $fields['is_admin'] ?? false;

        $user = User::create($fields);
        $token = $user->createToken($request->name);

        return response()->json([
					'name' => $user->name,
					'token' => $token->plainTextToken,
					'isAdmin' => $user->is_admin
			], 201);
    }


    public function userLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
			return response('', 401);
        }

        $token = $user->createToken($user->name);

        return response()->json([
            'name' => $user->name,
            'token' => $token->plainTextToken,
            'isAdmin' => $user->is_admin
        ], 200);
    }

    public function userLogout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response('', 200);

    }

	}
