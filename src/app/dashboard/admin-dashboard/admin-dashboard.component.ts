import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../core/services/task.service';
import { TeamService } from '../../core/services/team.service';
import { Task } from '../../core/models/task.model';
import { Team } from '../../core/models/team.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  tasks: Task[] = [];
  teams: Team[] = [];
   teamMembers: { [teamId: string]: User[] } = {};

  constructor(
    private taskService: TaskService,
    private teamService: TeamService
  ) {}
  
  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
    
    this.teamService.getTeams().subscribe(teams => {
      this.teams = teams;
    });
  }
  
  getRecentTasks(): Task[] {
    return this.tasks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }
  
  getCompletedTasks(): number {
    return this.tasks.filter(task => task.status === 'done').length;
  }
 
getTotalMembers(): number {
  return this.teams.reduce((total, team) => {
    const members = this.teamMembers[team.id] || [];
    return total + members.length;
  }, 0);
}


  
  getStatusClass(status: string): string {
    return `badge-${status}`;
  }
}