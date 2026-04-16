import React from 'react';
import { cn } from '../../utils/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--app-surface-soft)] text-[var(--app-text-muted)] border-[var(--app-border)]',
  success: 'bg-[rgba(16,185,129,0.12)] text-[var(--app-success)] border-[rgba(16,185,129,0.22)]',
  warning: 'bg-[rgba(245,158,11,0.12)] text-[var(--app-warning)] border-[rgba(245,158,11,0.22)]',
  danger: 'bg-[rgba(239,68,68,0.12)] text-[var(--app-danger)] border-[rgba(239,68,68,0.22)]',
  info: 'bg-[var(--app-accent-soft)] text-[var(--app-accent)] border-[rgba(56,189,248,0.22)]',
  purple: 'bg-[var(--app-secondary-soft)] text-[var(--app-secondary)] border-[rgba(15,118,110,0.22)]',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-[var(--app-text-soft)]',
  success: 'bg-[var(--app-success)]',
  warning: 'bg-[var(--app-warning)]',
  danger: 'bg-[var(--app-danger)]',
  info: 'bg-[var(--app-accent)]',
  purple: 'bg-[var(--app-secondary)]',
};

const Badge = React.memo<BadgeProps>(function Badge({ children, variant = 'default', className, dot }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
});

export default Badge;
