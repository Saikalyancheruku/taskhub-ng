import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  user: User | null = null;
  isDropdownOpen = false;
  isDarkTheme = false;
  
  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) {
    this.authService.currentUser$.subscribe(user => {
      console.log(user);
      
      this.user = user;
    });
    
    this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
  }
  
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  logout(): void {
    this.authService.logout();
  }
}