"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar = () => {
  const pathname = usePathname();
  return (
    <nav className="w-full max-w-6xl mx-auto mb-8 flex gap-4 items-center py-4">
      <Link href="/" className={`px-4 py-2 rounded font-medium ${pathname === '/' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>My Recs</Link>
      <Link href="/content" className={`px-4 py-2 rounded font-medium ${pathname === '/content' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Content</Link>
    </nav>
  );
};

export default NavBar; 