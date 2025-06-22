import React from 'react';

type ReviewCardProps = {
  title: string;
  description: string;
  rating: number;
  type: 'movie' | 'tv-show' | 'book';
  personalNotes?: string;
};

const ReviewCard: React.FC<ReviewCardProps> = ({ title, description, rating, type, personalNotes }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-800 flex flex-col h-full">
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
      </div>
    </div>
  );
};

export default ReviewCard; 