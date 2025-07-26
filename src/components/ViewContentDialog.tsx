import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Content } from "@/lib/contentStore";
import { ReviewWithContent } from "@/lib/reviewStore";
import { getPeople, CURRENT_USER_ID } from "@/lib/peopleStore";
import CloseButton from './CloseButton';
import { FaPencilAlt } from 'react-icons/fa';

interface ViewContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: Content | null;
  reviews: ReviewWithContent[];
  onEdit: () => void; // Edit content
  onEditReview?: () => void; // Edit user's review
  onAddToRatings: () => void;
  canAddToRatings: boolean;
}

function formatReviewDateShort(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  const date = new Date(timestamp);
  return `on ${date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
}

const ViewContentDialog: React.FC<ViewContentDialogProps> = ({ isOpen, onClose, content, reviews, onEdit, onEditReview, onAddToRatings, canAddToRatings }) => {
  const [imgError, setImgError] = useState(false);
  useEffect(() => {
    setImgError(false);
  }, [content?.thumbnailUrl, isOpen]);
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

  const myReview = reviews.find(r => r.userId === CURRENT_USER_ID);

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
                <Image
                  src={imgError ? '/fallback.svg' : content.thumbnailUrl}
                  alt={content.title}
                  fill
                  className="object-cover"
                  sizes="192px"
                  onError={() => setImgError(true)}
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{content.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-2">{content.type}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{content.description}</p>
              <div className="flex flex-col gap-2 mt-4 items-end">
                {canAddToRatings && (
                  <button
                    onClick={onAddToRatings}
                    className="px-4 py-2 rounded-md bg-cyan-600 text-white font-medium hover:bg-cyan-700 shadow"
                  >
                    Rate This
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
                        <span className="text-xs text-gray-400 ml-2">{formatReviewDateShort(review.timestamp)}</span>
                        {review.userId === CURRENT_USER_ID && (
                          <button
                            onClick={onEditReview}
                            className="ml-auto w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 shadow transition-colors"
                            aria-label="Edit My Review"
                            type="button"
                          >
                            <FaPencilAlt className="w-5 h-5" />
                          </button>
                        )}
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