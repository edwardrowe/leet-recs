"use client";

import ReviewCard from "@/components/ReviewCard";
import { useState } from "react";
import AddReviewDialog, { Content, NewReviewData, Review } from "@/components/AddReviewDialog";
import Fab from "@/components/Fab";
import UserProfile from "@/components/UserProfile";
import EmptyState from "@/components/EmptyState";

// This is the shape of a review that has been saved
// Note: The `Review` type is now imported from AddReviewDialog
// to ensure it's consistent across components.

// This is our fake "database" of all possible content
const contentDatabase: Content[] = [
  { id: "1", title: "Inception", type: "movie", description: "A mind-bending thriller about dreaming within dreams.", thumbnailUrl: "https://picsum.photos/seed/inception/400/300" },
  { id: "2", title: "Fleabag", type: "tv-show", description: "A hilarious and heartbreaking look at a young woman's life in London.", thumbnailUrl: "https://picsum.photos/seed/fleabag/400/300" },
  { id: "3", title: "Project Hail Mary", type: "book", description: "A lone astronaut must save the Earth from a mysterious threat.", thumbnailUrl: "https://picsum.photos/seed/project-hail-mary/400/300" },
  { id: "4", title: "The Office", type: "tv-show", description: "A mockumentary about the everyday lives of office employees.", thumbnailUrl: "https://picsum.photos/seed/the-office/400/300" },
  { id: "5", title: "Dune", type: "book", description: "A sci-fi epic about a young nobleman's destiny on a desert planet.", thumbnailUrl: "https://picsum.photos/seed/dune/400/300" },
  { id: "6", title: "The Matrix", type: "movie", description: "A hacker discovers the shocking truth about his reality.", thumbnailUrl: "https://picsum.photos/seed/the-matrix/400/300" },
];

// This is the initial set of reviews already on the page
const initialReviews: Review[] = [
  {
    id: "3",
    title: "Project Hail Mary",
    description: "A lone astronaut must save the Earth from a mysterious threat.",
    rating: 9,
    type: "book" as const,
    thumbnailUrl: "https://picsum.photos/seed/project-hail-mary/400/300",
  },
  {
    id: "2",
    title: "Fleabag",
    description: "A hilarious and heartbreaking look at a young woman's life in London.",
    rating: 10,
    type: "tv-show" as const,
    personalNotes: "The 'hot priest' season is a masterpiece of television.",
    thumbnailUrl: "https://picsum.photos/seed/fleabag/400/300",
  },
];

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv-show' | 'book'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'title'>('rating');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);

  const currentUser = {
    name: 'Elrowe',
    avatarUrl: 'https://picsum.photos/seed/elrowe-avatar/200',
  };

  const handleOpenAddDialog = () => {
    setReviewToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (review: Review) => {
    setReviewToEdit(review);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setReviewToEdit(null);
  };

  const handleSaveReview = (newReviewData: NewReviewData) => {
    const content = contentDatabase.find(c => c.id === newReviewData.contentId);
    if (!content) return;

    const newReview: Review = {
      ...content,
      rating: newReviewData.rating,
      personalNotes: newReviewData.personalNotes,
    };
    
    // Add the new review, replacing it if it already exists
    setReviews(prevReviews => {
      const existingIndex = prevReviews.findIndex(r => r.id === newReview.id);
      if (existingIndex > -1) {
        const updatedReviews = [...prevReviews];
        updatedReviews[existingIndex] = newReview;
        return updatedReviews;
      }
      return [...prevReviews, newReview];
    });
  };

  const filteredAndSortedReviews = reviews
    .filter(review => filter === 'all' || review.type === filter)
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
  const availableContentToReview = contentDatabase.filter(
    content => !reviews.some(review => review.id === content.id)
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-12 space-y-8">
      <header className="w-full max-w-6xl flex justify-between items-center">
        <h1 className="text-5xl font-bold">My Recs</h1>
        <UserProfile name={currentUser.name} avatarUrl={currentUser.avatarUrl} />
      </header>

      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 flex-wrap justify-center">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>All</button>
          <button onClick={() => setFilter('movie')} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'movie' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Movies</button>
          <button onClick={() => setFilter('tv-show')} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'tv-show' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>TV Shows</button>
          <button onClick={() => setFilter('book')} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'book' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Books</button>
        </div>
        <div className="flex items-center gap-2">
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
            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border rounded-md text-lg font-mono bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            aria-label={`Sort in ${sortDirection === 'asc' ? 'descending' : 'ascending'} order`}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {filteredAndSortedReviews.length > 0 ? (
          filteredAndSortedReviews.map((review) => (
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
      
      <Fab onClick={handleOpenAddDialog} />

      <AddReviewDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveReview}
        contentDatabase={availableContentToReview}
        reviewToEdit={reviewToEdit}
      />
    </main>
  );
}
