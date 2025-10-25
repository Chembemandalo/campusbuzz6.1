import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Campus Buzz</p>
    </div>
  );
};

export default LoadingSpinner;
