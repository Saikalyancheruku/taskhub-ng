import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { TeamService } from '../../core/services/team.service';
import { NotificationService } from '../../core/services/notification.service';
import { CreateTaskRequest, TaskPriority } from '../../core/models/task.model';
import { Team, TeamMember } from '../../core/models/team.model';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
 
})
export class CreateTaskComponent implements OnInit {
  @ViewChild('taskForm') taskForm!: NgForm;

  // teamId must be number, default to 0 means "none selected"
  taskData: CreateTaskRequest = {
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM,
    assigneeId: '',
    dueDate: '',
    teamId: '',
  };

  selectedTeamId = ''; // from select as string
  teams: Team[] = [];
  teamMembers: TeamMember[] = [];
  // priorities should have id matching TaskPriority type, adjust if needed
  priorities: { id: TaskPriority; name: string }[] = [];
  minDate: string;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private teamService: TeamService,
    private notificationService: NotificationService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.taskService.getTaskPriorities().subscribe((priorities) => {
      this.priorities = priorities.map(p => ({
        id: p.id as TaskPriority,
        name: p.name
      }));
      // If priorities do not come with TaskPriority enum ids,
      // you may need to map them accordingly here.
    });

    this.teamService.getTeams().subscribe((teams) => {
      this.teams = teams;
    });
  }

  onTeamChange(): void {
    if (this.selectedTeamId) {
      this.taskData.teamId = this.selectedTeamId; // Assign as string to match type
      this.taskData.assigneeId = '';

      this.teamService.getTeamMembers(Number(this.taskData.teamId)).subscribe((members) => {
        this.teamMembers = members;
      });
    } else {
      this.teamMembers = [];
      this.taskData.teamId = ''; // no team selected
      this.taskData.assigneeId = '';
    }
  }

  createTask(): void {
    if (!this.taskForm?.form.valid) {
      this.markFormTouched();
      return;
    }

    this.taskService.createTask(this.taskData).subscribe({
      next: () => {
        this.notificationService.success('Task created successfully');
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.notificationService.error('Failed to create task');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }

  markFormTouched(): void {
    Object.values(this.taskForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}

