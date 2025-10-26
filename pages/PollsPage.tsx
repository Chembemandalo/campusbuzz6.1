import React, { useState } from 'react';
import { Poll, User } from '../types';
import PollCard from '../components/PollCard';
import { PlusIcon } from '../components/icons';

interface PollsPageProps {
  polls: Poll[];
  currentUser: User;
  onVote: (pollId: string, optionId: string) => void;
  onOpenCreatePollModal: () => void;
}

const PollsPage: React.FC<PollsPageProps> = ({ polls, currentUser, onVote, onOpenCreatePollModal }) => {
  const [expandedPollId, setExpandedPollId] = useState<string | null>(null);

  const handleToggleExpand = (pollId: string) => {
    setExpandedPollId(prevId => (prevId === pollId ? null : pollId));
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-8 animate-fade-in-up">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Polls & Surveys</h1>
          <button
            onClick={onOpenCreatePollModal}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Create Poll</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map(poll => (
            <PollCard 
              key={poll.id} 
              poll={poll} 
              currentUser={currentUser} 
              onVote={onVote} 
              isExpanded={expandedPollId === poll.id}
              onToggleExpand={() => handleToggleExpand(poll.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PollsPage;