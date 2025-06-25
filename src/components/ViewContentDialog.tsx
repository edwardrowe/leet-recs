import React, { useEffect } from "react";
import Image from "next/image";
import { Content } from "@/lib/contentStore";
import { ReviewWithContent } from "@/lib/reviewStore";
import { getPeople, CURRENT_USER_ID } from "@/lib/peopleStore";
import CloseButton from './CloseButton';

interface ViewContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: Content | null;
  reviews: ReviewWithContent[];
  onEdit: () => void;
  onAddToRatings: () => void;
  canAddToRatings: boolean;
}

const ViewContentDialog: React.FC<ViewContentDialogProps> = ({ isOpen, onClose, content, reviews, onEdit, onAddToRatings, canAddToRatings }) => {
  // Add Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !content) return null;

  // Get people map for fast lookup
  const people = getPeople();
  const getName = (userId: string) =>
    userId === CURRENT_USER_ID ? "Me" : (people.find(p => p.id === userId)?.name || userId);

  // Sort reviews: current user first, then others
  const sortedReviews = [
    ...reviews.filter(r => r.userId === CURRENT_USER_ID),
    ...reviews.filter(r => r.userId !== CURRENT_USER_ID),
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center" style={{ background: 'var(--dialog-scrim-bg)' }}>
      <div className="bg-white dark:bg-gray-800 p-0 rounded-2xl shadow-2xl w-full max-w-2xl relative">
        <div className="h-2 rounded-t-2xl bg-cyan-600 w-full" />
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={onEdit}
            className="px-4 py-2 rounded-md bg-cyan-600 text-white font-medium hover:bg-cyan-700 shadow"
            aria-label="Edit"
          >
            Edit
          </button>
          <CloseButton onClick={onClose} />
        </div>
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {content.thumbnailUrl && (
              <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={content.thumbnailUrl} alt={content.title} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{content.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-2">{content.type}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{content.description}</p>
              <div className="flex gap-2 mt-4 justify-end">
                {canAddToRatings && (
                  <button
                    onClick={onAddToRatings}
                    className="px-4 py-2 rounded-md bg-cyan-600 text-white font-medium hover:bg-cyan-700 shadow"
                  >
                    Add to Ratings
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">All Ratings</h3>
            {sortedReviews.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400">No one has rated this yet.</div>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {sortedReviews.map((review, idx) => (
                  <React.Fragment key={review.userId + '-' + idx}>
                    {idx === 1 && (
                      <div className="flex items-center my-2">
                        <div className="flex-grow h-px bg-gradient-to-r from-cyan-400 via-cyan-200 to-transparent dark:from-cyan-700 dark:via-cyan-900 dark:to-transparent" />
                        <span className="mx-2 text-cyan-400 dark:text-cyan-600 text-xs font-bold tracking-widest">OTHERS</span>
                        <div className="flex-grow h-px bg-gradient-to-l from-cyan-400 via-cyan-200 to-transparent dark:from-cyan-700 dark:via-cyan-900 dark:to-transparent" />
                      </div>
                    )}
                    <div className={`pb-3 ${idx !== sortedReviews.length - 1 && idx !== 0 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-semibold ${review.userId === CURRENT_USER_ID ? 'text-cyan-800 dark:text-cyan-200' : 'text-gray-800 dark:text-gray-200'}`}>{review.userId === CURRENT_USER_ID ? 'Me (You)' : getName(review.userId)}</span>
                        <span className="ml-2 inline-block bg-cyan-600 text-white rounded-full px-3 py-1 font-bold text-lg">{review.rating}</span>
                      </div>
                      {review.personalNotes && (
                        <div className={`text-sm italic ${review.userId === CURRENT_USER_ID ? 'text-cyan-900 dark:text-cyan-100' : 'text-gray-600 dark:text-gray-400'}`}>{review.personalNotes}</div>
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContentDialog; 