// types/jira.ts - Core type definitions

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  avatarUrls?: {
    '48x48': string;
    '24x24': string;
    '16x16': string;
    '32x32': string;
  };
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
      statusCategory: {
        key: string;
        name: string;
      };
    };
    assignee?: JiraUser;
    reporter?: JiraUser;
    created: string;
    updated: string;
    resolutiondate?: string;
    duedate?: string;
    issuetype: {
      name: string;
      subtask: boolean;
    };
    parent?: {
      key: string;
      fields: {
        summary: string;
      };
    };
    priority?: {
      name: string;
    };
    sprint?: {
      id: number;
      name: string;
      startDate: string;
      endDate: string;
    };
    storyPoints?: number;
  };
}

export interface SprintData {
  id: number;
  name: string;
  state: 'active' | 'closed' | 'future';
  startDate: string;
  endDate: string;
  boardId: number;
}

export interface BoardData {
  id: number;
  name: string;
  type: string;
  location?: {
    projectKey: string;
    projectName: string;
  };
}

export interface EmployeeMetrics {
  name: string;
  accountId: string;
  avatarUrl?: string;
  
  // Weekly metrics
  weekly: {
    total: number;
    completed: number;
    onTime: number;
    completionRate: number;
    onTimeRate: number;
    breakdown: {
      tasks: number;
      subtasks: number;
      stories: number;
      bugs: number;
    };
  };
  
  // Full sprint metrics
  fullSprint: {
    total: number;
    completed: number;
    onTime: number;
    completionRate: number;
    onTimeRate: number;
    breakdown: {
      tasks: number;
      subtasks: number;
      stories: number;
      bugs: number;
    };
  };
  
  // Additional analytics
  averageCompletionTime?: number;
  currentWorkload: number;
  velocity?: number;
}

export interface TeamMetrics {
  sprintName: string;
  sprintId: number[];
  startDate: string;
  endDate: string;
  week1End: string;
  
  // Aggregate metrics
  totalIssues: number;
  completedIssues: number;
  overallCompletionRate: number;
  overallOnTimeRate: number;
  
  // Employee breakdown
  employees: EmployeeMetrics[];
  
  // Sprint health
  sprintHealth: {
    velocity: number;
    burndownRate: number;
    scopeCreep: number;
  };
}

export interface DashboardFilters {
  boardId?: number;
  sprintName?: string;
  employeeName?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: 'READY' | 'ERROR' | 'BUILDING' | 'QUEUED' | 'CANCELED';
  creator: {
    username: string;
  };
}

export interface VercelProject {
  id: string;
  name: string;
  createdAt: number;
  framework: string;
  latestDeployments?: VercelDeployment[];
}
