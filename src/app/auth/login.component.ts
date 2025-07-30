import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🍽️ Restaurant Management</h1>
          <p>Sign in to your account</p>
        </div>
        
        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label for="staff_name">Username</label>
            <input 
              id="staff_name"
              [(ngModel)]="credentials.staff_name" 
              name="staff_name" 
              type="text"
              placeholder="Enter your username" 
              required 
              [disabled]="authService.loading()"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              [(ngModel)]="credentials.password" 
              name="password" 
              type="password" 
              placeholder="Enter your password" 
              required 
              [disabled]="authService.loading()"
            />
          </div>

          <div class="error-message" *ngIf="errorMessage()">
            {{ errorMessage() }}
          </div>

          <button 
            type="submit" 
            class="login-button"
            [disabled]="authService.loading() || !isFormValid()"
          >
            <span *ngIf="!authService.loading()">Sign In</span>
            <span *ngIf="authService.loading()">Signing in...</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-header h1 {
      color: #333;
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
    }

    .login-header p {
      color: #666;
      margin: 0;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-group input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    .error-message {
      background-color: #fee;
      border: 1px solid #fcc;
      color: #c33;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      text-align: center;
    }

    .login-button {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    .login-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  `]
})
export class LoginComponent {
  credentials = {
    staff_name: '',
    password: ''
  };

  errorMessage = signal<string>('');

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Check for logout message from query params
    const message = this.route.snapshot.queryParams['message'];
    if (message) {
      this.errorMessage.set(message);
      // Clear the query params to clean up the URL
      this.router.navigate([], { 
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });
    }
  }

  isFormValid(): boolean {
    return this.credentials.staff_name.trim() !== '' && 
           this.credentials.password.trim() !== '';
  }

  onLogin(): void {
    if (!this.isFormValid() || this.authService.loading()) {
      return;
    }

    this.errorMessage.set('');

    this.authService.login(this.credentials.staff_name, this.credentials.password).subscribe({
      next: () => {
        const user = this.authService.getUserFromToken();
        if (user) {
          this.authService.isAuthenticated.set(true);
          this.authService.user.set(user);
          this.router.navigate(['/']);
        } else {
          this.errorMessage.set('Token could not be processed');
        }
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Login failed. Please try again.');
      }
    });
  }
}
