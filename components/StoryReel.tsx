import React from 'react';
import { User, Page, Article } from '../types';
import { PlusIcon } from './icons';

interface StoryReelProps {
    currentUser: User;
    users: User[];
    onNavigate: (page: Page, data?: User | Article) => void;
}

const StoryReel: React.FC<StoryReelProps> = ({ currentUser, users, onNavigate }) => {
    // Take a few users for the story reel, excluding the current user
    const storyUsers = users.filter(u => u.id !== currentUser.id).slice(0, 10);

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-4 overflow-x-auto pb-2 -mb-2">
                {/* Current User's Story */}
                <div className="flex flex-col items-center space-y-1 flex-shrink-0 w-20 text-center cursor-pointer">
                    <div className="relative">
                        <img 
                            src={currentUser.avatarUrl} 
                            alt="Your Story" 
                            className="w-16 h-16 rounded-full object-cover border-2 border-dashed border-gray-300"
                        />
                        <div className="absolute bottom-0 right-0 bg-indigo-600 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                            <PlusIcon className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <p className="text-xs font-medium text-gray-700">Your Story</p>
                </div>

                {/* Other Users' Stories */}
                {storyUsers.map(user => (
                    <div 
                        key={user.id} 
                        className="flex flex-col items-center space-y-1 flex-shrink-0 w-20 text-center cursor-pointer"
                        onClick={() => onNavigate('profile', user)}
                    >
                        <div className="story-ring">
                            <img 
                                src={user.avatarUrl} 
                                alt={user.name} 
                                className="w-16 h-16 rounded-full object-cover border-2 border-white"
                            />
                        </div>
                        <p className="text-xs text-gray-600 truncate w-full">{user.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoryReel;
