// components/ui/StatCard.tsx - Metric display card

import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'success' | 'warning' | 'progress' | 'danger' | 'purple' | 'neutral';
  suffix?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  color = 'neutral',
  suffix,
  className,
}) => {
  const colorClasses = {
    success: 'text-accent-success',
    warning: 'text-accent-warning',
    progress: 'text-accent-progress',
    danger: 'text-accent-danger',
    purple: 'text-accent-purple',
    neutral: 'text-gray-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative p-6 rounded-lg border border-dark-border bg-dark-card',
        'backdrop-blur-sm shadow-glass',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className={cn('text-3xl font-bold', colorClasses[color])}>
              {value}
            </span>
            {suffix && (
              <span className="text-lg text-gray-500">{suffix}</span>
            )}
          </div>
          
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.direction === 'up' ? 'text-accent-success' : 'text-accent-danger'
                )}
              >
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500">vs last sprint</span>
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={cn('p-3 rounded-lg bg-dark-hover', colorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface StatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const StatGrid: React.FC<StatGridProps> = ({
  children,
  columns = 4,
  className,
}) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  );
};
