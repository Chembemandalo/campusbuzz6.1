import React from 'react';
import { ClockIcon } from '../components/icons';

const ClearancePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] bg-gray-50 text-center p-8 animate-fade-in-up">
      <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-200">
        <div className="mb-6">
          <ClockIcon className="w-24 h-24 text-indigo-300 mx-auto animate-pulse" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Coming Soon!</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-md">
          We're working hard to bring you an exciting new Clearance section. Get ready for amazing deals and exclusive offers. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default ClearancePage;
