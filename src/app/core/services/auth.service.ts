import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, UserRole, AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';
import { ConfigService } from '../services/config.service'; // Assuming ConfigService is defined elsewhere
import { ApiEndpoints } from '../../../assets/endpoints'; // Adjust the import path as necessary
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getCurrentUserRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }
  private  API_URL = ''; // Mock API URL
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  ENDPOINTS = ApiEndpoints;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getSavedUser());
  private currentUserIdSubject = new BehaviorSubject<string | null>(this.getIdFromLocalStorage());
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.getToken());
  
  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private configService: ConfigService // Assuming ConfigService is defined elsewhere
  ) {
    this.API_URL = this.configService.getApiUrl(); // Get API URL from config
  }
  
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}${this.ENDPOINTS.AUTH_LOGIN}`, credentials).pipe(
      tap(response => {
        this.setSession(response);
        this.navigateBasedOnRole(response.user.role);
      }),
      catchError(error => {
              const errorMessage = error?.error?.message || 'Login failed. Please try again.';
      return throwError(() => new Error(errorMessage));
      })
    );
  }
  
  register(userData: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}${this.ENDPOINTS.AUTH_REGISTER}`, userData).pipe(
      tap(response => {
        this.setSession(response);
        this.navigateBasedOnRole(response.user.role);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );

  }
  
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  getCurrentUserId(): string | null { 
    return this.currentUserIdSubject.value;
    };
  
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  hasRole(role: UserRole | UserRole[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  }
  
  private setSession(authResult: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
    this.currentUserIdSubject.next(authResult.user.id);
    this.isLoggedInSubject.next(true);
  }
  
  private getSavedUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        localStorage.removeItem(this.USER_KEY);
      }
    }
    return null;
  }
  private getIdFromLocalStorage(): string | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        return user.id;
      } catch (e) {
        localStorage.removeItem(this.USER_KEY);
      }
    }
    return null;
  }
  
  private navigateBasedOnRole(role: UserRole): void {
    switch (role) {
      case UserRole.ADMIN:
        this.router.navigate(['/admin']);
        break;
      case UserRole.MANAGER:
        this.router.navigate(['/manager']);
        break;
      case UserRole.USER:
        this.router.navigate(['/user']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
  
  
 
  
  private getMockUser(role: UserRole): AuthResponse {
    const names = {
      [UserRole.ADMIN]: 'Admin User',
      [UserRole.MANAGER]: 'Manager User',
      [UserRole.USER]: 'Regular User'
    };
    
    return {
      user: {
        id: role + '-' + Date.now(),
        username: names[role],
        email: role + '@example.com',
        role: role,
        avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(names[role])
      },
      token: 'mock-jwt-token-' + role + '-' + Date.now()
    };
  }
}