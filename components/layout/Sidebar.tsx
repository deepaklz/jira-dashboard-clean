// components/layout/Sidebar.tsx - Navigation sidebar

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn, sanitizeSprintName } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Calendar,
  Settings,
  ChevronDown,
  ChevronRight,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  boards: Array<{
    id: number;
    name: string;
    projectName?: string;
  }>;
  activeSprints: Array<{
    id: number;
    name: string;
    boardId: number;
  }>;
}

export const Sidebar: React.FC<SidebarProps> = ({ boards, activeSprints }) => {
  const router = useRouter();
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const toggleProject = (projectName: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectName)) {
      newExpanded.delete(projectName);
    } else {
      newExpanded.add(projectName);
    }
    setExpandedProjects(newExpanded);
  };

  // Group boards by project
  const groupedBoards = boards.reduce((acc, board) => {
    const projectName = board.projectName || 'Other Projects';
    if (!acc[projectName]) {
      acc[projectName] = [];
    }
    acc[projectName].push(board);
    return acc;
  }, {} as Record<string, typeof boards>);

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/' },
    { icon: Activity, label: 'Team Analytics', href: '/analytics' },
    { icon: Users, label: 'Team Members', href: '/team' },
    { icon: Calendar, label: 'Sprint Calendar', href: '/calendar' },
  ];

  return (
    <aside className="w-64 h-screen bg-dark-card border-r border-dark-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-border">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-progress flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          MIS Dashboard
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1 mb-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-accent-progress/20 text-accent-progress'
                    : 'text-gray-400 hover:bg-dark-hover hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Agile Boards by Project */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
            Agile Boards
          </h2>
          
          <div className="space-y-1">
            {Object.entries(groupedBoards).map(([projectName, projectBoards]) => (
              <div key={projectName}>
                {/* Project Header */}
                <button
                  onClick={() => toggleProject(projectName)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-dark-hover rounded-lg transition-colors"
                >
                  {expandedProjects.has(projectName) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <FolderKanban className="w-4 h-4" />
                  <span className="flex-1 text-left font-medium">{projectName}</span>
                  <span className="text-xs text-gray-500">{projectBoards.length}</span>
                </button>

                {/* Boards in Project */}
                {expandedProjects.has(projectName) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {projectBoards.map((board) => {
                      const boardSprints = activeSprints.filter(
                        (s) => s.boardId === board.id
                      );
                      
                      return (
                        <div key={board.id}>
                          <div className="px-3 py-1.5 text-sm text-gray-500">
                            {board.name}
                          </div>
                          {boardSprints.map((sprint) => {
                            const sprintPath = `/sprint/${sanitizeSprintName(sprint.name)}`;
                            const isActive = router.asPath === sprintPath;
                            
                            return (
                              <Link
                                key={sprint.id}
                                href={sprintPath}
                                className={cn(
                                  'block px-3 py-1.5 text-sm rounded-lg transition-colors ml-4',
                                  isActive
                                    ? 'bg-accent-success/20 text-accent-success'
                                    : 'text-gray-400 hover:bg-dark-hover hover:text-white'
                                )}
                              >
                                {sprint.name}
                              </Link>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Settings Footer */}
      <div className="p-4 border-t border-dark-border">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-dark-hover hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
};
