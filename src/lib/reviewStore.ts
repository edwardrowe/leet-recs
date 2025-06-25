import { Review } from "@/components/AddReviewDialog";
import { CURRENT_USER_ID } from "./peopleStore";
import { getContentList, Content } from "./contentStore";

export type ReviewWithUser = {
  id: string; // This is the contentId
  userId: string;
  rating: number;
  personalNotes?: string;
};

// Helper type for reviews with full content data
export type ReviewWithContent = ReviewWithUser & Content;

let reviews: ReviewWithUser[] = [
  // Elrowe (me)
  {
    id: "1", // Project Hail Mary
    userId: CURRENT_USER_ID,
    rating: 9,
  },
  {
    id: "2", // Fleabag
    userId: CURRENT_USER_ID,
    rating: 10,
    personalNotes: "The 'hot priest' season is a masterpiece of television.",
  },
  // Alice
  {
    id: "1", // Inception
    userId: "1",
    rating: 8,
    personalNotes: "Loved the visuals!"
  },
  {
    id: "3", // Project Hail Mary
    userId: "1",
    rating: 7,
    personalNotes: "Fun sci-fi read."
  },
  // Bob
  {
    id: "2", // Fleabag
    userId: "2",
    rating: 9,
    personalNotes: "Phoebe Waller-Bridge is a genius."
  },
  {
    id: "6", // The Matrix
    userId: "2",
    rating: 10,
    personalNotes: "Classic!"
  },
  // Diana
  {
    id: "4", // The Office
    userId: "4",
    rating: 8,
    personalNotes: "So many laughs."
  },
  {
    id: "5", // Dune
    userId: "4",
    rating: 9,
    personalNotes: "Epic world-building."
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