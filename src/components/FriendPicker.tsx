import { useState, useRef, useEffect } from "react";
import { Person, getPeople } from "@/lib/peopleStore";
import { CURRENT_USER_ID } from "@/lib/peopleStore";
import Image from "next/image";

interface FriendPickerProps {
  selectedFriendId: string | null;
  onFriendSelect: (friendId: string | null) => void;
}

export default function FriendPicker({ selectedFriendId, onFriendSelect }: FriendPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const people = getPeople();
  const followedFriends = people.filter(p => p.followed && p.id !== CURRENT_USER_ID);
  const selectedFriend = selectedFriendId ? people.find(p => p.id === selectedFriendId) : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFriendSelect = (friendId: string | null) => {
    onFriendSelect(friendId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {selectedFriend ? (
          <>
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image src={selectedFriend.avatarUrl} alt={selectedFriend.name} fill className="object-cover" />
            </div>
            <span className="font-medium">{selectedFriend.name}</span>
          </>
        ) : (
          <>
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image src="https://picsum.photos/seed/elrowe-avatar/200" alt="Elrowe" fill className="object-cover" />
            </div>
            <span className="font-medium">My Ratings</span>
          </>
        )}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
          <div className="p-2">
            <button
              onClick={() => handleFriendSelect(null)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                selectedFriendId === null ? 'bg-primary-light dark:bg-primary-dark' : ''
              }`}
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image src="https://picsum.photos/seed/elrowe-avatar/200" alt="Elrowe" fill className="object-cover" />
              </div>
              <span className="font-medium">My Ratings</span>
            </button>
            
            {followedFriends.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-600 mt-2 pt-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1 font-medium">Friends</div>
                {followedFriends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => handleFriendSelect(friend.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      selectedFriendId === friend.id ? 'bg-primary-light dark:bg-primary-dark' : ''
                    }`}
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image src={friend.avatarUrl} alt={friend.name} fill className="object-cover" />
                    </div>
                    <span className="font-medium">{friend.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 