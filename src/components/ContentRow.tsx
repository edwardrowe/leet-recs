import React from 'react';
import Image from 'next/image';
import { ContentType } from '@/lib/contentStore';
import ContentTypeIcon from './ContentTypeIcon';

interface ContentRowProps {
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
  canEdit?: boolean;
  className?: string;
}

const ContentRow: React.FC<ContentRowProps> = ({
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
  canEdit = true,
  className = ''
}) => {
  const displayRating = rating !== undefined ? rating : averageRating;
  const showRating = displayRating !== undefined && displayRating !== null;

  return (
    <div 
      className={`flex items-center border-b border-gray-200 dark:border-gray-700 py-4 px-2 ${canEdit ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer' : ''} ${className}`} 
      onClick={canEdit ? onClick : undefined}
    >
      {thumbnailUrl && (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden mr-4 flex-shrink-0">
          <Image src={thumbnailUrl} alt={title} fill className="object-cover" />
        </div>
      )}
      
      <div className="mr-4 flex-shrink-0">
        <ContentTypeIcon type={type} className="text-2xl text-primary" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-lg truncate">{title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-md">{description}</div>
        {(reviewedDate || lastReviewed) && (
          <div className="text-xs text-gray-400 dark:text-gray-500">{reviewedDate || lastReviewed}</div>
        )}
      </div>
      
      <div className="flex flex-row items-center gap-2 min-w-[120px] justify-end ml-2">
        {/* Personal notes for Ratings page */}
        {personalNotes && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-right max-w-xs truncate" title={personalNotes}>
            <span className="font-semibold text-gray-400 dark:text-gray-500">Notes:</span> {personalNotes}
          </div>
        )}
        
        {/* Friend avatars for Discover page */}
        {friendAvatars.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Reviewed by:</span>
            {friendAvatars.slice(0, 3).map(f => (
              <div key={f.id} className="relative w-6 h-6 rounded-full overflow-hidden border border-primary" title={f.name}>
                <Image src={f.avatarUrl} alt={f.name} fill className="object-cover" />
              </div>
            ))}
            {friendAvatars.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">+{friendAvatars.length - 3}</span>
            )}
          </div>
        )}
        
        {/* Rating display */}
        <div className="text-right min-w-[48px]">
          {showRating ? (
            <span className="inline-block bg-primary text-white rounded-full px-3 py-1 font-bold text-lg">{displayRating}</span>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm">No ratings</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentRow; 