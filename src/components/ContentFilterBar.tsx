import React from "react";
import type { ContentType as LibContentType } from '@/lib/contentStore';
import ContentTypeIcon from './ContentTypeIcon';

export type ContentType = LibContentType | 'all';

interface ContentFilterBarProps {
  enabledTypes: ContentType[];
  setEnabledTypes: (types: ContentType[]) => void;
  search: string;
  setSearch: (s: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (d: 'asc' | 'desc') => void;
  className?: string;
  color?: 'cyan';
  reviewedFilter: 'all' | 'reviewed';
  onReviewedFilterChange: (val: 'all' | 'reviewed') => void;
}

const ContentFilterBar: React.FC<ContentFilterBarProps> = ({
  enabledTypes,
  setEnabledTypes,
  search,
  setSearch,
  sortDirection,
  setSortDirection,
  className = '',
  color = 'cyan',
  reviewedFilter,
  onReviewedFilterChange,
}) => {
  const accent = 'cyan';
  const selectedClass = (active: boolean) => active ? `bg-${accent}-600 hover:bg-${accent}-700 text-white` : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600';
  return (
    <div className={`w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 ${className}`}>
      <div className="flex gap-2 flex-wrap justify-center">
        <button onClick={() => setEnabledTypes(['all'])} className={`px-4 py-2 rounded-full text-sm font-medium ${selectedClass(enabledTypes[0] === 'all')}`}>All Content</button>
        <button onClick={() => setEnabledTypes(['movie'])} className={`px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center ${selectedClass(enabledTypes[0] === 'movie')}`} aria-label="Movies">
          <ContentTypeIcon type="movie" className="w-5 h-5" />
        </button>
        <button onClick={() => setEnabledTypes(['tv-show'])} className={`px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center ${selectedClass(enabledTypes[0] === 'tv-show')}`} aria-label="TV Shows">
          <ContentTypeIcon type="tv-show" className="w-5 h-5" />
        </button>
        <button onClick={() => setEnabledTypes(['book'])} className={`px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center ${selectedClass(enabledTypes[0] === 'book')}`} aria-label="Books">
          <ContentTypeIcon type="book" className="w-5 h-5" />
        </button>
        <button onClick={() => setEnabledTypes(['video-game'])} className={`px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center ${selectedClass(enabledTypes[0] === 'video-game')}`} aria-label="Games">
          <ContentTypeIcon type="video-game" className="w-5 h-5" />
        </button>
        <button
          onClick={() => onReviewedFilterChange(reviewedFilter === 'reviewed' ? 'all' : 'reviewed')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${reviewedFilter === 'reviewed' ? `bg-${accent}-600 text-white` : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
        >
          My Reviews
        </button>
      </div>
    </div>
  );
};

export default ContentFilterBar; 