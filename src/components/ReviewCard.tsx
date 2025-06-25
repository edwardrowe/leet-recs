import React from 'react';
import Image from 'next/image';
import { ContentType } from '@/lib/contentStore';

type ReviewCardProps = {
  title: string;
  description: string;
  rating: number;
  type: ContentType;
  personalNotes?: string;
  thumbnailUrl?: string;
  onEdit?: () => void;
  reviewedDate?: string;
};

const ReviewCard: React.FC<ReviewCardProps> = ({ title, description, rating, type, personalNotes, thumbnailUrl, onEdit, reviewedDate }) => {
  return (
    <div
      className={
        `border rounded-lg shadow-md bg-white dark:bg-gray-800 flex flex-col h-full overflow-hidden transition-colors ${onEdit ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}`
      }
      onClick={onEdit}
    >
      {thumbnailUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={thumbnailUrl}
            alt={`Thumbnail for ${title}`}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold mb-1">{title}</h2>
          {reviewedDate && <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">{reviewedDate}</div>}
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-2">{type}</p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
          {personalNotes && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <h3 className="font-semibold text-md mb-1 text-gray-800 dark:text-gray-200">My Notes:</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">{personalNotes}</p>
            </div>
          )}
        </div>
        <div className="flex items-center mt-auto">
          <span className="font-bold text-lg">{rating}</span>
          <span className="text-gray-500 dark:text-gray-400">/10</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard; 