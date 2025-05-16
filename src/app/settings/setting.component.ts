import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../core/services/theme.service';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { User } from '../core/models/user.model';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  user: User | null = null;
  isDarkTheme = false;
  defaultAvatar = 'https://ui-avatars.com/api/?name=User';
  
  profileForm = {
    name: '',
    email: ''
  };
  
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    userId:this.user?.id || ''
  };
  
  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
    
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.profileForm.name = user.username;
        this.profileForm.email = user.email;
      }
    });
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  saveProfile(): void {
    if (!this.isProfileChanged()) return;
    
    // In a real app, this would make an API call
    this.notificationService.success('Profile updated successfully');
  }
  

  
  isProfileChanged(): boolean {
    return this.user?.username !== this.profileForm.name;
  }
  
  isPasswordFormValid(): boolean {
    return !!(
      this.passwordForm.currentPassword &&
      this.passwordForm.newPassword &&
      this.passwordForm.confirmPassword &&
      this.passwordForm.newPassword === this.passwordForm.confirmPassword &&
      this.passwordForm.newPassword.length >= 6
    );
  }
  
  formatRole(role: string | undefined): string {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  changePassword(): void {
  if (!this.isPasswordFormValid()) {
    this.notificationService.error('Please fill all fields correctly.');
    return;
  }

  this.userService.changePassword(this.passwordForm).subscribe({
    next: () => {
      this.notificationService.success('Password changed successfully');
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        userId:this.user?.id || ''
      };
    },
    error: (err) => {
      this.notificationService.error(err.error?.message || 'Error changing password');
    }
  });
}

}