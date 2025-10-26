import React, { useState } from 'react';
import { Poll, User } from '../types';
import { SpinnerIcon } from './icons';

interface PollCardProps {
  poll: Poll;
  currentUser: User;
  onVote: (pollId: string, optionId: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const PollCard: React.FC<PollCardProps> = ({ poll, currentUser, onVote, isExpanded, onToggleExpand }) => {
  const [isVoting, setIsVoting] = useState(false);

  const hasVoted = poll.votedBy.includes(currentUser.id);
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = async (optionId: string) => {
    if (hasVoted || isVoting) return;
    setIsVoting(true);
    await onVote(poll.id, optionId);
    // No need to set isVoting(false) here, as the component will re-render with hasVoted=true
    // which replaces the voting UI with the results UI.
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <div className="p-6 cursor-pointer" onClick={onToggleExpand}>
            <p className="text-xs text-gray-500">Posted by {poll.createdBy.name} on {poll.creationDate.toLocaleDateString()}</p>
            <h3 className="text-lg font-bold text-gray-800 my-2">{poll.question}</h3>
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
                <span className="text-indigo-600 font-semibold text-sm">
                    {isExpanded ? 'Collapse' : 'View & Vote'}
                </span>
            </div>
        </div>

        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
            <div className="p-6 pt-0">
                <div className="border-t pt-4">
                    <div className="space-y-3">
                    {isVoting ? (
                        <div className="flex justify-center items-center py-8">
                            <SpinnerIcon className="w-8 h-8 text-indigo-600" />
                            <span className="ml-2 text-gray-600">Submitting your vote...</span>
                        </div>
                    ) : hasVoted ? (
                    // Results View
                    poll.options.map(option => {
                        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                        const userVotedForThis = option.voterIds?.includes(currentUser.id);
                        return (
                        <div key={option.id} className={`relative p-3 rounded-lg border ${userVotedForThis ? 'bg-indigo-50 border-indigo-300' : 'border-transparent'}`}>
                            {userVotedForThis && (
                                <div className="absolute top-2 right-2 text-xs bg-indigo-500 text-white font-semibold px-2 py-0.5 rounded-full">Your Vote</div>
                            )}
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className={`font-semibold ${userVotedForThis ? 'text-indigo-800' : 'text-gray-700'}`}>{option.text}</span>
                                <span className="text-gray-500 font-medium">{percentage.toFixed(0)}% ({option.votes})</span>
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
                        className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-indigo-50 hover:border-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                        <span className="font-medium text-gray-800">{option.text}</span>
                        </button>
                    ))
                    )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PollCard;
