import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

 import { AuthService } from '../core/services/auth.service';
import { TeamService } from '../core/services/team.service';
 import { NotificationService } from '../core/services/notification.service';
 import { Team, TeamMember, CreateTeamRequest, AddTeamMemberRequest } from '../core/models/team.model';
 import { User, UserRole } from '../core/models/user.model';
 import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css'],

})
export class TeamListComponent implements OnInit {
  teams: Team[] = [];
  teamMembers: { [key: number]: TeamMember[] } = {};
  isAdmin = false;
  showModal = false;
  editingTeam: Team | null = null;
  newMemberId :number =0;
userCounts: { [teamId: number]: number } = {};
  teamForm: CreateTeamRequest = {
    name: '',
    description: '',
    managerId: ''  // change to number if your backend expects managerId as a number
  };

 constructor(
  private teamService: TeamService,
  private authService: AuthService,
  private notificationService: NotificationService,
  private userService: UserService
) {}
  managers: any[] = [];

  allUsers: any[] = [];
  showUserModal = false;
  newUser = {
    name: '',
    email: '',
    role: 'user'
  };

  ngOnInit(): void {
    this.isAdmin = this.authService.getCurrentUserRole() === 'admin';
    this.loadTeams();
    this.loadAllUsers();
  }

  loadTeams(): void {
    this.teamService.getTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.teams.forEach(team => {
          this.loadTeamMembers(team);
        });
      },
      error: () => {
        this.notificationService.error('Failed to load teams.');
      }
    });
  }

  loadTeamMembers(team: Team): void {
    this.teamService.getTeamMembers(team.id).subscribe({
      next: (members) => {
        this.teamMembers[team.id] = members;
        this.userCounts[team.id] = members.length;
      },
      error: () => {
        this.notificationService.error(`Failed to load members for team ${team.name}.`);
      }
    });
  }

  loadAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
         this.managers = this.allUsers.filter(user => user.role === 'manager');
      },
      error: () => {
        this.notificationService.error('Failed to load users.');
      }
    });
  }

  showCreateTeamModal(): void {
    this.teamForm = { name: '', description: '', managerId: '' };
    this.editingTeam = null;
    this.showModal = true;
  }
  

  showEditTeamModal(team: Team): void {
    this.teamForm = {
      name: team.name,
      description: team.description,
      managerId: team.managerId
    };
    this.editingTeam = team;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveTeam(): void {
    if (this.editingTeam) {
      this.teamService.updateTeam(this.editingTeam.id, this.teamForm).subscribe({
        next: () => {
          this.notificationService.success('Team updated successfully.');
          this.loadTeams();
          this.closeModal();
        },
        error: () => {
          this.notificationService.error('Failed to update team.');
        }
      });
    } else {
      this.teamService.createTeam(this.teamForm).subscribe({
        next: () => {
          this.notificationService.success('Team created successfully.');
          this.loadTeams();
          this.closeModal();
        },
        error: () => {
          this.notificationService.error('Failed to create team.');
        }
      });
    }
  }

  deleteTeam(team: Team): void {
    if (confirm(`Are you sure you want to delete the team "${team.name}"?`)) {
      this.teamService.deleteTeam(team.id).subscribe({
        next: () => {
          this.notificationService.success('Team deleted.');
          this.loadTeams();
        },
        error: () => {
          this.notificationService.error('Failed to delete team.');
        }
      });
    }
  }

  canManageTeam(team: Team): boolean {
    const currentUser = this.authService.getCurrentUser();
    return this.isAdmin || currentUser?.id === team.managerId;
  }



addMember(team: Team): void {
  const userId = Number(this.newMemberId); // convert to number, if needed

  if (!userId) {
    this.notificationService.error('Invalid user ID');
    return;
  }

  const request = {
    userId: userId,
    teamId: team.id
  };

  this.teamService.addTeamMember(request).subscribe({
    next: () => {
      this.notificationService.success('Member added.');
      this.newMemberId = 0; // reset the input
      this.loadTeamMembers(team);
    },
    error: () => {
      this.notificationService.error('Failed to add member.');
    }
  });
}

  

  showCreateUserModal(): void {
    this.newUser = { name: '', email: '', role: 'user' };
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
  }

  isUserFormValid(): boolean {
    return !!this.newUser.name && !!this.newUser.email && !!this.newUser.role;
  }

  createUser(): void {
    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.notificationService.success('User created successfully.');
        this.closeUserModal();
        this.loadAllUsers();
      },
      error: () => {
        this.notificationService.error('Failed to create user.');
      }
    });
  }

  isTeamFormValid(): boolean {
    return !!this.teamForm.name && !!this.teamForm.managerId;
  }
}

