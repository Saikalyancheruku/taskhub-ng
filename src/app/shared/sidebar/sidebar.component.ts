import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: UserRole[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  
  userName = 'User';
  userRole = '';
  userAvatar = 'https://ui-avatars.com/api/?name=User';
  
  navItems: NavItem[] = [];
  
  constructor(private authService: AuthService,
    private eRef: ElementRef
  ) {}
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.username;
        this.userRole = this.formatRole(user.role);
        this.userAvatar = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`;
        this.buildNavItems(user.role);
      }
    });
  }
  private formatRole(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrator';
      case UserRole.MANAGER:
        return 'Manager';
      case UserRole.USER:
        return 'Team Member';
      default:
        return 'User';
    }
  }
  
  private buildNavItems(userRole: UserRole): void {
    // Common items for all roles
    const items: NavItem[] = [
      {
        label: 'Dashboard',
        icon: '📊',
        route: this.getDashboardRoute(userRole),
        roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]
      },
      {
        label: 'Tasks',
        icon: '✅',
        route: '/tasks',
        roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]
      },
      {
        label: 'Settings',
        icon: '⚙️',
        route: '/settings',
        roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]
      }
    ];
    
    // Role-specific items
    if (userRole === UserRole.ADMIN || userRole === UserRole.MANAGER) {
      items.push({
        label: 'Create Task',
        icon: '➕',
        route: '/add',
        roles: [UserRole.ADMIN, UserRole.MANAGER]
      });
      
      items.push({
        label: 'Teams',
        icon: '👥',
        route: '/teams',
        roles: [UserRole.ADMIN, UserRole.MANAGER]
      });
    }
    
    this.navItems = items;
  }
  
  private getDashboardRoute(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return '/admin';
      case UserRole.MANAGER:
        return '/manager';
      case UserRole.USER:
        return '/user';
      default:
        return '/login';
    }
  }
}