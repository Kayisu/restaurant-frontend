import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-staff-settings',
  imports: [CommonModule, FormsModule],
  styleUrl: './styles/staff-settings.component.scss',
  template: `
    <div class="settings-container">
      <div class="settings-sections">
        <!-- Profile Information -->
        <div class="settings-section">
          <h2>Profile Information</h2>
          
          <div class="setting-item">
            <label for="staff_name">Username</label>
            <input 
              id="staff_name" 
              type="text" 
              [(ngModel)]="profileForm.staff_name"
              placeholder="Enter username"
            />
          </div>
          
          <div class="setting-item">
            <label for="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              [(ngModel)]="profileForm.email"
              placeholder="yourmail@example.com"
            />
          </div>
          
          <div class="setting-item">
            <label for="phone">Phone Number</label>
            <input 
              id="phone" 
              type="tel" 
              [(ngModel)]="profileForm.phone"
              placeholder="+90 555 123 4567"
            />
          </div>

          <div class="setting-item">
            <label for="profile_current_password">Current Password (Required for Profile Updates)</label>
            <input 
              id="profile_current_password" 
              type="password" 
              [(ngModel)]="profileForm.current_password"
              placeholder="Enter your current password"
            />
          </div>

          <!-- Profile Actions -->
          <div class="section-actions">
            <button 
              class="btn-success" 
              (click)="updateProfile()"
              [disabled]="loading() || !profileForm.current_password"
            >
              <span *ngIf="!profileLoading()">Save Changes</span>
              <span *ngIf="profileLoading()">Saving...</span>
            </button>
            
            <button 
              class="btn-cancel" 
              (click)="resetProfileForm()"
              [disabled]="loading()"
            >
              Reset Form
            </button>
          </div>
        </div>

        <!-- Security Settings -->
        <div class="settings-section">
          <h2>Change Password</h2>
          
          <div class="setting-item">
            <label for="current_password">Current Password</label>
            <input 
              id="current_password" 
              type="password" 
              [(ngModel)]="passwordForm.current_password"
              placeholder="Enter current password"
            />
          </div>
          
          <div class="setting-item">
            <label for="new_password">New Password</label>
            <input 
              id="new_password" 
              type="password" 
              [(ngModel)]="passwordForm.new_password"
              placeholder="Enter new password (min 6 characters)"
            />
          </div>
          
          <div class="setting-item">
            <label for="confirm_password">Confirm New Password</label>
            <input 
              id="confirm_password" 
              type="password" 
              [(ngModel)]="passwordForm.confirm_password"
              placeholder="Confirm new password"
              [class.error-input]="passwordForm.confirm_password && passwordForm.new_password && passwordForm.confirm_password !== passwordForm.new_password"
            />
          </div>

          <!-- Password Validation Messages -->
          <div class="validation-messages" *ngIf="passwordForm.new_password || passwordForm.confirm_password">
            <div class="validation-message error" *ngIf="passwordForm.new_password && passwordForm.new_password.length < 6">
              ⚠️ New password must be at least 6 characters long
            </div>
            <div class="validation-message error" *ngIf="passwordForm.new_password && passwordForm.current_password && passwordForm.new_password === passwordForm.current_password">
              ⚠️ New password must be different from current password
            </div>
            <div class="validation-message error" *ngIf="passwordForm.confirm_password && passwordForm.new_password && passwordForm.confirm_password !== passwordForm.new_password">
              ⚠️ Passwords do not match
            </div>
            <div class="validation-message success" *ngIf="passwordForm.new_password && passwordForm.confirm_password && passwordForm.confirm_password === passwordForm.new_password && passwordForm.new_password.length >= 6 && passwordForm.new_password !== passwordForm.current_password">
              ✅ Passwords match and are valid
            </div>
          </div>

          <!-- Password Actions -->
          <div class="section-actions">
            <button 
              class="btn-primary" 
              (click)="updatePassword()"
              [disabled]="loading() || !isPasswordFormValid()"
            >
              <span *ngIf="!passwordLoading()">Change Password</span>
              <span *ngIf="passwordLoading()">Changing...</span>
            </button>
            
            <button 
              class="btn-cancel" 
              (click)="resetPasswordForm()"
              [disabled]="loading()"
            >
              Reset Form
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StaffSettingsComponent implements OnInit {
  loading = signal<boolean>(false);
  profileLoading = signal<boolean>(false);
  passwordLoading = signal<boolean>(false);

  originalProfileForm = {
    staff_name: '',
    email: '',
    phone: '',
    current_password: ''
  };

  profileForm = {
    staff_name: '',
    email: '',
    phone: '',
    current_password: ''
  };

  passwordForm = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  };

  constructor(private authService: AuthService, private toastService: ToastService) {}

  ngOnInit() {
    this.loadCurrentUserData();
  }

  private loadCurrentUserData() {
    const user = this.authService.user();
    if (user) {
      this.profileForm.staff_name = user.staff_name || '';
      this.originalProfileForm.staff_name = user.staff_name || '';
      // Email and phone are not included in JWT token, fetch from API in real implementation
      this.profileForm.email = '';
      this.profileForm.phone = '';
      this.originalProfileForm.email = '';
      this.originalProfileForm.phone = '';
    }
  }

  updateProfile() {
    if (this.profileLoading()) return;

    if (!this.profileForm.current_password || this.profileForm.current_password.length < 6) {
      this.toastService.error('Validation Error! ❌', 'Current password is required for profile updates');
      return;
    }

    this.profileLoading.set(true);
    this.loading.set(true);

    // Send only changed fields for profile update
    const updates: any = {
      current_password: this.profileForm.current_password
    };

    const user = this.authService.user();
    if (this.profileForm.staff_name && this.profileForm.staff_name !== user?.staff_name) {
      updates.staff_name = this.profileForm.staff_name;
    }
    if (this.profileForm.email && this.profileForm.email.trim()) {
      updates.email = this.profileForm.email;
    }
    if (this.profileForm.phone && this.profileForm.phone.trim()) {
      updates.phone = this.profileForm.phone;
    }

    // Check if there are any changes (excluding current_password)
    if (Object.keys(updates).length === 1) {
      this.toastService.info('No Changes! ℹ️', 'No changes detected to update in your profile');
      this.profileLoading.set(false);
      this.loading.set(false);
      return;
    }

    this.authService.updateOwnCredentials(updates).subscribe({
      next: () => {
        this.profileLoading.set(false);
        this.loading.set(false);
        this.profileForm.current_password = '';
        
        this.toastService.success('Profile Updated! 🎉', 'Your profile information has been updated successfully');
        
        setTimeout(() => {
          this.authService.refreshUserFromToken();
          this.loadCurrentUserData();
        }, 300);
      },
      error: (error) => {
        console.error('Update error:', error);
        this.profileLoading.set(false);
        this.loading.set(false);
        
        this.toastService.error('Update Failed! ❌', error.error?.message || 'Failed to update profile');
      }
    });
  }

  updatePassword() {
    if (this.passwordLoading() || !this.isPasswordFormValid()) return;

    // Check if new password is same as current password
    if (this.passwordForm.new_password === this.passwordForm.current_password) {
      this.toastService.warning('Same Password! ⚠️', 'New password must be different from current password');
      return;
    }

    this.passwordLoading.set(true);
    this.loading.set(true);

    const passwordData = {
      current_password: this.passwordForm.current_password,
      new_password: this.passwordForm.new_password
    };

    this.authService.updateOwnCredentials(passwordData).subscribe({
      next: () => {
        this.resetPasswordForm();
        this.passwordLoading.set(false);
        this.loading.set(false);
        
        this.toastService.success('Password Changed! 🔐', 'Your password has been updated successfully');
      },
      error: (error) => {
        this.passwordLoading.set(false);
        this.loading.set(false);
        
        this.toastService.error('Password Change Failed! ❌', error.error?.message || 'Failed to change password');
      }
    });
  }

  isPasswordFormValid(): boolean {
    return this.passwordForm.current_password.length >= 6 &&
           this.passwordForm.new_password.length >= 6 &&
           this.passwordForm.new_password === this.passwordForm.confirm_password;
  }

  resetProfileForm() {
    this.profileForm = { ...this.originalProfileForm };
    this.profileForm.current_password = '';
  }

  resetPasswordForm() {
    this.passwordForm = {
      current_password: '',
      new_password: '',
      confirm_password: ''
    };
  }
}
