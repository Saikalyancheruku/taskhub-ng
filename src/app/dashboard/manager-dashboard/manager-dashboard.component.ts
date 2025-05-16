import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../core/services/task.service';
import { TeamService } from '../../core/services/team.service';
import { AuthService } from '../../core/services/auth.service';
import { Task, TaskStatus } from '../../core/models/task.model';
import { Team } from '../../core/models/team.model';
import { TeamMember, User } from '../../core/models/user.model';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css'],
})
export class ManagerDashboardComponent implements OnInit {
  tasks: Task[] = [];
  myTeams: Team[] = [];
teamMembers: { [teamId: string]: any } = {};

  currentUserId: string = '';

  constructor(
    private taskService: TaskService,
    private teamService: TeamService,
    private authService: AuthService
  ) {}

 ngOnInit(): void {
  const user = this.authService.getCurrentUser();
  if (user) {
    this.currentUserId = user.id;
  }

  this.taskService.getTasks().subscribe(tasks => {
    this.tasks = tasks;
  });

  this.teamService.getTeams().subscribe(teams => {
    this.myTeams = teams.filter(team => team.managerId === this.currentUserId);

    // Now fetch members for each team of the manager
    this.myTeams.forEach(team => {
      this.teamService.getTeamMembers(team.id).subscribe(members => {
        this.teamMembers[team.id] = members;
      });
    });
  });
}


  getRecentTasks(): Task[] {
    return this.tasks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  getPendingTasks(): number {
    return this.tasks.filter(task => task.status !== TaskStatus.DONE).length;
  }

  getTeamMembersCount(): number {
    return this.myTeams.reduce((total, team) => {
      const members = this.teamMembers[team.id] || [];
      return total + members.length;
    }, 0);
  }

  getStatusClass(status: string): string {
    return `badge-${status}`;
  }
}
