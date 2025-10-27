import React, { useState, useMemo, ChangeEvent } from 'react';
import { User, Post, Article, Event, MarketplaceItem, HeroSlide, Job, LibraryResource, Poll } from '../types';
import { 
    UsersIcon, 
    PencilSquareIcon as ContentIcon, 
    BuildingStorefrontIcon,
    NewspaperIcon,
    BriefcaseIcon,
    ChartBarIcon,
    TrashIcon,
    ArrowTrendingUpIcon,
    PlusIcon,
    ArrowRightIcon,
    MenuIcon,
    BookOpenIcon,
    ClipboardDocumentListIcon,
} from '../components/icons';

interface AdminDashboardPageProps {
  currentUser: User;
  allUsers: User[];
  allPosts: Post[];
  allArticles: Article[];
  allEvents: Event[];
  allListings: MarketplaceItem[];
  allJobs: Job[];
  heroSlides: HeroSlide[];
  allLibraryResources: LibraryResource[];
  allPolls: Poll[];
  onUpdateUser: (userId: string, updates: Partial<Pick<User, 'role' | 'status'>>) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onAdminCreatePost: (content: string) => Promise<void>;
  onDeletePost: (postId: string) => Promise<void>;
  onDeleteArticle: (articleId: string) => Promise<void>;
  onDeleteEvent: (eventId: string) => Promise<void>;
  onDeleteListing: (listingId: string) => Promise<void>;
  onDeleteJob: (jobId: string) => Promise<void>;
  onOpenCreateJobModal: () => void;
  onUpdateHeroSlide: (slideIndex: number, updatedSlide: HeroSlide) => Promise<void>;
  onAddHeroSlide: (slide: HeroSlide) => Promise<void>;
  onDeleteHeroSlide: (slideIndex: number) => Promise<void>;
  onCreateLibraryResource: (data: Omit<LibraryResource, 'id' | 'publishedDate'>) => Promise<void>;
  onUpdateLibraryResource: (id: string, data: Partial<LibraryResource>) => Promise<void>;
  onDeleteLibraryResource: (id: string) => Promise<void>;
  onDeletePoll: (pollId: string) => Promise<void>;
  onOpenCreatePollModal: () => void;
}

type AdminTab = 'stats' | 'users' | 'content' | 'listings' | 'posts' | 'jobs' | 'library' | 'polls';

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('stats');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch(activeTab) {
      case 'users':
        return <UserManagementTab {...props} />;
      case 'content':
        return <ContentModerationTab {...props} />;
      case 'listings':
        return <ListingManagementTab {...props} />;
      case 'posts':
        return <PostManagementTab {...props} />;
      case 'jobs':
        return <JobManagementTab {...props} />;
      case 'polls':
        return <PollManagementTab {...props} />;
      case 'library':
        return <LibraryManagementTab {...props} />;
      case 'stats':
      default:
        return <StatisticsTab {...props} setActiveTab={setActiveTab} />;
    }
  };

  const DashboardHeader = () => (
    <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md bg-white border border-gray-200">
                <MenuIcon className="w-6 h-6 text-gray-600"/>
            </button>
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back, {props.currentUser.name}.</p>
            </div>
        </div>
      <div className="hidden sm:flex space-x-2">
        <button className="bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm">Import Data</button>
        <button onClick={() => {
            if (activeTab === 'posts') {
                // This tab has its own create post
            } else if (activeTab === 'jobs') {
                props.onOpenCreateJobModal();
            } else if (activeTab === 'polls') {
                props.onOpenCreatePollModal();
            }
        }} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 text-sm flex items-center space-x-2"><PlusIcon className="w-4 h-4" /><span>Create New</span></button>
      </div>
    </div>
  );
  
  const SidebarNav = () => (
     <nav className="space-y-2">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
        <TabButton icon={ChartBarIcon} label="Dashboard" isActive={activeTab === 'stats'} onClick={() => { setActiveTab('stats'); setSidebarOpen(false); }} />
        <TabButton icon={UsersIcon} label="Users" isActive={activeTab === 'users'} onClick={() => { setActiveTab('users'); setSidebarOpen(false); }} />
        <TabButton icon={NewspaperIcon} label="Posts" isActive={activeTab === 'posts'} onClick={() => { setActiveTab('posts'); setSidebarOpen(false); }} />
        <p className="px-4 pt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</p>
        <TabButton icon={ContentIcon} label="Content" isActive={activeTab === 'content'} onClick={() => { setActiveTab('content'); setSidebarOpen(false); }} />
        <TabButton icon={BuildingStorefrontIcon} label="Listings" isActive={activeTab === 'listings'} onClick={() => { setActiveTab('listings'); setSidebarOpen(false); }} />
        <TabButton icon={BriefcaseIcon} label="Jobs" isActive={activeTab === 'jobs'} onClick={() => { setActiveTab('jobs'); setSidebarOpen(false); }} />
        <TabButton icon={ClipboardDocumentListIcon} label="Polls & Surveys" isActive={activeTab === 'polls'} onClick={() => { setActiveTab('polls'); setSidebarOpen(false); }} />
        <TabButton icon={BookOpenIcon} label="Library" isActive={activeTab === 'library'} onClick={() => { setActiveTab('library'); setSidebarOpen(false); }} />
    </nav>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="lg:flex">
        {/* Sidebar Overlay for mobile */}
        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}
        
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white p-4 border-r border-gray-200 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
            <div className="px-4 py-2 mb-8">
                <h2 className="font-bold text-2xl text-gray-800 tracking-wider">CAMPUS BUZZ</h2>
            </div>
            <SidebarNav />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8">
            <DashboardHeader />
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ icon: React.FC<{className?: string}>, label: string, isActive: boolean, onClick: () => void }> = ({ icon: Icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center p-3 rounded-lg text-left text-sm transition-colors ${isActive ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}>
        <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
        <span>{label}</span>
    </button>
);

const SectionTitle: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
    <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
);

