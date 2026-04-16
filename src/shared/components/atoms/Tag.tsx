import React from 'react';
import { cn } from '../../utils/cn';

interface TagProps {
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

const Tag = React.memo<TagProps>(function Tag({ children, onRemove, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300',
        className
      )}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:text-white transition-colors ml-0.5"
          aria-label="Eliminar"
        >
          ×
        </button>
      )}
    </span>
  );
});

export default Tag;
