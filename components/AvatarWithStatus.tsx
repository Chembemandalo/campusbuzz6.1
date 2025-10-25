import React from 'react';

interface AvatarWithStatusProps {
  avatarUrl: string;
  alt: string;
  status?: 'online' | 'offline';
  size?: 'sm' | 'md' | 'lg';
}

const AvatarWithStatus: React.FC<AvatarWithStatusProps> = ({ avatarUrl, alt, status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };
  const statusSizeClasses = {
    sm: 'w-2.5 h-2.5 border',
    md: 'w-3 h-3 border-2',
    lg: 'w-3.5 h-3.5 border-2',
  };
  const statusPositionClasses = {
    sm: 'bottom-0 right-0',
    md: 'bottom-0 right-0',
    lg: 'bottom-0.5 right-0.5',
  };

  return (
    <div className="relative flex-shrink-0">
      {/* Campus Buzz: Reusable user avatar image component */}
      <img src={avatarUrl} alt={alt} className={`rounded-full ${sizeClasses[size]}`} />
      {status && (
        <span
          className={`absolute block rounded-full border-white ${statusSizeClasses[size]} ${statusPositionClasses[size]} ${
            status === 'online' ? 'bg-green-500' : 'bg-gray-400'
          }`}
        ></span>
      )}
    </div>
  );
};

export default AvatarWithStatus;