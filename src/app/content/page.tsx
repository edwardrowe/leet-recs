import { Content } from "@/components/AddReviewDialog";
import NavBar from "@/components/NavBar";
import Image from "next/image";

// This should match the contentDatabase in the main page
const contentDatabase: Content[] = [
  { id: "1", title: "Inception", type: "movie", description: "A mind-bending thriller about dreaming within dreams.", thumbnailUrl: "https://picsum.photos/seed/inception/400/300" },
  { id: "2", title: "Fleabag", type: "tv-show", description: "A hilarious and heartbreaking look at a young woman's life in London.", thumbnailUrl: "https://picsum.photos/seed/fleabag/400/300" },
  { id: "3", title: "Project Hail Mary", type: "book", description: "A lone astronaut must save the Earth from a mysterious threat.", thumbnailUrl: "https://picsum.photos/seed/project-hail-mary/400/300" },
  { id: "4", title: "The Office", type: "tv-show", description: "A mockumentary about the everyday lives of office employees.", thumbnailUrl: "https://picsum.photos/seed/the-office/400/300" },
  { id: "5", title: "Dune", type: "book", description: "A sci-fi epic about a young nobleman's destiny on a desert planet.", thumbnailUrl: "https://picsum.photos/seed/dune/400/300" },
  { id: "6", title: "The Matrix", type: "movie", description: "A hacker discovers the shocking truth about his reality.", thumbnailUrl: "https://picsum.photos/seed/the-matrix/400/300" },
];

export default function ContentPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 space-y-8">
      <NavBar />
      <h1 className="text-4xl font-bold mb-8">All Content</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {contentDatabase.map((item) => (
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
    </main>
  );
} 