export type Person = {
  id: string;
  name: string;
  avatarUrl: string;
  followed: boolean;
};

let people: Person[] = [
  { id: '1', name: 'Alice Johnson', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg', followed: false },
  { id: '2', name: 'Bob Smith', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg', followed: false },
  { id: '3', name: 'Charlie Lee', avatarUrl: 'https://randomuser.me/api/portraits/men/65.jpg', followed: false },
  { id: '4', name: 'Diana Prince', avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg', followed: false },
  { id: '5', name: 'Eve Adams', avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg', followed: false },
];

export function getPeople() {
  return people;
}

export function followPerson(id: string) {
  people = people.map(p => p.id === id ? { ...p, followed: true } : p);
}

export function unfollowPerson(id: string) {
  people = people.map(p => p.id === id ? { ...p, followed: false } : p);
} 