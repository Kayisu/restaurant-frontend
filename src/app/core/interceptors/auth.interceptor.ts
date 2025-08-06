import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  
  return next(req).pipe(
    catchError((error) => {
      // Handle 401 Unauthorized responses
      if (error.status === 401) {
        console.warn('401 Unauthorized - clearing auth state and redirecting');
        authService.logout();
        router.navigate(['/login'], { 
          replaceUrl: true,
          queryParams: { message: 'Session expired. Please login again.' }
        });
      }
      
      // Handle 403 Forbidden (insufficient permissions)
      if (error.status === 403) {
        console.warn('403 Forbidden - insufficient permissions');
        router.navigate(['/dashboard'], {
          replaceUrl: true,
          queryParams: { message: 'Access denied. Insufficient permissions.' }
        });
      }
      
      return throwError(() => error);
    })
  );
};
