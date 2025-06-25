import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Content, ContentType } from '@/lib/contentStore';
import { ReviewWithContent } from '@/lib/reviewStore';

// This is the shape of the data the dialog will return
export type NewReviewData = {
  contentId: string;
  rating: number;
  personalNotes: string;
};

// The full review shape, needed for edit mode
export type Review = ReviewWithContent;

type AddReviewDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewReviewData) => void;
  onDelete?: () => void;
  contentDatabase: Content[]; // For add mode
  reviewToEdit?: Review | null; // For edit mode
};

const AddReviewDialog: React.FC<AddReviewDialogProps> = ({ isOpen, onClose, onSave, onDelete, contentDatabase, reviewToEdit }) => {
  const isEditMode = !!reviewToEdit;
  const [selectedContentId, setSelectedContentId] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [personalNotes, setPersonalNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && reviewToEdit) {
        setSelectedContentId(reviewToEdit.id);
        setRating(reviewToEdit.rating);
        setPersonalNotes(reviewToEdit.personalNotes || '');
      } else if (contentDatabase.length === 1) {
        setSelectedContentId(contentDatabase[0].id);
        setRating(5);
        setPersonalNotes('');
      } else {
        setSelectedContentId('');
        setRating(5);
        setPersonalNotes('');
      }
    }
  }, [isOpen, isEditMode, reviewToEdit, contentDatabase]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSave = () => {
    const contentId = isEditMode ? reviewToEdit.id : selectedContentId;
    if (!contentId) {
      alert('Please select an item to review.');
      return;
    }
    onSave({
      contentId,
      rating: Number(rating),
      personalNotes,
    });
    onClose();
  };

  if (!isOpen) return null;

  const selectedContent = isEditMode ? reviewToEdit : contentDatabase.find(c => c.id === selectedContentId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-0 rounded-2xl shadow-2xl w-full max-w-md relative">
        <div className="h-2 rounded-t-2xl bg-pink-600 w-full" />
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{isEditMode ? 'Edit Review' : 'Add a new review'}</h2>
          {selectedContent && selectedContent.thumbnailUrl && (
            <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
              <Image
                src={selectedContent.thumbnailUrl}
                alt={`Thumbnail for ${selectedContent.title}`}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="space-y-6">
            {isEditMode && reviewToEdit ? (
              <div>
                <h3 className="text-xl font-semibold">{reviewToEdit.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{reviewToEdit.type}</p>
              </div>
            ) : contentDatabase.length === 1 ? (
              <div>
                <h3 className="text-xl font-semibold">{contentDatabase[0].title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{contentDatabase[0].type}</p>
              </div>
            ) : (
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content Title</label>
                <select
                  id="content"
                  value={selectedContentId}
                  onChange={(e) => setSelectedContentId(e.target.value)}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-lg bg-white dark:bg-gray-700 px-3`}
                >
                  <option value="" disabled>Select something to review...</option>
                  {contentDatabase.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.title} ({item.type})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating (0-10)</label>
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
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Personal Notes</label>
              <textarea
                id="notes"
                rows={4}
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-between items-center">
            <div>
              {isEditMode && onDelete && (
                <button onClick={onDelete} className="px-5 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 shadow">
                  Delete Review
                </button>
              )}
            </div>
            <div className="flex gap-4">
              <button onClick={onClose} className="px-5 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 shadow">
                Cancel
              </button>
              <button onClick={handleSave} className="px-5 py-2 text-sm font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 shadow">
                Save Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReviewDialog; 