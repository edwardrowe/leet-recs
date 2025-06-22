import React, { useState } from 'react';

// This is the shape of the content in our "database"
export type Content = {
  id: string;
  title: string;
  type: 'movie' | 'tv-show' | 'book';
  description: string;
  thumbnailUrl?: string;
};

// This is the shape of the data the dialog will return
export type NewReviewData = {
  contentId: string;
  rating: number;
  personalNotes: string;
};

type AddReviewDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewReviewData) => void;
  contentDatabase: Content[];
};

const AddReviewDialog: React.FC<AddReviewDialogProps> = ({ isOpen, onClose, onSave, contentDatabase }) => {
  const [selectedContentId, setSelectedContentId] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [personalNotes, setPersonalNotes] = useState('');

  const handleSave = () => {
    if (!selectedContentId) {
      alert('Please select an item to review.');
      return;
    }
    onSave({
      contentId: selectedContentId,
      rating: Number(rating),
      personalNotes,
    });
    // Reset form and close
    setSelectedContentId('');
    setRating(5);
    setPersonalNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add a new review</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content Title</label>
            <select
              id="content"
              value={selectedContentId}
              onChange={(e) => setSelectedContentId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700"
            >
              <option value="" disabled>Select something to review...</option>
              {contentDatabase.map(item => (
                <option key={item.id} value={item.id}>
                  {item.title} ({item.type})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating (0-10)</label>
            <input
              type="range"
              id="rating"
              min="0"
              max="10"
              step="1"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="text-center font-bold text-lg">{rating}</div>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Personal Notes</label>
            <textarea
              id="notes"
              rows={4}
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Save Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReviewDialog; 