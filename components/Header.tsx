import React, { useState, useRef, useEffect } from 'react';
import { User, Notification, Article, Page } from '../types';
import { 
    ChevronDownIcon, 
    SearchIcon, 
    BellIcon, 
    CartIcon, 
    MenuIcon, 
    ChatBubbleLeftRightIcon,
    HeartIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    CalendarDaysIcon,
    MegaphoneIcon,
    NewspaperIcon,
    BuildingStorefrontIcon,
    UserPlusIcon
} from './icons';

interface HeaderProps {
  currentUser: User;
  onNavigate: (page: Page, data?: User | Article) => void;
  onSearch: (query: string) => void;
  totalUnreadMessages: number;
  notifications: Notification[];
  onMarkAllNotificationsRead: () => void;
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
  currentPage: Page;
}

const NotificationIconMap: Record<Notification['type'], React.FC<{className?: string}>> = {
    like: HeartIcon,
    comment: ChatBubbleOvalLeftEllipsisIcon,
    event: CalendarDaysIcon,
    announcement: MegaphoneIcon,
    post: NewspaperIcon,
    listing: BuildingStorefrontIcon,
    friend_request: UserPlusIcon,
    friend_request_accepted: UserPlusIcon,
    article_like: HeartIcon,
    article_comment: ChatBubbleOvalLeftEllipsisIcon,
};

