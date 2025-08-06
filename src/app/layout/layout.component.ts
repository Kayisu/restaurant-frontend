import { Component, ElementRef, HostListener, ViewChild, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ToastContainerComponent } from '../shared/toast-container.component';



@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, ToastContainerComponent],
  styleUrl: './layout.component.scss',
  template: `
    <div class="layout">
      <!-- USER MENU DROPDOWN - Top Right -->
      <div class="user-menu" #menuRef (click)="toggleMenu()" [class.open]="menuOpen()">
        <div class="user-summary">
          <div class="avatar">
            {{ getUserInitial() }}
          </div>
          <div class="greeting">
            <span>Welcome</span>
            <span>{{ authService.user()?.user_name || 'User' }}</span>
          </div>
        </div>

        <div class="dropdown" *ngIf="menuOpen()">
          <button (click)="goToSettings($event)">⚙️ Settings</button>
          <button (click)="logout($event)">🚪 Logout</button>
        </div>
      </div>

      <main class="content">
        <router-outlet />
      </main>

      <!-- Toast notifications -->
      <app-toast-container />
    </div>
  `,
})

export class LayoutComponent {
  menuOpen = signal<boolean>(false);

  @ViewChild('menuRef') menuRef!: ElementRef;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  getUserInitial(): string {
    const user = this.authService.user();
    return user?.user_name ? user.user_name.charAt(0).toUpperCase() : 'U';
  }

  toggleMenu() {
    this.menuOpen.update(open => !open);
  }

  logout(event: Event) {
    event.stopPropagation();
    this.authService.logout();
    setTimeout(() => {
      this.router.navigate(['/login'], { 
        replaceUrl: true
      });
    }, 100);
  }

  goToSettings(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/settings']);
    this.menuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.menuRef?.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }
}

 