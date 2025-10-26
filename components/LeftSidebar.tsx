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
    PlusIcon,
    UserCircleIcon,
    AcademicCapIcon,
    HomeIcon,
    TagIcon,
    InformationCircleIcon,
} from './icons';

interface SidebarLinkProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon: Icon, label, count, isActive, onClick }) => (
    <a 
        href="#" 
        onClick={(e) => { e.preventDefault(); onClick?.(); }} 
        className={`flex items-center p-2.5 rounded-lg transition-colors text-sm ${isActive ? 'bg-gray-200 text-gray-900 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
        aria-current={isActive ? 'page' : undefined}
    >
        <Icon className="w-5 h-5 mr-3 text-gray-500" />
        <span className="flex-grow font-medium">{label}</span>
        {count != null && count > 0 && <span className="bg-gray-200 text-xs font-bold rounded-full px-2 py-0.5">{count}</span>}
    </a>
);

interface LeftSidebarProps {
  currentUser: User;
  onNavigate: (page: Page, data?: User | Article) => void;
  currentPage: Page;
  onOpenCreatePostModal: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ currentUser, onNavigate, currentPage, onOpenCreatePostModal }) => {
    return (
        <div className="bg-white p-4 h-full border-r border-gray-200">
            <button 
                onClick={onOpenCreatePostModal}
                className="w-full flex items-center justify-center p-3 mb-6 bg-gray-800 text-white rounded-lg font-semibold text-sm hover:bg-gray-700 transition-colors"
            >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create
            </button>
            
            <nav className="space-y-6">
                <div>
                    <h3 className="px-2.5 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">General</h3>
                    <ul className="space-y-1">
                        <SidebarLink icon={UsersIcon} label="Community" onClick={() => onNavigate('community')} isActive={currentPage === 'community'} />
                        <SidebarLink icon={ListBulletIcon} label="My Tasks" onClick={() => onNavigate('classes')} isActive={currentPage === 'classes'} />
                        <SidebarLink icon={ChatBubbleOvalLeftEllipsisIcon} label="Inbox" onClick={() => onNavigate('chat')} isActive={currentPage === 'chat'} />
                        <SidebarLink icon={QuestionMarkCircleIcon} label="Lost and Found" onClick={() => onNavigate('lostandfound')} isActive={currentPage === 'lostandfound'} />
                    </ul>
                </div>
                 <div>
                    <h3 className="px-2.5 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">My Workspace</h3>
                    <ul className="space-y-1">
                        <SidebarLink icon={UserCircleIcon} label="Profile Timeline" onClick={() => onNavigate('profile', currentUser)} isActive={currentPage === 'profile'} />
                        <SidebarLink icon={PhotoIcon} label="Gallery" onClick={() => onNavigate('gallery')} isActive={currentPage === 'gallery'} />
                        <SidebarLink icon={CalendarDaysIcon} label="Events Calendar" onClick={() => onNavigate('events')} isActive={currentPage === 'events'} />
                        <SidebarLink icon={UserGroupIcon} label="Groups" onClick={() => onNavigate('groups')} isActive={currentPage === 'groups'} />
                        <SidebarLink icon={AcademicCapIcon} label="Goals" onClick={() => onNavigate('mentors')} isActive={currentPage === 'mentors'} />
                        <SidebarLink icon={TagIcon} label="Clearance" onClick={() => onNavigate('clearance')} isActive={currentPage === 'clearance'} />
                        <SidebarLink icon={InformationCircleIcon} label="About Us" onClick={() => onNavigate('about')} isActive={currentPage === 'about'} />
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default LeftSidebar;