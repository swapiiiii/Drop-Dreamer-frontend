import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLogin = false;
  isSignup = false;

  showLoginForm() {
    this.isLogin = true;
    this.isSignup = false;
  }

  showSignupForm() {
    this.isSignup = true;
    this.isLogin = false;
  }
}
