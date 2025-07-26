import React from 'react';
import Image from 'next/image';
import { ContentType } from '@/lib/contentStore';
import ContentTypeIcon from './ContentTypeIcon';
import { useState } from 'react';

interface ContentRowProps {
  title: string;
  description: string;
  type: ContentType;
  thumbnailUrl?: string;
  averageRating?: number;
  lastReviewed?: string;
  friendAvatars?: Array<{ id: string; name: string; avatarUrl: string }>;
  onClick?: () => void;
  className?: string;
  yourRating?: number;
}

const ContentRow: React.FC<ContentRowProps> = ({
  title,
  description,
  type,
  thumbnailUrl,
  averageRating,
  lastReviewed,
  friendAvatars = [],
  onClick,
  className = '',
  yourRating
}) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div
      className={`flex items-center bg-[#1e2a3b] hover:bg-[#263143] transition-colors rounded-2xl px-3 py-2 w-full cursor-pointer ${className}`}
      onClick={onClick}
      style={{ marginBottom: '0.25rem' }}
    >
      {/* Thumbnail */}
      {thumbnailUrl && (
        <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-6 bg-gray-800">
          <Image
            src={imgError ? '/fallback.svg' : thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="96px"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-1">
          <ContentTypeIcon type={type} className="w-5 h-5 text-primary" />
          <span className="text-lg font-bold text-white truncate">{title}</span>
        </div>
        {lastReviewed && (
          <div className="text-xs text-gray-400 mb-1">{lastReviewed}</div>
        )}
        <div className="text-sm text-gray-300 truncate max-w-2xl">{description}</div>
      </div>
      {/* Rating badge */}
      {averageRating !== undefined && (
        <div className="ml-6 flex flex-col items-end justify-between h-full">
          <div className="flex flex-row items-center gap-2">
            {yourRating !== undefined && (
              <span className="text-xs font-semibold text-primary bg-white dark:bg-gray-900 rounded px-2 py-1 border border-primary-light dark:border-primary-dark">
                Your Rating: {yourRating}
              </span>
            )}
            <span className="bg-green-600 text-white font-bold px-4 py-1 rounded-full text-base shadow text-center min-w-[3rem]">
              {averageRating}
            </span>
          </div>
          {/* Reviewer avatars */}
          {friendAvatars.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-gray-400 mr-1">Reviewed by:</span>
              {friendAvatars.map(f => (
                <div key={f.id} className="relative w-7 h-7 rounded-full overflow-hidden" title={f.name}>
                  <Image src={f.avatarUrl} alt={f.name} fill className="object-cover" sizes="28px" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentRow; 