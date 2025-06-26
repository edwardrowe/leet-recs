import React from 'react';

interface FabProps {
  onClick: () => void;
  color?: 'primary';
}

const Fab: React.FC<FabProps> = ({ onClick, color = 'primary' }) => {
  return (
    <button
      onClick={onClick}
      className="w-16 h-16 rounded-full shadow-lg text-white font-bold text-2xl flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-4 bg-primary hover:bg-primary-hover focus:ring-primary"
      aria-label="Add new item"
    >
      +
    </button>
  );
};

export default Fab; 