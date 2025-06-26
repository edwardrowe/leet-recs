import React from 'react';
import Image from 'next/image';
import { ContentType } from '@/lib/contentStore';
import ContentTypeIcon from './ContentTypeIcon';

interface ContentCardProps {
  title: string;
  description: string;
  type: ContentType;
  thumbnailUrl?: string;
  rating?: number; // For Ratings page (single user rating)
  averageRating?: number; // For Discover page (average of all ratings)
  personalNotes?: string; // For Ratings page
  reviewedDate?: string; // For Ratings page
  lastReviewed?: string; // For Discover page
  friendAvatars?: Array<{ id: string; name: string; avatarUrl: string }>; // For Discover page
  onClick?: () => void;
  className?: string;
}

// Sanitize thumbnailUrl for next/image
function getSafeImageUrl(url?: string): string | null {
  if (!url) return null;
  let clean = url.trim();
  // Remove wrapping parentheses
  if (clean.startsWith('(') && clean.endsWith(')')) {
    clean = clean.slice(1, -1).trim();
  }
  // Only allow absolute URLs or relative URLs starting with '/'
  if (/^(https?:\/\/|\/)/.test(clean)) {
    return clean;
  }
  return null;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  description,
  type,
  thumbnailUrl,
  rating,
  averageRating,
  personalNotes,
  reviewedDate,
  lastReviewed,
  friendAvatars = [],
  onClick,
  className = ''
}) => {
  const displayRating = rating !== undefined ? rating : averageRating;
  const showRating = displayRating !== undefined && displayRating !== null;

  return (
    <div
      className={`border rounded-lg shadow-md bg-white dark:bg-gray-800 flex flex-col h-full overflow-hidden relative cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`}
      onClick={onClick}
    >
      {/* Rating display */}
      {showRating && (
        <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-1">
          <span className="text-4xl font-extrabold text-primary bg-white dark:bg-gray-900 rounded-full px-4 py-1 shadow border-2 border-primary-light dark:border-primary-dark">
            {displayRating}
          </span>
        </div>
      )}
      
      {thumbnailUrl && getSafeImageUrl(thumbnailUrl) && (
        <div className="relative h-48 w-full">
          <Image
            src={getSafeImageUrl(thumbnailUrl)!}
            alt={`Thumbnail for ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      )}
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <span className="min-w-[20px] min-h-[20px] flex items-center justify-center">
            <ContentTypeIcon type={type} className="w-5 h-5 text-primary" />
          </span>
          <h2 className="text-2xl font-bold truncate flex-1">{title}</h2>
        </div>
        
        {/* Date display */}
        {(reviewedDate || lastReviewed) && (
          <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">
            {reviewedDate || lastReviewed}
          </div>
        )}
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
        
        {/* Personal notes for Ratings page */}
        {personalNotes && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="font-semibold text-md mb-1 text-gray-800 dark:text-gray-200">My Notes:</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">{personalNotes}</p>
          </div>
        )}
        
        {/* Friend avatars for Discover page */}
        {friendAvatars.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Reviewed by:</span>
            {friendAvatars.map(f => (
              <div key={f.id} className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-primary" title={f.name}>
                <Image src={f.avatarUrl} alt={f.name} fill className="object-cover" sizes="28px" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard; 