import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { AdminSettingsComponent } from './admin-settings.component';
import { StaffSettingsComponent } from './staff-settings.component';

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [CommonModule, AdminSettingsComponent, StaffSettingsComponent],
  template: `
    <div class="settings-wrapper">
      <div class="settings-header">
        <button class="back-btn" (click)="goBack()">
          ← Back to Dashboard
        </button>
      </div>

      <!-- Show admin settings for role_id 1 (admin) -->
      <app-admin-settings *ngIf="isAdmin()"></app-admin-settings>
      
      <!-- Show staff settings for all other roles -->
      <app-staff-settings *ngIf="!isAdmin()"></app-staff-settings>
    </div>
  `,
  styles: [`
    .settings-wrapper {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .settings-header {
      padding: 2rem 2rem 0 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .back-btn {
      background: white;
      color: #333;
      border: 1px solid #e1e5e9;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
    }

    .back-btn:hover {
      background: #f8f9fa;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    @media (max-width: 768px) {
      .settings-header {
        padding: 1rem 1rem 0 1rem;
      }
      
      .back-btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class SettingsComponent {
  @Output() navigationRequest = new EventEmitter<string>();

  constructor(private authService: AuthService) {}

  isAdmin(): boolean {
    const user = this.authService.user();
    return user?.role_id === 1; // Assuming 1 is admin role
  }

  goBack(): void {
    this.navigationRequest.emit('dashboard');
  }
}
