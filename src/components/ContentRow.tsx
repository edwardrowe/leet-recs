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
      className={`row flex items-center bg-white hover:bg-gray-50 transition-colors rounded-lg px-3 py-2 w-full cursor-pointer ${className}`}
      onClick={onClick}
      style={{ marginBottom: '0.25rem', minHeight: 64 }}
    >
      {/* Thumbnail */}
      {thumbnailUrl && (
        <div className="relative w-16 h-12 rounded-md overflow-hidden flex-shrink-0 mr-4 bg-gray-200">
          <Image
            src={imgError ? '/fallback.svg' : thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="64px"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-2 mb-0.5">
          <ContentTypeIcon type={type} className="w-4 h-4 text-primary" />
          <span className="text-base font-semibold text-gray-900 truncate">{title}</span>
        </div>
        {lastReviewed && (
          <div className="text-xs text-gray-400 mb-0.5">{lastReviewed}</div>
        )}
        <div className="text-xs text-gray-600 truncate max-w-2xl">{description}</div>
      </div>
      {/* Rating badge and reviewers */}
      {averageRating !== undefined && (
        <div className="ml-4 flex flex-col items-end justify-between h-full">
          <div className="flex flex-row items-center gap-2">
            {yourRating !== undefined && (
              <span className="text-xs font-semibold text-primary bg-white rounded px-2 py-1 border border-primary-light">
                Your Rating: {yourRating}
              </span>
            )}
            <span className="bg-green-600 text-white font-bold px-3 py-1 rounded-full text-base shadow text-center min-w-[2.5rem]">
              {averageRating}
            </span>
          </div>
          {friendAvatars.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-gray-400 mr-1">Reviewed by:</span>
              {friendAvatars.map(f => (
                <div key={f.id} className="relative w-5 h-5 rounded-full overflow-hidden" title={f.name}>
                  <Image src={f.avatarUrl} alt={f.name} fill className="object-cover" sizes="20px" />
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