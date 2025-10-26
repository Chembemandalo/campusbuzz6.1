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
    UserPlusIcon,
    UserGroupIcon,
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon
} from './icons';

interface HeaderProps {
  currentUser?: User;
  onNavigate: (page: Page, data?: User | Article) => void;
  onSearch: (query: string) => void;
  totalUnreadMessages: number;
  notifications: Notification[];
  onMarkAllNotificationsRead: () => void;
  onNotificationClick: (notification: Notification) => void;
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
    friend_request_accepted: UserGroupIcon,
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
  onNotificationClick,
  isAuthenticated,
  onLogin,
  onLogout,
  currentPage
}) => {
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) setNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; }
  }, [isMobileMenuOpen]);

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(searchTerm);
    }
  };
  
  const handleNavClick = (page: Page, user?: User) => {
    setMobileMenuOpen(false);
    if (isAuthenticated) {
        onNavigate(page, user);
    } else {
        // For public pages, navigate directly. For others, App.tsx handles the auth redirect.
        const publicPages: Page[] = ['home', 'blog', 'library', 'about', 'contact'];
        if (publicPages.includes(page)) {
          onNavigate(page);
        } else {
          onLogin();
        }
    }
  };
  
  const handleNotificationItemClick = (notification: Notification) => {
    setNotificationsOpen(false); // Close dropdown first
    onNotificationClick(notification);
  };

  const MobileMenu = () => (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/30 animate-fade-in-opacity" onClick={() => setMobileMenuOpen(false)} aria-hidden="true"></div>
        
        {/* Menu Panel */}
        <div className="fixed top-0 bottom-0 left-0 w-4/5 max-w-sm bg-white p-4 flex flex-col shadow-xl animate-slide-in-left">
            <div className="flex justify-between items-center mb-6">
                <div className="flex-shrink-0 flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('home')}>
                    <div className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center p-1">
                        <div className="grid grid-cols-2 gap-0.5">
                            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                            <span className="w-2.5 h-2.5 bg-gray-700 rounded-full"></span>
                            <span className="w-2.5 h-2.5 bg-gray-700 rounded-full"></span>
                            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                        </div>
                    </div>
                    <span className="font-bold text-xl text-gray-800 tracking-wider">Campus Buzz</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500"><XMarkIcon className="w-7 h-7"/></button>
            </div>
            
            <nav className="flex flex-col space-y-2 flex-grow overflow-y-auto">
              {isAuthenticated ? (
                <>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className="text-gray-700 font-medium hover:bg-gray-100 p-3 rounded-lg text-lg">Home</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('community'); }} className="text-gray-700 font-medium hover:bg-gray-100 p-3 rounded-lg text-lg">Community</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('blog'); }} className="text-gray-700 font-medium hover:bg-gray-100 p-3 rounded-lg text-lg">News</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('marketplace'); }} className="text-gray-700 font-medium hover:bg-gray-100 p-3 rounded-lg text-lg">Marketplace</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('jobs'); }} className="text-gray-700 font-medium hover:bg-gray-100 p-3 rounded-lg text-lg">Jobs</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('mentors'); }} className="text-gray-700 font-medium hover:bg-gray-100 p-3 rounded-lg text-lg">Mentors</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('library'); }} className="text-gray-700 font-medium hover:bg-gray-100 p-3 rounded-lg text-lg">Library</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('events'); }} className="text-gray-700 font-medium hover:bg-gray-100 p-3 rounded-lg text-lg">Events</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }} className="text-gray-700 font-medium hover:bg-gray-100 p-3 rounded-lg text-lg">About Us</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }} className="text-gray-700 font-medium hover:bg-gray-100 p-3 rounded-lg text-lg">Contact Us</a>
                </>
              ) : (
                <>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} className="text-gray-700 font-medium hover:bg-gray-100 p-3 rounded-lg text-lg">Home</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('blog'); }} className="text-gray-700 font-medium hover:bg-gray-100 p-3 rounded-lg text-lg">News</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('library'); }} className="text-gray-700 font-medium hover:bg-gray-100 p-3 rounded-lg text-lg">Library</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }} className="text-gray-700 font-medium hover:bg-gray-100 p-3 rounded-lg text-lg">About Us</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }} className="text-gray-700 font-medium hover:bg-gray-100 p-3 rounded-lg text-lg">Contact Us</a>
                </>
              )}
            </nav>
            
            <div className="mt-auto pt-4 border-t">
                {isAuthenticated && currentUser ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('profile', currentUser)}>
                            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-12 h-12 rounded-full" />
                            <div>
                                <p className="font-bold truncate">{currentUser.name}</p>
                                <p className="text-sm text-gray-500 truncate">{currentUser.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handleNavClick('settings')} className="p-3 hover:bg-gray-100 rounded-full text-gray-500"><Cog6ToothIcon /></button>
                            <button onClick={() => { setMobileMenuOpen(false); onLogout(); }} className="p-3 hover:bg-gray-100 rounded-full text-gray-500"><ArrowRightOnRectangleIcon /></button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <button onClick={() => { setMobileMenuOpen(false); onLogin(); }} className="flex-1 font-semibold text-gray-700 hover:bg-gray-100 transition-colors py-3 px-4 rounded-lg">Sign in</button>
                        <button onClick={() => { setMobileMenuOpen(false); onLogin(); }} className="flex-1 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors">Get Started</button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Campus Buzz: Logo */}
          <div className="flex-shrink-0 flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center p-1">
                <div className="grid grid-cols-2 gap-0.5">
                    <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                    <span className="w-2.5 h-2.5 bg-gray-700 rounded-full"></span>
                    <span className="w-2.5 h-2.5 bg-gray-700 rounded-full"></span>
                    <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                </div>
            </div>
            <span className="hidden sm:block font-bold text-xl text-gray-800 tracking-wider">Campus Buzz</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">Home</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('community'); }} className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">Community</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('blog'); }} className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">News</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('marketplace'); }} className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">Marketplace</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('jobs'); }} className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">Jobs</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('mentors'); }} className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">Mentors</a>
                <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('library'); }} className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">Library</a>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">Contact Us</a>
              </>
            ) : (
              <>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('blog'); }} className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">News</a>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('library'); }} className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">Library</a>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">About Us</a>
              </>
            )}
          </nav>

          {/* Right side icons and user */}
          {isAuthenticated && currentUser ? (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative hidden lg:block">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full lg:hidden">
                  <SearchIcon className="w-6 h-6"/>
              </button>

              <button onClick={() => handleNavClick('chat')} className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                  <ChatBubbleLeftRightIcon className="w-6 h-6"/>
                  {totalUnreadMessages > 0 && <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center text-white">{totalUnreadMessages}</span>}
              </button>

              <div className="relative hidden md:block" ref={notificationsRef}>
                  <button onClick={() => setNotificationsOpen(!isNotificationsOpen)} className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                      <BellIcon className="w-6 h-6" />
                      {unreadCount > 0 && <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center text-white">{unreadCount}</span>}
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
                                          <div key={n.id} onClick={() => handleNotificationItemClick(n)} className={`p-3 border-b border-gray-100 flex items-start space-x-3 cursor-pointer ${!n.isRead ? 'bg-indigo-50' : 'bg-white'} hover:bg-gray-50`}>
                                              <div className="flex-shrink-0 mt-1 relative">
                                                  {n.fromUser ? (
                                                      <img src={n.fromUser.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                                                  ) : (
                                                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                          <Icon className="w-5 h-5 text-gray-400"/>
                                                      </div>
                                                  )}
                                                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
                                                      <Icon className="w-4 h-4 text-indigo-500" />
                                                  </div>
                                              </div>
                                              <div>
                                                  <p className={`text-sm ${!n.isRead ? 'text-gray-800' : 'text-gray-600'}`}>{n.text}</p>
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
                
              <div className="relative hidden md:block" ref={profileRef}>
                <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500">
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full border-2 border-gray-300" />
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
              <button onClick={onLogin} className="font-semibold text-gray-700 hover:text-indigo-600 transition-colors">Sign in</button>
              <button onClick={onLogin} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-full hover:bg-indigo-700 transition-colors">Get Started</button>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-500 rounded-md hover:bg-gray-100">
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && <MobileMenu />}
    </header>
  );
};

export default Header;
