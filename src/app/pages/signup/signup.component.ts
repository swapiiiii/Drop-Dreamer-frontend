import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  firstName = '';
  lastName = '';
  email = '';
  mobile = '';
  password = '';
  otp = '';

  step: 'signup' | 'verify' = 'signup';
  message = '';
  messageType: 'success' | 'error' | 'warning' | '' = '';
  loading = false;

  //private baseUrl = 'https://drop-dreamer-backend-production.up.railway.app/auth';
      private baseUrl=environment.apiBaseUrl +'/auth';


  constructor(private http: HttpClient, private router: Router) {}

  // Step 1: Signup
  onSignup() {
    if (!this.email || !this.password || !this.firstName || !this.lastName) {
      this.message = '⚠️ Please fill in all required fields.';
      this.messageType = 'warning';
      return;
    }

    this.loading = true;
    this.message = '';

    const body = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      mobile: this.mobile,
      password: this.password
    };

    this.http.post(`${this.baseUrl}/signup`, body).subscribe({
      next: (res: any) => {
        this.loading = false;
        const msg = (res?.message || '').toLowerCase();

        if (msg.includes('otp') && msg.includes('sent')) {
          this.step = 'verify';
          this.message = '📩 OTP sent to your email. Please verify.';
          this.messageType = 'success';
        } else {
          this.message = res?.message || 'Signup failed. Try again.';
          this.messageType = 'error';
        }
      },
      error: (err) => {
        this.loading = false;
        this.message = err.error?.message || 'Signup failed. Please try again.';
        this.messageType = 'error';
      }
    });
  }

  // Step 2: Verify OTP
  onVerifyOtp() {
    if (!this.otp) {
      this.message = '⚠️ Please enter the OTP.';
      this.messageType = 'warning';
      return;
    }

    this.loading = true;
    this.message = '';

    const body = { email: this.email, otp: this.otp };

    this.http.post(`${this.baseUrl}/verify-otp`, body).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (res.message?.toLowerCase().includes('verified')) {
          this.message = '✅ Email verified successfully!';
          this.messageType = 'success';

          // ✅ Auto-login after verification
          if (res.user && res.token) {
            localStorage.setItem('user', JSON.stringify(res.user));
            localStorage.setItem('token', res.token);

            setTimeout(() => {
              this.router.navigate(['/products']); // fixed route
            }, 800);
          } else {
            // Fallback → Go to login page
            setTimeout(() => this.router.navigate(['/login']), 1500);
          }
        } else {
          this.message = res.message || 'OTP verification failed.';
          this.messageType = 'error';
        }
      },
      error: (err) => {
        this.loading = false;
        this.message = err.error?.message || '❌ OTP verification failed. Try again.';
        this.messageType = 'error';
      }
    });
  }
}
