import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../../../assets/endpoints';
@Injectable({ providedIn: 'root' })
export class UserService {
  endPoints = ApiEndpoints;
  private baseUrl = this.endPoints.USERS;

  constructor(private apiService: ApiService) {}

  createUser(data: { name: string; email: string; role: string }): Observable<any> {
    return this.apiService.post(this.baseUrl, data);
  }

  getAllUsers(): Observable<any[]> {
    return this.apiService.get(this.baseUrl);
  }

  getUserById(id: number): Observable<any> {
    return this.apiService.get(`${this.baseUrl}/${id}`);
  }

  updateUser(id: number, data: { name?: string; email?: string; role?: string }): Observable<any> {
    return this.apiService.put(`${this.baseUrl}/${id}`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.apiService.delete(`${this.baseUrl}/${id}`);
  }


  changePassword(payload: { currentPassword: string; newPassword: string; confirmPassword: string;userId: string }): Observable<{ message: string }> {
  return this.apiService.post<{ message: string }>(this.endPoints.CHANGE_PASSWORD,
    {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword
    }
  );
}
}
