import React, { useState } from 'react';
import { Group, User } from '../types';
import GroupCard from '../components/GroupCard';
import { UserGroupIcon, BackButton } from '../components/icons';

interface GroupsPageProps {
  groups: Group[];
  currentUser: User;
  onJoinGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
  handleBack: () => void;
}

const GroupsPage: React.FC<GroupsPageProps> = ({ groups, currentUser, onJoinGroup, onLeaveGroup, handleBack }) => {
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const handleToggleExpand = (groupId: string) => {
    setExpandedGroupId(prevId => (prevId === groupId ? null : groupId));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
            <BackButton onClick={handleBack} className="mb-4 text-white hover:text-indigo-200" text="Back" />
            <div className="flex items-center space-x-4">
              <UserGroupIcon className="w-12 h-12 md:w-16 md:h-16 text-white"/>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">Community Groups</h1>
                <p className="text-sm md:text-base">Find your community and get involved on campus.</p>
              </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups.map(group => (
            <GroupCard 
              key={group.id} 
              group={group} 
              isMember={group.members.includes(currentUser.id)}
              isExpanded={expandedGroupId === group.id}
              onToggleExpand={() => handleToggleExpand(group.id)}
              onJoin={() => onJoinGroup(group.id)}
              onLeave={() => onLeaveGroup(group.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;