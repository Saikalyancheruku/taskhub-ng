// import { Injectable } from '@angular/core';
// import { Observable, of } from 'rxjs';
// import { ApiService } from './api.service';
// import { Team, TeamMember, CreateTeamRequest, AddTeamMemberRequest } from '../models/team.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class TeamService {
//   private teams: Team[] = [
//     {
//       id: 'team-1',
//       name: 'Frontend Team',
//       description: 'Responsible for UI/UX implementation',
//       managerId: 'manager-101',
//       managerName: 'Manager User',
//       memberCount: 3,
//       createdAt: new Date().toISOString()
//     },
//     {
//       id: 'team-2',
//       name: 'Backend Team',
//       description: 'Responsible for API and database',
//       managerId: 'manager-102',
//       managerName: 'Another Manager',
//       memberCount: 4,
//       createdAt: new Date().toISOString()
//     },
//     {
//       id: 'team-3',
//       name: 'QA Team',
//       description: 'Quality assurance and testing',
//       managerId: 'manager-103',
//       managerName: 'QA Manager',
//       memberCount: 2,
//       createdAt: new Date().toISOString()
//     }
//   ];
  
//   private teamMembers: TeamMember[] = [
//     {
//       id: 'member-1',
//       userId: 'user-123',
//       teamId: 'team-1',
//       userName: 'John Doe',
//       userEmail: 'john@example.com',
//       userRole: 'developer',
//       joinedAt: new Date().toISOString()
//     },
//     {
//       id: 'member-2',
//       userId: 'user-456',
//       teamId: 'team-1',
//       userName: 'Jane Smith',
//       userEmail: 'jane@example.com',
//       userRole: 'designer',
//       joinedAt: new Date().toISOString()
//     },
//     {
//       id: 'member-3',
//       userId: 'user-789',
//       teamId: 'team-2',
//       userName: 'Bob Johnson',
//       userEmail: 'bob@example.com',
//       userRole: 'developer',
//       joinedAt: new Date().toISOString()
//     }
//   ];
  
//   constructor(private apiService: ApiService) {}
  
//   // In a real application, these would make API calls via apiService
  
//   getTeams(): Observable<Team[]> {
//     return of([...this.teams]);
//   }
  
//   getTeamById(id: string): Observable<Team> {
//     const team = this.teams.find(t => t.id === id);
    
//     if (!team) {
//       throw new Error('Team not found');
//     }
    
//     return of(team);
//   }
  
//   createTeam(teamData: CreateTeamRequest): Observable<Team> {
//     const newTeam: Team = {
//       id: 'team-' + Date.now(),
//       name: teamData.name,
//       description: teamData.description,
//       managerId: teamData.managerId,
//       memberCount: 1, // Manager is the first member
//       createdAt: new Date().toISOString()
//     };
    
//     this.teams.push(newTeam);
    
//     return of(newTeam);
//   }
  
//   updateTeam(id: string, changes: Partial<Team>): Observable<Team> {
//     const index = this.teams.findIndex(t => t.id === id);
    
//     if (index === -1) {
//       throw new Error('Team not found');
//     }
    
//     const updatedTeam = { ...this.teams[index], ...changes };
//     this.teams[index] = updatedTeam;
    
//     return of(updatedTeam);
//   }
  
//   deleteTeam(id: string): Observable<boolean> {
//     const initialLength = this.teams.length;
//     this.teams = this.teams.filter(t => t.id !== id);
    
//     // Also clean up team members
//     this.teamMembers = this.teamMembers.filter(tm => tm.teamId !== id);
    
//     return of(this.teams.length !== initialLength);
//   }
  
//   getTeamMembers(teamId: string): Observable<TeamMember[]> {
//     return of(this.teamMembers.filter(tm => tm.teamId === teamId));
//   }
  
//   addTeamMember(teamId: string, memberData: AddTeamMemberRequest): Observable<TeamMember> {
//     const team = this.teams.find(t => t.id === teamId);
    
//     if (!team) {
//       throw new Error('Team not found');
//     }
    
//     const newMember: TeamMember = {
//       id: 'member-' + Date.now(),
//       userId: memberData.userId,
//       teamId: teamId,
//       userName: 'New User', // In a real app, this would come from user service
//       userEmail: 'user@example.com', // In a real app, this would come from user service
//       userRole: 'member',
//       joinedAt: new Date().toISOString()
//     };
    
//     this.teamMembers.push(newMember);
    
//     // Update team member count
//     team.memberCount += 1;
    
//     return of(newMember);
//   }
  
//   removeTeamMember(teamId: string, memberId: string): Observable<boolean> {
//     const team = this.teams.find(t => t.id === teamId);
    
//     if (!team) {
//       throw new Error('Team not found');
//     }
    
//     const initialLength = this.teamMembers.length;
//     this.teamMembers = this.teamMembers.filter(tm => tm.id !== memberId);
    
//     if (this.teamMembers.length !== initialLength) {
//       // Update team member count
//       team.memberCount -= 1;
//       return of(true);
//     }
    
//     return of(false);
//   }
// }

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Team, TeamMember, CreateTeamRequest, AddTeamMemberRequest } from '../models/team.model';
import { ApiEndpoints } from '../../../assets/endpoints';
@Injectable({
  providedIn: 'root'
})
export class TeamService {
  endPoints = ApiEndpoints;
  private readonly baseUrl = this.endPoints.TEAMS;

  constructor(private apiService: ApiService) {}

  getTeams(): Observable<Team[]> {
    return this.apiService.get<Team[]>(this.baseUrl);
  }

  getTeamById(id: number): Observable<Team> {
    return this.apiService.get<Team>(`${this.baseUrl}/${id}`);
  }

  createTeam(teamData: CreateTeamRequest): Observable<Team> {
    return this.apiService.post<Team>(this.baseUrl, teamData);
  }

  updateTeam(id: number, changes: Partial<Team>): Observable<Team> {
    return this.apiService.put<Team>(`${this.baseUrl}/${id}`, changes);
  }

  deleteTeam(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  getTeamMembers(teamId: number): Observable< TeamMember[] > {
    return this.apiService.get<TeamMember[] >(`${this.baseUrl}/${teamId}/users`);
  }

 addTeamMember(request: { userId: number; teamId: number }): Observable<any> {
  return this.apiService.post(`${this.baseUrl}/assign`, request);
}
  removeTeamMember(teamId: number, memberId: string): Observable<void> {
  return this.apiService.delete<void>(`${this.baseUrl}/${teamId}/users/${memberId}`);
}

}
