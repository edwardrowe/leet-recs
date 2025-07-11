import { getReviews, addOrUpdateReview, deleteReview } from "./reviewStore";

export type ContentType = 'movie' | 'tv-show' | 'book' | 'video-game';

let contentList: Content[] = [
  { id: "1", title: "Inception", type: "movie", description: "A mind-bending thriller about dreaming within dreams.", thumbnailUrl: "https://picsum.photos/seed/inception/400/300", lastReviewed: undefined },
  { id: "2", title: "Fleabag", type: "tv-show", description: "A hilarious and heartbreaking look at a young woman's life in London.", thumbnailUrl: "https://picsum.photos/seed/fleabag/400/300", lastReviewed: undefined },
  { id: "3", title: "Project Hail Mary", type: "book", description: "A lone astronaut must save the Earth from a mysterious threat.", thumbnailUrl: "https://picsum.photos/seed/project-hail-mary/400/300", lastReviewed: undefined },
  { id: "4", title: "The Office", type: "tv-show", description: "A mockumentary about the everyday lives of office employees.", thumbnailUrl: "https://picsum.photos/seed/the-office/400/300", lastReviewed: undefined },
  { id: "5", title: "Dune", type: "book", description: "A sci-fi epic about a young nobleman's destiny on a desert planet.", thumbnailUrl: "https://picsum.photos/seed/dune/400/300", lastReviewed: undefined },
  { id: "6", title: "The Matrix", type: "movie", description: "A hacker discovers the shocking truth about his reality.", thumbnailUrl: "https://picsum.photos/seed/the-matrix/400/300", lastReviewed: undefined },
  { id: "7", title: "The Legend of Zelda: Breath of the Wild", type: "video-game", description: "An epic open-world adventure game set in Hyrule.", thumbnailUrl: "https://picsum.photos/seed/zelda/400/300", lastReviewed: undefined },
];

// On startup, set lastReviewed for each content item based on reviews
const reviews = getReviews();
contentList = contentList.map(content => {
  const contentReviews = reviews.filter(r => r.id === content.id);
  if (contentReviews.length === 0) return content;
  const latest = Math.max(...contentReviews.map(r => r.timestamp));
  return { ...content, lastReviewed: latest };
});

export function getContentList() {
  return contentList;
}

export function addContent(newContent: Content) {
  contentList = [...contentList, newContent];
}

export function updateContent(updated: Content) {
  contentList = contentList.map(c => c.id === updated.id ? updated : c);
}

export function deleteContent(id: string) {
  contentList = contentList.filter(c => c.id !== id);
}

// Set the lastReviewed timestamp for a content item
export function setLastReviewed(contentId: string, timestamp: number) {
  contentList = contentList.map(c => c.id === contentId ? { ...c, lastReviewed: timestamp } : c);
}

// Utility to import multiple content items at once
export function importContent(items: Content[]) {
  const existingIds = new Set(contentList.map(c => c.id));
  const newItems = items.filter(item => !existingIds.has(item.id));
  newItems.forEach(addContent);
  return newItems.length; // Return the number of items actually imported
}

// This is the shape of the content in our "database"
export type Content = {
  id: string;
  title: string;
  type: ContentType;
  description: string;
  thumbnailUrl?: string;
  lastReviewed?: number; // Unix timestamp (ms)
}; 