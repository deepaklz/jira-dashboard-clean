// components/ui/ProgressRing.tsx - Circular progress indicator

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: 'success' | 'warning' | 'progress' | 'danger' | 'purple';
  showPercentage?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  label,
  color = 'success',
  showPercentage = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const colorMap = {
    success: '#10b981',
    warning: '#f59e0b',
    progress: '#3b82f6',
    danger: '#ef4444',
    purple: '#a855f7',
  };

  const selectedColor = colorMap[color];

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e1e1e"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={selectedColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${selectedColor}40)`,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span
            className={cn('text-2xl font-bold', `text-accent-${color}`)}
          >
            {progress}%
          </span>
        )}
        {label && (
          <span className="text-xs text-gray-400 mt-1">{label}</span>
        )}
      </div>
    </div>
  );
};

interface ProgressRingGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ProgressRingGroup: React.FC<ProgressRingGroupProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-around gap-4', className)}>
      {children}
    </div>
  );
};
