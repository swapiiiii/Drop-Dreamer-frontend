import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLogin = false;
  isSignup = false;
  isOtpStep = false;
  loading = false;

  firstName = '';
  lastName = '';
  email = '';
  mobile = '';
  password = '';
  otp = '';
  message = '';
  messageType: 'success' | 'error' | 'warning' | '' = '';

  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  showLoginForm() {
    this.isLogin = true;
    this.isSignup = false;
    this.isOtpStep = false;
    this.message = '';
  }

  showSignupForm() {
    this.isSignup = true;
    this.isLogin = false;
    this.isOtpStep = false;
    this.message = '';
  }

  // ✅ Login
  onLogin() {
    this.loading = true;
    const body = { email: this.email, password: this.password };

    this.http.post(`${this.baseUrl}/login`, body).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.message === 'Login successful') {
          this.message = '✅ Login successful!';
          this.messageType = 'success';
          console.log('User info:', res);
        } else {
          this.message = res.message;
          this.messageType = 'warning';
        }
      },
      error: () => {
        this.loading = false;
        this.message = '❌ Login failed. Please try again.';
        this.messageType = 'error';
      }
    });
  }

  // ✅ Signup
  onSignup() {
    if (!this.email.includes('@') || !this.email.includes('.com')) {
      this.message = '⚠️ Please enter a valid email address.';
      this.messageType = 'warning';
      return;
    }
    if (this.password.length < 8) {
      this.message = '⚠️ Password must be at least 8 characters long.';
      this.messageType = 'warning';
      return;
    }

    this.loading = true;
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
        if (res.message.includes('OTP sent')) {
          this.message = '📧 OTP sent to your email. Please verify.';
          this.messageType = 'success';
          this.isSignup = false;
          this.isOtpStep = true;
        } else {
          this.message = res.message;
          this.messageType = 'warning';
        }
      },
      error: () => {
        this.loading = false;
        this.message = '❌ Signup failed. Try again.';
        this.messageType = 'error';
      }
    });
  }

  // ✅ Verify OTP
  verifyOtp() {
    if (!this.otp) {
      this.message = '⚠️ Please enter the OTP.';
      this.messageType = 'warning';
      return;
    }

    this.loading = true;
    const body = { email: this.email, otp: this.otp };

    this.http.post(`${this.baseUrl}/verify-otp`, body).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.message.includes('verified')) {
          this.message = '✅ Email verified successfully! You can now login.';
          this.messageType = 'success';
          this.isOtpStep = false;
          this.isLogin = true;
        } else {
          this.message = res.message;
          this.messageType = 'warning';
        }
      },
      error: () => {
        this.loading = false;
        this.message = '❌ OTP verification failed.';
        this.messageType = 'error';
      }
    });
  }
}
