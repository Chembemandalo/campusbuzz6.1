import React from 'react';
// FIX: Add BackButton to imports
import { ClockIcon, BackButton } from '../components/icons';

// FIX: Add props interface
interface ClearancePageProps {
    handleBack: () => void;
}

const ClearancePage: React.FC<ClearancePageProps> = ({ handleBack }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] bg-gray-50 text-center p-8 animate-fade-in-up">
      {/* FIX: Add BackButton component */}
      <div className="absolute top-8 left-8">
        <BackButton onClick={handleBack} />
      </div>
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
