import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { Task, TaskStatus, TaskPriority } from '../../core/models/task.model';
import { User, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  canCreateTask = false;
  currentUserRole: any;
  user :User | null = null;
  filters = { 
    status: '',
    priority: '',
    dueDate: ''
  };
  
  statuses: { id: string, name: string }[] = [];
  priorities: { id: string, name: string }[] = [];
  
  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
     this.user = this.authService.getCurrentUser();
    this.currentUserRole = this.user?.role;
    this.canCreateTask = this.user ? 
      [UserRole.ADMIN, UserRole.MANAGER].includes(this.user.role) : 
      false;
    
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilters();
    });
    
    this.taskService.getTaskStatuses().subscribe(statuses => {
      this.statuses = statuses;
    });
    
    this.taskService.getTaskPriorities().subscribe(priorities => {
      this.priorities = priorities;
    });
  }
  
  applyFilters(): void {
    let filtered = [...this.tasks];
    if (this.currentUserRole && this.currentUserRole === UserRole.USER) {
    filtered = filtered.filter(task => task.assigned_to === this.user?.id);
  }
    if (this.filters.status) {
      filtered = filtered.filter(task => task.status === this.filters.status);
    }
    
    if (this.filters.priority) {
      filtered = filtered.filter(task => task.priority === this.filters.priority);
    }
    
    if (this.filters.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      
      const monthFromNow = new Date(today);
      monthFromNow.setMonth(monthFromNow.getMonth() + 1);
      
      filtered = filtered.filter(task => {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        switch (this.filters.dueDate) {
          case 'overdue':
            return dueDate < today && task.status !== TaskStatus.DONE;
          case 'today':
            return dueDate.getTime() === today.getTime();
          case 'week':
            return dueDate >= today && dueDate <= weekFromNow;
          case 'month':
            return dueDate >= today && dueDate <= monthFromNow;
          default:
            return true;
        }
      });
    }
    
    this.filteredTasks = filtered;
  }
  
  clearFilters(): void {
    this.filters = {
      status: '',
      priority: '',
      dueDate: ''
    };
    this.applyFilters();
  }
  
  isOverdue(task: Task): boolean {
    return new Date(task.dueDate) < new Date() && task.statusName !== TaskStatus.DONE;
  }
}