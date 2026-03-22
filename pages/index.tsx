// pages/index.tsx - Main dashboard overview

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/ui/GlassCard';
import { StatCard, StatGrid } from '@/components/ui/StatCard';
import useSWR from 'swr';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Activity 
} from 'lucide-react';
import { TeamMetrics } from '@/types/jira';
import { calculateSprintHealth } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function HomePage() {
  const { data: boards, error: boardsError } = useSWR('/api/jira/boards', fetcher);
  const [activeSprintData, setActiveSprintData] = useState<TeamMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (boards?.values) {
      fetchActiveSprintsData(boards.values);
    }
  }, [boards]);

  const fetchActiveSprintsData = async (boardList: any[]) => {
    try {
      setIsLoading(true);
      const sprintsData: TeamMetrics[] = [];

      // Fetch sprints for each board and get their data
      for (const board of boardList.slice(0, 5)) { // Limit to first 5 boards for performance
        try {
          const sprintsRes = await fetch(`/api/jira/boards/${board.id}/sprints`);
          const sprints = await sprintsRes.json();
          
          const activeSprint = sprints.values?.find((s: any) => s.state === 'active');
          if (activeSprint) {
            // Fetch issues for this sprint
            const issuesRes = await fetch('/api/jira/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jql: `sprint = ${activeSprint.id}`,
                maxResults: 100,
              }),
            });
            const issuesData = await issuesRes.json();
            
            if (issuesData.issues && issuesData.issues.length > 0) {
              const completed = issuesData.issues.filter((i: any) => 
                i.fields.status.statusCategory.key === 'done'
              ).length;

              sprintsData.push({
                sprintName: activeSprint.name,
                sprintId: [activeSprint.id],
                startDate: activeSprint.startDate,
                endDate: activeSprint.endDate,
                week1End: '',
                totalIssues: issuesData.issues.length,
                completedIssues: completed,
                overallCompletionRate: Math.round((completed / issuesData.issues.length) * 100),
                overallOnTimeRate: 0,
                employees: [],
                sprintHealth: {
                  velocity: completed,
                  burndownRate: 0,
                  scopeCreep: 0,
                },
              });
            }
          }
        } catch (err) {
          console.error(`Error fetching sprint data for board ${board.id}:`, err);
        }
      }

      setActiveSprintData(sprintsData);
    } catch (error) {
      console.error('Error fetching active sprints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate aggregate metrics
  const aggregateMetrics = activeSprintData.reduce(
    (acc, sprint) => ({
      totalIssues: acc.totalIssues + sprint.totalIssues,
      completedIssues: acc.completedIssues + sprint.completedIssues,
      velocity: acc.velocity + sprint.sprintHealth.velocity,
    }),
    { totalIssues: 0, completedIssues: 0, velocity: 0 }
  );

  const overallCompletionRate = aggregateMetrics.totalIssues > 0
    ? Math.round((aggregateMetrics.completedIssues / aggregateMetrics.totalIssues) * 100)
    : 0;

  const sprintHealth = calculateSprintHealth(
    overallCompletionRate,
    75, // Mock on-time rate
    aggregateMetrics.velocity,
    100
  );

  if (boardsError) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-accent-danger mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Failed to Load Boards</h2>
            <p className="text-gray-400">Please check your JIRA configuration</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      boards={boards?.values || []} 
      activeSprints={activeSprintData.map(s => ({
        id: s.sprintId[0],
        name: s.sprintName,
        boardId: 0,
      }))}
      title="Dashboard Overview"
    >
      <div className="space-y-6">
        {/* Hero Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatGrid columns={4}>
            <StatCard
              label="Active Sprints"
              value={activeSprintData.length}
              icon={Activity}
              color="progress"
            />
            <StatCard
              label="Total Issues"
              value={aggregateMetrics.totalIssues}
              icon={Users}
              color="neutral"
            />
            <StatCard
              label="Completed"
              value={aggregateMetrics.completedIssues}
              icon={CheckCircle}
              color="success"
              suffix={`(${overallCompletionRate}%)`}
            />
            <StatCard
              label="Sprint Health"
              value={sprintHealth.label}
              icon={TrendingUp}
              color={
                sprintHealth.label === 'Excellent' ? 'success' :
                sprintHealth.label === 'Good' ? 'progress' :
                sprintHealth.label === 'Fair' ? 'warning' : 'danger'
              }
            />
          </StatGrid>
        </motion.div>

        {/* Active Sprints Overview */}
        <GlassCard>
          <GlassCardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Active Sprints</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Overview of all currently running sprints
                </p>
              </div>
              <button className="px-4 py-2 bg-accent-progress rounded-lg text-white text-sm font-medium hover:bg-accent-progress/90 transition-colors">
                View All Sprints
              </button>
            </div>
          </GlassCardHeader>
          <GlassCardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton h-24 w-full" />
                ))}
              </div>
            ) : activeSprintData.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No active sprints found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeSprintData.map((sprint, index) => (
                  <motion.div
                    key={sprint.sprintId[0]}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link 
                      href={`/sprint/${sprint.sprintName.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block"
                    >
                      <div className="p-4 rounded-lg bg-dark-hover border border-dark-border hover:border-accent-progress transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{sprint.sprintName}</h3>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${
                              sprint.overallCompletionRate >= 75 ? 'text-accent-success' :
                              sprint.overallCompletionRate >= 50 ? 'text-accent-warning' :
                              'text-accent-danger'
                            }`}>
                              {sprint.overallCompletionRate}%
                            </div>
                            <p className="text-xs text-gray-400">Completion</p>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="relative h-2 bg-dark-border rounded-full overflow-hidden">
                          <motion.div
                            className={`absolute inset-y-0 left-0 rounded-full ${
                              sprint.overallCompletionRate >= 75 ? 'bg-accent-success' :
                              sprint.overallCompletionRate >= 50 ? 'bg-accent-warning' :
                              'bg-accent-danger'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${sprint.overallCompletionRate}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 text-sm">
                          <span className="text-gray-400">
                            {sprint.completedIssues} / {sprint.totalIssues} issues
                          </span>
                          <span className="text-accent-progress font-medium">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCardContent>
        </GlassCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard hover>
            <GlassCardContent className="text-center py-8">
              <div className="w-12 h-12 bg-accent-success/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-accent-success" />
              </div>
              <h3 className="font-semibold text-white mb-2">Team Performance</h3>
              <p className="text-sm text-gray-400 mb-4">
                View detailed employee metrics and rankings
              </p>
              <Link 
                href="/team"
                className="text-accent-success hover:underline text-sm font-medium"
              >
                View Team →
              </Link>
            </GlassCardContent>
          </GlassCard>

          <GlassCard hover>
            <GlassCardContent className="text-center py-8">
              <div className="w-12 h-12 bg-accent-progress/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-accent-progress" />
              </div>
              <h3 className="font-semibold text-white mb-2">Analytics</h3>
              <p className="text-sm text-gray-400 mb-4">
                Deep dive into velocity and burndown charts
              </p>
              <Link 
                href="/analytics"
                className="text-accent-progress hover:underline text-sm font-medium"
              >
                View Analytics →
              </Link>
            </GlassCardContent>
          </GlassCard>

          <GlassCard hover>
            <GlassCardContent className="text-center py-8">
              <div className="w-12 h-12 bg-accent-purple/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-accent-purple" />
              </div>
              <h3 className="font-semibold text-white mb-2">Calendar View</h3>
              <p className="text-sm text-gray-400 mb-4">
                See all sprints in a timeline format
              </p>
              <Link 
                href="/calendar"
                className="text-accent-purple hover:underline text-sm font-medium"
              >
                View Calendar →
              </Link>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
}
