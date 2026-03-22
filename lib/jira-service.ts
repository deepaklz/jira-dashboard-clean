// lib/jira-service.ts - JIRA API Integration

import axios, { AxiosInstance } from 'axios';
import { JiraIssue, SprintData, BoardData, EmployeeMetrics, TeamMetrics } from '@/types/jira';
import { calculateWeek1End, isInWeek1, isCompletedOnTime, calculateRate, calculateAverageCompletionTime } from './utils';

class JiraService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 30000,
    });
  }

  /**
   * Fetch all boards
   */
  async getBoards(): Promise<BoardData[]> {
    try {
      const response = await this.client.get('/api/jira/boards');
      return response.data.values || [];
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }
  }

  /**
   * Fetch sprints for a specific board
   */
  async getSprints(boardId: number): Promise<SprintData[]> {
    try {
      const response = await this.client.get(`/api/jira/boards/${boardId}/sprints`);
      return response.data.values || [];
    } catch (error) {
      console.error(`Error fetching sprints for board ${boardId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch all sprints across multiple boards with the same name
   */
  async getSprintsByName(boardIds: number[], sprintName: string): Promise<SprintData[]> {
    try {
      const allSprints = await Promise.all(
        boardIds.map(boardId => this.getSprints(boardId))
      );
      
      const flatSprints = allSprints.flat();
      const matchingSprints = flatSprints.filter(sprint => sprint.name === sprintName);
      
      return matchingSprints;
    } catch (error) {
      console.error('Error fetching sprints by name:', error);
      throw error;
    }
  }

  /**
   * Fetch issues for a sprint using JQL
   */
  async getIssuesForSprint(sprintIds: number[]): Promise<JiraIssue[]> {
    try {
      const jql = `sprint in (${sprintIds.join(',')}) ORDER BY created DESC`;
      
      const response = await this.client.post('/api/jira/search', {
        jql,
        maxResults: 1000,
        fields: [
          'summary',
          'status',
          'assignee',
          'reporter',
          'created',
          'updated',
          'resolutiondate',
          'duedate',
          'issuetype',
          'parent',
          'priority',
          'customfield_10016', // Story points
        ],
      });
      
      return response.data.issues || [];
    } catch (error) {
      console.error('Error fetching sprint issues:', error);
      throw error;
    }
  }

  /**
   * Global search fallback for employee tasks
   */
  async searchEmployeeTasks(
    employeeAccountId: string,
    sprintIds: number[]
  ): Promise<JiraIssue[]> {
    try {
      const jql = `assignee = "${employeeAccountId}" AND sprint in (${sprintIds.join(',')})`;
      
      const response = await this.client.post('/api/jira/search', {
        jql,
        maxResults: 500,
        fields: [
          'summary',
          'status',
          'assignee',
          'created',
          'updated',
          'resolutiondate',
          'duedate',
          'issuetype',
          'parent',
        ],
      });
      
      return response.data.issues || [];
    } catch (error) {
      console.error('Error searching employee tasks:', error);
      return [];
    }
  }

  /**
   * Calculate metrics for a single employee
   */
  calculateEmployeeMetrics(
    issues: JiraIssue[],
    sprintStart: string,
    sprintEnd: string,
    week1End: string
  ): Omit<EmployeeMetrics, 'name' | 'accountId' | 'avatarUrl'> {
    // Filter by period
    const week1Issues = issues.filter(issue => {
      const completionDate = issue.fields.resolutiondate || issue.fields.updated;
      return isInWeek1(completionDate, sprintStart, week1End);
    });

    const fullSprintIssues = issues;

    // Calculate metrics for Week 1
    const weeklyMetrics = this.calculatePeriodMetrics(week1Issues, sprintStart, week1End);
    
    // Calculate metrics for Full Sprint
    const sprintMetrics = this.calculatePeriodMetrics(fullSprintIssues, sprintStart, sprintEnd);

    return {
      weekly: weeklyMetrics,
      fullSprint: sprintMetrics,
      averageCompletionTime: calculateAverageCompletionTime(fullSprintIssues),
      currentWorkload: fullSprintIssues.filter(i => 
        i.fields.status.statusCategory.key !== 'done'
      ).length,
    };
  }

  /**
   * Calculate metrics for a specific period
   */
  private calculatePeriodMetrics(
    issues: JiraIssue[],
    startDate: string,
    endDate: string
  ) {
    const total = issues.length;
    const completed = issues.filter(i => 
      i.fields.status.statusCategory.key === 'done'
    ).length;
    
    const onTime = issues.filter(i => {
      if (i.fields.status.statusCategory.key !== 'done') return false;
      
      return isCompletedOnTime(
        i.fields.resolutiondate,
        i.fields.updated,
        i.fields.duedate,
        endDate
      );
    }).length;

    // Breakdown by type
    const breakdown = {
      tasks: issues.filter(i => 
        i.fields.issuetype.name === 'Task' && !i.fields.issuetype.subtask
      ).length,
      subtasks: issues.filter(i => i.fields.issuetype.subtask).length,
      stories: issues.filter(i => i.fields.issuetype.name === 'Story').length,
      bugs: issues.filter(i => i.fields.issuetype.name === 'Bug').length,
    };

    return {
      total,
      completed,
      onTime,
      completionRate: calculateRate(completed, total),
      onTimeRate: calculateRate(onTime, completed),
      breakdown,
    };
  }

  /**
   * Calculate team metrics for a sprint
   */
  async calculateTeamMetrics(
    boardIds: number[],
    sprintName: string
  ): Promise<TeamMetrics> {
    // Get all sprint instances with this name
    const sprints = await this.getSprintsByName(boardIds, sprintName);
    
    if (sprints.length === 0) {
      throw new Error(`No sprints found with name: ${sprintName}`);
    }

    // Use the first sprint's dates (they should be the same)
    const sprintData = sprints[0];
    const sprintIds = sprints.map(s => s.id);
    const week1End = calculateWeek1End(sprintData.startDate);

    // Fetch all issues
    const allIssues = await this.getIssuesForSprint(sprintIds);

    // Group by assignee
    const employeeIssuesMap = new Map<string, JiraIssue[]>();
    
    allIssues.forEach(issue => {
      const assignee = issue.fields.assignee;
      if (!assignee) return;
      
      const key = assignee.accountId;
      if (!employeeIssuesMap.has(key)) {
        employeeIssuesMap.set(key, []);
      }
      employeeIssuesMap.get(key)!.push(issue);
    });

    // Calculate metrics for each employee
    const employees: EmployeeMetrics[] = [];
    
    for (const [accountId, issues] of employeeIssuesMap) {
      const assignee = issues[0].fields.assignee!;
      
      // Global fallback search
      const additionalIssues = await this.searchEmployeeTasks(accountId, sprintIds);
      const allEmployeeIssues = [...new Set([...issues, ...additionalIssues])];
      
      const metrics = this.calculateEmployeeMetrics(
        allEmployeeIssues,
        sprintData.startDate,
        sprintData.endDate,
        week1End
      );

      employees.push({
        name: assignee.displayName,
        accountId,
        avatarUrl: assignee.avatarUrls?.['48x48'],
        ...metrics,
      });
    }

    // Calculate aggregate metrics
    const totalIssues = allIssues.length;
    const completedIssues = allIssues.filter(i => 
      i.fields.status.statusCategory.key === 'done'
    ).length;

    return {
      sprintName,
      sprintId: sprintIds,
      startDate: sprintData.startDate,
      endDate: sprintData.endDate,
      week1End,
      totalIssues,
      completedIssues,
      overallCompletionRate: calculateRate(completedIssues, totalIssues),
      overallOnTimeRate: calculateRate(
        employees.reduce((sum, e) => sum + e.fullSprint.onTime, 0),
        completedIssues
      ),
      employees: employees.sort((a, b) => 
        b.fullSprint.completionRate - a.fullSprint.completionRate
      ),
      sprintHealth: {
        velocity: employees.reduce((sum, e) => sum + e.fullSprint.completed, 0),
        burndownRate: 0, // Can be calculated with daily snapshots
        scopeCreep: 0,   // Can be calculated by tracking additions
      },
    };
  }
}

export const jiraService = new JiraService();
