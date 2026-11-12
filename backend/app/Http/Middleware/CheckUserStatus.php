<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Check if the user is logged in
        if (Auth::check()) {
            /** @var \App\Models\User $user */
            $user = Auth::user();

            // 2. Check if the user's status is Inactive (0)
            if ($user->IsActive == 0) {
                
                // 3. Revoke all tokens (Instant Logout from all devices)
                // Note: Agar aap Sanctum use kar rahe hain toh 'tokens()' kaam karega
                $user->tokens()->delete();

                return response()->json([
                    'status' => 'deactivated',
                    'message' => 'Your account has been deactivated by admin. Please contact support.'
                ], 403);
            }
        }

        return $next($request);
    }
}