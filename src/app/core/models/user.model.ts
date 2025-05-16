export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user'
}
export interface TeamMember {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  teamId?: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}