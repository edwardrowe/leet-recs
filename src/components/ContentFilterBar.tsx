import React from "react";

export type ContentType = 'all' | 'movie' | 'tv-show' | 'book';

interface ContentFilterBarProps {
  typeFilter: ContentType;
  setTypeFilter: (type: ContentType) => void;
  search: string;
  setSearch: (s: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (d: 'asc' | 'desc') => void;
  className?: string;
  color?: 'magenta' | 'cyan';
}

const ContentFilterBar: React.FC<ContentFilterBarProps> = ({
  typeFilter,
  setTypeFilter,
  search,
  setSearch,
  sortDirection,
  setSortDirection,
  className = '',
  color = 'magenta',
}) => {
  const accent = color === 'cyan' ? 'cyan' : 'pink';
  const selectedClass = (active: boolean) => active ? `bg-${accent}-600 hover:bg-${accent}-700 text-white` : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600';
  return (
    <div className={`w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 ${className}`}>
      <div className="flex gap-2 flex-wrap justify-center">
        <button onClick={() => setTypeFilter('all')} className={`px-4 py-2 rounded-full text-sm font-medium ${selectedClass(typeFilter === 'all')}`}>All</button>
        <button onClick={() => setTypeFilter('movie')} className={`px-4 py-2 rounded-full text-sm font-medium ${selectedClass(typeFilter === 'movie')}`}>Movies</button>
        <button onClick={() => setTypeFilter('tv-show')} className={`px-4 py-2 rounded-full text-sm font-medium ${selectedClass(typeFilter === 'tv-show')}`}>TV Shows</button>
        <button onClick={() => setTypeFilter('book')} className={`px-4 py-2 rounded-full text-sm font-medium ${selectedClass(typeFilter === 'book')}`}>Books</button>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        />
        <button
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          className="px-3 py-2 border rounded-md text-lg font-mono bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
          aria-label={`Sort in ${sortDirection === 'asc' ? 'descending' : 'ascending'} order`}
        >
          {sortDirection === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  );
};

export default ContentFilterBar; 