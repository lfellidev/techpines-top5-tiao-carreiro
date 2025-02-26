<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
	function adminOnly(User $user, $post = null): Response
    {
        return $user->is_admin
            ? Response::allow()
            : Response::deny('Only administrators can perform this action.');
    }
}
