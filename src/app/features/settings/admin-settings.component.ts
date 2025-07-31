import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

interface User {
  id?: number;
  staff_id?: number;
  user_id?: number;
  staff_name: string;
  role_id: number;
  email?: string;
  phone?: string;
  created_at: string;
}

@Component({
  standalone: true,
  selector: 'app-admin-settings',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <div class="settings-sections">
        <!-- User Management Section -->
        <div class="settings-section">
          <h2>User Management</h2>
          <div class="setting-item">
            <label>Add New Staff Member</label>
            <button class="btn-primary" (click)="toggleAddUserForm()">
              {{ showAddUserForm ? 'Cancel' : 'Add User' }}
            </button>
          </div>
          <div class="setting-item">
            <label>View All Users</label>
            <button class="btn-secondary" (click)="toggleUserList()">
              {{ showUserList ? 'Hide Users' : 'Show Users' }}
            </button>
          </div>
        </div>

        <!-- User List -->
        <div class="settings-section" *ngIf="showUserList">
          <h2>Staff Members</h2>

          
          <div *ngIf="loadingUsers" class="loading-message">
            Loading users...
          </div>
          
          <div *ngIf="shouldShowNoUsers" class="no-users-message">
            No users found.
          </div>
          
          <div *ngIf="shouldShowUserTable" class="user-table-container">
            <table class="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users" class="user-row">
                  <td>{{ getUserId(user) }}</td>
                  <td class="user-name">{{ user.staff_name }}</td>
                  <td>
                    <span class="role-badge" [class]="getRoleClass(user.role_id)">
                      {{ getRoleName(user.role_id) }}
                    </span>
                  </td>
                  <td>{{ user.email || '-' }}</td>
                  <td>{{ user.phone || '-' }}</td>
                  <td>{{ formatDate(user.created_at) }}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-warning btn-small" (click)="editUser(user)">
                        Edit
                      </button>
                      <button class="btn-danger btn-small" (click)="deleteUser(user)" [disabled]="getUserId(user) === currentUserId">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="user-list-actions">
            <button class="btn-secondary" (click)="refreshUserList()" [disabled]="loadingUsers">
              {{ loadingUsers ? 'Loading...' : 'Refresh' }}
            </button>
          </div>

        </div>
        

        <!-- Add User Form -->
        <div class="settings-section" *ngIf="showAddUserForm">
          <h2>Add New Staff Member</h2>
          <form (ngSubmit)="registerUser()" #userForm="ngForm">
            <div class="form-grid">
              <div class="form-group">
                <label for="staffName">Staff Name *</label>
                <input 
                  id="staffName"
                  type="text" 
                  [(ngModel)]="newUser.staff_name"
                  name="staff_name"
                  placeholder="Enter full name"
                  required
                  #staffName="ngModel"
                />
                <div class="error-message" *ngIf="staffName.invalid && staffName.touched">
                  Staff name is required
                </div>
              </div>

              <div class="form-group">
                <label for="password">Password *</label>
                <input 
                  id="password"
                  type="password" 
                  [(ngModel)]="newUser.password"
                  name="password"
                  placeholder="Enter password"
                  required
                  minlength="6"
                  #password="ngModel"
                />
                <div class="error-message" *ngIf="password.invalid && password.touched">
                  <span *ngIf="password.errors?.['required']">Password is required</span>
                  <span *ngIf="password.errors?.['minlength']">Password must be at least 6 characters</span>
                </div>
              </div>

              <div class="form-group">
                <label for="role">Role *</label>
                <select 
                  id="role"
                  [(ngModel)]="newUser.role_id"
                  name="role_id"
                  required
                  #role="ngModel"
                >
                  <option value="">Select Role</option>
                  <option value="1">Admin</option>
                  <option value="2">Staff</option>

                </select>
                <div class="error-message" *ngIf="role.invalid && role.touched">
                  Role is required
                </div>
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  id="email"
                  type="email" 
                  [(ngModel)]="newUser.email"
                  name="email"
                  placeholder="Enter email (optional)"
                  #email="ngModel"
                />
                <div class="error-message" *ngIf="email.invalid && email.touched">
                  Please enter a valid email
                </div>
              </div>

              <div class="form-group">
                <label for="phone">Phone</label>
                <input 
                  id="phone"
                  type="tel" 
                  [(ngModel)]="newUser.phone"
                  name="phone"
                  placeholder="+90 555 123 4567"
                />
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="btn-success"
                [disabled]="userForm.invalid || isRegistering"
              >
                {{ isRegistering ? 'Creating...' : 'Create User' }}
              </button>
              <button 
                type="button" 
                class="btn-cancel"
                (click)="resetForm()"
              >
                Reset Form
              </button>
            </div>
          </form>
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

    /* Form Styles */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
    }

    .form-group input,
    .form-group select {
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .form-group input.ng-invalid.ng-touched,
    .form-group select.ng-invalid.ng-touched {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      padding-top: 1rem;
      border-top: 1px solid #e1e5e9;
    }

    .btn-cancel {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 1.1rem;
    }

    .btn-cancel:hover {
      background: #c82333;
    }

    /* User List Styles */
    .user-list-actions {
      margin-top: 1rem;
      display: flex;
      justify-content: flex-end;
    }

    .loading-message, .no-users-message {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-style: italic;
    }

    .user-table-container {
      overflow-x: auto;
    }

    .user-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .user-table th,
    .user-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e1e5e9;
    }

    .user-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .user-table tbody tr:hover {
      background: #f8f9fa;
    }

    .user-name {
      font-weight: 600;
      color: #333;
    }

    .role-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .role-admin {
      background: #dc3545;
      color: white;
    }

    .role-staff {
      background: #007bff;
      color: white;
    }

    .role-unknown {
      background: #6c757d;
      color: white;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-small {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
      border-radius: 4px;
    }

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

      .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .settings-actions {
        flex-direction: column;
      }

      .user-table-container {
        font-size: 0.8rem;
      }

      .user-table th,
      .user-table td {
        padding: 0.5rem 0.25rem;
      }

      .action-buttons {
        flex-direction: column;
        gap: 0.25rem;
      }

      .btn-small {
        font-size: 0.7rem;
        padding: 0.2rem 0.4rem;
      }
    }
  `]
})
export class AdminSettingsComponent {
  showAddUserForm = false;
  showUserList = false;
  isRegistering = false;
  loadingUsers = false;
  users: User[] = [];
  currentUserId: number | null = null;
  
  newUser = {
    staff_name: '',
    password: '',
    role_id: '',
    email: '',
    phone: ''
  };

  get shouldShowUserTable(): boolean {
    return !this.loadingUsers && this.users.length > 0;
  }

  get shouldShowNoUsers(): boolean {
    return !this.loadingUsers && this.users.length === 0;
  }

  getUserId(user: User): number | string {
    return user.id || user.staff_id || user.user_id || '-';
  }

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {
    // Get current user ID to prevent self-deletion
    const user = this.authService.user();
    this.currentUserId = user?.userId || null;
  }

  toggleAddUserForm(): void {
    this.showAddUserForm = !this.showAddUserForm;
    if (!this.showAddUserForm) {
      this.resetForm();
    }
  }

  toggleUserList(): void {
    this.showUserList = !this.showUserList;
    if (this.showUserList && this.users.length === 0) {
      this.refreshUserList();
    }
  }

  async refreshUserList(): Promise<void> {
    this.loadingUsers = true;
    this.cdr.detectChanges(); // Force change detection
    
    try {
      const response: any = await this.authService.getUsers().toPromise();
      this.users = response.data || response || [];
      console.log('Users loaded:', this.users);
      console.log('First user structure:', this.users[0]);
      console.log('loadingUsers before setting false:', this.loadingUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      alert('Failed to load users. Please try again.');
      this.users = [];
    } finally {
      this.loadingUsers = false;
      console.log('loadingUsers after setting false:', this.loadingUsers);
      this.cdr.detectChanges(); // Force change detection again
    }
  }

  getRoleName(roleId: number): string {
    switch (roleId) {
      case 1: return 'Admin';
      case 2: return 'Staff';
      default: return 'Unknown';
    }
  }

  getRoleClass(roleId: number): string {
    switch (roleId) {
      case 1: return 'role-admin';
      case 2: return 'role-staff';
      default: return 'role-unknown';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString || dateString === 'Invalid Date' || dateString === 'null' || dateString === 'undefined') {
      return '-';
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '-';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  }

  editUser(user: User): void {
    // For now, just show an alert. We can implement a proper edit form later
    alert(`Edit functionality for ${user.staff_name} will be implemented soon.`);
  }

  async deleteUser(user: User): Promise<void> {
    const userId = this.getUserId(user);
    if (userId === this.currentUserId || userId === '-') {
      alert('You cannot delete your own account or users without valid IDs.');
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete user "${user.staff_name}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      // Call the actual API to delete the user
      await this.authService.deleteUser(userId).toPromise();
      
      // Remove from local array after successful API call
      this.users = this.users.filter(u => this.getUserId(u) !== userId);
      alert(`User "${user.staff_name}" has been successfully deleted.`);
      
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      
      // Handle specific error messages
      let errorMessage = 'Failed to delete user. Please try again.';
      
      if (error?.status === 401) {
        errorMessage = 'Authentication required. Please login again.';
      } else if (error?.status === 403) {
        errorMessage = 'You don\'t have permission to delete users.';
      } else if (error?.status === 404) {
        errorMessage = 'User not found.';
      } else if (error?.error?.message) {
        errorMessage = `Delete failed: ${error.error.message}`;
      } else if (error?.message) {
        errorMessage = `Delete failed: ${error.message}`;
      }
      
      alert(errorMessage);
      
      // Refresh the list to ensure consistency with backend
      this.refreshUserList();
    }
  }

  resetForm(): void {
    this.newUser = {
      staff_name: '',
      password: '',
      role_id: '',
      email: '',
      phone: ''
    };
    this.isRegistering = false;
  }

  async registerUser(): Promise<void> {
    this.isRegistering = true;
    
    try {
      // Prepare user data for API
      const userData = {
        staff_name: this.newUser.staff_name,
        password: this.newUser.password,
        role_id: parseInt(this.newUser.role_id), // Convert to number
        email: this.newUser.email || undefined,
        phone: this.newUser.phone || undefined
      };

      console.log('Registering new user:', userData);
      
      // Call the real API
      const response = await this.authService.register(userData).toPromise();
      
      alert(`User "${this.newUser.staff_name}" has been successfully created!`);
      this.resetForm();
      this.showAddUserForm = false;
      
      // Refresh user list if it's currently shown
      if (this.showUserList) {
        this.refreshUserList();
      }
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Handle specific error messages from backend
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error?.status === 401) {
        errorMessage = 'Authentication required. Please login again.';
      } else if (error?.status === 403) {
        errorMessage = 'Admin access required. You don\'t have permission to create users.';
      } else if (error?.error?.message) {
        errorMessage = `${error.error.message}`;
      } else if (error?.message) {
        errorMessage = `${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      this.isRegistering = false;
    }
  }

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
