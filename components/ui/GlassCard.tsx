// components/ui/GlassCard.tsx - Premium glassmorphism card component

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  gradient?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hover = false,
  onClick,
  gradient = false,
}) => {
  const MotionDiv = hover ? motion.div : 'div';

  return (
    <MotionDiv
      className={cn(
        'relative rounded-xl border border-dark-border bg-dark-card',
        gradient && 'bg-card-gradient',
        'backdrop-blur-sm shadow-glass',
        hover && 'cursor-pointer transition-all duration-300 hover:shadow-glass-hover hover:border-dark-hover',
        className
      )}
      onClick={onClick}
      {...(hover && {
        whileHover: { scale: 1.02, y: -4 },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      })}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-xl shadow-inner-glow pointer-events-none" />
      
      {children}
    </MotionDiv>
  );
};

interface GlassCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCardHeader: React.FC<GlassCardHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('px-6 py-4 border-b border-dark-border', className)}>
      {children}
    </div>
  );
};

interface GlassCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCardContent: React.FC<GlassCardContentProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
};

interface GlassCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCardFooter: React.FC<GlassCardFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('px-6 py-4 border-t border-dark-border', className)}>
      {children}
    </div>
  );
};
