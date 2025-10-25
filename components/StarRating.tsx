import React from 'react';
import { StarIcon } from './icons';

interface StarRatingProps {
  rating: number;
  ratingCount: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const StarRating: React.FC<StarRatingProps> = ({ rating, ratingCount, size = 'sm' }) => {
  const fullStars = Math.round(rating); // Round to nearest whole number for simplicity
  const emptyStars = 5 - fullStars;

  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} className={`${sizeClasses[size]} text-yellow-400`} />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} className={`${sizeClasses[size]} text-gray-300`} />
        ))}
      </div>
      {ratingCount > 0 && (
        <span className="text-gray-500 text-xs ml-1.5">({ratingCount})</span>
      )}
    </div>
  );
};

export default StarRating;
