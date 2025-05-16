import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { ApiService } from './api.service';
import { forkJoin, Observable } from 'rxjs';
import {switchMap} from 'rxjs';
import { 
  Task, 
  Comment, 
  TaskStatus, 
  TaskPriority, 
  CreateTaskRequest, 
  UpdateTaskRequest,
  CreateCommentRequest
} from '../models/task.model';
import { ApiEndpoints } from '../../../assets/endpoints';
import {AuthService} from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class TaskService {


  ENDPOINTS = ApiEndpoints;
 
  
  constructor(private apiService: ApiService,private authService : AuthService) {
  }
   statusMap: { [key: string]: string } = {
    [TaskStatus.TODO]: 'To Do',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.REVIEW]: 'Review',
    [TaskStatus.DONE]: 'Done'
  };

   priorityMap: { [key: string]: string } = {
    [TaskPriority.LOW]: 'Low',
    [TaskPriority.MEDIUM]: 'Medium',
    [TaskPriority.HIGH]: 'High'
  };

  
  getTasks(filters?: any): Observable<Task[]> {
  

  return this.apiService.get<Task[]>(this.ENDPOINTS.GET_TASKS, filters).pipe(
    map(tasks =>
      tasks.map(task => ({
        ...task,
        statusName: this.statusMap[task.status],
        priorityName: this.priorityMap[task.priority],
      assigneeName: task.assignedUser?.username ?? '',
      createdBy: task.createdUser?.username ?? ''
      }))
    )
  );
}

  
getTaskById(id: string): Observable<Task & { comments: Comment[] }> {
  return this.apiService.get<Task>(`${this.ENDPOINTS.GET_TASKS}/${id}`).pipe(
    switchMap(task =>
      this.apiService.get<Comment[]>(`${this.ENDPOINTS.GET_COMMENT_FOR_TASK}/${id}`).pipe(
        map(comments => ({
          ...task,
          statusName: this.statusMap[task.status],
          priorityName: this.priorityMap[task.priority],
          assigneeName: task.assignedUser?.username ?? '',
          createdBy: task.createdUser?.username ?? '',
          comments
        }))
      )
    )
  );
}

  
  createTask(taskData: CreateTaskRequest): Observable<Task> {
    const newTask : any ={
      
  title: taskData.title,
  description: taskData.description,
  priority: taskData.priority,
  status: TaskStatus.TODO,
  assigned_to:taskData.assigneeId,
  created_by: this.authService.getCurrentUser()?.id,
  dueDate: taskData.dueDate
}
    
    
    return this.apiService.post<Task>(`${this.ENDPOINTS.GET_TASKS}`,newTask)
  }
  
  updateTask(id: string, changes: UpdateTaskRequest): Observable<Task> {
return this.apiService.put<Task>(`${this.ENDPOINTS.GET_TASKS}/${id}`, changes).pipe(
    map(task => ({
      ...task,
      statusName: this.statusMap[task.status],
      priorityName: this.priorityMap[task.priority],
      assigneeName: task.assignedUser?.username ?? ''
    }))
  );
  }

  
 addComment(taskId: string, commentData: CreateCommentRequest): Observable<Comment> {
  const body = {
    taskId,
    userId: this.authService.getCurrentUser()?.id,  // Replace this with actual logged-in user ID
    comment: commentData.content
  };

  return this.apiService.post<Comment>(`comments`, body);
}

  
  getTaskStatuses(): Observable<{ id: string, name: string }[]> {
    return of([
      { id: TaskStatus.TODO, name: 'To Do' },
      { id: TaskStatus.IN_PROGRESS, name: 'In Progress' },
      { id: TaskStatus.REVIEW, name: 'Review' },
      { id: TaskStatus.DONE, name: 'Done' }
    ]);
  }
  
  getTaskPriorities(): Observable<{ id: string, name: string }[]> {
    return of([
      { id: TaskPriority.LOW, name: 'Low' },
      { id: TaskPriority.MEDIUM, name: 'Medium' },
      { id: TaskPriority.HIGH, name: 'High' }
    ]);
  }
  
  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}