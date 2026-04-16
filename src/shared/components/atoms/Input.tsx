import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, icon, className, ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-[var(--app-text-muted)]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--app-text-soft)]">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-xl border px-4 py-2.5 text-sm text-[var(--app-text)]',
            'border-[var(--app-border)] bg-[var(--app-surface-soft)] placeholder:text-[var(--app-text-soft)] transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[var(--app-primary-soft)] focus:border-[var(--app-primary)]',
            'hover:border-[var(--app-border-strong)]',
            icon && 'pl-10',
            error && 'border-red-500/50 focus:ring-red-500/50',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[var(--app-danger)]">{error}</p>}
    </div>
  );
});

export default Input;
