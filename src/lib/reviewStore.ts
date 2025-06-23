import { Review } from "@/components/AddReviewDialog";

let reviews: Review[] = [
  {
    id: "3",
    title: "Project Hail Mary",
    description: "A lone astronaut must save the Earth from a mysterious threat.",
    rating: 9,
    type: "book",
    thumbnailUrl: "https://picsum.photos/seed/project-hail-mary/400/300",
  },
  {
    id: "2",
    title: "Fleabag",
    description: "A hilarious and heartbreaking look at a young woman's life in London.",
    rating: 10,
    type: "tv-show",
    personalNotes: "The 'hot priest' season is a masterpiece of television.",
    thumbnailUrl: "https://picsum.photos/seed/fleabag/400/300",
  },
];

export function getReviews() {
  return reviews;
}

export function addOrUpdateReview(newReview: Review) {
  const idx = reviews.findIndex(r => r.id === newReview.id);
  if (idx > -1) {
    reviews[idx] = newReview;
  } else {
    reviews = [...reviews, newReview];
  }
}

export function deleteReview(id: string) {
  reviews = reviews.filter(r => r.id !== id);
} 