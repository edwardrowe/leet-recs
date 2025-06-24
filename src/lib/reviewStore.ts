import { Review } from "@/components/AddReviewDialog";
import { CURRENT_USER_ID } from "./peopleStore";

export type ReviewWithUser = Review & { userId: string };

let reviews: ReviewWithUser[] = [
  // Elrowe (me)
  {
    id: "3",
    userId: CURRENT_USER_ID,
    title: "Project Hail Mary",
    description: "A lone astronaut must save the Earth from a mysterious threat.",
    rating: 9,
    type: "book",
    thumbnailUrl: "https://picsum.photos/seed/project-hail-mary/400/300",
  },
  {
    id: "2",
    userId: CURRENT_USER_ID,
    title: "Fleabag",
    description: "A hilarious and heartbreaking look at a young woman's life in London.",
    rating: 10,
    type: "tv-show",
    personalNotes: "The 'hot priest' season is a masterpiece of television.",
    thumbnailUrl: "https://picsum.photos/seed/fleabag/400/300",
  },
  // Alice
  {
    id: "1",
    userId: "1",
    title: "Inception",
    description: "A mind-bending thriller about dreaming within dreams.",
    rating: 8,
    type: "movie",
    thumbnailUrl: "https://picsum.photos/seed/inception/400/300",
    personalNotes: "Loved the visuals!"
  },
  {
    id: "3",
    userId: "1",
    title: "Project Hail Mary",
    description: "A lone astronaut must save the Earth from a mysterious threat.",
    rating: 7,
    type: "book",
    thumbnailUrl: "https://picsum.photos/seed/project-hail-mary/400/300",
    personalNotes: "Fun sci-fi read."
  },
  // Bob
  {
    id: "2",
    userId: "2",
    title: "Fleabag",
    description: "A hilarious and heartbreaking look at a young woman's life in London.",
    rating: 9,
    type: "tv-show",
    thumbnailUrl: "https://picsum.photos/seed/fleabag/400/300",
    personalNotes: "Phoebe Waller-Bridge is a genius."
  },
  {
    id: "6",
    userId: "2",
    title: "The Matrix",
    description: "A hacker discovers the shocking truth about his reality.",
    rating: 10,
    type: "movie",
    thumbnailUrl: "https://picsum.photos/seed/the-matrix/400/300",
    personalNotes: "Classic!"
  },
  // Diana
  {
    id: "4",
    userId: "4",
    title: "The Office",
    description: "A mockumentary about the everyday lives of office employees.",
    rating: 8,
    type: "tv-show",
    thumbnailUrl: "https://picsum.photos/seed/the-office/400/300",
    personalNotes: "So many laughs."
  },
  {
    id: "5",
    userId: "4",
    title: "Dune",
    description: "A sci-fi epic about a young nobleman's destiny on a desert planet.",
    rating: 9,
    type: "book",
    thumbnailUrl: "https://picsum.photos/seed/dune/400/300",
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