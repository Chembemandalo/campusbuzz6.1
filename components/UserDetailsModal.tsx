import React, { useMemo } from 'react';
import { User, Post, Article, Event, MarketplaceItem } from '../types';
import { 
    XMarkIcon,
    NewspaperIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    CalendarDaysIcon,
    BuildingStorefrontIcon,
    UserGroupIcon,
    PencilSquareIcon,
} from './icons';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  allPosts: Post[];
  allArticles: Article[];
  allEvents: Event[];
  allListings: MarketplaceItem[];
}

const StatItem: React.FC<{ icon: React.FC<{className?: string}>, label: string, value: number }> = ({ icon: Icon, label, value }) => (
    <div className="bg-gray-100 p-4 rounded-lg flex items-center">
        <div className="p-2 bg-indigo-100 rounded-md">
            <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="ml-4">
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);


const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user, allPosts, allArticles, allEvents, allListings }) => {
    
    const stats = useMemo(() => {
        if (!user) return null;

        const userPosts = allPosts.filter(p => p.author.id === user.id).length;
        const userArticles = allArticles.filter(a => a.author.id === user.id).length;
        const userEvents = allEvents.filter(e => e.organizer.id === user.id).length;
        const userListings = allListings.filter(l => l.seller.id === user.id).length;
        const userCommentsCount = allPosts.reduce((acc, post) => {
            return acc + post.comments.filter(c => c.author.id === user.id).length;
        }, 0);
        
        return {
            posts: userPosts,
            articles: userArticles,
            events: userEvents,
            listings: userListings,
            comments: userCommentsCount,
            friends: user.friends.length,
        };
    }, [user, allPosts, allArticles, allEvents, allListings]);

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up" 
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">User Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow overflow-y-auto">
                    {/* User Banner */}
                    <div className="relative h-40 bg-gray-200">
                        <img src={user.coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute -bottom-12 left-8">
                             <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white bg-white object-cover" />
                        </div>
                    </div>
                    
                    <div className="pt-16 px-8 pb-8">
                        <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="mt-2 text-gray-700">{user.bio}</p>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div><span className="font-semibold text-gray-600">Role:</span> {user.role}</div>
                            <div><span className="font-semibold text-gray-600">Status:</span> 
                                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {user.status}
                                </span>
                            </div>
                            <div><span className="font-semibold text-gray-600">Joined:</span> {user.joinedDate}</div>
                            <div><span className="font-semibold text-gray-600">Department:</span> {user.department}</div>
                            <div><span className="font-semibold text-gray-600">Major:</span> {user.major}</div>
                        </div>

                        {/* Stats */}
                        <div className="mt-8 border-t pt-6">
                             <h4 className="text-lg font-semibold text-gray-800 mb-4">User Activity</h4>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <StatItem icon={NewspaperIcon} label="Posts Created" value={stats?.posts || 0} />
                                <StatItem icon={PencilSquareIcon} label="Articles Written" value={stats?.articles || 0} />
                                <StatItem icon={ChatBubbleOvalLeftEllipsisIcon} label="Comments Made" value={stats?.comments || 0} />
                                <StatItem icon={CalendarDaysIcon} label="Events Organized" value={stats?.events || 0} />
                                <StatItem icon={BuildingStorefrontIcon} label="Marketplace Listings" value={stats?.listings || 0} />
                                <StatItem icon={UserGroupIcon} label="Friends" value={stats?.friends || 0} />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;