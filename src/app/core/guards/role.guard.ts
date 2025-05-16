import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Get the roles from the route data
  const roles = route.data['roles'] as UserRole[];
  
  if (authService.isLoggedIn() && roles && authService.hasRole(roles)) {
    return true;
  }
  
  // User doesn't have the required role, redirect based on their actual role
  const user = authService.getCurrentUser();
  if (user) {
    switch (user.role) {
      case UserRole.ADMIN:
        router.navigate(['/admin']);
        break;
      case UserRole.MANAGER:
        router.navigate(['/manager']);
        break;
      case UserRole.USER:
        router.navigate(['/user']);
        break;
      default:
        router.navigate(['/login']);
    }
  } else {
    router.navigate(['/login']);
  }
  
  return false;
};