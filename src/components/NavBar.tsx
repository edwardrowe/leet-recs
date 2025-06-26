"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar = () => {
  const pathname = usePathname();
  return (
    <nav className="w-full max-w-6xl mx-auto mb-8 flex gap-4 items-center py-4">
      <Link href="/" className={`px-4 py-2 rounded font-medium ${pathname === '/' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Ratings</Link>
      <Link href="/content" className={`px-4 py-2 rounded font-medium ${pathname === '/content' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Discover</Link>
      <Link href="/friends" className={`px-4 py-2 rounded font-medium ${pathname === '/friends' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Friends</Link>
    </nav>
  );
};

export default NavBar; 