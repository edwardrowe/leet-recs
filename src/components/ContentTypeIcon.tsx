import React from 'react';
import { FaFilm, FaTv, FaBook, FaGamepad } from 'react-icons/fa';
import { ContentType } from '@/lib/contentStore';

interface ContentTypeIconProps {
  type: ContentType;
  className?: string;
}

const ContentTypeIcon: React.FC<ContentTypeIconProps> = ({ type, className }) => {
  switch (type) {
    case 'movie':
      return <FaFilm className={className} aria-label="Movie" />;
    case 'tv-show':
      return <FaTv className={className} aria-label="TV Show" />;
    case 'video-game':
      return <FaGamepad className={className} aria-label="Video Game" />;
    case 'book':
    default:
      return <FaBook className={className} aria-label="Book" />;
  }
};

export default ContentTypeIcon; 