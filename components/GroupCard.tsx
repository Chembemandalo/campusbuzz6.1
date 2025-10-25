import React from 'react';
import { Group } from '../types';

interface GroupCardProps {
  group: Group;
  isMember: boolean;
  onJoin: () => void;
  onLeave: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, isMember, onJoin, onLeave }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-24 bg-gradient-to-r from-gray-300 to-gray-400">
        <img 
            src={group.avatarUrl} 
            alt={`${group.name} cover`} 
            className="w-20 h-20 rounded-full border-4 border-white absolute -bottom-10 left-1/2 -translate-x-1/2"
        />
      </div>
      <div className="pt-12 p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-lg">{group.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{group.members.length} members</p>
        <p className="text-sm text-gray-600 line-clamp-2 flex-grow">{group.description}</p>
        <div className="mt-4">
          {isMember ? (
            <button
              onClick={onLeave}
              className="w-full bg-gray-200 text-gray-700 font-semibold px-3 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
            >
              Leave Group
            </button>
          ) : (
            <button
              onClick={onJoin}
              className="w-full bg-indigo-600 text-white font-semibold px-3 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
            >
              Join Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
