import React, { useState, useMemo } from 'react';
import { User, FriendRequest, Article, Page } from '../types';
import UserCard from '../components/UserCard';
import FriendRequestCard from '../components/FriendRequestCard';
import { SearchIcon, UserGroupIcon } from '../components/icons';

type FriendsPageTab = 'all' | 'requests' | 'find';

interface FriendsPageProps {
  allUsers: User[];
  currentUser: User;
  friendRequests: FriendRequest[];
  sentFriendRequests: FriendRequest[];
  onNavigate: (page: Page, data?: User | Article) => void;
  onSendFriendRequest: (userId: string) => void;
  onAcceptFriendRequest: (requestId: string) => void;
  onDeclineFriendRequest: (requestId: string) => void;
}

const FriendsPage: React.FC<FriendsPageProps> = ({ 
    allUsers, 
    currentUser, 
    friendRequests, 
    sentFriendRequests,
    onNavigate,
    onSendFriendRequest,
    onAcceptFriendRequest,
    onDeclineFriendRequest 
}) => {
  const [activeTab, setActiveTab] = useState<FriendsPageTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const myFriends = useMemo(() => 
    allUsers.filter(user => currentUser.friends.includes(user.id)),
    [allUsers, currentUser.friends]
  );
  
  const potentialFriends = useMemo(() => 
    allUsers.filter(user => user.id !== currentUser.id && !currentUser.friends.includes(user.id)), 
    [allUsers, currentUser]
  );
  
  const filteredUsers = useMemo(() => {
    const usersToFilter = activeTab === 'all' ? myFriends : potentialFriends;
    if (!searchQuery) return usersToFilter;
    return usersToFilter.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [potentialFriends, myFriends, searchQuery, activeTab]);

  const isRequestSent = (userId: string) => {
    return sentFriendRequests.some(req => req.toUser.id === userId);
  };
  
  const renderContent = () => {
      switch(activeTab) {
          case 'requests':
              return friendRequests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {friendRequests.map(req => (
                          <FriendRequestCard 
                              key={req.id} 
                              request={req} 
                              onAccept={onAcceptFriendRequest}
                              onDecline={onDeclineFriendRequest}
                          />
                      ))}
                  </div>
              ) : (
                  <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                      <p>No new friend requests.</p>
                  </div>
              );
          case 'all':
              return filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredUsers.map(user => (
                        <UserCard 
                            key={user.id} 
                            user={user} 
                            friendStatus='friend'
                            onNavigateToProfile={() => onNavigate('profile', user)}
                            onSendRequest={() => {}}
                        />
                    ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                    <p>You haven't added any friends yet. Go to "Find People" to connect with others!</p>
                </div>
              );
          case 'find':
          default:
              return filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredUsers.map(user => (
                        <UserCard 
                            key={user.id} 
                            user={user} 
                            friendStatus={isRequestSent(user.id) ? 'sent' : 'none'}
                            onNavigateToProfile={() => onNavigate('profile', user)} 
                            onSendRequest={onSendFriendRequest}
                        />
                    ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                    <p>No users found matching your search.</p>
                </div>
              );
      }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
        <div className="container mx-auto px-4 py-8 md:py-12 flex items-center space-x-4">
          <UserGroupIcon className="w-12 h-12 md:w-16 md:h-16 text-white"/>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">Friends</h1>
            <p className="text-sm md:text-base">Connect with students and staff at Rockview University.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex border-b mb-4">
                <TabButton label="My Friends" count={myFriends.length} isActive={activeTab === 'all'} onClick={() => setActiveTab('all')} />
                <TabButton label="Friend Requests" count={friendRequests.length} isActive={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
                <TabButton label="Find People" isActive={activeTab === 'find'} onClick={() => setActiveTab('find')} />
            </div>
            { (activeTab === 'all' || activeTab === 'find') && (
                 <div className="relative">
                    <input
                    type="text"
                    placeholder={activeTab === 'all' ? "Search your friends..." : "Search by name or department..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                </div>
            )}
        </div>
        
        {renderContent()}

      </div>
    </div>
  );
};

interface TabButtonProps {
    label: string;
    count?: number;
    isActive: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, count, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex items-center space-x-2 py-2 px-4 text-sm font-semibold transition-colors ${isActive ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
    >
        <span>{label}</span>
        {typeof count !== 'undefined' && count > 0 && (
            <span className={`text-xs rounded-full px-2 py-0.5 ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{count}</span>
        )}
    </button>
);


export default FriendsPage;