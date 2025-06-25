import { getReviews, addOrUpdateReview, deleteReview } from "./reviewStore";

export type ContentType = 'movie' | 'tv-show' | 'book' | 'video-game';

let contentList: Content[] = [
  { id: "1", title: "Inception", type: "movie", description: "A mind-bending thriller about dreaming within dreams.", thumbnailUrl: "https://picsum.photos/seed/inception/400/300" },
  { id: "2", title: "Fleabag", type: "tv-show", description: "A hilarious and heartbreaking look at a young woman's life in London.", thumbnailUrl: "https://picsum.photos/seed/fleabag/400/300" },
  { id: "3", title: "Project Hail Mary", type: "book", description: "A lone astronaut must save the Earth from a mysterious threat.", thumbnailUrl: "https://picsum.photos/seed/project-hail-mary/400/300" },
  { id: "4", title: "The Office", type: "tv-show", description: "A mockumentary about the everyday lives of office employees.", thumbnailUrl: "https://picsum.photos/seed/the-office/400/300" },
  { id: "5", title: "Dune", type: "book", description: "A sci-fi epic about a young nobleman's destiny on a desert planet.", thumbnailUrl: "https://picsum.photos/seed/dune/400/300" },
  { id: "6", title: "The Matrix", type: "movie", description: "A hacker discovers the shocking truth about his reality.", thumbnailUrl: "https://picsum.photos/seed/the-matrix/400/300" },
  { id: "7", title: "The Legend of Zelda: Breath of the Wild", type: "video-game", description: "An epic open-world adventure game set in Hyrule.", thumbnailUrl: "https://picsum.photos/seed/zelda/400/300" },
];

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

// This is the shape of the content in our "database"
export type Content = {
  id: string;
  title: string;
  type: ContentType;
  description: string;
  thumbnailUrl?: string;
}; 