import React from 'react';

type FabProps = {
  onClick: () => void;
  color?: 'magenta' | 'cyan';
};

const Fab: React.FC<FabProps> = ({ onClick, color = 'magenta' }) => {
  const colorClasses = color === 'cyan'
    ? 'bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500'
    : 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-500';
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full text-white text-3xl flex items-center justify-center shadow-lg focus:outline-none focus:ring-4 ${colorClasses}`}
      aria-label="Add"
    >
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  );
};

export default Fab; 