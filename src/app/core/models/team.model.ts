export interface Team {
  id: number;
  name: string;
  description?: string;
  managerId: string;
  managerName?: string;
  memberCount: number;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  userId?: string;
  teamId: number;
  username: string;
  email: string;
  userRole: string;
  joinedAt: string;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  managerId: string;
}

export interface AddTeamMemberRequest {
  email: string;
}