// components/dashboard/EmployeeCard.tsx - Individual employee metrics card

import React from 'react';
import Image from 'next/image';
import { EmployeeMetrics } from '@/types/jira';
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/ui/GlassCard';
import { ProgressRing, ProgressRingGroup } from '@/components/ui/ProgressRing';
import { getPerformanceColor, formatDuration } from '@/lib/utils';
import { Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface EmployeeCardProps {
  employee: EmployeeMetrics;
  period: 'weekly' | 'fullSprint';
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  period,
}) => {
  const metrics = employee[period];
  const completionColor = 
    metrics.completionRate >= 90 ? 'success' :
    metrics.completionRate >= 75 ? 'progress' :
    metrics.completionRate >= 60 ? 'warning' : 'danger';

  const onTimeColor =
    metrics.onTimeRate >= 90 ? 'success' :
    metrics.onTimeRate >= 75 ? 'progress' :
    metrics.onTimeRate >= 60 ? 'warning' : 'danger';

  return (
    <GlassCard hover gradient>
      <GlassCardHeader>
        <div className="flex items-center gap-3">
          {employee.avatarUrl ? (
            <Image
              src={employee.avatarUrl}
              alt={employee.name}
              width={48}
              height={48}
              className="rounded-full ring-2 ring-dark-border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-purple to-accent-progress flex items-center justify-center text-white font-bold">
              {employee.name.charAt(0)}
            </div>
          )}
          
          <div className="flex-1">
            <h3 className="font-semibold text-white">{employee.name}</h3>
            <p className="text-xs text-gray-400">
              {metrics.total} {metrics.total === 1 ? 'item' : 'items'} assigned
            </p>
          </div>
        </div>
      </GlassCardHeader>

      <GlassCardContent>
        {/* Progress Rings */}
        <ProgressRingGroup className="mb-6">
          <div className="text-center">
            <ProgressRing
              progress={metrics.completionRate}
              size={100}
              strokeWidth={6}
              color={completionColor}
            />
            <p className="text-xs text-gray-400 mt-2">Completion</p>
          </div>
          
          <div className="text-center">
            <ProgressRing
              progress={metrics.onTimeRate}
              size={100}
              strokeWidth={6}
              color={onTimeColor}
            />
            <p className="text-xs text-gray-400 mt-2">On-Time</p>
          </div>
        </ProgressRingGroup>

        {/* Breakdown Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-dark-hover border border-dark-border">
            <p className="text-xs text-gray-400">Completed</p>
            <p className="text-lg font-bold text-accent-success">
              {metrics.completed}/{metrics.total}
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-dark-hover border border-dark-border">
            <p className="text-xs text-gray-400">On Time</p>
            <p className="text-lg font-bold text-accent-progress">
              {metrics.onTime}/{metrics.completed}
            </p>
          </div>
        </div>

        {/* Type Breakdown */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400 mb-2">Breakdown by Type</p>
          {Object.entries(metrics.breakdown).map(([type, count]) => (
            count > 0 && (
              <div key={type} className="flex items-center justify-between text-sm">
                <span className="text-gray-300 capitalize">{type}</span>
                <span className="font-medium text-white">{count}</span>
              </div>
            )
          ))}
        </div>

        {/* Additional Metrics */}
        {period === 'fullSprint' && (
          <div className="mt-4 pt-4 border-t border-dark-border space-y-2">
            {employee.averageCompletionTime && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Avg. Completion</span>
                </div>
                <span className="font-medium text-white">
                  {formatDuration(employee.averageCompletionTime)}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span>Current Load</span>
              </div>
              <span className="font-medium text-white">
                {employee.currentWorkload} active
              </span>
            </div>
          </div>
        )}
      </GlassCardContent>
    </GlassCard>
  );
};
