// components/layout/Layout.tsx - Main layout wrapper

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  boards?: Array<{
    id: number;
    name: string;
    projectName?: string;
  }>;
  activeSprints?: Array<{
    id: number;
    name: string;
    boardId: number;
  }>;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  boards = [],
  activeSprints = [],
  title,
}) => {
  return (
    <div className="flex h-screen bg-dark-bg">
      <Sidebar boards={boards} activeSprints={activeSprints} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
