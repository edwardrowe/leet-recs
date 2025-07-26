"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NavBar = () => {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // On mount, check localStorage or system preference
    const stored = localStorage.getItem('theme');
    if (stored) {
      setDark(stored === 'dark');
      document.body.classList.toggle('dark', stored === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDark(true);
      document.body.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    setDark(d => {
      const newDark = !d;
      document.body.classList.toggle('dark', newDark);
      localStorage.setItem('theme', newDark ? 'dark' : 'light');
      return newDark;
    });
  };

  return (
    <nav className="w-full max-w-6xl mx-auto mb-4 flex gap-2 items-center py-2 px-4 bg-[var(--surface)] shadow-sm rounded-lg border border-[var(--border)]">
      <Link href="/content" className={`px-3 py-1.5 rounded font-medium text-sm transition-colors ${pathname === '/content' ? 'bg-[var(--primary)] text-white shadow' : 'text-[var(--text)] hover:bg-[var(--surface-alt)]'}`}>Discover</Link>
      <Link href="/friends" className={`px-3 py-1.5 rounded font-medium text-sm transition-colors ${pathname === '/friends' ? 'bg-[var(--primary)] text-white shadow' : 'text-[var(--text)] hover:bg-[var(--surface-alt)]'}`}>Friends</Link>
      <button
        onClick={toggleDark}
        className="ml-auto w-8 h-8 flex items-center justify-center rounded-full bg-[var(--surface-alt)] text-[var(--text)] hover:bg-[var(--border)] transition-colors"
        aria-label="Toggle dark mode"
        type="button"
      >
        {dark ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 2a7 7 0 1 0 7 7c0-.34-.02-.67-.06-1A5.5 5.5 0 0 1 9 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.64 3.64l1.42 1.42M12.94 12.94l1.42 1.42M3.64 14.36l1.42-1.42M12.94 5.06l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </nav>
  );
};

export default NavBar; 