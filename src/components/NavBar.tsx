"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar = () => {
  const pathname = usePathname();
  return (
    <nav className="w-full max-w-6xl mx-auto mb-4 flex gap-2 items-center py-2 px-4 bg-white shadow-sm rounded-lg border border-gray-200">
      <Link href="/content" className={`px-3 py-1.5 rounded font-medium text-sm transition-colors ${pathname === '/content' ? 'bg-cyan-600 text-white shadow' : 'text-gray-800 hover:bg-gray-100'}`}>Discover</Link>
      <Link href="/friends" className={`px-3 py-1.5 rounded font-medium text-sm transition-colors ${pathname === '/friends' ? 'bg-cyan-600 text-white shadow' : 'text-gray-800 hover:bg-gray-100'}`}>Friends</Link>
    </nav>
  );
};

export default NavBar; 