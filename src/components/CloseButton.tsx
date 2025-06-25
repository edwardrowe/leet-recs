import React from 'react';

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick, className = '', ariaLabel = 'Close' }) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 shadow text-xl z-10 ${className}`}
    aria-label={ariaLabel}
    type="button"
  >
    &times;
  </button>
);

export default CloseButton; 