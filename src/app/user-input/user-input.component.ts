import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment'; // ✅ import environment

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})
export class UserInputComponent {
  username: string = '';
  responseMessage: string = '';

  constructor(private http: HttpClient) {}

  sendUsername() {
    const apiUrl = environment.apiUrl;

    this.http.post(apiUrl, { username: this.username }, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.responseMessage = res;
      },
      error: (err) => {
        console.error(err);
        this.responseMessage = 'Error sending data!';
      }
    });
  }
}
