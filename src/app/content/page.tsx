"use client";
import { useState } from "react";
import { Content } from "@/components/AddReviewDialog";
import AddContentDialog, { NewContentData } from "@/components/AddContentDialog";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import Fab from "@/components/Fab";
import { getContentList, addContent } from "@/lib/contentStore";

export default function ContentPage() {
  const [contentList, setContentList] = useState<Content[]>(getContentList());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  return (
    <main className="flex min-h-screen flex-col items-center p-12 space-y-8">
      <NavBar />
      <h1 className="text-4xl font-bold mb-8">All Content</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {contentList.map((item) => (
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
              <button className="mt-auto px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700">Add to My Recs</button>
            </div>
          </div>
        ))}
      </div>
      <Fab onClick={() => setIsDialogOpen(true)} />
      <AddContentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleAddContent}
      />
    </main>
  );
} 