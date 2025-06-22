import React from 'react';

type FabProps = {
  onClick: () => void;
};

const Fab: React.FC<FabProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      aria-label="Add new review"
    >
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  );
};

export default Fab; 