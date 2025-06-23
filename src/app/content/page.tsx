"use client";
import { useState } from "react";
import { Content } from "@/components/AddReviewDialog";
import AddContentDialog, { NewContentData } from "@/components/AddContentDialog";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import Fab from "@/components/Fab";
import { getContentList, addContent } from "@/lib/contentStore";
import ContentFilterBar from "@/components/ContentFilterBar";
import AddReviewDialog, { Content as ReviewContent, NewReviewData } from "@/components/AddReviewDialog";
import { getReviews, addOrUpdateReview } from "@/lib/reviewStore";

export default function ContentPage() {
  const [contentList, setContentList] = useState<Content[]>(getContentList());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'tv-show' | 'book'>('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewContent, setReviewContent] = useState<ReviewContent | null>(null);
  const [reviewedFilter, setReviewedFilter] = useState<'all' | 'reviewed' | 'not-reviewed'>('all');
  const reviewedIds = new Set(getReviews().map(r => r.id));
  const [_, setForceUpdate] = useState(0);

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
      ...reviewContent,
      rating: data.rating,
      personalNotes: data.personalNotes,
    };
    addOrUpdateReview(newReview);
    setForceUpdate(x => x + 1); // force re-render
    setReviewDialogOpen(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 space-y-8">
      <NavBar />
      <h1 className="text-4xl font-bold mb-8">All Content</h1>
      <div className="w-full max-w-6xl flex flex-row justify-between items-center gap-4 mb-8 px-0 md:px-0">
        <div className="flex flex-row items-center gap-2">
          {/* Content type filter */}
          <button onClick={() => setTypeFilter('all')} className={`px-4 py-2 rounded-full text-sm font-medium ${typeFilter === 'all' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>All</button>
          <button onClick={() => setTypeFilter('movie')} className={`px-4 py-2 rounded-full text-sm font-medium ${typeFilter === 'movie' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Movies</button>
          <button onClick={() => setTypeFilter('tv-show')} className={`px-4 py-2 rounded-full text-sm font-medium ${typeFilter === 'tv-show' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>TV Shows</button>
          <button onClick={() => setTypeFilter('book')} className={`px-4 py-2 rounded-full text-sm font-medium ${typeFilter === 'book' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Books</button>
          {/* Vertical divider */}
          <span className="h-6 border-l border-gray-300 dark:border-gray-600 mx-3" />
          {/* Show filter */}
          <label className="font-medium">Show:</label>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${reviewedFilter === 'all' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            onClick={() => handleReviewedFilterChange('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${reviewedFilter === 'reviewed' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            onClick={() => handleReviewedFilterChange('reviewed')}
          >
            Reviewed
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${reviewedFilter === 'not-reviewed' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
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
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border rounded-md text-lg font-mono bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            aria-label={`Sort in ${sortDirection === 'asc' ? 'descending' : 'ascending'} order`}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {filteredSortedContent.map((item) => (
          <div key={item.id} className="border rounded-lg shadow-md bg-white dark:bg-gray-800 flex flex-col h-full overflow-hidden">
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
              {!reviewedIds.has(item.id) && (
                <button
                  className="mt-auto px-4 py-2 rounded-md bg-cyan-600 text-white font-medium hover:bg-cyan-700"
                  onClick={() => {
                    setReviewContent(item);
                    setReviewDialogOpen(true);
                  }}
                >
                  Add to My Recs
                </button>
              )}
            </div>
          </div>
        ))}
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
    </main>
  );
} 