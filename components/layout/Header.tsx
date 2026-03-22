// components/layout/Header.tsx - Top header with search and actions

import React, { useState } from 'react';
import { Search, Bell, RefreshCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  onRefresh?: () => void;
  onExport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onRefresh,
  onExport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 border-b border-dark-border bg-dark-card backdrop-blur-sm">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Title or Search */}
        <div className="flex-1 max-w-xl">
          {title ? (
            <h1 className="text-2xl font-bold text-white">{title}</h1>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees, sprints, tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-hover border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-progress transition-colors"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className={cn(
                'p-2 rounded-lg bg-dark-hover border border-dark-border',
                'text-gray-400 hover:text-white hover:bg-dark-hover/80',
                'transition-colors'
              )}
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}

          {onExport && (
            <button
              onClick={onExport}
              className={cn(
                'px-4 py-2 rounded-lg bg-accent-progress border border-accent-progress/20',
                'text-white font-medium hover:bg-accent-progress/90',
                'transition-colors flex items-center gap-2'
              )}
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}

          <button
            className={cn(
              'relative p-2 rounded-lg bg-dark-hover border border-dark-border',
              'text-gray-400 hover:text-white hover:bg-dark-hover/80',
              'transition-colors'
            )}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-danger rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
};
