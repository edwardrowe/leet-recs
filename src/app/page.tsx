"use client";

import React, { useState } from "react";
import AddReviewDialog, { NewReviewData, Review } from "@/components/AddReviewDialog";
import { ReviewWithUser } from "@/lib/reviewStore";
import Fab from "@/components/Fab";
import UserProfile from "@/components/UserProfile";
import EmptyState from "@/components/EmptyState";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import NavBar from "@/components/NavBar";
import { getContentList, Content } from "@/lib/contentStore";
import type { ContentType } from '@/components/ContentFilterBar';
import { CURRENT_USER_ID, getPeople } from "@/lib/peopleStore";
import ContentFilterBar from "@/components/ContentFilterBar";
import { getReviews, addOrUpdateReview, deleteReview, getReviewsWithContentByUserId, ReviewWithContent } from "@/lib/reviewStore";
import ContentCard from "@/components/ContentCard";
import ContentRow from "@/components/ContentRow";
import FriendPicker from "@/components/FriendPicker";
import SortPicker, { SortOption } from "@/components/SortPicker";

function formatReviewDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Reviewed today';
  if (days === 1) return 'Reviewed yesterday';
  if (days < 7) return `Reviewed ${days} days ago`;
  const date = new Date(timestamp);
  return `Reviewed on ${date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
}

export default function Home() {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ReviewWithContent[]>(getReviewsWithContentByUserId(CURRENT_USER_ID));
  const [enabledTypes, setEnabledTypes] = useState<ContentType[]>(['all']);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'title' | 'lastReviewed'>('rating');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<ReviewWithContent | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<ReviewWithContent | null>(null);
  const [view, setView] = useState<'grid' | 'row'>('grid');

  const people = getPeople();
  const currentUser = people.find(p => p.id === CURRENT_USER_ID) || {
    name: 'Elrowe',
    avatarUrl: 'https://picsum.photos/seed/elrowe-avatar/200',
  };
  const selectedFriend = selectedFriendId ? people.find(p => p.id === selectedFriendId) : null;

  // Update reviews when friend selection changes
  const updateReviews = () => {
    const targetUserId = selectedFriendId || CURRENT_USER_ID;
    setReviews(getReviewsWithContentByUserId(targetUserId));
  };

  // Update reviews whenever selectedFriendId changes
  React.useEffect(() => {
    updateReviews();
  }, [selectedFriendId]);

  const handleFriendSelect = (friendId: string | null) => {
    setSelectedFriendId(friendId);
  };

  const handleOpenAddDialog = () => {
    setReviewToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (review: ReviewWithContent) => {
    setReviewToEdit(review);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setReviewToEdit(null);
  };

  const handleOpenDeleteConfirmDialog = () => {
    if (reviewToEdit) {
      setReviewToDelete(reviewToEdit);
      setIsDialogOpen(false);
      setIsConfirmDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (reviewToDelete) {
      deleteReview(reviewToDelete.id, reviewToDelete.userId);
      updateReviews();
      setIsConfirmDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleSaveReview = (newReviewData: NewReviewData) => {
    const newReview: ReviewWithUser = {
      id: newReviewData.contentId,
      rating: newReviewData.rating,
      personalNotes: newReviewData.personalNotes,
      userId: CURRENT_USER_ID,
      timestamp: Date.now(),
    };
    addOrUpdateReview(newReview);
    updateReviews();
  };

  const filteredAndSortedReviews = reviews
    .filter(review =>
      (enabledTypes.includes('all') || enabledTypes.includes(review.type)) &&
      (review.title.toLowerCase().includes(search.toLowerCase()) ||
        review.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'rating') {
        if (a.rating === b.rating) {
          return a.title.localeCompare(b.title);
        }
        // Descending: highest to lowest
        return sortDirection === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      }
      if (sortBy === 'title') {
        const direction = sortDirection === 'asc' ? 1 : -1;
        return a.title.localeCompare(b.title) * direction;
      }
      if (sortBy === 'lastReviewed') {
        const direction = sortDirection === 'asc' ? 1 : -1;
        if (a.timestamp === b.timestamp) return a.title.localeCompare(b.title) * direction;
        return (a.timestamp - b.timestamp) * direction;
      }
      return 0;
    });

  const getEmptyStateMessage = () => {
    const personName = selectedFriend ? selectedFriend.name : 'You';
    if (reviews.length === 0) {
      return selectedFriend 
        ? `${personName} hasn't added any reviews yet.`
        : "You haven't added any reviews yet. Click the '+' to get started!";
    }
    let typeName;
    if (reviews[0].type === 'tv-show') typeName = 'TV shows';
    else if (reviews[0].type === 'video-game') typeName = 'Video games';
    else typeName = `${reviews[0].type}s`;
    return `No ${typeName} found in ${personName.toLowerCase()}'s reviews.`;
  };

  // Only show add button if viewing own reviews
  const canAddReviews = selectedFriendId === null;

  // Exclude already reviewed content from the dialog dropdown (only for own reviews)
  const availableContentToReview = canAddReviews ? getContentList().filter(
    content => !reviews.some(review => review.id === content.id)
  ) : [];

  const sortOptions: SortOption[] = [
    { value: 'rating', label: 'Rating' },
    { value: 'title', label: 'Title' },
    { value: 'lastReviewed', label: 'Last Reviewed' },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-12 space-y-8">
      <NavBar />
      <header className="w-full max-w-6xl flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-5xl font-bold">
            {selectedFriend ? `${selectedFriend.name}'s Ratings` : 'Ratings'}
          </h1>
          <FriendPicker 
            selectedFriendId={selectedFriendId} 
            onFriendSelect={handleFriendSelect} 
          />
        </div>
      </header>

      <div className="w-full max-w-6xl flex flex-row justify-between items-center gap-4 mb-8 px-0 md:px-0">
        <div className="flex flex-row items-center gap-2">
          <ContentFilterBar enabledTypes={enabledTypes} setEnabledTypes={setEnabledTypes} search={search} setSearch={setSearch} sortDirection={sortDirection} setSortDirection={setSortDirection} />
        </div>
        <div className="flex items-center gap-2 border-l border-gray-300 dark:border-gray-600 pl-4">
          <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
          <SortPicker
            options={sortOptions}
            value={sortBy}
            onChange={val => setSortBy(val as 'rating' | 'title' | 'lastReviewed')}
          />
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border rounded-md text-lg font-mono bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            aria-label={`Sort in ${sortDirection === 'asc' ? 'descending' : 'ascending'} order`}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
          {/* View toggle */}
          <button
            className={`ml-4 px-3 py-2 rounded-md text-sm font-medium border ${view === 'grid' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-gray-800 text-primary border-primary'}`}
            onClick={() => setView('grid')}
            aria-label="Grid view"
          >
            Grid
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium border ${view === 'row' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-gray-800 text-primary border-primary'}`}
            onClick={() => setView('row')}
            aria-label="Row view"
          >
            Row
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {(filteredAndSortedReviews as ReviewWithContent[]).length > 0 ? (
            (filteredAndSortedReviews as ReviewWithContent[]).map((review) => (
              <ContentCard
                key={review.id}
                title={review.title}
                description={review.description}
                rating={review.rating}
                type={review.type}
                personalNotes={review.personalNotes}
                thumbnailUrl={review.thumbnailUrl}
                reviewedDate={formatReviewDate(review.timestamp)}
                onClick={canAddReviews ? () => handleOpenEditDialog(review) : undefined}
              />
            ))
          ) : (
            <EmptyState message={getEmptyStateMessage()} />
          )}
        </div>
      ) : (
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
          {(filteredAndSortedReviews as ReviewWithContent[]).length > 0 ? (
            (filteredAndSortedReviews as ReviewWithContent[]).map((review) => (
              <ContentRow 
                key={review.id} 
                title={review.title}
                description={review.description}
                rating={review.rating}
                type={review.type}
                personalNotes={review.personalNotes}
                thumbnailUrl={review.thumbnailUrl}
                reviewedDate={formatReviewDate(review.timestamp)}
                onClick={() => handleOpenEditDialog(review)} 
                canEdit={canAddReviews} 
              />
            ))
          ) : (
            <EmptyState message={getEmptyStateMessage()} />
          )}
        </div>
      )}
      
      {canAddReviews && <Fab onClick={handleOpenAddDialog} color="primary" />}

      <AddReviewDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveReview}
        contentDatabase={availableContentToReview}
        reviewToEdit={reviewToEdit}
        onDelete={handleOpenDeleteConfirmDialog}
      />

      {isConfirmDeleteDialogOpen && reviewToDelete && (
        <ConfirmationDialog
          isOpen={true}
          onClose={() => setIsConfirmDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete your review for "${reviewToDelete.title}"? This action cannot be undone.`}
        />
      )}
    </main>
  );
}
