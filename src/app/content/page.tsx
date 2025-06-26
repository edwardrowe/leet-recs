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
import { getReviews, addOrUpdateReview, getReviewsWithContentByContentId, ReviewWithContent } from "@/lib/reviewStore";
import { getPeople, CURRENT_USER_ID } from "@/lib/peopleStore";
import { getReviewsByContentId } from "@/lib/reviewStore";
import ConfirmationDialog from '@/components/ConfirmationDialog';
import SortPicker, { SortOption } from "@/components/SortPicker";
import ViewContentDialog from "@/components/ViewContentDialog";
import ContentTypeToggleGroup, { allContentTypes } from '@/components/ContentTypeToggleGroup';
import { FaFilm, FaTv, FaBook, FaGamepad } from 'react-icons/fa';
import ContentTypeIcon from '@/components/ContentTypeIcon';
import ContentCard from "@/components/ContentCard";
import ContentRow from "@/components/ContentRow";

export default function ContentPage() {
  const [contentList, setContentList] = useState<Content[]>(getContentList());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [enabledTypes, setEnabledTypes] = useState<ContentType[]>(allContentTypes);
  const [sortBy, setSortBy] = useState<'title' | 'avgRating' | 'lastReviewed'>('avgRating');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewContent, setReviewContent] = useState<Content | null>(null);
  const [reviewedFilter, setReviewedFilter] = useState<'all' | 'reviewed' | 'not-reviewed'>('all');
  const reviewedIds = new Set(getReviews().filter(r => r.userId === CURRENT_USER_ID).map(r => r.id));
  const [_, setForceUpdate] = useState(0);
  const [editContent, setEditContent] = useState<Content | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteContent, setPendingDeleteContent] = useState<Content | null>(null);
  const [viewContent, setViewContent] = useState<Content | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editReview, setEditReview] = useState<ReviewWithContent | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

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

  // Sorting options for the picker
  const sortOptions: SortOption[] = [
    { value: 'title', label: 'Title' },
    { value: 'avgRating', label: 'Average rating' },
    { value: 'lastReviewed', label: 'Last Reviewed' },
  ];

  // Filtering and sorting logic
  const filteredSortedContent = contentList
    .filter(item => {
      if (reviewedFilter === 'reviewed' && !reviewedIds.has(item.id)) return false;
      if (reviewedFilter === 'not-reviewed' && reviewedIds.has(item.id)) return false;
      return (
        enabledTypes.includes(item.type) &&
        (item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()))
      );
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title) * direction;
      }
      if (sortBy === 'avgRating') {
        const aReviews = getReviewsWithContentByContentId(a.id);
        const bReviews = getReviewsWithContentByContentId(b.id);
        const aAvg = aReviews.length > 0 ? aReviews.reduce((sum, r) => sum + r.rating, 0) / aReviews.length : 0;
        const bAvg = bReviews.length > 0 ? bReviews.reduce((sum, r) => sum + r.rating, 0) / bReviews.length : 0;
        if (aAvg === bAvg) return a.title.localeCompare(b.title) * direction;
        return (aAvg - bAvg) * direction;
      }
      if (sortBy === 'lastReviewed') {
        // If both are undefined, sort by title
        if (!a.lastReviewed && !b.lastReviewed) return a.title.localeCompare(b.title) * direction;
        // If only one is undefined, put it last (or first if ascending)
        if (!a.lastReviewed) return 1 * direction;
        if (!b.lastReviewed) return -1 * direction;
        if (a.lastReviewed === b.lastReviewed) return a.title.localeCompare(b.title) * direction;
        return (a.lastReviewed - b.lastReviewed) * direction;
      }
      return 0;
    });

  const handleReviewedFilterChange = (val: 'all' | 'reviewed' | 'not-reviewed') => setReviewedFilter(val);

  const handleSaveReview = (data: NewReviewData) => {
    if (!reviewContent) return;
    const newReview = {
      id: reviewContent.id,
      rating: data.rating,
      personalNotes: data.personalNotes,
      userId: CURRENT_USER_ID,
      timestamp: Date.now(),
    };
    addOrUpdateReview(newReview);
    setForceUpdate(x => x + 1); // force re-render
    setReviewDialogOpen(false);
    setEditReview(null);
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

  function formatLastReviewedDate(timestamp?: number): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `Last reviewed on ${date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}`;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-12 space-y-8">
      <NavBar />
      <h1 className="text-4xl font-bold mb-8">Discover</h1>
      <div className="w-full max-w-6xl flex flex-row justify-between items-center gap-4 mb-8 px-0 md:px-0">
        <div className="flex flex-row items-center gap-2">
          <ContentTypeToggleGroup enabledTypes={enabledTypes} setEnabledTypes={setEnabledTypes} />
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
          <SortPicker
            options={sortOptions}
            value={sortBy}
            onChange={val => setSortBy(val as 'title' | 'avgRating' | 'lastReviewed')}
          />
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border rounded-md text-lg font-mono bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
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
            className={`px-3 py-2 rounded-md text-sm font-medium border ${view === 'list' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-gray-800 text-primary border-primary'}`}
            onClick={() => setView('list')}
            aria-label="List view"
          >
            List
          </button>
        </div>
      </div>
      {view === 'grid' ? (
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
            const canAddToRatings = !reviewedIds.has(item.id);
            return (
              <ContentCard 
                key={item.id} 
                title={item.title}
                description={item.description}
                type={item.type}
                thumbnailUrl={item.thumbnailUrl}
                averageRating={avgRating ? parseFloat(avgRating) : undefined}
                lastReviewed={item.lastReviewed ? formatLastReviewedDate(item.lastReviewed) : undefined}
                friendAvatars={friendAvatars}
                onClick={() => {
                  setViewContent(item);
                  setIsViewDialogOpen(true);
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
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
              <ContentRow 
                key={item.id} 
                title={item.title}
                description={item.description}
                type={item.type}
                thumbnailUrl={item.thumbnailUrl}
                averageRating={avgRating ? parseFloat(avgRating) : undefined}
                lastReviewed={item.lastReviewed ? formatLastReviewedDate(item.lastReviewed) : undefined}
                friendAvatars={friendAvatars}
                onClick={() => {
                  setViewContent(item);
                  setIsViewDialogOpen(true);
                }}
              />
            );
          })}
        </div>
      )}
      <Fab onClick={() => setIsDialogOpen(true)} color="primary" />
      <AddContentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleAddContent}
      />
      <AddReviewDialog
        isOpen={reviewDialogOpen}
        onClose={() => { setReviewDialogOpen(false); setEditReview(null); }}
        onSave={handleSaveReview}
        contentDatabase={reviewContent ? [reviewContent] : []}
        reviewToEdit={editReview}
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
      />
      <ViewContentDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        content={viewContent}
        reviews={viewContent ? getReviewsWithContentByContentId(viewContent.id) : []}
        onEdit={() => {
          if (!viewContent) return;
          const myReview = getReviewsWithContentByContentId(viewContent.id).find(r => r.userId === CURRENT_USER_ID);
          setReviewContent(viewContent);
          setEditReview(myReview || null);
          setReviewDialogOpen(true);
          setIsViewDialogOpen(false);
        }}
        onAddToRatings={() => {
          setReviewContent(viewContent);
          setEditReview(null);
          setReviewDialogOpen(true);
          setIsViewDialogOpen(false);
        }}
        canAddToRatings={viewContent ? !reviewedIds.has(viewContent.id) : false}
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