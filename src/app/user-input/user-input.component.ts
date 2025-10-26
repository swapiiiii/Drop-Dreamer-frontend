import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})
export class UserInputComponent {
  username: string = '';
  responseMessage: string = '';

  constructor(private http: HttpClient) {}

  sendUsername() {
    const apiUrl = 'http://localhost:8080/users'; // replace with your backend endpoint

    this.http.post(apiUrl, { username: this.username }, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.responseMessage = res; // backend response like "Hello Swapnil"
      },
      error: (err) => {
        console.error(err);
        this.responseMessage = 'Error sending data!';
      }
    });
  }
}
