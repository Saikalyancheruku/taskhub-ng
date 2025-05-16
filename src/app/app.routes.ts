import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { ManagerDashboardComponent } from './dashboard/manager-dashboard/manager-dashboard.component';
import { UserDashboardComponent } from './dashboard/user-dashboard/user-dashboard.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.component';
import { CreateTaskComponent } from './tasks/create-task/create-task.component';
import { TeamListComponent } from './teams/team-list.component';
import { SettingsComponent } from './settings/setting.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
     canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  { 
    path: 'manager', 
    component: ManagerDashboardComponent, 
     canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.MANAGER] }
  },
  { 
    path: 'user', 
    component: UserDashboardComponent, 
     canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.USER] }
  },
  { 
    path: 'tasks', 
    component: TaskListComponent, 
     canActivate: [AuthGuard]
  },
  { 
    path: 'tasks/:id', 
    component: TaskDetailComponent, 
     canActivate: [AuthGuard]
  },
  { 
    path: 'add', 
    component: CreateTaskComponent, 
     canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.MANAGER] }
  },
  { 
    path: 'teams', 
    component: TeamListComponent, 
     canActivate: [AuthGuard, RoleGuard],
     data: { roles: [UserRole.ADMIN, UserRole.MANAGER] }
  },
  { 
    path: 'settings', 
    component: SettingsComponent, 
     canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];