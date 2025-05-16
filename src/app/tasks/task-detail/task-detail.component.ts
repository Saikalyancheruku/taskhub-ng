import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Task, Comment, TaskStatus, CreateCommentRequest } from '../../core/models/task.model';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css'],
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;
  isEditing = false;
  canEditTask = false;
  newComment = '';
  comments: Comment[] = [];
  
  editedTask: Partial<Task> = {};
  statuses: { id: string, name: string }[] = [];
  priorities: { id: string, name: string }[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}
  
  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (!taskId) {
      this.router.navigate(['/tasks']);
      return;
    }
    
    this.taskService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.task = task;
        this.initializeEditedTask();
        this.checkPermissions();
      },
      error: () => {
        this.notificationService.error('Task not found');
        this.router.navigate(['/tasks']);
      }
    });
    
    this.taskService.getTaskStatuses().subscribe(statuses => {
      this.statuses = statuses;
    });
    
    this.taskService.getTaskPriorities().subscribe(priorities => {
      this.priorities = priorities;
    });
  }
  
  private initializeEditedTask(): void {
    if (this.task) {
      this.editedTask = {
        status: this.task.status,
        priority: this.task.priority,
        description: this.task.description,
        dueDate: this.task.dueDate
      };
    }
  }
  
  private checkPermissions(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    
    this.canEditTask = 
      user.role === UserRole.ADMIN || 
      user.role === UserRole.MANAGER || 
      (this.task?.assigned_to === user.id);
  }
  
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.initializeEditedTask();
    }
  }
  
  saveChanges(): void {
    if (!this.task) return;
    
    this.taskService.updateTask(this.task.id, this.editedTask).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask;
        this.isEditing = false;
        this.notificationService.success('Task updated successfully');
      },
      error: () => {
        this.notificationService.error('Failed to update task');
      }
    });
  }
  
  deleteTask(): void {
    if (!this.task) return;
    
    if (confirm('Are you sure you want to delete this task?')) {
      // this.taskService.deleteTask(this.task.id).subscribe({
      //   next: () => {
      //     this.notificationService.success('Task deleted successfully');
      //     this.router.navigate(['/tasks']);
      //   },
      //   error: () => {
      //     this.notificationService.error('Failed to delete task');
      //   }
      // });
    }
  }
  
  addComment(): void {
  if (!this.task || !this.newComment.trim()) return;

  const commentData: CreateCommentRequest = {
    content: this.newComment.trim()
  };

  this.taskService.addComment(this.task.id, commentData).subscribe({
    next: (comment) => {
      // Initialize task.comments if it doesn't exist
      if (!this.task!.comments) {
        this.task!.comments = [];
      }

      this.task!.comments.push(comment);
      this.newComment = '';
      this.notificationService.success('Comment added successfully');
    },
    error: () => {
      this.notificationService.error('Failed to add comment');
    }
  });
}



  
  isOverdue(task: Task): boolean {
    return new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;
  }
}