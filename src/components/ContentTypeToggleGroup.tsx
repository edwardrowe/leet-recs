import React from 'react';
import { ContentType } from '@/lib/contentStore';
import ContentTypeIcon from './ContentTypeIcon';

export const allContentTypes: ContentType[] = ['movie', 'tv-show', 'book', 'video-game'];

interface ContentTypeToggleGroupProps {
  enabledTypes: ContentType[];
  setEnabledTypes: (types: ContentType[]) => void;
  className?: string;
}

const ContentTypeToggleGroup: React.FC<ContentTypeToggleGroupProps> = ({ enabledTypes, setEnabledTypes, className }) => (
  <div className={`flex flex-row items-center gap-2 ${className || ''}`}>
    {allContentTypes.map(type => {
      const isEnabled = enabledTypes.includes(type);
      const canDeselect = enabledTypes.length > 1;
      return (
        <button
          key={type}
          onClick={() => {
            if (isEnabled && canDeselect) {
              setEnabledTypes(enabledTypes.filter(t => t !== type));
            } else if (!isEnabled) {
              setEnabledTypes([...enabledTypes, type]);
            }
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center ${isEnabled ? 'bg-primary hover:bg-primary-hover text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'} cursor-pointer`}
          aria-pressed={isEnabled}
          aria-disabled={isEnabled && !canDeselect}
          disabled={isEnabled && !canDeselect}
        >
          <span className="sr-only">{type}</span>
          <ContentTypeIcon type={type} className="w-5 h-5" />
        </button>
      );
    })}
  </div>
);

export default ContentTypeToggleGroup; 