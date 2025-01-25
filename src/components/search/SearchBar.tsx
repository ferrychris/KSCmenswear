import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, loading, getSuggestions } = useSearch();
  const searchBarRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300); // 300ms debounce

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      getSuggestions(debouncedQuery);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedQuery, getSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div ref={searchBarRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search our collection..."
            className="w-full pl-12 pr-12 py-4 bg-white/90 backdrop-blur-sm border border-charcoal-200 text-charcoal-900 placeholder:text-charcoal-400 focus:ring-2 focus:ring-inset focus:ring-navy-600 rounded-xl shadow-md"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400"
            aria-hidden="true"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 transition-colors"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-charcoal-100 overflow-hidden">
          <ul className="py-2 divide-y divide-charcoal-100">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-3 hover:bg-charcoal-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center">
                  <Search className="h-4 w-4 text-charcoal-400 mr-3" />
                  <span className="text-charcoal-900 font-medium">{suggestion}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-600"></div>
        </div>
      )}
    </div>
  );
}