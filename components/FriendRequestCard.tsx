import React from 'react';
import { FriendRequest } from '../types';
import { CheckIcon, XMarkIcon } from './icons';

interface FriendRequestCardProps {
  request: FriendRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({ request, onAccept, onDecline }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
      <div className="flex items-center min-w-0">
        <img src={request.fromUser.avatarUrl} alt={request.fromUser.name} className="w-12 h-12 rounded-full" />
        <div className="ml-3 min-w-0">
          <p className="font-semibold text-gray-800 truncate">{request.fromUser.name}</p>
          <p className="text-sm text-gray-500 truncate">{request.fromUser.department}</p>
        </div>
      </div>
      <div className="flex space-x-2 flex-shrink-0">
        <button 
            onClick={() => onAccept(request.id)}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
            aria-label={`Accept friend request from ${request.fromUser.name}`}
        >
            <CheckIcon className="w-5 h-5" />
        </button>
        <button 
            onClick={() => onDecline(request.id)}
            className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition-colors"
            aria-label={`Decline friend request from ${request.fromUser.name}`}
        >
            <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FriendRequestCard;
