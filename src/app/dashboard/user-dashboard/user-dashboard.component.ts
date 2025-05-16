import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { Task, TaskStatus } from '../../core/models/task.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  tasks: Task[] = [];
  currentUserId: string = '';
  
  // Expose TaskStatus enum to template
  TaskStatus = TaskStatus;
  
  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    const user = this.authService.getCurrentUserId();
    console.log('Current User:', user);
    if (user) {
      this.currentUserId = user;
    }
    
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      
    });
  }
  
  getMyTasks(): Task[] {
    
    return this.tasks
      .filter(task => task.assigned_to === this.currentUserId)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }
  
  getTaskCount(): number {
    return this.getMyTasks().length;
  }
  
  getTasksByStatus(status: TaskStatus): Task[] {
    return this.getMyTasks().filter(task => task.status === status);
  }
  
  getDueSoonTasks(): Task[] {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return this.getMyTasks()
      .filter(task => {
        const dueDate = new Date(task.dueDate);
        return task.status !== TaskStatus.DONE && 
               dueDate >= today && 
               dueDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }
  
  isOverdue(task: Task): boolean {
    return new Date(task.dueDate).getTime() < Date.now() && task.status !== TaskStatus.DONE;
  }
  
  getStatusClass(status: string): string {
    return `badge-${status}`;
  }
}
