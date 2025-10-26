import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserInputComponent } from './user-input/user-input.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserInputComponent], // ✅ combined in one array
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // ✅ plural 'styleUrls'
})
export class AppComponent {
  title = 'dropdreamer-frontend';
}