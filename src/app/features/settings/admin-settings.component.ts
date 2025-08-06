import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

interface User {
  id?: number;
  user_id?: number;
  user_name: string;
  role_id: number;
  email?: string;
  phone?: string;
  created_at: string;
}

@Component({
  standalone: true,
  selector: 'app-admin-settings',
  imports: [CommonModule, FormsModule],
  styleUrl: './styles/admin-settings.component.scss',
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
            <button class="btn-primary" (click)="toggleUserList()">
              {{ showUserList ? 'Hide Users' : 'Show Users' }}
              <span *ngIf="!showUserList && users.length > 0" class="user-count">({{ users.length }})</span>
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
            <!-- Admin Users Section -->
            <div class="user-section" *ngIf="adminUsers.length > 0">
              <div class="section-header">
                <h3 class="section-title">👑 Administrators ({{ adminUsers.length }})</h3>
                <div class="section-divider"></div>
              </div>
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
                  <ng-container *ngFor="let user of adminUsers">
                    <tr class="user-row admin-row">
                      <td>{{ getUserId(user) }}</td>
                      <td class="user-name">{{ user.user_name }}</td>
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
                          <button class="btn-warning btn-small" (click)="startEdit(user)">
                            {{ editingUserId === getUserId(user) ? 'Cancel' : 'Edit' }}
                          </button>
                          <button 
                            class="btn-danger btn-small" 
                            (click)="deleteUser(user)" 
                            [disabled]="isCurrentUser(user)"
                            [title]="isCurrentUser(user) ? 'You cannot delete your own account' : 'Delete user'"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Inline Edit Form for Admins -->
                    <tr *ngIf="editingUserId === getUserId(user)" class="edit-form-row">
                      <td colspan="7">
                        <div class="inline-edit-form">
                          <h4>Edit Admin: {{ user.user_name }}</h4>
                          
                          <div class="edit-form-grid">
                            <div class="form-group">
                              <label for="edit_staff_name">Username</label>
                              <input 
                                id="edit_user_name"
                                type="text" 
                                [(ngModel)]="editForm.user_name"
                                placeholder="Enter username"
                              />
                            </div>
                            
                            <div class="form-group">
                              <label for="edit_email">Email</label>
                              <input 
                                id="edit_email"
                                type="email" 
                                [(ngModel)]="editForm.email"
                                placeholder="Enter email"
                              />
                            </div>
                            
                            <div class="form-group">
                              <label for="edit_phone">Phone</label>
                              <input 
                                id="edit_phone"
                                type="tel" 
                                [(ngModel)]="editForm.phone"
                                placeholder="Enter phone"
                              />
                            </div>
                            
                            <div class="form-group">
                              <label for="edit_role">Role</label>
                              <select id="edit_role" [(ngModel)]="editForm.role_id" [disabled]="isEditingSelfRole(user)">
                                <option value="1">Admin</option>
                                <option value="2">Staff</option>
                              </select>
                              <small class="role-warning" *ngIf="isEditingSelfRole(user)">
                                ⚠️ You cannot change your own role for security reasons
                              </small>
                            </div>
                            
                            <div class="form-group">
                              <label for="edit_password">New Password (optional)</label>
                              <input 
                                id="edit_password"
                                type="password" 
                                [(ngModel)]="editForm.password"
                                placeholder="Leave empty to keep current password"
                              />
                            </div>
                          </div>
                          
                          <div class="edit-form-actions">
                            <button class="btn-success" (click)="saveEdit(user)">
                              Save Changes
                            </button>
                            <button class="btn-cancel" (click)="cancelEdit()">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </ng-container>
                </tbody>
              </table>
            </div>

            <!-- Staff Users Section -->
            <div class="user-section" *ngIf="staffUsers.length > 0">
              <div class="section-header">
                <h3 class="section-title">👥 Staff Members ({{ staffUsers.length }})</h3>
                <div class="section-divider"></div>
              </div>
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
                  <ng-container *ngFor="let user of staffUsers">
                    <tr class="user-row staff-row">
                      <td>{{ getUserId(user) }}</td>
                      <td class="user-name">{{ user.user_name }}</td>
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
                          <button class="btn-warning btn-small" (click)="startEdit(user)">
                            {{ editingUserId === getUserId(user) ? 'Cancel' : 'Edit' }}
                          </button>
                          <button 
                            class="btn-danger btn-small" 
                            (click)="deleteUser(user)" 
                            [disabled]="isCurrentUser(user)"
                            [title]="isCurrentUser(user) ? 'You cannot delete your own account' : 'Delete user'"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Inline Edit Form for Staff -->
                    <tr *ngIf="editingUserId === getUserId(user)" class="edit-form-row">
                      <td colspan="7">
                        <div class="inline-edit-form">
                          <h4>Edit User: {{ user.user_name }}</h4>

                          <div class="edit-form-grid">
                            <div class="form-group">
                              <label for="edit_user_name">Username</label>
                              <input 
                                id="edit_user_name"
                                type="text" 
                                [(ngModel)]="editForm.user_name"
                                placeholder="Enter username"
                              />
                            </div>
                            
                            <div class="form-group">
                              <label for="edit_email">Email</label>
                              <input 
                                id="edit_email"
                                type="email" 
                                [(ngModel)]="editForm.email"
                                placeholder="Enter email"
                              />
                            </div>
                            
                            <div class="form-group">
                              <label for="edit_phone">Phone</label>
                              <input 
                                id="edit_phone"
                                type="tel" 
                                [(ngModel)]="editForm.phone"
                                placeholder="Enter phone"
                              />
                            </div>
                            
                            <div class="form-group">
                              <label for="edit_role">Role</label>
                              <select id="edit_role" [(ngModel)]="editForm.role_id" [disabled]="isEditingSelfRole(user)">
                                <option value="1">Admin</option>
                                <option value="2">Staff</option>
                              </select>
                              <small class="role-warning" *ngIf="isEditingSelfRole(user)">
                                ⚠️ You cannot change your own role for security reasons
                              </small>
                            </div>
                            
                            <div class="form-group">
                              <label for="edit_password">New Password (optional)</label>
                              <input 
                                id="edit_password"
                                type="password" 
                                [(ngModel)]="editForm.password"
                                placeholder="Leave empty to keep current password"
                              />
                            </div>
                          </div>
                          
                          <div class="edit-form-actions">
                            <button class="btn-success" (click)="saveEdit(user)">
                              Save Changes
                            </button>
                            <button class="btn-cancel" (click)="cancelEdit()">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </ng-container>
                </tbody>
              </table>
            </div>
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
                  [(ngModel)]="newUser.user_name"
                  name="user_name"
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
      </div>
    </div>
  `
})
export class AdminSettingsComponent implements OnInit {
  showAddUserForm = false;
  showUserList = false;
  isRegistering = false;
  loadingUsers = false;
  users: User[] = [];
  currentUserId: number | null = null;
  
  editingUserId: number | string | null = null;
  editForm = {
    user_name: '',
    email: '',
    phone: '',
    password: '',
    role_id: 2
  };
  
  newUser = {
    user_name: '',
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

  get adminUsers(): User[] {
    return this.users.filter(user => user.role_id === 1);
  }

  get staffUsers(): User[] {
    return this.users.filter(user => user.role_id === 2);
  }

  getUserId(user: User): number | string {
    return user.id || user.user_id || '-';
  }

  isEditingSelfRole(user: User): boolean {
    const currentUser = this.authService.user();
    const userId = this.getUserId(user);
    return !!(currentUser && (currentUser.userId === userId || 
                             currentUser.userId.toString() === userId.toString()));
  }

  isCurrentUser(user: User): boolean {
    const userId = this.getUserId(user);
    return userId === this.currentUserId || userId.toString() === this.currentUserId?.toString();
  }

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private toastService: ToastService) {
    const user = this.authService.user();
    this.currentUserId = user?.userId || null;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.refreshUserList();
    }, 0);
  }

  toggleAddUserForm(): void {
    this.showAddUserForm = !this.showAddUserForm;
    
    // Close user list when opening add user form
    if (this.showAddUserForm && this.showUserList) {
      this.showUserList = false;
    }
    
    if (!this.showAddUserForm) {
      this.resetForm();
    }
  }

  toggleUserList(): void {
    this.showUserList = !this.showUserList;
    
    // Close add user form when opening user list
    if (this.showUserList && this.showAddUserForm) {
      this.showAddUserForm = false;
      this.resetForm();
    }
    
    if (this.showUserList && this.users.length === 0 && !this.loadingUsers) {
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

  startEdit(user: User): void {
    if (this.editingUserId === this.getUserId(user)) {
      // Cancel edit if already editing this user
      this.cancelEdit();
    } else {
      // Start editing this user
      this.editingUserId = this.getUserId(user);
      this.editForm = {
        user_name: user.user_name,
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        role_id: user.role_id
      };
    }
  }

  cancelEdit(): void {
    this.editingUserId = null;
    this.editForm = {
      user_name: '',
      email: '',
      phone: '',
      password: '',
      role_id: 2  // Default to Staff (2), not Admin (1)
    };
  }

  async saveEdit(user: User): Promise<void> {
    const userId = this.getUserId(user);
    if (userId === '-') {
      this.toastService.error('Update Failed! ❌', 'Cannot update user: Invalid user ID');
      return;
    }

    // Prepare updates object with only changed fields
    const updates: any = {};

    if (this.editForm.user_name !== user.user_name && this.editForm.user_name.trim()) {
      updates.user_name = this.editForm.user_name.trim();
    }
    
    if (this.editForm.email !== (user.email || '') && this.editForm.email.trim()) {
      updates.email = this.editForm.email.trim();
    }
    
    if (this.editForm.phone !== (user.phone || '') && this.editForm.phone.trim()) {
      updates.phone = this.editForm.phone.trim();
    }
    
    if (this.editForm.role_id !== user.role_id) {
      // Check if admin is trying to change their own role
      const currentUser = this.authService.user();
      const isEditingSelf = currentUser && (currentUser.userId === userId || 
                                           currentUser.userId.toString() === userId.toString());
      
      if (isEditingSelf) {
        this.toastService.error('Security Error! ❌', 'You cannot change your own role for security reasons');
        return;
      }
      
      updates.role_id = this.editForm.role_id;
    }
    
    if (this.editForm.password && this.editForm.password.length >= 6) {
      updates.password = this.editForm.password;
    } else if (this.editForm.password && this.editForm.password.length < 6) {
      this.toastService.error('Validation Error! ❌', 'Password must be at least 6 characters long');
      return;
    }

    // Check if there are any changes
    if (Object.keys(updates).length === 0) {
      this.toastService.info('No Changes! ℹ️', 'No changes detected to update');
      this.cancelEdit();
      return;
    }

    try {
      // Check if admin is editing themselves
      const currentUser = this.authService.user();
      const isEditingSelf = currentUser && (currentUser.userId === userId || 
                                           currentUser.userId.toString() === userId.toString());
      
      if (isEditingSelf && this.editForm.password) {
        // Admin editing their own password - this requires special handling
        // For now, show a toast that password change should be done via staff settings
        this.toastService.warning('Password Change! ⚠️', 'Please use Staff Settings to change your own password securely');
        
        // Remove password from updates and continue with other fields
        const { password, ...updatesWithoutPassword } = updates;
        if (Object.keys(updatesWithoutPassword).length > 0) {
          await this.authService.adminUpdateCredentials(userId, updatesWithoutPassword).toPromise();
          this.toastService.success('Profile Updated! 📝', `Profile updated successfully! Password change should be done via Staff Settings.`);
          
          // Refresh session for self-edit to update user menu
          setTimeout(() => {
            this.authService.refreshUserFromToken();
          }, 300);
        }
      } else {
        // Admin editing other users OR admin editing own profile without password
        await this.authService.adminUpdateCredentials(userId, updates).toPromise();
        this.toastService.success('User Updated! 📝', `User "${user.user_name}" updated successfully!`);

        // If admin edited themselves (without password), refresh session
        if (isEditingSelf) {
          setTimeout(() => {
            this.authService.refreshUserFromToken();
          }, 300);
        }
      }
      
      this.cancelEdit();
      this.refreshUserList();
    } catch (error: any) {
      console.error('Failed to update user:', error);
      
      // Handle specific error messages for user updates
      let errorMessage = 'Failed to update user. Please try again.';
      
      if (error?.status === 400) {
        // Bad request - likely duplicate username or validation error
        if (error?.error?.message?.includes('already exists') || 
            error?.error?.message?.includes('duplicate') ||
            error?.error?.message?.includes('unique')) {
          errorMessage = `Username "${this.editForm.user_name}" already exists. Please choose a different username.`;
        } else if (error?.error?.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = 'Invalid data provided. Please check all fields and try again.';
        }
      } else if (error?.status === 401) {
        errorMessage = 'Authentication required. Please login again.';
      } else if (error?.status === 403) {
        errorMessage = 'You don\'t have permission to update this user.';
      } else if (error?.status === 409) {
        // Conflict - duplicate entry
        errorMessage = `Username "${this.editForm.user_name}" already exists. Please choose a different username.`;
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      this.toastService.error('Update Failed! ❌', errorMessage);
    }
  }

  editUser(user: User): void {
    // Keep old method for compatibility, redirect to new method
    this.startEdit(user);
  }

  async updateUserCredentials(user: User, updates: any): Promise<void> {
    const userId = this.getUserId(user);
    if (userId === '-') {
      this.toastService.error('Update Failed! ❌', 'Cannot update user: Invalid user ID');
      return;
    }

    try {
      await this.authService.adminUpdateCredentials(userId, updates).toPromise();
      this.toastService.success('User Updated! 📝', `User "${user.user_name}" updated successfully!`);

      // Refresh user list to show changes
      this.refreshUserList();
    } catch (error: any) {
      console.error('Failed to update user:', error);
      this.toastService.error('Update Failed! ❌', error.error?.message || 'Failed to update user. Please try again.');
    }
  }

  async deleteUser(user: User): Promise<void> {
    const userId = this.getUserId(user);
    
    // Prevent self-deletion
    if (this.isCurrentUser(user)) {
      this.toastService.error('Delete Denied! ❌', 'You cannot delete your own account for security reasons.');
      return;
    }
    
    if (userId === '-') {
      this.toastService.error('Delete Failed! ❌', 'Cannot delete user: Invalid user ID');
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete user "${user.user_name}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      // Call the actual API to delete the user
      await this.authService.deleteUser(userId).toPromise();
      
      // Remove from local array after successful API call
      this.users = this.users.filter(u => this.getUserId(u) !== userId);
      this.toastService.success('User Deleted! 🗑️', `User "${user.user_name}" has been successfully deleted.`);

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
      
      this.toastService.error('Delete Failed! ❌', errorMessage);
      
      // Refresh the list to ensure consistency with backend
      this.refreshUserList();
    }
  }

  resetForm(): void {
    this.newUser = {
      user_name: '',
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
        user_name: this.newUser.user_name,
        password: this.newUser.password,
        role_id: parseInt(this.newUser.role_id), // Convert to number
        email: this.newUser.email || undefined,
        phone: this.newUser.phone || undefined
      };

      console.log('Registering new user:', userData);
      
      // Call the real API
      const response = await this.authService.register(userData).toPromise();

      this.toastService.success('User Created! 👤', `User "${this.newUser.user_name}" has been successfully created!`);
      this.resetForm();
      this.showAddUserForm = false;
      
      // Refresh user list to show the new user
      this.refreshUserList();
      
      // If user list is not currently shown, show it to display the new user
      if (!this.showUserList) {
        this.showUserList = true;
      }
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Handle specific error messages from backend
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error?.status === 400) {
        // Bad request - likely duplicate username or validation error
        if (error?.error?.message?.includes('already exists') || 
            error?.error?.message?.includes('duplicate') ||
            error?.error?.message?.includes('unique')) {
          errorMessage = `Username "${this.newUser.user_name}" already exists. Please choose a different username.`;
        } else if (error?.error?.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = 'Invalid data provided. Please check all fields and try again.';
        }
      } else if (error?.status === 401) {
        errorMessage = 'Authentication required. Please login again.';
      } else if (error?.status === 403) {
        errorMessage = 'Admin access required. You don\'t have permission to create users.';
      } else if (error?.status === 409) {
        // Conflict - duplicate entry
        errorMessage = `Username "${this.newUser.user_name}" already exists. Please choose a different username.`;
      } else if (error?.error?.message) {
        errorMessage = `${error.error.message}`;
      } else if (error?.message) {
        errorMessage = `${error.message}`;
      }
      
      this.toastService.error('Registration Failed! ❌', errorMessage);
    } finally {
      this.isRegistering = false;
    }
  }
}
