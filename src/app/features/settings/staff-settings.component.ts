import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-staff-settings',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <div class="settings-sections">
        <!-- Profile Information -->
        <div class="settings-section">
          <h2>Profile Information</h2>
          <div class="setting-item">
            <label for="displayName">Display Name</label>
            <input 
              id="displayName" 
              type="text" 
              [(ngModel)]="profileSettings.displayName"
              placeholder="How others see your name"
            />
          </div>
          <div class="setting-item">
            <label for="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              [(ngModel)]="profileSettings.email"
              placeholder="your.email@restaurant.com"
            />
          </div>
          <div class="setting-item">
            <label for="phone">Phone Number</label>
            <input 
              id="phone" 
              type="tel" 
              [(ngModel)]="profileSettings.phone"
              placeholder="+90 555 123 4567"
            />
          </div>
        </div>

        <!-- Security Settings -->
        <div class="settings-section">
          <h2>Security</h2>
          <div class="setting-item">
            <label>Change Password</label>
            <button class="btn-primary" (click)="changePassword()">Update Password</button>
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" [(ngModel)]="securitySettings.enableNotifications">
              Enable login notifications
            </label>
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" [(ngModel)]="securitySettings.autoLogout">
              Auto logout after inactivity
            </label>
          </div>
        </div>

        <!-- Work Preferences -->
        <div class="settings-section">
          <h2>Work Preferences</h2>
          <div class="setting-item">
            <label for="workStation">Preferred Work Station</label>
            <select id="workStation" [(ngModel)]="workSettings.preferredStation">
              <option value="any">Any Available</option>
              <option value="counter">Counter</option>
              <option value="kitchen">Kitchen</option>
              <option value="floor">Floor Service</option>
            </select>
          </div>
          <div class="setting-item">
            <label for="shiftPreference">Shift Preference</label>
            <select id="shiftPreference" [(ngModel)]="workSettings.shiftPreference">
              <option value="morning">Morning (08:00-16:00)</option>
              <option value="evening">Evening (16:00-00:00)</option>
              <option value="night">Night (00:00-08:00)</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" [(ngModel)]="workSettings.receiveShiftNotifications">
              Receive shift change notifications
            </label>
          </div>
        </div>

        <!-- Display Preferences -->
        <div class="settings-section">
          <h2>Display Preferences</h2>
          <div class="setting-item">
            <label for="language">Language</label>
            <select id="language" [(ngModel)]="displaySettings.language">
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>
          <div class="setting-item">
            <label for="theme">Theme</label>
            <select id="theme" [(ngModel)]="displaySettings.theme">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" [(ngModel)]="displaySettings.compactMode">
              Compact interface mode
            </label>
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" [(ngModel)]="displaySettings.showTooltips">
              Show helpful tooltips
            </label>
          </div>
        </div>

        <!-- Notifications -->
        <div class="settings-section">
          <h2>Notifications</h2>
          <div class="setting-item">
            <label>
              <input type="checkbox" [(ngModel)]="notificationSettings.newOrders">
              New order notifications
            </label>
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" [(ngModel)]="notificationSettings.orderUpdates">
              Order status updates
            </label>
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" [(ngModel)]="notificationSettings.shiftReminders">
              Shift reminders
            </label>
          </div>
          <div class="setting-item">
            <label>
              <input type="checkbox" [(ngModel)]="notificationSettings.systemMessages">
              System messages
            </label>
          </div>
        </div>

      <div class="settings-actions">
        <button class="btn-success" (click)="saveSettings()">💾 Save Settings</button>
        <button class="btn-secondary" (click)="resetSettings()">🔄 Reset to Defaults</button>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      position: relative;
    }

    .settings-sections {
      display: grid;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .settings-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid #e1e5e9;
    }

    .settings-section h2 {
      color: #333;
      margin-bottom: 1.5rem;
      font-size: 1.3rem;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 0.5rem;
    }

    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .setting-item:last-child {
      margin-bottom: 0;
    }

    .setting-item label {
      font-weight: 500;
      color: #333;
      flex: 1;
    }

    .setting-item input[type="text"],
    .setting-item input[type="email"],
    .setting-item input[type="tel"],
    .setting-item select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 200px;
    }

    .setting-item input[type="checkbox"] {
      margin-left: 0.5rem;
    }

    .btn-primary {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-success {
      background: #28a745;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 1.1rem;
    }

    .btn-primary:hover { background: #0056b3; }
    .btn-secondary:hover { background: #545b62; }
    .btn-success:hover { background: #218838; }

    .settings-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      padding-top: 2rem;
      border-top: 1px solid #e1e5e9;
    }

    @media (max-width: 768px) {
      .settings-container {
        padding: 1rem;
      }

      .setting-item {
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
      }

      .setting-item input[type="text"],
      .setting-item input[type="email"],
      .setting-item input[type="tel"],
      .setting-item select {
        width: 100%;
      }

      .settings-actions {
        flex-direction: column;
      }
    }
  `]
})
export class StaffSettingsComponent {
  profileSettings = {
    displayName: '',
    email: '',
    phone: ''
  };

  securitySettings = {
    enableNotifications: true,
    autoLogout: false
  };

  workSettings = {
    preferredStation: 'any',
    shiftPreference: 'flexible',
    receiveShiftNotifications: true
  };

  displaySettings = {
    language: 'tr',
    theme: 'light',
    compactMode: false,
    showTooltips: true
  };

  notificationSettings = {
    newOrders: true,
    orderUpdates: true,
    shiftReminders: true,
    systemMessages: false
  };

  constructor(private authService: AuthService) {
    // Initialize with current user data
    const user = this.authService.user();
    if (user) {
      this.profileSettings.displayName = user.staff_name;
    }
  }

  changePassword(): void {
    // This would open a password change modal or navigate to password change page
    alert('Password change functionality will be implemented here');
  }

  saveSettings(): void {
    // Implement save logic here
    console.log('Saving staff settings:', {
      profile: this.profileSettings,
      security: this.securitySettings,
      work: this.workSettings,
      display: this.displaySettings,
      notifications: this.notificationSettings
    });
    alert('Settings saved successfully!');
  }

  resetSettings(): void {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      const user = this.authService.user();
      this.profileSettings = {
        displayName: user?.staff_name || '',
        email: '',
        phone: ''
      };
      this.securitySettings = {
        enableNotifications: true,
        autoLogout: false
      };
      this.workSettings = {
        preferredStation: 'any',
        shiftPreference: 'flexible',
        receiveShiftNotifications: true
      };
      this.displaySettings = {
        language: 'tr',
        theme: 'light',
        compactMode: false,
        showTooltips: true
      };
      this.notificationSettings = {
        newOrders: true,
        orderUpdates: true,
        shiftReminders: true,
        systemMessages: false
      };
      console.log('Settings reset to defaults');
    }
  }
}