const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  onNavigate, 
  onSearch, 
  totalUnreadMessages, 
  notifications, 
  onMarkAllNotificationsRead,
  isAuthenticated,
  onLogin,
  onLogout,
  currentPage
}) => {
  const [isCommunityOpen, setCommunityOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const communityRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleClickOutside = (event: MouseEvent) => {
    if (communityRef.current && !communityRef.current.contains(event.target as Node)) {
      setCommunityOpen(false);
    }
    if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
      setNotificationsOpen(false);
    }
    if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
      setProfileOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(searchTerm);
    }
  };
  
  const handleNavClick = (page: Page, user?: User) => {
    if (isAuthenticated) {
        onNavigate(page, user);
    } else {
        onLogin();
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Campus Buzz: Logo Text */}
          <div className="flex-shrink-0 flex items-center">
            <span className="font-bold text-2xl tracking-wider cursor-pointer" onClick={() => onNavigate('home')}>CAMPUS BUZZ</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="hover:text-yellow-300 transition-colors">Home</a>
            <div className="relative" ref={communityRef}>
              <button onClick={() => setCommunityOpen(!isCommunityOpen)} className="flex items-center hover:text-yellow-300 transition-colors">
                Community <ChevronDownIcon className="ml-1 w-4 h-4" />
              </button>
              {isCommunityOpen && (
                <div className="absolute mt-2 w-48 bg-white text-gray-800 rounded-md shadow-xl py-1 z-20">
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('newsfeed'); setCommunityOpen(false); }} className="block px-4 py-2 text-sm hover:bg-gray-100">NewsFeed</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('profile', currentUser); setCommunityOpen(false); }} className="block px-4 py-2 text-sm hover:bg-gray-100">Profile Timeline</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('gallery'); setCommunityOpen(false); }} className="block px-4 py-2 text-sm hover:bg-gray-100">Gallery</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('events'); setCommunityOpen(false); }} className="block px-4 py-2 text-sm hover:bg-gray-100">Events Calendar</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('groups'); setCommunityOpen(false); }} className="block px-4 py-2 text-sm hover:bg-gray-100">Groups</a>
                </div>
              )}
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('blog'); }} className="hover:text-yellow-300 transition-colors">Blog</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('marketplace'); }} className="hover:text-yellow-300 transition-colors">Marketplace</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('jobs'); }} className="hover:text-yellow-300 transition-colors">Jobs</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('mentors'); }} className="hover:text-yellow-300 transition-colors">Mentors</a>
            <a href="#" className="hover:text-yellow-300 transition-colors">Contact Us</a>
          </nav>

          {/* Right side icons and user */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative" style={{ visibility: currentPage === 'newsfeed' ? 'hidden' : 'visible' }}>
                <input 
                  type="text" 
                  placeholder="Search posts..." 
                  className="bg-white bg-opacity-20 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
              </div>
              <button className="relative p-2 hover:bg-white/20 rounded-full">
                  <CartIcon className="w-6 h-6"/>
              </button>

              <button onClick={() => handleNavClick('chat')} className="relative p-2 hover:bg-white/20 rounded-full">
                  <ChatBubbleLeftRightIcon className="w-6 h-6"/>
                  {totalUnreadMessages > 0 && <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center">{totalUnreadMessages}</span>}
              </button>

              <div className="relative" ref={notificationsRef}>
                  <button onClick={() => setNotificationsOpen(!isNotificationsOpen)} className="relative p-2 hover:bg-white/20 rounded-full">
                      <BellIcon className="w-6 h-6" />
                      {unreadCount > 0 && <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center">{unreadCount}</span>}
                  </button>
                  {isNotificationsOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-20">
                          <div className="p-3 flex justify-between items-center border-b">
                              <h3 className="font-semibold text-gray-700">Notifications</h3>
                              {unreadCount > 0 && (
                                  <button 
                                      onClick={onMarkAllNotificationsRead} 
                                      className="text-xs text-indigo-600 hover:underline focus:outline-none"
                                  >
                                      Mark all as read
                                  </button>
                              )}
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                              {notifications.length > 0 ? (
                                  notifications.map(n => {
                                      const Icon = NotificationIconMap[n.type] || BellIcon;
                                      return (
                                          <div key={n.id} className={`p-3 border-b border-gray-100 flex items-start space-x-3 ${!n.isRead ? 'bg-indigo-50' : 'bg-white'} hover:bg-gray-50`}>
                                              <div className="flex-shrink-0 mt-1">
                                                  <Icon className="w-5 h-5 text-gray-400"/>
                                              </div>
                                              <div>
                                                  <p className={`text-sm ${!n.isRead ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>{n.text}</p>
                                                  <p className="text-xs text-gray-400 mt-1">{n.timestamp}</p>
                                              </div>
                                          </div>
                                      );
                                  })
                              ) : (
                                  <div className="p-4 text-center text-sm text-gray-500">
                                      You have no new notifications.
                                  </div>
                              )}
                          </div>
                          <a href="#" className="block text-center p-2 text-sm font-semibold text-indigo-600 bg-gray-50 hover:bg-gray-100">View All</a>
                      </div>
                  )}
              </div>
                
              <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white">
                  {/* Campus Buzz: Current user's avatar in the header */}
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full border-2 border-white" />
                </button>
                {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-xl py-1 z-20">
                        <div className="px-4 py-2 border-b">
                            <p className="font-bold truncate">{currentUser.name}</p>
                            <p className="text-sm text-gray-500 truncate">{currentUser.role}</p>
                        </div>
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('profile', currentUser); setProfileOpen(false); }} className="block px-4 py-2 text-sm hover:bg-gray-100">My Profile</a>
                        {currentUser.isMentor && <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('mentor-dashboard'); setProfileOpen(false); }} className="block px-4 py-2 text-sm hover:bg-gray-100">Mentor Dashboard</a>}
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('settings'); setProfileOpen(false); }} className="block px-4 py-2 text-sm hover:bg-gray-100">Settings</a>
                        {currentUser.role === 'Admin' && <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('admin'); setProfileOpen(false); }} className="block px-4 py-2 text-sm hover:bg-gray-100">Admin Dashboard</a>}
                        <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); setProfileOpen(false); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 border-t">Logout</a>
                    </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={onLogin} className="hover:text-yellow-300 transition-colors font-semibold">Login</button>
              <button onClick={onLogin} className="bg-white text-indigo-700 font-bold py-2 px-4 rounded-full hover:bg-yellow-300 transition-colors">Sign Up</button>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md hover:bg-white/20">
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;