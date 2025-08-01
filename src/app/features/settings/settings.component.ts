import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AdminSettingsComponent } from './admin-settings.component';
import { StaffSettingsComponent } from './staff-settings.component';

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [CommonModule, AdminSettingsComponent, StaffSettingsComponent],
  styleUrl: './styles/settings.component.scss',
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
  `
})
export class SettingsComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isAdmin(): boolean {
    const user = this.authService.user();
    return user?.role_id === 1; // Assuming 1 is admin role
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