const StatCard: React.FC<{ title: string, value: string | number, icon: React.FC<{className?: string}>, change?: string, dark?: boolean, onClick?: () => void }> = ({ title, value, icon: Icon, change, dark = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-5 rounded-xl cursor-pointer transition-all duration-300 ${dark ? 'bg-green-700 text-white' : 'bg-white border'} hover:-translate-y-1 hover:shadow-lg`}
  >
    <div className="flex justify-between items-start">
      <p className={`font-medium ${dark ? 'text-green-100' : 'text-gray-500'}`}>{title}</p>
      <button className={`p-1.5 rounded-md ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
        <ArrowRightIcon className={`w-4 h-4 ${dark ? 'text-white' : 'text-gray-600'}`} />
      </button>
    </div>
    <p className="text-3xl font-bold mt-2">{value}</p>
    {change && <div className="flex items-center text-xs mt-4">
      <ArrowTrendingUpIcon className="w-4 h-4 mr-1 text-green-400"/>
      <span className={dark ? 'text-green-200' : 'text-gray-500'}>{change} from last month</span>
    </div>}
  </div>
);

const ActivityChart: React.FC = () => {
    const data = useMemo(() => {
        const today = new Date();
        const days = Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (6 - i));
            return date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
        });
        
        const values = days.map(() => ({
            posts: Math.floor(Math.random() * 20) + 5,
            users: Math.floor(Math.random() * 8) + 2,
        }));
        
        const maxValue = Math.max(...values.map(v => Math.max(v.posts, v.users))) + 5;
        
        return { days, values, maxValue };
    }, []);

    return (
        <div className="bg-white border p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Project Analytics</h3>
            <div className="flex justify-between items-end h-40">
                {data.values.map((dayData, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end group h-full">
                        <div className="relative flex items-end h-full w-full justify-center">
                            <div 
                                className="w-5 bg-green-200 rounded-t-lg group-hover:bg-green-400 transition-colors"
                                style={{ height: `${(dayData.posts / data.maxValue) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{data.days[index]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const StatisticsTab: React.FC<AdminDashboardPageProps & { setActiveTab: (tab: AdminTab) => void }> = ({ allUsers, allPosts, allListings, allEvents, setActiveTab }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Users" value={allUsers.length} icon={UsersIcon} change="+5" dark onClick={() => setActiveTab('users')} />
                <StatCard title="Total Posts" value={allPosts.length} icon={ContentIcon} change="+12" onClick={() => setActiveTab('posts')} />
                <StatCard title="Active Listings" value={allListings.filter(l => l.status === 'Available').length} icon={BuildingStorefrontIcon} change="+2" onClick={() => setActiveTab('listings')} />
                <StatCard title="Upcoming Events" value={allEvents.filter(e => e.startTime > new Date()).length} icon={ChartBarIcon} change="+1" onClick={() => setActiveTab('content')} />
            </div>
            <ActivityChart />
        </div>
        <div className="lg:col-span-1">
             <div className="bg-white border p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Suspended Users</span>
                        <span className="font-bold text-red-600">{allUsers.filter(u=> u.status === 'suspended').length}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-600">Draft Articles</span>
                        <span className="font-bold">{allUsers.filter(u=> u.status === 'suspended').length}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Comments</span>
                        <span className="font-bold">{allPosts.reduce((acc, p) => acc + p.comments.length, 0)}</span>
                    </div>
                </div>
             </div>
        </div>
    </div>
);

const UserManagementTab: React.FC<AdminDashboardPageProps> = ({ currentUser, allUsers, onUpdateUser, onDeleteUser }) => {
    // ... handler functions remain the same
    const handleRoleChange = (userId: string, e: ChangeEvent<HTMLSelectElement>) => {
        onUpdateUser(userId, { role: e.target.value as User['role'] });
    };

    const handleStatusToggle = (user: User) => {
        const newStatus = user.status === 'active' ? 'suspended' : 'active';
        onUpdateUser(user.id, { status: newStatus });
    };

    const handleDelete = (userId: string) => {
        if (window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
            onDeleteUser(userId);
        }
    };
    return (
        <div className="bg-white border p-6 rounded-xl overflow-x-auto">
            <SectionTitle title="Manage Users" />
            <div className="min-w-full space-y-2">
                {allUsers.map(user => (
                    <div key={user.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg transition-colors ${user.status === 'suspended' ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-center mb-4 sm:mb-0">
                            <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.name} />
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.major}</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-6 w-full sm:w-auto">
                            <div className="w-32">
                                {currentUser.id === user.id ? (
                                    <span className="text-sm text-gray-600">{user.role}</span>
                                ) : (
                                    <select value={user.role} onChange={(e) => handleRoleChange(user.id, e)} className="rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm py-1">
                                        <option>Student</option>
                                        <option>Staff</option>
                                        <option>Admin</option>
                                    </select>
                                )}
                            </div>
                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {user.status || 'active'}
                            </span>
                            <div className="flex items-center space-x-2">
                                {currentUser.id !== user.id && (
                                    <>
                                        <button onClick={() => handleStatusToggle(user)} className="text-sm text-indigo-600 hover:text-indigo-900 font-semibold">{user.status === 'active' ? 'Suspend' : 'Activate'}</button>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full"><TrashIcon className="w-4 h-4"/></button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const ContentModerationTab: React.FC<AdminDashboardPageProps> = ({ allPosts, allArticles, allEvents, onDeletePost, onDeleteArticle, onDeleteEvent }) => {
    // ... state and logic remain the same
    return (
        <div className="bg-white border p-6 rounded-xl">
            <SectionTitle title="Content Moderation" />
            <p className="text-sm text-gray-500">Review and delete user-generated content across the platform.</p>
            <div className="mt-6 space-y-6">
                <ContentList items={allPosts} onDelete={onDeletePost} title="Recent Posts" />
                <ContentList items={allArticles} onDelete={onDeleteArticle} title="Recent Articles" />
                <ContentList items={allEvents} onDelete={onDeleteEvent} title="Recent Events" />
            </div>
        </div>
    )
};

const ContentList = ({ items, onDelete, title }: { items: any[], onDelete: (id: string) => void, title: string}) => (
    <div>
        <h3 className="text-md font-semibold text-gray-700 mb-2">{title}</h3>
        <div className="border rounded-lg divide-y">
            {items.slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50">
                    <div>
                        <p className="text-sm font-medium text-gray-900">{item.title || `Post by ${item.author.name}`}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{item.content || item.description}</p>
                    </div>
                    <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full"><TrashIcon className="w-4 h-4"/></button>
                </div>
            ))}
        </div>
    </div>
);

const ListingManagementTab: React.FC<AdminDashboardPageProps> = ({ allListings, onDeleteListing }) => (
    <div className="bg-white border p-6 rounded-xl">
        <SectionTitle title="Marketplace Listings" />
        <div className="space-y-2">
            {allListings.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                        <img className="h-10 w-10 rounded-md object-cover" src={item.images[0]} alt={item.name} />
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">Sold by {item.seller.name}</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <span className="text-sm font-semibold text-gray-700">${item.price.toFixed(2)}</span>
                        <button onClick={() => onDeleteListing(item.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full"><TrashIcon className="w-4 h-4"/></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const JobManagementTab: React.FC<AdminDashboardPageProps> = ({ allJobs, onDeleteJob, onOpenCreateJobModal }) => (
     <div className="bg-white border p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
            <SectionTitle title="Job Opportunities" />
            <button
                onClick={onOpenCreateJobModal}
                className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 text-sm flex items-center space-x-2"
            >
                <PlusIcon className="w-4 h-4" />
                <span>Create Job</span>
            </button>
        </div>
        <div className="space-y-2">
            {allJobs.map(job => (
                 <div key={job.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div>
                        <p className="text-sm font-medium text-gray-900">{job.title}</p>
                        <p className="text-sm text-gray-500">{job.company} - {job.location}</p>
                    </div>
                     <div className="flex items-center space-x-6">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${job.type === 'Job' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{job.type}</span>
                        <button onClick={() => onDeleteJob(job.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full"><TrashIcon className="w-4 h-4"/></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const PostManagementTab: React.FC<AdminDashboardPageProps> = (props) => {
    // ... logic remains the same ...
    const { onAdminCreatePost, heroSlides, onUpdateHeroSlide, onAddHeroSlide, onDeleteHeroSlide } = props;
    const [announcement, setAnnouncement] = useState('');
    const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
    const [editingSlideData, setEditingSlideData] = useState<HeroSlide | null>(null);
    const [newSlide, setNewSlide] = useState<HeroSlide>({ category: '', title: '', description: '', imageUrl: '' });
    const handlePostAnnouncement = async () => { if (!announcement.trim()) return; await onAdminCreatePost(announcement); setAnnouncement(''); };
    const handleAddNewSlide = async () => { if (!newSlide.category || !newSlide.title) return; await onAddHeroSlide(newSlide); setNewSlide({ category: '', title: '', description: '', imageUrl: '' }); };
    const handleDeleteSlide = (index: number) => { if (window.confirm('Are you sure you want to delete this banner post?')) { onDeleteHeroSlide(index); }};
    const handleEditSlide = (index: number) => { setEditingSlideIndex(index); setEditingSlideData(heroSlides[index]); };
    const handleSaveSlide = async () => { if (editingSlideIndex === null || !editingSlideData) return; await onUpdateHeroSlide(editingSlideIndex, editingSlideData); setEditingSlideIndex(null); setEditingSlideData(null); };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'new' | 'edit') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (type === 'new') {
                    setNewSlide(prev => ({ ...prev, imageUrl: result }));
                } else if (type === 'edit' && editingSlideData) {
                    setEditingSlideData(prev => prev ? ({ ...prev, imageUrl: result }) : null);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white border p-6 rounded-xl">
                <SectionTitle title="Create Announcement" description="Post an official announcement to the main newsfeed." />
                <div className="space-y-2">
                    <textarea value={announcement} onChange={(e) => setAnnouncement(e.target.value)} placeholder="What's the announcement?" className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" rows={3} />
                    <div className="flex justify-end">
                        <button onClick={handlePostAnnouncement} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 text-sm">Post Announcement</button>
                    </div>
                </div>
            </div>

            <div className="bg-white border p-6 rounded-xl">
                <SectionTitle title="Manage Banner Posts" description="Add, edit, or remove posts in the newsfeed hero banner." />
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-gray-800">Add New Banner Post</h4>
                    <div className="space-y-2">
                        <input type="text" placeholder="Category (e.g., Breaking News)" value={newSlide.category} onChange={(e) => setNewSlide({ ...newSlide, category: e.target.value })} className="w-full text-sm p-2 border rounded" />
                        <input type="text" placeholder="Title" value={newSlide.title} onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })} className="w-full text-sm p-2 border rounded font-semibold" />
                        <textarea placeholder="Description" value={newSlide.description} onChange={(e) => setNewSlide({ ...newSlide, description: e.target.value })} className="w-full text-sm p-2 border rounded" rows={2} />
                        <div>
                            <label className="text-xs">Image</label>
                            <input type="file" onChange={(e) => handleImageUpload(e, 'new')} accept="image/*" className="w-full text-sm p-1 border rounded bg-white" />
                            {newSlide.imageUrl && <img src={newSlide.imageUrl} alt="New slide preview" className="w-32 h-16 object-cover mt-2 rounded"/>}
                        </div>
                        <div className="flex justify-end">
                            <button onClick={handleAddNewSlide} className="bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-blue-700">Add to Banner</button>
                        </div>
                    </div>
                </div>
                <div className="space-y-4 mt-4">
                    {heroSlides.map((slide, index) => (
                         <div key={index} className="bg-gray-50 p-4 rounded-lg">
                         {editingSlideIndex === index && editingSlideData ? (
                             <div className="space-y-2">
                                 <input type="text" placeholder="Category" value={editingSlideData.category} onChange={(e) => setEditingSlideData({ ...editingSlideData, category: e.target.value })} className="w-full text-sm p-1 border rounded" />
                                 <input type="text" placeholder="Title" value={editingSlideData.title} onChange={(e) => setEditingSlideData({ ...editingSlideData, title: e.target.value })} className="w-full text-sm p-1 border rounded font-semibold" />
                                 <textarea placeholder="Description" value={editingSlideData.description} onChange={(e) => setEditingSlideData({ ...editingSlideData, description: e.target.value })} className="w-full text-sm p-1 border rounded" rows={2} />
                                 <div>
                                    <label className="text-xs">Image</label>
                                    <input type="file" onChange={(e) => handleImageUpload(e, 'edit')} accept="image/*" className="w-full text-sm p-1 border rounded bg-white" />
                                    {editingSlideData.imageUrl && <img src={editingSlideData.imageUrl} alt="Edit slide preview" className="w-32 h-16 object-cover mt-2 rounded"/>}
                                </div>
                                 <div className="flex justify-end space-x-2 mt-2">
                                     <button onClick={() => setEditingSlideIndex(null)} className="bg-gray-200 text-gray-700 text-xs font-semibold py-1 px-3 rounded-md">Cancel</button>
                                     <button onClick={handleSaveSlide} className="bg-green-600 text-white text-xs font-semibold py-1 px-3 rounded-md">Save</button>
                                 </div>
                             </div>
                         ) : (
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase text-green-600">{slide.category}</p>
                                    <h4 className="font-semibold">{slide.title}</h4>
                                    <p className="text-sm text-gray-600">{slide.description}</p>
                                </div>
                                <div className="flex space-x-2 flex-shrink-0 ml-2">
                                    <button onClick={() => handleEditSlide(index)} className="bg-green-100 text-green-700 text-xs font-semibold py-1 px-3 rounded-md">Edit</button>
                                    <button onClick={() => handleDeleteSlide(index)} className="bg-red-100 text-red-700 text-xs font-semibold py-1 px-3 rounded-md">Delete</button>
                                </div>
                            </div>
                         )}
                     </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PollManagementTab: React.FC<AdminDashboardPageProps> = ({ allPolls, onDeletePoll, onOpenCreatePollModal }) => (
    <div className="bg-white border p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
            <SectionTitle title="Manage Polls & Surveys" />
            <button
                onClick={onOpenCreatePollModal}
                className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 text-sm flex items-center space-x-2"
            >
                <PlusIcon className="w-4 h-4" />
                <span>Create Poll</span>
            </button>
        </div>
        <div className="space-y-4">
            {allPolls.map(poll => {
                const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
                return (
                    <div key={poll.id} className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-gray-800">{poll.question}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    By {poll.createdBy.name} on {poll.creationDate.toLocaleDateString()} &bull; {totalVotes} votes
                                </p>
                            </div>
                            <button onClick={() => onDeletePoll(poll.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full flex-shrink-0 ml-4">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="mt-3 space-y-2 text-sm">
                            {poll.options.map(option => {
                                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                                return (
                                    <div key={option.id}>
                                        <div className="flex justify-between items-center text-gray-700">
                                            <span>{option.text}</span>
                                            <span className="font-medium">{option.votes} ({percentage.toFixed(0)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);


const LibraryManagementTab: React.FC<AdminDashboardPageProps> = ({ allLibraryResources, onCreateLibraryResource, onUpdateLibraryResource, onDeleteLibraryResource }) => {
    const [isEditing, setIsEditing] = useState<LibraryResource | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<Omit<LibraryResource, 'id' | 'publishedDate'>>({
        title: '', author: '', category: 'Computer Science', type: 'Book', fileUrl: '', description: '', coverImageUrl: ''
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (isEditing) {
            setIsEditing(prev => prev ? { ...prev, [name]: value } : null);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (isEditing) {
                    setIsEditing(prev => prev ? { ...prev, coverImageUrl: result } : null);
                } else {
                    setFormData(prev => ({ ...prev, coverImageUrl: result }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (isEditing) {
            await onUpdateLibraryResource(isEditing.id, isEditing);
            setIsEditing(null);
        } else {
            await onCreateLibraryResource(formData);
            setFormData({ title: '', author: '', category: 'Computer Science', type: 'Book', fileUrl: '', description: '', coverImageUrl: '' });
            setIsCreating(false);
        }
    };
    
    const FormFields = ({ data, handler, fileHandler }: { data: any, handler: any, fileHandler: any }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="title" placeholder="Title" value={data.title} onChange={handler} className="w-full text-sm p-2 border rounded" required />
            <input type="text" name="author" placeholder="Author(s)" value={data.author} onChange={handler} className="w-full text-sm p-2 border rounded" required />
            <select name="type" value={data.type} onChange={handler} className="w-full text-sm p-2 border rounded bg-white">
                <option>Book</option>
                <option>Journal</option>
                <option>Paper</option>
            </select>
            <input type="text" name="category" placeholder="Category" value={data.category} onChange={handler} className="w-full text-sm p-2 border rounded" />
            <input type="text" name="fileUrl" placeholder="File URL" value={data.fileUrl} onChange={handler} className="w-full text-sm p-2 border rounded col-span-1 md:col-span-2" required />
            <div className="col-span-1 md:col-span-2">
                <label className="text-xs">Cover Image</label>
                <input type="file" name="coverImageUrl" onChange={fileHandler} className="w-full text-sm p-1 border rounded bg-white" accept="image/*"/>
                {data.coverImageUrl && <img src={data.coverImageUrl} alt="Cover" className="w-20 h-28 object-cover mt-2 rounded" />}
            </div>
            <textarea name="description" placeholder="Description" value={data.description} onChange={handler} className="w-full text-sm p-2 border rounded col-span-1 md:col-span-2" rows={3}></textarea>
        </div>
    );

    return (
         <div className="bg-white border p-6 rounded-xl">
            <SectionTitle title="Manage Library Resources" />

            {!isCreating && <button onClick={() => setIsCreating(true)} className="mb-4 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 text-sm flex items-center space-x-2"><PlusIcon className="w-4 h-4" /><span>Add New Resource</span></button>}
            
            {isCreating && (
                 <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                    <h4 className="font-semibold mb-2 text-gray-800">New Resource</h4>
                    <FormFields data={formData} handler={handleInputChange} fileHandler={handleFileChange} />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button onClick={() => setIsCreating(false)} className="bg-gray-200 text-gray-700 text-xs font-semibold py-1 px-3 rounded-md">Cancel</button>
                        <button onClick={handleSave} className="bg-green-600 text-white text-xs font-semibold py-1 px-3 rounded-md">Save</button>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                {allLibraryResources.map(item => (
                    <div key={item.id} className="p-3 rounded-lg hover:bg-gray-50">
                        {isEditing?.id === item.id ? (
                            <div>
                                <FormFields data={isEditing} handler={handleInputChange} fileHandler={handleFileChange} />
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button onClick={() => setIsEditing(null)} className="bg-gray-200 text-gray-700 text-xs font-semibold py-1 px-3 rounded-md">Cancel</button>
                                    <button onClick={handleSave} className="bg-green-600 text-white text-xs font-semibold py-1 px-3 rounded-md">Save Changes</button>
                                </div>
                            </div>
                        ) : (
                             <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img className="h-12 w-10 rounded-sm object-cover bg-gray-100" src={item.coverImageUrl || undefined} alt={item.title} />
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                        <div className="text-sm text-gray-500">{item.author} - <span className="font-semibold">{item.type}</span></div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => setIsEditing(item)} className="text-sm text-indigo-600 hover:text-indigo-900 font-semibold">Edit</button>
                                    <button onClick={() => onDeleteLibraryResource(item.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full"><TrashIcon className="w-4 h-4"/></button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
