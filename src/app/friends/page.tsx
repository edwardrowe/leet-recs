"use client";
import { useState } from "react";
import { getPeople, followPerson, unfollowPerson, Person, CURRENT_USER_ID } from "@/lib/peopleStore";
import Image from "next/image";
import NavBar from "@/components/NavBar";

export default function FriendsPage() {
  const [people, setPeople] = useState<Person[]>(getPeople());
  const [search, setSearch] = useState("");

  const handleFollow = (id: string) => {
    followPerson(id);
    setPeople(getPeople());
  };
  const handleUnfollow = (id: string) => {
    unfollowPerson(id);
    setPeople(getPeople());
  };

  const filteredPeople = people.filter(p => p.id !== CURRENT_USER_ID && p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="flex min-h-screen flex-col items-center p-12 space-y-8">
      <NavBar />
      <h1 className="text-4xl font-bold mb-8">Friends</h1>
      <div className="w-full max-w-2xl mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search people..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 w-full"
        />
      </div>
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
        {filteredPeople.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">No people found.</div>
        ) : (
          filteredPeople.map(person => (
            <div key={person.id} className="flex items-center gap-4 p-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image src={person.avatarUrl} alt={person.name} fill className="object-cover" />
              </div>
              <div className="flex-1 font-medium text-lg">{person.name}</div>
              {person.followed ? (
                <button
                  className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={() => handleUnfollow(person.id)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="px-4 py-2 rounded-full bg-cyan-600 text-white font-semibold hover:bg-cyan-700"
                  onClick={() => handleFollow(person.id)}
                >
                  Follow
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
} 