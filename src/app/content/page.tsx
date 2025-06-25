"use client";
import { useState } from "react";
import { Content } from "@/lib/contentStore";
import AddContentDialog, { NewContentData } from "@/components/AddContentDialog";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import Fab from "@/components/Fab";
import { getContentList, addContent, updateContent, deleteContent, ContentType } from "@/lib/contentStore";
import ContentFilterBar from "@/components/ContentFilterBar";
import AddReviewDialog, { NewReviewData } from "@/components/AddReviewDialog";
import { getReviews, addOrUpdateReview, getReviewsWithContentByContentId } from "@/lib/reviewStore";
import { getPeople, CURRENT_USER_ID } from "@/lib/peopleStore";
import { getReviewsByContentId } from "@/lib/reviewStore";
import ConfirmationDialog from '@/components/ConfirmationDialog';

export default function ContentPage() {
  const [contentList, setContentList] = useState<Content[]>(getContentList());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | ContentType>('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewContent, setReviewContent] = useState<Content | null>(null);
  const [reviewedFilter, setReviewedFilter] = useState<'all' | 'reviewed' | 'not-reviewed'>('all');
  const reviewedIds = new Set(getReviews().filter(r => r.userId === CURRENT_USER_ID).map(r => r.id));
  const [_, setForceUpdate] = useState(0);
  const [editContent, setEditContent] = useState<Content | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteContent, setPendingDeleteContent] = useState<Content | null>(null);

  const handleAddContent = (data: NewContentData) => {
    // For now, default to 'movie' type and generate a new id
    const newId = (Math.max(0, ...getContentList().map(c => parseInt(c.id, 10))) + 1).toString();
    const newContent = {
      id: newId,
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      type: data.type,
    };
    addContent(newContent);
    setContentList(getContentList()); // Trigger re-render
  };

  // Filtering and sorting logic
  const filteredSortedContent = contentList
    .filter(item => {
      if (reviewedFilter === 'reviewed' && !reviewedIds.has(item.id)) return false;
      if (reviewedFilter === 'not-reviewed' && reviewedIds.has(item.id)) return false;
      return (
        (typeFilter === 'all' || item.type === typeFilter) &&
        (item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()))
      );
    })
    .sort((a, b) => {
      const cmp = a.title.localeCompare(b.title);
      return sortDirection === 'asc' ? cmp : -cmp;
    });

  const handleReviewedFilterChange = (val: 'all' | 'reviewed' | 'not-reviewed') => setReviewedFilter(val);

  const handleSaveReview = (data: NewReviewData) => {
    if (!reviewContent) return;
    const newReview = {
      id: reviewContent.id,
      rating: data.rating,
      personalNotes: data.personalNotes,
      userId: CURRENT_USER_ID,
    };
    addOrUpdateReview(newReview);
    setForceUpdate(x => x + 1); // force re-render
    setReviewDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteContent) {
      deleteContent(pendingDeleteContent.id);
      setContentList(getContentList());
      setEditContent(null);
    }
    setPendingDeleteContent(null);
    setConfirmDeleteOpen(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 space-y-8">
      <NavBar />
      <h1 className="text-4xl font-bold mb-8">Discover</h1>
      <div className="w-full max-w-6xl flex flex-row justify-between items-center gap-4 mb-8 px-0 md:px-0">
        <div className="flex flex-row items-center gap-2">
          {/* Content type filter */}
          <button onClick={() => setTypeFilter('all')} className={`px-4 py-2 rounded-full text-sm font-medium ${typeFilter === 'all' ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'} cursor-pointer`}>All</button>
          <button onClick={() => setTypeFilter('movie')} className={`px-4 py-2 rounded-full text-sm font-medium ${typeFilter === 'movie' ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'} cursor-pointer`}>Movies</button>
          <button onClick={() => setTypeFilter('tv-show')} className={`px-4 py-2 rounded-full text-sm font-medium ${typeFilter === 'tv-show' ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'} cursor-pointer`}>TV Shows</button>
          <button onClick={() => setTypeFilter('book')} className={`px-4 py-2 rounded-full text-sm font-medium ${typeFilter === 'book' ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'} cursor-pointer`}>Books</button>
          <button onClick={() => setTypeFilter('video-game')} className={`px-4 py-2 rounded-full text-sm font-medium ${typeFilter === 'video-game' ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'} cursor-pointer`}>Video Games</button>
          {/* Vertical divider */}
          <span className="h-6 border-l border-gray-300 dark:border-gray-600 mx-3" />
          {/* Show filter */}
          <label className="font-medium">Show:</label>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${reviewedFilter === 'all' ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'} cursor-pointer`}
            onClick={() => handleReviewedFilterChange('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${reviewedFilter === 'reviewed' ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'} cursor-pointer`}
            onClick={() => handleReviewedFilterChange('reviewed')}
          >
            Reviewed
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${reviewedFilter === 'not-reviewed' ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'} cursor-pointer`}
            onClick={() => handleReviewedFilterChange('not-reviewed')}
          >
            Not Reviewed
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">Sorted by Title</span>
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border rounded-md text-lg font-mono bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            aria-label={`Sort in ${sortDirection === 'asc' ? 'descending' : 'ascending'} order`}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {filteredSortedContent.map((item) => {
          // Find reviews for this content
          const reviews = getReviewsWithContentByContentId(item.id);
          // Calculate average rating
          const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;
          // Get followed friends
          const people = getPeople();
          const followedFriends = people.filter(p => p.followed && p.id !== 'me');
          // Find which followed friends reviewed this content
          const friendReviewers = reviews.filter(r => followedFriends.some(f => f.id === r.userId));
          const friendAvatars = friendReviewers
            .map(r => {
              const person = people.find(p => p.id === r.userId);
              return person ? { id: person.id, name: person.name, avatarUrl: person.avatarUrl } : undefined;
            })
            .filter((f): f is { id: string; name: string; avatarUrl: string } => Boolean(f));
          return (
            <div key={item.id} className="border rounded-lg shadow-md bg-white dark:bg-gray-800 flex flex-col h-full overflow-hidden relative">
              {/* Average rating display */}
              <div className="absolute top-4 left-4 z-10 flex items-center">
                {avgRating !== null && (
                  <span className="text-4xl font-extrabold text-cyan-600 bg-white dark:bg-gray-900 rounded-full px-4 py-1 shadow border-2 border-cyan-200 dark:border-cyan-800">{avgRating}</span>
                )}
              </div>
              {item.thumbnailUrl && (
                <div className="relative h-48 w-full">
                  <Image
                    src={item.thumbnailUrl}
                    alt={`Thumbnail for ${item.title}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold mb-1">{item.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-2">{item.type}</p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
                {friendAvatars.length > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Reviewed by:</span>
                    {friendAvatars.map(f => (
                      <div key={f.id} className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-cyan-600" title={f.name}>
                        <Image src={f.avatarUrl} alt={f.name} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                {!reviewedIds.has(item.id) && (
                  <button
                    className="mt-auto px-4 py-2 rounded-md bg-cyan-600 text-white font-medium hover:bg-cyan-700 cursor-pointer"
                    onClick={() => {
                      setReviewContent(item);
                      setReviewDialogOpen(true);
                    }}
                  >
                    Add to Ratings
                  </button>
                )}
                {/* Edit button */}
                <button
                  className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-cyan-600 text-white hover:bg-cyan-700"
                  onClick={() => setEditContent(item)}
                  aria-label="Edit Item"
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <Fab onClick={() => setIsDialogOpen(true)} color="cyan" />
      <AddContentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleAddContent}
        color="cyan"
      />
      <AddReviewDialog
        isOpen={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        onSave={handleSaveReview}
        contentDatabase={reviewContent ? [reviewContent] : []}
        reviewToEdit={null}
      />
      <AddContentDialog
        isOpen={!!editContent}
        onClose={() => setEditContent(null)}
        onSave={data => {
          if (!editContent) return;
          updateContent({ ...editContent, ...data });
          setEditContent(null);
          setContentList(getContentList());
        }}
        contentToEdit={editContent}
        onDelete={() => {
          if (!editContent) return;
          setPendingDeleteContent(editContent);
          setConfirmDeleteOpen(true);
        }}
        color="cyan"
      />
      <ConfirmationDialog
        isOpen={!!pendingDeleteContent}
        onClose={() => setPendingDeleteContent(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${pendingDeleteContent?.title}"? This action cannot be undone.`}
      />
    </main>
  );
} 