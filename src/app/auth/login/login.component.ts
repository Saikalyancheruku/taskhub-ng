import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { LoginRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  
  isLoading = false;
  
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}
  
  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      return;
    }
    
    this.isLoading = true;
    
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.success('Login successful!');
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.error(error.message || 'Login failed. Please check your credentials.');
      }
    });
  }
  
  fillCredentials(email: string): void {
    this.credentials.email = email;
    this.credentials.password = 'password';
  }
}