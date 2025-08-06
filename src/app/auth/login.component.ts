import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  styleUrl: './login.component.scss',
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🍽️ Restaurant Management</h1>
          <p>Sign in to your account</p>
        </div>
        
        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label for="user_name">Username</label>
            <input 
              id="user_name"
              [(ngModel)]="credentials.user_name" 
              name="user_name" 
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
  `
})
export class LoginComponent {
  credentials = {
    user_name: '',
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
    return this.credentials.user_name.trim() !== '' && 
           this.credentials.password.trim() !== '';
  }

  onLogin(): void {
    if (!this.isFormValid() || this.authService.loading()) {
      return;
    }

    this.errorMessage.set('');

    this.authService.login(this.credentials.user_name, this.credentials.password).subscribe({
      next: () => {
        const user = this.authService.getUserFromToken();
        if (user) {
          this.authService.isAuthenticated.set(true);
          this.authService.user.set(user);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('Token could not be processed');
        }
      },
      error: (error) => {
        // Always show generic error message regardless of backend response
        this.errorMessage.set('Invalid credentials. Please try again.');
      }
    });
  }
}
