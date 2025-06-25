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
};

const ReviewCard: React.FC<ReviewCardProps> = ({ title, description, rating, type, personalNotes, thumbnailUrl, onEdit }) => {
  return (
    <div className="border rounded-lg shadow-md bg-white dark:bg-gray-800 flex flex-col h-full overflow-hidden">
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
          {onEdit && (
            <button 
              onClick={onEdit} 
              className="ml-auto p-2 rounded-full text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Edit review"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard; 