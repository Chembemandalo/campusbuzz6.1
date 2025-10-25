import React from 'react';
import { User, Article, Page } from '../types';
import { 
    NewspaperIcon, 
    ListBulletIcon, 
    UserGroupIcon, 
    UserPlusIcon, 
    PhotoIcon, 
    VideoCameraIcon, 
    CalendarDaysIcon, 
    ChatBubbleOvalLeftEllipsisIcon,
    QuestionMarkCircleIcon,
    UsersIcon,
} from './icons';

interface SidebarLinkProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon: Icon, label, isActive, onClick }) => (
    <li>
        <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onClick?.(); }} 
            className={`flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
            aria-current={isActive ? 'page' : undefined}
        >
            <Icon className="w-5 h-5 mr-4 text-gray-500" />
            <span className="flex-grow text-sm font-medium">{label}</span>
        </a>
    </li>
);

interface LeftSidebarProps {
  currentUser: User;
  onNavigate: (page: Page, data?: User | Article) => void;
  currentPage: Page;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ currentUser, onNavigate, currentPage }) => {
    // For unimplemented pages, the onClick will do nothing for now.
    const handleUnimplementedClick = () => {
        console.log("This page is not yet implemented.");
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <nav>
                <ul className="space-y-1">
                    <SidebarLink icon={NewspaperIcon} label="Newsfeed" onClick={() => onNavigate('newsfeed')} isActive={currentPage === 'newsfeed'} />
                    <SidebarLink icon={ListBulletIcon} label="My Timeline" onClick={() => onNavigate('profile', currentUser)} isActive={currentPage === 'profile'} />
                    <SidebarLink icon={UsersIcon} label="Friends" onClick={() => onNavigate('friends')} isActive={currentPage === 'friends'} />
                    <SidebarLink icon={UserGroupIcon} label="Groups" onClick={() => onNavigate('groups')} isActive={currentPage === 'groups'} />
                    <SidebarLink icon={UserPlusIcon} label="Mentors" onClick={() => onNavigate('mentors')} isActive={currentPage === 'mentors'} />
                    <SidebarLink icon={CalendarDaysIcon} label="Event Schedule" onClick={() => onNavigate('events')} isActive={currentPage === 'events'} />
                    <SidebarLink icon={PhotoIcon} label="Gallery" onClick={() => onNavigate('gallery')} isActive={currentPage === 'gallery'} />
                    <SidebarLink icon={QuestionMarkCircleIcon} label="Lost & Found" onClick={() => onNavigate('lostandfound')} isActive={currentPage === 'lostandfound'} />
                    <SidebarLink icon={ChatBubbleOvalLeftEllipsisIcon} label="Forum" onClick={handleUnimplementedClick} />
                </ul>
            </nav>
        </div>
    );
};

export default LeftSidebar;