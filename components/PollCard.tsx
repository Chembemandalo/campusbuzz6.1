import React, { useState } from 'react';
import { Poll, User } from '../types';
import { SpinnerIcon } from './icons';

interface PollCardProps {
  poll: Poll;
  currentUser: User;
  onVote: (pollId: string, optionId: string) => void;
}

const PollCard: React.FC<PollCardProps> = ({ poll, currentUser, onVote }) => {
  const [isVoting, setIsVoting] = useState(false);

  const hasVoted = poll.votedBy.includes(currentUser.id);
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = async (optionId: string) => {
    if (hasVoted || isVoting) return;
    setIsVoting(true);
    await onVote(poll.id, optionId);
    setIsVoting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <p className="text-xs text-gray-500">Posted by {poll.createdBy.name} on {poll.creationDate.toLocaleDateString()}</p>
      <h3 className="text-lg font-bold text-gray-800 my-2 flex-grow">{poll.question}</h3>
      
      <div className="space-y-3 mt-4">
        {hasVoted ? (
          // Results View
          poll.options.map(option => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            return (
              <div key={option.id}>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="font-semibold text-gray-700">{option.text}</span>
                  <span className="text-gray-500 font-medium">{percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            );
          })
        ) : (
          // Voting View
          poll.options.map(option => (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={isVoting}
              className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-indigo-50 hover:border-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <span className="font-medium text-gray-800">{option.text}</span>
            </button>
          ))
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500 text-right">
        {isVoting ? <SpinnerIcon className="w-5 h-5 inline" /> : <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>}
      </div>
    </div>
  );
};

export default PollCard;
