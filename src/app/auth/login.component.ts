import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onLogin()">
      <input [(ngModel)]="staff_name" name="staff_name" placeholder="Username" required />
      <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  `
})
export class LoginComponent {
  staff_name = '';
  password = '';

  constructor(private authService: AuthService) {}

  onLogin() {
  this.authService.login(this.staff_name, this.password).subscribe({
    next: () => {
      const user = this.authService.getUserFromToken();
      if (user) {
        this.authService.isAuthenticated.set(true);
        this.authService.user.set(user);
      } else {
        alert("Token çözümlenemedi");
      }
    },
    error: err => alert('Login failed: ' + err.error.message)
  });
}

}
