import { Review } from "@/components/AddReviewDialog";
import { CURRENT_USER_ID } from "./peopleStore";
import { getContentList, Content, setLastReviewed } from "./contentStore";

export type ReviewWithUser = {
  id: string; // This is the contentId
  userId: string;
  rating: number;
  personalNotes?: string;
  timestamp: number; // Unix ms
};

// Helper type for reviews with full content data
export type ReviewWithContent = ReviewWithUser & Content;

const now = Date.now();
let reviews: ReviewWithUser[] = [
  // Elrowe (me)
  {
    id: "1", // Project Hail Mary
    userId: CURRENT_USER_ID,
    rating: 9,
    timestamp: now - 2 * 86400000, // 2 days ago
  },
  {
    id: "2", // Fleabag
    userId: CURRENT_USER_ID,
    rating: 10,
    personalNotes: "The 'hot priest' season is a masterpiece of television.",
    timestamp: now - 10 * 86400000, // 10 days ago
  },
  // Alice
  {
    id: "1", // Inception
    userId: "1",
    rating: 8,
    personalNotes: "Loved the visuals!",
    timestamp: now - 5 * 86400000, // 5 days ago
  },
  {
    id: "3", // Project Hail Mary
    userId: "1",
    rating: 7,
    personalNotes: "Fun sci-fi read.",
    timestamp: now - 1 * 86400000, // 1 day ago
  },
  // Bob
  {
    id: "2", // Fleabag
    userId: "2",
    rating: 9,
    personalNotes: "Phoebe Waller-Bridge is a genius.",
    timestamp: now - 7 * 86400000, // 7 days ago
  },
  {
    id: "6", // The Matrix
    userId: "2",
    rating: 10,
    personalNotes: "Classic!",
    timestamp: now - 3 * 86400000, // 3 days ago
  },
  // Diana
  {
    id: "4", // The Office
    userId: "4",
    rating: 8,
    personalNotes: "So many laughs.",
    timestamp: now - 12 * 86400000, // 12 days ago
  },
  {
    id: "5", // Dune
    userId: "4",
    rating: 9,
    personalNotes: "Epic world-building.",
    timestamp: now - 6 * 86400000, // 6 days ago
  },
  {
    id: "6", // The Matrix
    userId: "4",
    rating: 8,
    personalNotes: "Mind-bending action.",
    timestamp: now - 4 * 86400000, // 4 days ago
  },
];

export function getReviews() {
  return reviews;
}

export function getReviewsByContentId(contentId: string) {
  return reviews.filter(r => r.id === contentId);
}

export function getReviewsByUserId(userId: string) {
  return reviews.filter(r => r.userId === userId);
}

export function addOrUpdateReview(newReview: ReviewWithUser) {
  const idx = reviews.findIndex(r => r.id === newReview.id && r.userId === newReview.userId);
  if (idx > -1) {
    reviews[idx] = newReview;
  } else {
    reviews = [...reviews, newReview];
  }
  // Update lastReviewed timestamp for the content
  setLastReviewed(newReview.id, Date.now());
}

export function deleteReview(id: string, userId: string) {
  reviews = reviews.filter(r => !(r.id === id && r.userId === userId));
}

export function getReviewsWithContent(): ReviewWithContent[] {
  const contentList = getContentList();
  return reviews.map(review => {
    const content = contentList.find(c => c.id === review.id);
    if (!content) {
      // Handle case where content was deleted but review still exists
      return {
        ...review,
        title: "Unknown Content",
        description: "This content has been removed.",
        type: "movie" as const,
        thumbnailUrl: undefined,
      };
    }
    return {
      ...review,
      ...content,
    };
  });
}

export function getReviewsWithContentByUserId(userId: string): ReviewWithContent[] {
  return getReviewsWithContent().filter(r => r.userId === userId);
}

export function getReviewsWithContentByContentId(contentId: string): ReviewWithContent[] {
  return getReviewsWithContent().filter(r => r.id === contentId);
} 