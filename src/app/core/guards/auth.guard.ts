import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Double-check authentication state
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.user();
  const tokenUser = authService.getUserFromToken();

  // If any of these checks fail, redirect to login
  if (!isAuthenticated || !user || !tokenUser) {
    console.warn('Authentication check failed, redirecting to login');
    authService.logout(); // Clear any partial state
    router.navigate(['/login']);
    return false;
  }

  // Verify token hasn't expired
  const currentTime = Math.floor(Date.now() / 1000);
  if (tokenUser.exp && tokenUser.exp < currentTime) {
    console.warn('Token expired, redirecting to login');
    authService.logout();
    router.navigate(['/login'], { 
      queryParams: { message: 'Session expired. Please login again.' }
    });
    return false;
  }

  return true;
};
