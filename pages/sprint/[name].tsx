// pages/sprint/[name].tsx - Sprint detail view with employee metrics

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/layout/Layout';
import { EmployeeCard } from '@/components/dashboard/EmployeeCard';
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/ui/GlassCard';
import { StatCard, StatGrid } from '@/components/ui/StatCard';
import useSWR from 'swr';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { TeamMetrics, EmployeeMetrics } from '@/types/jira';
import { jiraService } from '@/lib/jira-service';
import { motion } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SprintDetailPage() {
  const router = useRouter();
  const { name } = router.query;
  
  const [teamMetrics, setTeamMetrics] = useState<TeamMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'fullSprint'>('fullSprint');
  const [sortBy, setSortBy] = useState<'completionRate' | 'onTimeRate'>('completionRate');
  
  const { data: boards } = useSWR('/api/jira/boards', fetcher);

  useEffect(() => {
    if (name && boards?.values) {
      loadSprintData();
    }
  }, [name, boards]);

  const loadSprintData = async () => {
    if (!name || typeof name !== 'string') return;
    
    try {
      setIsLoading(true);
      
      // Convert URL slug back to sprint name
      const sprintName = name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const boardIds = boards.values.map((b: any) => b.id);
      
      // Use the jira service to calculate team metrics
      const metrics = await jiraService.calculateTeamMetrics(boardIds, sprintName);
      setTeamMetrics(metrics);
    } catch (error) {
      console.error('Error loading sprint data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!teamMetrics) return;

    const csvData = [
      ['Employee', 'Total', 'Completed', 'Completion Rate', 'On Time', 'On-Time Rate'],
      ...teamMetrics.employees.map(emp => [
        emp.name,
        emp.fullSprint.total,
        emp.fullSprint.completed,
        `${emp.fullSprint.completionRate}%`,
        emp.fullSprint.onTime,
        `${emp.fullSprint.onTimeRate}%`,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${teamMetrics.sprintName}-metrics.csv`;
    a.click();
  };

  const sortedEmployees = teamMetrics?.employees.slice().sort((a, b) => {
    const aValue = a[selectedPeriod][sortBy];
    const bValue = b[selectedPeriod][sortBy];
    return bValue - aValue;
  }) || [];

  if (isLoading) {
    return (
      <Layout boards={boards?.values || []}>
        <div className="space-y-6">
          <div className="skeleton h-24 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton h-96 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!teamMetrics) {
    return (
      <Layout boards={boards?.values || []}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Sprint Not Found</h2>
            <p className="text-gray-400">Unable to load metrics for this sprint</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout boards={boards?.values || []}>
      <div className="space-y-6">
        {/* Sprint Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {teamMetrics.sprintName}
            </h1>
            <p className="text-gray-400">
              {new Date(teamMetrics.startDate).toLocaleDateString()} - {new Date(teamMetrics.endDate).toLocaleDateString()}
            </p>
          </div>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-accent-success rounded-lg text-white font-medium hover:bg-accent-success/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </motion.div>

        {/* Aggregate Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatGrid columns={4}>
            <StatCard
              label="Team Members"
              value={teamMetrics.employees.length}
              icon={Users}
              color="progress"
            />
            <StatCard
              label="Total Issues"
              value={teamMetrics.totalIssues}
              icon={Calendar}
              color="neutral"
            />
            <StatCard
              label="Completion Rate"
              value={`${teamMetrics.overallCompletionRate}%`}
              icon={CheckCircle}
              color={
                teamMetrics.overallCompletionRate >= 75 ? 'success' :
                teamMetrics.overallCompletionRate >= 50 ? 'warning' : 'danger'
              }
            />
            <StatCard
              label="Team Velocity"
              value={teamMetrics.sprintHealth.velocity}
              icon={TrendingUp}
              color="success"
            />
          </StatGrid>
        </motion.div>

        {/* Filters */}
        <GlassCard>
          <GlassCardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPeriod('weekly')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedPeriod === 'weekly'
                        ? 'bg-accent-progress text-white'
                        : 'bg-dark-hover text-gray-400 hover:text-white'
                    }`}
                  >
                    Week 1
                  </button>
                  <button
                    onClick={() => setSelectedPeriod('fullSprint')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedPeriod === 'fullSprint'
                        ? 'bg-accent-progress text-white'
                        : 'bg-dark-hover text-gray-400 hover:text-white'
                    }`}
                  >
                    Full Sprint
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-accent-progress"
                >
                  <option value="completionRate">Completion Rate</option>
                  <option value="onTimeRate">On-Time Rate</option>
                </select>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        {/* Employee Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedEmployees.map((employee, index) => (
            <motion.div
              key={employee.accountId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <EmployeeCard employee={employee} period={selectedPeriod} />
            </motion.div>
          ))}
        </motion.div>

        {/* Summary Footer */}
        <GlassCard>
          <GlassCardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm text-gray-400 mb-1">Average Completion Rate</p>
                <p className="text-2xl font-bold text-accent-success">
                  {Math.round(
                    sortedEmployees.reduce((sum, e) => sum + e[selectedPeriod].completionRate, 0) / 
                    sortedEmployees.length
                  )}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Average On-Time Rate</p>
                <p className="text-2xl font-bold text-accent-progress">
                  {Math.round(
                    sortedEmployees.reduce((sum, e) => sum + e[selectedPeriod].onTimeRate, 0) / 
                    sortedEmployees.length
                  )}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Completed</p>
                <p className="text-2xl font-bold text-white">
                  {sortedEmployees.reduce((sum, e) => sum + e[selectedPeriod].completed, 0)}
                </p>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </Layout>
  );
}
