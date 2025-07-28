import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface DecodedToken {
  userId: number;
  staff_name: string;
  role_id: number;
  exp: number;
  iat: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {


  //private tokenKey = 'auth_token';

  isAuthenticated = signal<boolean>(false);
  user = signal<DecodedToken | null>(null);

  private api = 'http://localhost:5001/api';

  constructor(private http: HttpClient) {
    const decoded = this.getUserFromToken();
    if (decoded) {
      this.isAuthenticated.set(true);
      this.user.set(decoded);
    }
  }


  login(staff_name: string, password: string) {
    return this.http.post(`${this.api}/auth/login`, { staff_name, password }, {
      withCredentials: true
    });
  }

  // storeToken(token: string) {
  //   localStorage.setItem(this.tokenKey, token);
  //   this.isAuthenticated.set(true);
  // }

  // getToken() {
  //   return localStorage.getItem(this.tokenKey);
  // }

  logout() {
    this.http.post(`${this.api}/auth/logout`, {}, {
      withCredentials: true
    }).subscribe(() => {
      this.isAuthenticated.set(false);
      this.user.set(null);
    });
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

  private getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      const [key, value] = c.trim().split('=');
      if (key === name) return value;
    }
    return null;
  }
}



