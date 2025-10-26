import React from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false }) => {
  const spinnerSize = fullScreen ? 'w-16 h-16' : 'w-10 h-10';
  const containerHeight = fullScreen ? '100vh' : 'calc(100vh - 200px)';

  return (
    <div 
        className="flex justify-center items-center" 
        style={{ minHeight: containerHeight }}
    >
      <div
        className={`animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 ${spinnerSize}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;