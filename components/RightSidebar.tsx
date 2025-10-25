import React from 'react';
import { User, Post, Article, Page } from '../types';

interface RightSidebarProps {
  allUsers: User[];
  allPosts: Post[];
  onNavigate: (page: Page, data?: User | Article) => void;
}

// Mock data for groups, as it's not in the main data model yet
const mockGroups = [
  { id: 'g1', name: 'Computer Science Club', avatarUrl: 'https://picsum.photos/seed/csc/200' },
  { id: 'g2', name: 'University Hiking Group', avatarUrl: 'https://picsum.photos/seed/hiking/200' },
  { id: 'g3', name: 'Debate Team', avatarUrl: 'https://picsum.photos/seed/debate/200' },
];

const RightSidebar: React.FC<RightSidebarProps> = ({ allUsers, allPosts, onNavigate }) => {
  // Get the 4 most "recent" users (using slice as a proxy for recency)
  const newestMembers = allUsers.slice(0, 4);

  // Get the 3 most popular posts by likes
  const popularPosts = [...allPosts].sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <div className="space-y-6 sticky top-28">
      {/* My Groups */}
      <div className="bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <h3 className="font-bold mb-4 text-gray-800 border-b pb-2">My Groups</h3>
        <ul className="space-y-3">
          {mockGroups.map(group => (
            <li key={group.id} className="flex items-center space-x-3 cursor-pointer group" onClick={() => onNavigate('groups')}>
              {/* Campus Buzz: Group avatar in the right sidebar */}
              <img src={group.avatarUrl} alt={group.name} className="w-10 h-10 rounded-lg object-cover" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">{group.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Newest Members */}
      <div className="bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <h3 className="font-bold mb-4 text-gray-800 border-b pb-2">Newest Members</h3>
        <ul className="space-y-3">
          {newestMembers.map(user => (
            <li 
              key={user.id} 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => onNavigate('profile', user)}
            >
              {/* Campus Buzz: New member's avatar in the right sidebar */}
              <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600">{user.name}</p>
                <p className="text-xs text-gray-500">{user.department}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Now */}
      <div className="bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <h3 className="font-bold mb-4 text-gray-800 border-b pb-2">Popular Now</h3>
        <ul className="space-y-4">
            {popularPosts.map(post => (
                 <li key={post.id} className="text-sm cursor-pointer group">
                    <p className="font-semibold text-gray-700 group-hover:text-indigo-600">
                        {post.content.substring(0, 40)}...
                    </p>
                    <p className="text-xs text-gray-500">{post.likes} reactions</p>
                 </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default RightSidebar;