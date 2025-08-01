import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { ToastService } from './toast.service';

interface DecodedToken {
  userId: number;
  staff_name: string;
  role_id: number;
  exp: number;
  iat: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuthenticated = signal<boolean>(false);
  user = signal<DecodedToken | null>(null);
  loading = signal<boolean>(false);

  private api = 'http://localhost:5001/api';

  constructor(private http: HttpClient, private toastService: ToastService) {
    const decoded = this.getUserFromToken();
    if (decoded) {
      this.isAuthenticated.set(true);
      this.user.set(decoded);
    }
  }


  login(staff_name: string, password: string) {
    this.loading.set(true);
    const loginRequest = this.http.post(`${this.api}/auth/login`, { staff_name, password }, {
      withCredentials: true
    });
    
    // Add finalize to always set loading to false
    return loginRequest.pipe(
      finalize(() => this.loading.set(false))
    );
  }

  register(userData: { staff_name: string; password: string; role_id: number; email?: string; phone?: string }) {
    return this.http.post(`${this.api}/auth/register`, userData, {
      withCredentials: true
    });
  }

  getUsers() {
    return this.http.get(`${this.api}/users`, {
      withCredentials: true
    });
  }

  deleteUser(userId: number | string) {
    return this.http.delete(`${this.api}/users/${userId}`, {
      withCredentials: true
    });
  }

  // Staff updates own credentials (requires current password)
  updateOwnCredentials(credentialsData: {
    current_password: string;
    new_password?: string;
    staff_name?: string;
    email?: string;
    phone?: string;
  }) {
    return this.http.put(`${this.api}/profile`, credentialsData, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        console.log('Profile update successful, refreshing user data...', response);
        
        const oldTokenData = this.getUserFromToken();
        console.log('Old token user data:', oldTokenData);
        
        // Check for updated token after a short delay to allow cookie to be set
        setTimeout(() => {
          const newTokenData = this.getUserFromToken();
          console.log('New token user data:', newTokenData);
          
          const tokenContentChanged = JSON.stringify(oldTokenData) !== JSON.stringify(newTokenData);
          console.log('Token content changed:', tokenContentChanged);
          
          if (tokenContentChanged && newTokenData) {
            this.toastService.success('Session Updated! ✨', `Welcome ${newTokenData.staff_name}! Your session has been refreshed.`);
            this.user.set(newTokenData);
          } else if (newTokenData) {
            this.user.set(newTokenData);
            console.log('Token content same, but user data refreshed');
          } else {
            console.warn('Could not decode token after update');
          }
        }, 300);
      })
    );
  }

  // Admin updates any user's credentials (no current password needed)
  adminUpdateCredentials(userId: number | string, updates: {
    staff_name?: string;
    password?: string;
    role_id?: number;
    email?: string;
    phone?: string;
  }) {
    return this.http.put(`${this.api}/users/${userId}`, updates, {
      withCredentials: true
    });
  }

  logout() {
    this.isAuthenticated.set(false);
    this.user.set(null);
    this.clearAuthData();
    
    this.http.post(`${this.api}/auth/logout`, {}, {
      withCredentials: true
    }).subscribe({
      next: () => {
        console.log('Server logout successful');
      },
      error: (error) => {
        console.warn('Server logout failed, but local state cleared:', error);
      }
    });
  }

  private clearAuthData() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
  }


  getUserFromToken(): DecodedToken | null {
    const token = this.getCookie('token');
    if (!token) return null;

    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }

  // Force refresh user data from token
  refreshUserFromToken(): void {
    const decoded = this.getUserFromToken();
    if (decoded) {
      this.user.set(decoded);
      console.log('User data force refreshed:', decoded);
    } else {
      console.warn('No valid token found for refresh');
    }
  }

  private getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      const [key, value] = c.trim().split('=');
      if (key === name) return value;
    }
    return null;
  }
}



