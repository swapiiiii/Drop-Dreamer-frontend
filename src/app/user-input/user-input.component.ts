import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ important for *ngIf

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule], // ✅ include CommonModule
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})
export class UserInputComponent {
  username: string = '';
  responseMessage: string = '';

  constructor(private http: HttpClient) {}

  sendUsername() {
    const apiUrl = 'https://drop-dreamer-backend-production.up.railway.app/users'; // ✅ your live backend

    this.http.post(apiUrl, { username: this.username }, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.responseMessage = res; // backend response
      },
      error: (err) => {
        console.error(err);
        this.responseMessage = 'Error sending data!';
      }
    });
  }
}
