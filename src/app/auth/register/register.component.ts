import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { RegisterRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  userData: RegisterRequest = {
    username: '',
    email: '',
    password: ''
  };
  
  isLoading = false;
  
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}
  
  onSubmit(): void {
    if (!this.userData.username || !this.userData.email || !this.userData.password) {
      return;
    }
    
    this.isLoading = true;
    
    this.authService.register(this.userData).subscribe({
      next: () => {
        this.isLoading = false;
        this.notificationService.success('Registration successful!');
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.error(error.message || 'Registration failed. Please try again.');
      }
    });
  }
}