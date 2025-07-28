import { Component, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { LoginComponent } from './auth/login.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthService } from './core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-root', 
  imports: [NgIf, LoginComponent, LayoutComponent],
  template: `
    <ng-container *ngIf="authService.isAuthenticated(); else showLogin">
        <app-layout />
    </ng-container>

    <ng-template #showLogin>
        <app-login />
    </ng-template>
  `
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}

