import React from 'react';
import { Group } from '../types';

interface GroupCardProps {
  group: Group;
  isMember: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onJoin: () => void;
  onLeave: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, isMember, isExpanded, onToggleExpand, onJoin, onLeave }) => {
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMember) {
      // "Open" action - for now, we can just leave the group as a placeholder action
      onLeave();
    } else {
      onJoin();
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-24 bg-gradient-to-r from-gray-300 to-gray-400 cursor-pointer" onClick={onToggleExpand}>
        <img 
            src={group.avatarUrl} 
            alt={`${group.name} cover`} 
            className="w-20 h-20 rounded-full border-4 border-white absolute -bottom-10 left-1/2 -translate-x-1/2"
        />
      </div>
      <div className="pt-12 p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-lg cursor-pointer" onClick={onToggleExpand}>{group.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{group.members.length} members</p>
        
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-40' : 'max-h-10'}`}>
             <p className={`text-sm text-gray-600 ${!isExpanded && 'line-clamp-2'}`}>{group.description}</p>
        </div>
        
        <div className="mt-4">
          <button
              onClick={handleActionClick}
              className={`w-full font-semibold px-3 py-2 rounded-lg text-sm transition-colors ${
                  isMember ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
          >
              {isMember ? 'Leave Group' : 'Join Group'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;