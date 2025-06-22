import React from 'react';

type EmptyStateProps = {
  message: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="text-center py-20 w-full col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center">
      <div className="w-48 h-48 text-gray-300 dark:text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 21.75h4.5m-4.5 0a3 3 0 01-3-3V7.5a3 3 0 013-3h7.5a3 3 0 013 3v11.25a3 3 0 01-3 3m-4.5 0v-4.5m-4.5 4.5V12m4.5 9.75V12m0-4.5h.008v.008H12v-.008zm3-3.75h.008v.008H15V8.25z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 14.25a.75.75 0 01-1.5 0 .75.75 0 011.5 0zM15.5 14.25a.75.75 0 01-1.5 0 .75.75 0 011.5 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.5 17.25s-1.5 1.5-3 0" />
        </svg>
      </div>
      <p className="mt-6 text-xl text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};

export default EmptyState; 