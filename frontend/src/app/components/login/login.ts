import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  isLoading = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      return;
    }

    this.isLoading = true;

    // Simulate API call
    console.log('Login submitted:', { username: this.username });

    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }
}
