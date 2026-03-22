// pages/team.tsx - Team overview page

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Search, Award, TrendingUp, TrendingDown } from 'lucide-react';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Mock employee data - in production, aggregate from all sprints
const mockEmployees = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: null,
    role: 'Senior Developer',
    completionRate: 95,
    onTimeRate: 92,
    totalCompleted: 48,
    currentLoad: 5,
    avgCycleTime: '2.8d',
    velocity: 12,
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: null,
    role: 'Full Stack Developer',
    completionRate: 88,
    onTimeRate: 85,
    totalCompleted: 42,
    currentLoad: 7,
    avgCycleTime: '3.5d',
    velocity: 10,
  },
  {
    id: '3',
    name: 'Charlie Brown',
    avatar: null,
    role: 'Frontend Developer',
    completionRate: 92,
    onTimeRate: 90,
    totalCompleted: 45,
    currentLoad: 4,
    avgCycleTime: '2.9d',
    velocity: 11,
  },
  {
    id: '4',
    name: 'David Lee',
    avatar: null,
    role: 'Backend Developer',
    completionRate: 85,
    onTimeRate: 82,
    totalCompleted: 38,
    currentLoad: 8,
    avgCycleTime: '3.8d',
    velocity: 9,
  },
  {
    id: '5',
    name: 'Eve Davis',
    avatar: null,
    role: 'QA Engineer',
    completionRate: 90,
    onTimeRate: 88,
    totalCompleted: 41,
    currentLoad: 6,
    avgCycleTime: '3.1d',
    velocity: 10,
  },
  {
    id: '6',
    name: 'Frank Wilson',
    avatar: null,
    role: 'DevOps Engineer',
    completionRate: 87,
    onTimeRate: 84,
    totalCompleted: 39,
    currentLoad: 5,
    avgCycleTime: '3.4d',
    velocity: 9,
  },
];

export default function TeamPage() {
  const { data: boards } = useSWR('/api/jira/boards', fetcher);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'completionRate' | 'onTimeRate' | 'velocity'>('completionRate');

  const filteredEmployees = mockEmployees
    .filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const topPerformer = filteredEmployees[0];

  return (
    <Layout boards={boards?.values || []} title="Team Members">
      <div className="space-y-6">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard>
            <GlassCardContent>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-dark-hover border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-progress transition-colors"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-dark-hover border border-dark-border rounded-lg text-white focus:outline-none focus:border-accent-progress"
                >
                  <option value="completionRate">Completion Rate</option>
                  <option value="onTimeRate">On-Time Rate</option>
                  <option value="velocity">Velocity</option>
                </select>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Top Performer Highlight */}
        {topPerformer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard gradient>
              <GlassCardContent className="py-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-warning to-accent-success flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{topPerformer.name}</h3>
                      <span className="px-2 py-1 bg-accent-success/20 text-accent-success text-xs font-medium rounded">
                        Top Performer
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{topPerformer.role}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent-success">{topPerformer.completionRate}%</p>
                      <p className="text-xs text-gray-400">Completion</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent-progress">{topPerformer.onTimeRate}%</p>
                      <p className="text-xs text-gray-400">On-Time</p>
                    </div>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        )}

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <GlassCard hover>
                <GlassCardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-purple to-accent-progress flex items-center justify-center text-white font-bold text-lg">
                      {employee.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{employee.name}</h3>
                      <p className="text-xs text-gray-400">{employee.role}</p>
                    </div>
                  </div>
                </GlassCardHeader>

                <GlassCardContent>
                  {/* Performance Rings */}
                  <div className="flex items-center justify-around mb-6">
                    <div className="text-center">
                      <ProgressRing
                        progress={employee.completionRate}
                        size={90}
                        strokeWidth={6}
                        color={
                          employee.completionRate >= 90 ? 'success' :
                          employee.completionRate >= 75 ? 'progress' : 'warning'
                        }
                      />
                      <p className="text-xs text-gray-400 mt-2">Completion</p>
                    </div>
                    <div className="text-center">
                      <ProgressRing
                        progress={employee.onTimeRate}
                        size={90}
                        strokeWidth={6}
                        color={
                          employee.onTimeRate >= 90 ? 'success' :
                          employee.onTimeRate >= 75 ? 'progress' : 'warning'
                        }
                      />
                      <p className="text-xs text-gray-400 mt-2">On-Time</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-dark-hover border border-dark-border">
                      <p className="text-xs text-gray-400 mb-1">Completed</p>
                      <p className="text-lg font-bold text-white">{employee.totalCompleted}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-dark-hover border border-dark-border">
                      <p className="text-xs text-gray-400 mb-1">Current Load</p>
                      <p className="text-lg font-bold text-white">{employee.currentLoad}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-dark-hover border border-dark-border">
                      <p className="text-xs text-gray-400 mb-1">Avg Cycle</p>
                      <p className="text-lg font-bold text-white">{employee.avgCycleTime}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-dark-hover border border-dark-border">
                      <p className="text-xs text-gray-400 mb-1">Velocity</p>
                      <div className="flex items-center gap-1">
                        <p className="text-lg font-bold text-white">{employee.velocity}</p>
                        {index % 2 === 0 ? (
                          <TrendingUp className="w-4 h-4 text-accent-success" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-accent-danger" />
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Team Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard>
            <GlassCardHeader>
              <h3 className="font-semibold text-white">Team Statistics</h3>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Team Size</p>
                  <p className="text-3xl font-bold text-white">{filteredEmployees.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg Completion Rate</p>
                  <p className="text-3xl font-bold text-accent-success">
                    {Math.round(
                      filteredEmployees.reduce((sum, e) => sum + e.completionRate, 0) / 
                      filteredEmployees.length
                    )}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg On-Time Rate</p>
                  <p className="text-3xl font-bold text-accent-progress">
                    {Math.round(
                      filteredEmployees.reduce((sum, e) => sum + e.onTimeRate, 0) / 
                      filteredEmployees.length
                    )}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Completed</p>
                  <p className="text-3xl font-bold text-white">
                    {filteredEmployees.reduce((sum, e) => sum + e.totalCompleted, 0)}
                  </p>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </div>
    </Layout>
  );
}
