import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  
  notifications$ = this.notificationSubject.asObservable();
  
  success(message: string): void {
    this.show('success', message);
  }
  
  error(message: string): void {
    this.show('error', message);
  }
  
  info(message: string): void {
    this.show('info', message);
  }
  
  warning(message: string): void {
    this.show('warning', message);
  }
  
  private show(type: 'success' | 'error' | 'info' | 'warning', message: string): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message
    };
    
    this.notificationSubject.next(notification);
  }
  
  private generateId(): string {
    return 'notification-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000);
  }
}