import React from 'react';

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-200 ${className}`}
    aria-label="Close"
    type="button"
  >
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 5L13 13M13 5L5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </button>
);

export default CloseButton; 