import { Component, ElementRef, HostListener, ViewChild, Signal, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { DashboardComponent } from '../features/dashboard/dashboard.component';



@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [CommonModule, DashboardComponent],
  template: `
    <div class="layout">
      <main class="content">
        <app-dashboard *ngIf="view() === 'dashboard'" />
        <!-- diğer component'ler -->
      </main>

      <!-- USER MENU DROPDOWN -->
      <div class="user-menu" #menuRef (click)="toggleMenu()" [class.open]="menuOpen()">
        <div class="user-summary">
          <div class="avatar"></div>
          <div class="greeting">
            <span>Welcome</span>
            <span>{{ authService.user()?.staff_name || 'user' }}</span>
          </div>
        </div>

        <div class="dropdown" *ngIf="menuOpen()">
          <button (click)="goToSettings($event)">⚙️ Ayarlar</button>
          <button (click)="logout($event)">🚪 Çıkış Yap</button>
        </div>
      </div>
    </div>
  `,

  styles: [`
    .layout { display: flex; height: 100vh; }
    .sidebar {
      width: 200px;
      background: #2e2e2e;
      color: white;
      display: flex;
      flex-direction: column;
      padding: 1rem;
      gap: 1rem;
    }
    .sidebar button {
      background: #444;
      color: white;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
    }
    .logout {
      margin-top: auto;
      background: crimson;
    }
    .content {
      flex: 1;
      padding: 2rem;
    }

    .user-menu {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  cursor: pointer;
  user-select: none;

  .user-summary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #e5d4fb;
  }

  .greeting {
    display: flex;
    flex-direction: column;

    span:first-child {
      font-weight: 600;
    }

    span:last-child {
      color: #777;
      font-size: 0.75rem;
    }
  }

  .dropdown {
    margin-top: 0.5rem;
    background: white;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 10;

    button {
      background: none;
      border: none;
      text-align: left;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      cursor: pointer;

      &:hover {
        background-color: #f1f1f1;
      }
    }
}
    }
  

  `]
})

export class LayoutComponent {
  view = signal<'dashboard' | 'orders' | 'menu' | 'users'>('dashboard');
  menuOpen = signal<boolean>(false);

  @ViewChild('menuRef') menuRef!: ElementRef;

  constructor(public authService: AuthService) {}

  setView(view: typeof this.view extends Signal<infer T> ? T : never) {
    this.view.set(view);
    this.menuOpen.set(false);
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
    alert("Ayarlar sayfası henüz hazır değil");
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.menuRef?.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }
}

 