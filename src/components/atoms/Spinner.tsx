import React from 'react';
import { cn } from '../../utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const Spinner = React.memo<SpinnerProps>(function Spinner({ size = 'md', className }) {
  return (
    <div className={cn('animate-spin rounded-full border-2 border-white/10 border-t-indigo-500', sizeStyles[size], className)} />
  );
});

export default Spinner;
