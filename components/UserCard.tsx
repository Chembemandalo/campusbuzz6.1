import React from 'react';
import { User } from '../types';

type FriendStatus = 'friend' | 'sent' | 'none';

interface UserCardProps {
  user: User;
  friendStatus: FriendStatus;
  onNavigateToProfile: (user: User) => void;
  onSendRequest: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, friendStatus, onNavigateToProfile, onSendRequest }) => {
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking button
    if (friendStatus === 'none') {
        onSendRequest(user.id);
    }
  };

  const renderButton = () => {
    switch(friendStatus) {
        case 'friend':
            return (
                <button
                    disabled
                    className="w-full bg-green-100 text-green-700 font-semibold px-3 py-2 rounded-lg text-sm cursor-not-allowed"
                >
                    Friends
                </button>
            );
        case 'sent':
            return (
                <button
                    disabled
                    className="w-full bg-gray-200 text-gray-500 font-semibold px-3 py-2 rounded-lg text-sm cursor-not-allowed"
                >
                    Request Sent
                </button>
            );
        case 'none':
        default:
            return (
                <button
                    onClick={handleButtonClick}
                    className="w-full bg-indigo-600 text-white font-semibold px-3 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                >
                    Add Friend
                </button>
            );
    }
  }

  return (
    <div 
        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center text-center p-6 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        onClick={() => onNavigateToProfile(user)}
    >
      {/* Campus Buzz: User's avatar on the 'Find Friends' user card */}
      <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full border-4 border-gray-200 group-hover:border-indigo-400 transition-colors" />
      <h3 className="mt-4 text-lg font-bold text-gray-800 truncate group-hover:text-indigo-600 w-full">{user.name}</h3>
      <p className="text-sm text-gray-500">{user.role}</p>
      <p className="text-xs text-gray-400 mt-1">{user.department}</p>
      <div className="mt-4 w-full">
        {renderButton()}
      </div>
    </div>
  );
};

export default UserCard;
