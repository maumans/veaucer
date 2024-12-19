<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSocieteAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $societe = $request->route('societe');

        // SuperAdmin a accès à toutes les sociétés
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Admin n'a accès qu'à sa société
        if ($user->isAdmin()) {
            $userSocietes = $user->posteEmployes()->pluck('societe_id')->unique();
            if (!$userSocietes->contains($societe->id)) {
                abort(403, 'Accès non autorisé à cette société.');
            }
        }

        // Employé n'a pas accès aux configurations
        if ($user->isEmploye()) {
            abort(403, 'Accès non autorisé aux configurations.');
        }

        return $next($request);
    }
}
