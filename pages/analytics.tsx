// pages/analytics.tsx - Analytics dashboard with charts

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/ui/GlassCard';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, Activity } from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AnalyticsPage() {
  const { data: boards } = useSWR('/api/jira/boards', fetcher);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    // Simulate chart data - in production, this would come from your JIRA data
    setChartData({
      velocity: {
        labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Sprint 6'],
        datasets: [
          {
            label: 'Completed',
            data: [45, 52, 48, 61, 58, 65],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Committed',
            data: [50, 55, 50, 65, 60, 70],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
          },
        ],
      },
      burndown: {
        labels: Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: 'Ideal',
            data: Array.from({ length: 14 }, (_, i) => 70 - (70 / 13) * i),
            borderColor: '#6b7280',
            borderDash: [5, 5],
            backgroundColor: 'transparent',
            tension: 0,
          },
          {
            label: 'Actual',
            data: [70, 68, 65, 61, 58, 54, 50, 45, 40, 35, 28, 20, 12, 5],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      issueTypes: {
        labels: ['Stories', 'Tasks', 'Bugs', 'Subtasks'],
        datasets: [
          {
            data: [35, 28, 15, 22],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(168, 85, 247, 0.8)',
            ],
            borderColor: [
              '#3b82f6',
              '#10b981',
              '#ef4444',
              '#a855f7',
            ],
            borderWidth: 2,
          },
        ],
      },
      employeePerformance: {
        labels: ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'],
        datasets: [
          {
            label: 'Completion Rate',
            data: [95, 88, 92, 85, 90, 87],
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: '#10b981',
            borderWidth: 1,
          },
          {
            label: 'On-Time Rate',
            data: [90, 85, 88, 80, 86, 83],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: '#3b82f6',
            borderWidth: 1,
          },
        ],
      },
    });
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#111111',
        borderColor: '#1e1e1e',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#9ca3af',
        padding: 12,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          color: '#1e1e1e',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
        },
      },
      y: {
        grid: {
          color: '#1e1e1e',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: '#111111',
        borderColor: '#1e1e1e',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#9ca3af',
        padding: 12,
      },
    },
  };

  return (
    <Layout boards={boards?.values || []} title="Team Analytics">
      <div className="space-y-6">
        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <GlassCard>
            <GlassCardContent className="text-center py-6">
              <div className="w-12 h-12 bg-accent-success/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-accent-success" />
              </div>
              <p className="text-sm text-gray-400 mb-1">Avg Velocity</p>
              <p className="text-3xl font-bold text-white">58.2</p>
              <p className="text-xs text-accent-success mt-1">↑ 12% from last sprint</p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardContent className="text-center py-6">
              <div className="w-12 h-12 bg-accent-progress/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-accent-progress" />
              </div>
              <p className="text-sm text-gray-400 mb-1">Predictability</p>
              <p className="text-3xl font-bold text-white">94%</p>
              <p className="text-xs text-accent-progress mt-1">Sprint commitment accuracy</p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardContent className="text-center py-6">
              <div className="w-12 h-12 bg-accent-purple/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-accent-purple" />
              </div>
              <p className="text-sm text-gray-400 mb-1">Team Capacity</p>
              <p className="text-3xl font-bold text-white">87%</p>
              <p className="text-xs text-accent-purple mt-1">Resource utilization</p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardContent className="text-center py-6">
              <div className="w-12 h-12 bg-accent-warning/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6 text-accent-warning" />
              </div>
              <p className="text-sm text-gray-400 mb-1">Cycle Time</p>
              <p className="text-3xl font-bold text-white">3.2d</p>
              <p className="text-xs text-accent-warning mt-1">Avg time to complete</p>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Velocity Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard>
              <GlassCardHeader>
                <h3 className="font-semibold text-white">Sprint Velocity Trend</h3>
                <p className="text-xs text-gray-400 mt-1">Completed vs Committed story points</p>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="h-80">
                  {chartData && (
                    <Line data={chartData.velocity} options={chartOptions} />
                  )}
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* Burndown Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <GlassCardHeader>
                <h3 className="font-semibold text-white">Sprint Burndown</h3>
                <p className="text-xs text-gray-400 mt-1">Current sprint progress</p>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="h-80">
                  {chartData && (
                    <Line data={chartData.burndown} options={chartOptions} />
                  )}
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Issue Type Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard>
              <GlassCardHeader>
                <h3 className="font-semibold text-white">Issue Type Distribution</h3>
                <p className="text-xs text-gray-400 mt-1">Breakdown by category</p>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="h-80">
                  {chartData && (
                    <Doughnut data={chartData.issueTypes} options={doughnutOptions} />
                  )}
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* Employee Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard>
              <GlassCardHeader>
                <h3 className="font-semibold text-white">Team Performance Comparison</h3>
                <p className="text-xs text-gray-400 mt-1">Completion vs on-time rates</p>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="h-80">
                  {chartData && (
                    <Bar data={chartData.employeePerformance} options={chartOptions} />
                  )}
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard>
            <GlassCardHeader>
              <h3 className="font-semibold text-white">Key Insights</h3>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-accent-success/10 border border-accent-success/20">
                  <div className="w-8 h-8 rounded-full bg-accent-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4 text-accent-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white mb-1">Velocity Improving</p>
                    <p className="text-sm text-gray-400">
                      Team velocity has increased by 12% over the last 3 sprints, indicating improved estimation and delivery capacity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-accent-progress/10 border border-accent-progress/20">
                  <div className="w-8 h-8 rounded-full bg-accent-progress/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Target className="w-4 h-4 text-accent-progress" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white mb-1">High Predictability</p>
                    <p className="text-sm text-gray-400">
                      94% sprint commitment accuracy shows strong planning and realistic goal setting.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-accent-warning/10 border border-accent-warning/20">
                  <div className="w-8 h-8 rounded-full bg-accent-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity className="w-4 h-4 text-accent-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white mb-1">Watch Cycle Time</p>
                    <p className="text-sm text-gray-400">
                      Average cycle time is slightly above target. Consider breaking down larger tasks to improve flow.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </div>
    </Layout>
  );
}
