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
        'relative flex items-center rounded-xl border bg-white/5 transition-all duration-200',
        focused ? 'border-indigo-500/50 ring-2 ring-indigo-500/20' : 'border-white/10 hover:border-white/20',
        className
      )}
    >
      <Search className="absolute left-3 w-4 h-4 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full bg-transparent pl-10 pr-9 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 text-gray-500 hover:text-white transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

export default SearchBar;
