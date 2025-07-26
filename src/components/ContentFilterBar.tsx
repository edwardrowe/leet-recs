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
  const selectedClass = (active: boolean) => active
    ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm'
    : 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-alt)]';
  return (
    <div className={`w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-2 mb-4 ${className}`}>
      <div className="flex gap-1 flex-wrap justify-center">
        <button onClick={() => setEnabledTypes(['all'])} className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm border transition-colors ${selectedClass(enabledTypes[0] === 'all')}`}>All Content</button>
        <button onClick={() => setEnabledTypes(['movie'])} className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center shadow-sm border transition-colors ${selectedClass(enabledTypes[0] === 'movie')}`} aria-label="Movies">
          <ContentTypeIcon type="movie" className="w-4 h-4" />
        </button>
        <button onClick={() => setEnabledTypes(['tv-show'])} className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center shadow-sm border transition-colors ${selectedClass(enabledTypes[0] === 'tv-show')}`} aria-label="TV Shows">
          <ContentTypeIcon type="tv-show" className="w-4 h-4" />
        </button>
        <button onClick={() => setEnabledTypes(['book'])} className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center shadow-sm border transition-colors ${selectedClass(enabledTypes[0] === 'book')}`} aria-label="Books">
          <ContentTypeIcon type="book" className="w-4 h-4" />
        </button>
        <button onClick={() => setEnabledTypes(['video-game'])} className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center shadow-sm border transition-colors ${selectedClass(enabledTypes[0] === 'video-game')}`} aria-label="Games">
          <ContentTypeIcon type="video-game" className="w-4 h-4" />
        </button>
        <button
          onClick={() => onReviewedFilterChange(reviewedFilter === 'reviewed' ? 'all' : 'reviewed')}
          className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm border transition-colors ${reviewedFilter === 'reviewed' ? `bg-cyan-600 text-white` : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'}`}
        >
          My Reviews
        </button>
      </div>
    </div>
  );
};

export default ContentFilterBar; 