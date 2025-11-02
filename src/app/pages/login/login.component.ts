import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';
  messageType: 'success' | 'error' | 'warning' | '' = '';
  loading = false;

  private baseUrl = 'https://drop-dreamer-backend-production.up.railway.app/auth';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.message = '⚠️ Please enter both email and password.';
      this.messageType = 'warning';
      return;
    }

    this.loading = true;
    const body = { email: this.email, password: this.password };

    this.http.post(`${this.baseUrl}/login`, body).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (res.message === 'User login successful') {
          this.message = '✅ Login successful!';
          this.messageType = 'success';

          // ✅ Store all user info properly
          const userData = {
            email: res.email,
            firstName: res.firstName,
            lastName: res.lastName,
            role: res.role
          };
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', res.token);

          // ✅ Redirect to products page
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 500);
        } else {
          this.message = res.message || 'Unexpected response.';
          this.messageType = 'warning';
        }
      },
      error: (err) => {
        this.loading = false;
        this.message = err.error?.message || '❌ Invalid credentials.';
        this.messageType = 'error';
      }
    });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
