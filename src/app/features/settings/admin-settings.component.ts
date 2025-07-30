import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-admin-settings',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <div class="settings-sections">
        <!-- User Management Section -->
        <div class="settings-section">
          <h2>👥 User Management</h2>
          <div class="setting-item">
            <label>Add New Staff Member</label>
            <button class="btn-primary">Add User</button>
          </div>
          <div class="setting-item">
            <label>Manage User Roles</label>
            <button class="btn-secondary">Role Management</button>
          </div>
          <div class="setting-item">
            <label>View User Activity</label>
            <button class="btn-secondary">Activity Logs</button>
          </div>
        </div>
      </div>

      <div class="settings-actions">
        <button class="btn-success" (click)="saveSettings()">Save Changes</button>
        <button class="btn-cancel" (click)="resetSettings()">Cancel Changes</button>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 1000px;
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
    .setting-item input[type="number"],
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

    .btn-cancel {
        background: rgba(167, 40, 40, 1);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        font-size: 1.1rem;
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

    .btn-warning {
      background: #ffc107;
      color: #212529;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-primary:hover { background: #0056b3; }
    .btn-secondary:hover { background: #545b62; }
    .btn-success:hover { background: #218838; }
    .btn-warning:hover { background: #e0a800; }
    .btn-danger:hover { background: #c82333; }

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
        padding-right: 1rem; /* Remove extra padding on mobile */
      }

      .setting-item {
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
      }

      .setting-item input[type="text"],
      .setting-item input[type="number"],
      .setting-item select {
        width: 100%;
      }

      .settings-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AdminSettingsComponent {
  constructor(private authService: AuthService) {}

  saveSettings(): void {
    // Implement save logic here for user management
    console.log('Saving user management settings');
    alert('User management settings saved successfully!');
  }

  resetSettings(): void {
    if (confirm('Are you sure you want to reset user management settings to defaults?')) {
      console.log('User management settings reset to defaults');
    }
  }
}
