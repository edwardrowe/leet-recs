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

export default function ContentPage() {
  const [contentList, setContentList] = useState<Content[]>(getContentList());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'tv-show' | 'book'>('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewContent, setReviewContent] = useState<ReviewContent | null>(null);

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
    .filter(item =>
      (typeFilter === 'all' || item.type === typeFilter) &&
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const cmp = a.title.localeCompare(b.title);
      return sortDirection === 'asc' ? cmp : -cmp;
    });

  return (
    <main className="flex min-h-screen flex-col items-center p-12 space-y-8">
      <NavBar />
      <h1 className="text-4xl font-bold mb-8">All Content</h1>
      <ContentFilterBar
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        search={search}
        setSearch={setSearch}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        color="cyan"
      />
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
              <button
                className="mt-auto px-4 py-2 rounded-md bg-cyan-600 text-white font-medium hover:bg-cyan-700"
                onClick={() => {
                  setReviewContent(item);
                  setReviewDialogOpen(true);
                }}
              >
                Add to My Recs
              </button>
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
        onSave={() => setReviewDialogOpen(false)}
        contentDatabase={reviewContent ? [reviewContent] : []}
        reviewToEdit={null}
      />
    </main>
  );
} 