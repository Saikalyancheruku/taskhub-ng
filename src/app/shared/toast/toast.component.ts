import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../core/services/notification.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toasts" 
        class="toast toast-{{ toast.type }}"
        [@fadeInOut]
      >
        <div class="toast-content">{{ toast.message }}</div>
        <button class="toast-close" (click)="removeToast(toast.id)">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 1000;
      max-width: 350px;
    }
    
    .toast {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      margin-bottom: 8px;
      border-radius: 4px;
      box-shadow: var(--shadow-md);
      color: white;
    }
    
    .toast-success {
      background-color: var(--success);
    }
    
    .toast-error {
      background-color: var(--error);
    }
    
    .toast-info {
      background-color: var(--info);
    }
    
    .toast-warning {
      background-color: var(--warning);
    }
    
    .toast-content {
      flex: 1;
    }
    
    .toast-close {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      margin-left: 16px;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }
    
    .toast-close:hover {
      opacity: 1;
    }
  `],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class ToastComponent implements OnInit {
  toasts: Notification[] = [];
  
  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(notification => {
      this.toasts.push(notification);
      this.setAutoRemove(notification.id);
    });
  }
  
  removeToast(id: string): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }
  
  private setAutoRemove(id: string): void {
    setTimeout(() => {
      this.removeToast(id);
    }, 5000);
  }
}