import { Component, ElementRef, HostListener, ViewChild, Signal, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { DashboardComponent } from '../features/dashboard/dashboard.component';
import { SettingsComponent } from '../features/settings/settings.component';



@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [CommonModule, DashboardComponent, SettingsComponent],
  template: `
    <div class="layout">
      <main class="content">
        <app-dashboard *ngIf="view() === 'dashboard'" />
        <app-settings *ngIf="view() === 'settings'" (navigationRequest)="handleNavigation($event)" />
        <!-- diğer component'ler -->
      </main>

      <!-- USER MENU DROPDOWN -->
      <div class="user-menu" #menuRef (click)="toggleMenu()" [class.open]="menuOpen()">
        <div class="user-summary">
          <div class="avatar">
            {{ getUserInitial() }}
          </div>
          <div class="greeting">
            <span>Welcome</span>
            <span>{{ authService.user()?.staff_name || 'User' }}</span>
          </div>
        </div>

        <div class="dropdown" *ngIf="menuOpen()">
          <button (click)="goToSettings($event)">⚙️ Settings</button>
          <button (click)="logout($event)">🚪 Logout</button>
        </div>
      </div>
    </div>
  `,

  styles: [`
    .layout { 
      display: flex; 
      height: 100vh;
      position: relative;
    }
    
    .content {
      flex: 1;
    }

    .content app-dashboard {
      display: block;
      padding: 2rem;
      padding-top: 5rem; /* Add space for the fixed header */
    }

    .content app-settings {
      display: block;
      padding-top: 5rem; /* Only top padding for user menu space */
    }

    .user-menu {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      cursor: pointer;
      user-select: none;
      z-index: 1000;
      background: white;
      border-radius: 12px;
      padding: 0.75rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border: 1px solid #e1e5e9;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .user-menu:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }

    .user-summary {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 180px;
    }

    .avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .greeting {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .greeting span:first-child {
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
    }

    .greeting span:last-child {
      color: #666;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .user-menu.open .avatar {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    }

    .dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 8px;
      padding: 0.5rem 0;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      z-index: 1001;
      min-width: 160px;
      transform: translateY(-5px);
      opacity: 0;
      animation: slideDown 0.2s ease forwards;
    }

    @keyframes slideDown {
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .dropdown button {
      background: none;
      border: none;
      text-align: left;
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      cursor: pointer;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #333;
      transition: background-color 0.2s ease;
    }

    .dropdown button:hover {
      background-color: #f8f9fa;
    }

    .dropdown button:first-child:hover {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .dropdown button:last-child:hover {
      background-color: #ffebee;
      color: #d32f2f;
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .user-menu {
        top: 1rem;
        right: 1rem;
        padding: 0.5rem;
      }

      .user-summary {
        min-width: 150px;
        gap: 0.5rem;
      }

      .avatar {
        width: 40px;
        height: 40px;
        font-size: 1rem;
      }

      .content {
        padding: 1rem;
        padding-top: 4rem;
      }
    }
  `]
})

export class LayoutComponent {
  view = signal<'dashboard' | 'orders' | 'menu' | 'users' | 'settings'>('dashboard');
  menuOpen = signal<boolean>(false);

  @ViewChild('menuRef') menuRef!: ElementRef;

  constructor(public authService: AuthService) {}

  getUserInitial(): string {
    const user = this.authService.user();
    return user?.staff_name ? user.staff_name.charAt(0).toUpperCase() : 'U';
  }

  setView(view: 'dashboard' | 'orders' | 'menu' | 'users' | 'settings') {
    this.view.set(view);
    this.menuOpen.set(false);
  }

  handleNavigation(viewName: string) {
    if (viewName === 'dashboard') {
      this.setView('dashboard');
    }
  }

  toggleMenu() {
    this.menuOpen.update(open => !open);
  }

  logout(event: Event) {
    event.stopPropagation();
    this.authService.logout();
  }

  goToSettings(event: Event) {
    event.stopPropagation();
    this.setView('settings');
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.menuRef?.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }
}

 