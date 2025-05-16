export enum TaskStatus {
  TODO = 'to_do',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  statusName?: string;
  priority: TaskPriority;
  assignedTo: string;
  assigned_to: string;
  assigneeName?: string;
  createdBy: string;
  createdAt: string;
  dueDate: string;
  teamId?: string;
  comments?: Comment[];
  priorityName?: string;
  assignedUser?: {
    id: string;
    username: string;
}
createdUser?: {
    id: string;
    username: string; 
}
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: string;
  user:{
    email:String;
    username:String
  };
  content:string
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
  teamId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
}

export interface CreateCommentRequest {
  content: string;
}