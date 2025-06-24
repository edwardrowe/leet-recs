"use client";

import ReviewCard from "@/components/ReviewCard";
import { useState } from "react";
import AddReviewDialog, { Content, NewReviewData, Review } from "@/components/AddReviewDialog";
import { ReviewWithUser } from "@/lib/reviewStore";
import Fab from "@/components/Fab";
import UserProfile from "@/components/UserProfile";
import EmptyState from "@/components/EmptyState";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import NavBar from "@/components/NavBar";
import { getContentList } from "@/lib/contentStore";
import { CURRENT_USER_ID } from "@/lib/peopleStore";
import ContentFilterBar from "@/components/ContentFilterBar";
import { getReviews, addOrUpdateReview, deleteReview } from "@/lib/reviewStore";
import { FaFilm, FaTv, FaBook } from "react-icons/fa";
import Image from "next/image";

// This is the shape of a review that has been saved
// Note: The `Review` type is now imported from AddReviewDialog
// to ensure it's consistent across components.

// This is our fake "database" of all possible content
// const contentDatabase: Content[] = [
//   { id: "1", title: "Inception", type: "movie", description: "A mind-bending thriller about dreaming within dreams.", thumbnailUrl: "https://picsum.photos/seed/inception/400/300" },
//   { id: "2", title: "Fleabag", type: "tv-show", description: "A hilarious and heartbreaking look at a young woman's life in London.", thumbnailUrl: "https://picsum.photos/seed/fleabag/400/300" },
//   { id: "3", title: "Project Hail Mary", type: "book", description: "A lone astronaut must save the Earth from a mysterious threat.", thumbnailUrl: "https://picsum.photos/seed/project-hail-mary/400/300" },
//   { id: "4", title: "The Office", type: "tv-show", description: "A mockumentary about the everyday lives of office employees.", thumbnailUrl: "https://picsum.photos/seed/the-office/400/300" },
//   { id: "5", title: "Dune", type: "book", description: "A sci-fi epic about a young nobleman's destiny on a desert planet.", thumbnailUrl: "https://picsum.photos/seed/dune/400/300" },
//   { id: "6", title: "The Matrix", type: "movie", description: "A hacker discovers the shocking truth about his reality.", thumbnailUrl: "https://picsum.photos/seed/the-matrix/400/300" },
// ];

// No longer needed: initialReviews are now in reviewStore

