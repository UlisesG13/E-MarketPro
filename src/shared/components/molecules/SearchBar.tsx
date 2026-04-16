import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = React.memo<SearchBarProps>(function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar...',
  className,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={cn(
        'relative flex items-center rounded-xl border bg-[var(--app-surface-soft)] transition-all duration-200',
        focused
          ? 'border-[var(--app-primary)] ring-2 ring-[var(--app-primary-soft)]'
          : 'border-[var(--app-border)] hover:border-[var(--app-border-strong)]',
        className
      )}
    >
      <Search className="absolute left-3 w-4 h-4 text-[var(--app-text-soft)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full bg-transparent pl-10 pr-9 py-2.5 text-sm text-[var(--app-text)] placeholder:text-[var(--app-text-soft)] focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 text-[var(--app-text-soft)] transition-colors hover:text-[var(--app-text)]"
          aria-label="Limpiar búsqueda"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

export default SearchBar;
