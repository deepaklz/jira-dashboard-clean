// lib/utils.ts - Utility functions

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, differenceInDays, isAfter, isBefore, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate Week 1 end date (first 7 days from sprint start)
 */
export function calculateWeek1End(startDate: string): string {
  const start = parseISO(startDate);
  const week1End = new Date(start);
  week1End.setDate(start.getDate() + 6); // Day 0-6 = 7 days
  return format(week1End, 'yyyy-MM-dd');
}

/**
 * Determine if a date falls within Week 1
 */
export function isInWeek1(date: string, sprintStart: string, week1End: string): boolean {
  const targetDate = parseISO(date);
  const start = parseISO(sprintStart);
  const end = parseISO(week1End);
  
  return (isAfter(targetDate, start) || targetDate.getTime() === start.getTime()) &&
         (isBefore(targetDate, end) || targetDate.getTime() === end.getTime());
}

/**
 * Check if an issue was completed on time
 */
export function isCompletedOnTime(
  resolutionDate: string | undefined,
  updatedDate: string,
  dueDate: string | undefined,
  sprintEndDate: string
): boolean {
  const completionDate = parseISO(resolutionDate || updatedDate);
  const deadline = dueDate ? parseISO(dueDate) : parseISO(sprintEndDate);
  
  return isBefore(completionDate, deadline) || completionDate.getTime() === deadline.getTime();
}

/**
 * Calculate completion rate percentage
 */
export function calculateRate(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Get color based on performance percentage
 */
export function getPerformanceColor(percentage: number): string {
  if (percentage >= 90) return 'text-accent-success';
  if (percentage >= 75) return 'text-accent-progress';
  if (percentage >= 60) return 'text-accent-warning';
  return 'text-accent-danger';
}

/**
 * Format duration in hours/days
 */
export function formatDuration(hours: number): string {
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}

/**
 * Calculate average completion time between created and resolved
 */
export function calculateAverageCompletionTime(issues: any[]): number {
  const completedIssues = issues.filter(issue => issue.fields.resolutiondate);
  
  if (completedIssues.length === 0) return 0;
  
  const totalHours = completedIssues.reduce((sum, issue) => {
    const created = parseISO(issue.fields.created);
    const resolved = parseISO(issue.fields.resolutiondate);
    const hours = differenceInDays(resolved, created) * 24;
    return sum + hours;
  }, 0);
  
  return Math.round(totalHours / completedIssues.length);
}

/**
 * Sanitize sprint name for URL routing
 */
export function sanitizeSprintName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Get status category color
 */
export function getStatusColor(status: string): string {
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('done') || statusLower.includes('complete')) {
    return 'bg-accent-success/20 text-accent-success';
  }
  if (statusLower.includes('progress') || statusLower.includes('review')) {
    return 'bg-accent-progress/20 text-accent-progress';
  }
  if (statusLower.includes('todo') || statusLower.includes('open')) {
    return 'bg-gray-500/20 text-gray-400';
  }
  return 'bg-accent-warning/20 text-accent-warning';
}

/**
 * Calculate sprint health score
 */
export function calculateSprintHealth(
  completionRate: number,
  onTimeRate: number,
  velocity: number,
  targetVelocity: number = 100
): {
  score: number;
  label: string;
  color: string;
} {
  const velocityScore = Math.min((velocity / targetVelocity) * 100, 100);
  const overallScore = (completionRate * 0.4) + (onTimeRate * 0.4) + (velocityScore * 0.2);
  
  let label = 'Critical';
  let color = 'text-accent-danger';
  
  if (overallScore >= 85) {
    label = 'Excellent';
    color = 'text-accent-success';
  } else if (overallScore >= 70) {
    label = 'Good';
    color = 'text-accent-progress';
  } else if (overallScore >= 50) {
    label = 'Fair';
    color = 'text-accent-warning';
  }
  
  return { score: Math.round(overallScore), label, color };
}

/**
 * Debounce function for search/filter inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Group issues by assignee
 */
export function groupByAssignee(issues: any[]): Map<string, any[]> {
  const grouped = new Map<string, any[]>();
  
  issues.forEach(issue => {
    const assignee = issue.fields.assignee?.displayName || 'Unassigned';
    if (!grouped.has(assignee)) {
      grouped.set(assignee, []);
    }
    grouped.get(assignee)!.push(issue);
  });
  
  return grouped;
}

/**
 * Sort employees by completion rate
 */
export function sortByPerformance(employees: any[], metric: 'completionRate' | 'onTimeRate' = 'completionRate'): any[] {
  return [...employees].sort((a, b) => {
    return b.fullSprint[metric] - a.fullSprint[metric];
  });
}