function ReviewRow({ review, onEdit }: { review: ReviewWithUser; onEdit: () => void }) {
  let icon;
  if (review.type === "movie") icon = <FaFilm className="text-2xl text-pink-600" />;
  else if (review.type === "tv-show") icon = <FaTv className="text-2xl text-pink-600" />;
  else icon = <FaBook className="text-2xl text-pink-600" />;
  return (
    <div className="flex items-center border-b border-gray-200 dark:border-gray-700 py-4 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={onEdit}>
      {review.thumbnailUrl && (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden mr-4 flex-shrink-0">
          <Image src={review.thumbnailUrl} alt={review.title} fill className="object-cover" />
        </div>
      )}
      <div className="mr-4 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-lg truncate">{review.title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-md">{review.description}</div>
      </div>
      <div className="flex flex-row items-center gap-2 min-w-[120px] justify-end ml-2">
        {review.personalNotes && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-right max-w-xs truncate" title={review.personalNotes}>
            <span className="font-semibold text-gray-400 dark:text-gray-500">Notes:</span> {review.personalNotes}
          </div>
        )}
        <div className="text-right min-w-[48px]">
          <span className="inline-block bg-pink-600 text-white rounded-full px-3 py-1 font-bold text-lg">{review.rating}</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [reviews, setReviews] = useState<ReviewWithUser[]>(getReviews().filter(r => r.userId === CURRENT_USER_ID));
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv-show' | 'book'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'title'>('rating');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<ReviewWithUser | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<ReviewWithUser | null>(null);
  const [view, setView] = useState<'grid' | 'row'>('grid');

  const currentUser = {
    name: 'Elrowe',
    avatarUrl: 'https://picsum.photos/seed/elrowe-avatar/200',
  };

  const handleOpenAddDialog = () => {
    setReviewToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (review: ReviewWithUser) => {
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
      setReviews(getReviews().filter(r => r.userId === CURRENT_USER_ID));
      setIsConfirmDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleSaveReview = (newReviewData: NewReviewData) => {
    const content = getContentList().find(c => c.id === newReviewData.contentId);
    if (!content) return;

    const newReview: ReviewWithUser = {
      ...content,
      rating: newReviewData.rating,
      personalNotes: newReviewData.personalNotes,
      userId: CURRENT_USER_ID,
    };
    addOrUpdateReview(newReview);
    setReviews(getReviews().filter(r => r.userId === CURRENT_USER_ID));
  };

  const filteredAndSortedReviews = reviews
    .filter(review =>
      (filter === 'all' || review.type === filter) &&
      (review.title.toLowerCase().includes(search.toLowerCase()) ||
        review.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortBy === 'rating') {
        if (b.rating === a.rating) {
          return a.title.localeCompare(b.title) * direction;
        }
        return (b.rating - a.rating) * direction;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title) * direction;
      }
      return 0;
    });

  const getEmptyStateMessage = () => {
    if (filter === 'all' && reviews.length === 0) {
      return "You haven't added any reviews yet. Click the '+' to get started!";
    }
    const typeName = filter === 'tv-show' ? 'TV shows' : `${filter}s`;
    return `No ${typeName} found in your reviews.`;
  };

  // Exclude already reviewed content from the dialog dropdown
  const availableContentToReview = getContentList().filter(
    content => !reviews.some(review => review.id === content.id)
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-12 space-y-8">
      <NavBar />
      <header className="w-full max-w-6xl flex justify-between items-center">
        <h1 className="text-5xl font-bold">My Recs</h1>
        <UserProfile name={currentUser.name} avatarUrl={currentUser.avatarUrl} />
      </header>

      <div className="w-full max-w-6xl flex flex-row justify-between items-center gap-4 mb-8 px-0 md:px-0">
        <div className="flex flex-row items-center gap-2">
          {/* Content type filter */}
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'all' ? 'bg-pink-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>All</button>
          <button onClick={() => setFilter('movie')} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'movie' ? 'bg-pink-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Movies</button>
          <button onClick={() => setFilter('tv-show')} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'tv-show' ? 'bg-pink-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>TV Shows</button>
          <button onClick={() => setFilter('book')} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'book' ? 'bg-pink-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Books</button>
        </div>
        <div className="flex items-center gap-2 border-l border-gray-300 dark:border-gray-600 pl-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
          <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'title')}
            className="px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          >
            <option value="rating">Rating</option>
            <option value="title">Title</option>
          </select>
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border rounded-md text-lg font-mono bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            aria-label={`Sort in ${sortDirection === 'asc' ? 'descending' : 'ascending'} order`}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
          {/* View toggle */}
          <button
            className={`ml-4 px-3 py-2 rounded-md text-sm font-medium border ${view === 'grid' ? 'bg-pink-600 text-white border-pink-600' : 'bg-white dark:bg-gray-800 text-pink-600 border-pink-600'}`}
            onClick={() => setView('grid')}
            aria-label="Grid view"
          >
            Grid
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium border ${view === 'row' ? 'bg-pink-600 text-white border-pink-600' : 'bg-white dark:bg-gray-800 text-pink-600 border-pink-600'}`}
            onClick={() => setView('row')}
            aria-label="Row view"
          >
            List
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {(filteredAndSortedReviews as ReviewWithUser[]).length > 0 ? (
            (filteredAndSortedReviews as ReviewWithUser[]).map((review) => (
              <ReviewCard
                key={review.id}
                title={review.title}
                description={review.description}
                rating={review.rating}
                type={review.type}
                personalNotes={review.personalNotes}
                thumbnailUrl={review.thumbnailUrl}
                onEdit={() => handleOpenEditDialog(review)}
              />
            ))
          ) : (
            <EmptyState message={getEmptyStateMessage()} />
          )}
        </div>
      ) : (
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
          {(filteredAndSortedReviews as ReviewWithUser[]).length > 0 ? (
            (filteredAndSortedReviews as ReviewWithUser[]).map((review) => (
              <ReviewRow key={review.id} review={review} onEdit={() => handleOpenEditDialog(review)} />
            ))
          ) : (
            <EmptyState message={getEmptyStateMessage()} />
          )}
        </div>
      )}
      
      <Fab onClick={handleOpenAddDialog} />

      <AddReviewDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveReview}
        contentDatabase={availableContentToReview}
        reviewToEdit={reviewToEdit}
        onDelete={handleOpenDeleteConfirmDialog}
      />

      <ConfirmationDialog
        isOpen={isConfirmDeleteDialogOpen}
        onClose={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete your review for "${reviewToDelete?.title}"? This action cannot be undone.`}
      />
    </main>
  );
}
