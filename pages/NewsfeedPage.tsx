import React from 'react';
import { Post as PostType, User, Article, Page, ScheduleItem, Event, HeroSlide, Poll } from '../types';
import PostCard from '../components/PostCard';
import LeftSidebar from '../components/LeftSidebar';
import { SearchIcon, ClockIcon, BookOpenIcon, ArrowRightIcon, ListBulletIcon } from '../components/icons';
import Timetable from '../components/Timetable';
import HeroSlider from '../components/HeroSlider';

interface HomePageProps {
  currentUser: User;
  posts: PostType[];
  allPosts: PostType[];
  allUsers: User[];
  schedule: ScheduleItem[];
  polls: Poll[];
  heroSlides: HeroSlide[];
  onNavigate: (page: Page, data?: User | Article) => void;
  onEditPost: (post: PostType) => void;
  onAddComment: (postId: string, commentText: string) => Promise<void>;
  onCreatePost: (content: string, image: string | null) => Promise<void>;
  onHashtagClick: (tag: string) => void;
  currentPage: Page;
  onOpenCreatePostModal: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
    currentUser, 
    posts,
    allPosts,
    schedule,
    polls,
    heroSlides,
    onNavigate, 
    onEditPost, 
    onAddComment,
    onCreatePost,
    onHashtagClick,
    currentPage,
    onOpenCreatePostModal
}) => {

    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const scheduleForToday = schedule.filter(item => item.day === todayName).sort((a, b) => a.startTime.localeCompare(b.startTime));

    // WIDGETS
    const TodoListWidget: React.FC = () => (
      <div 
        onClick={() => onNavigate('todolist')}
        className="bg-white p-6 rounded-xl shadow-sm border-2 border-indigo-400 ring-4 ring-indigo-100 h-full cursor-pointer group transform hover:-translate-y-1 transition-transform duration-300 flex flex-col"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-800">To do list</h3>
          <button 
            onClick={(e) => { e.stopPropagation(); onNavigate('todolist'); }}
            className="text-indigo-600 font-semibold text-sm hover:underline"
          >
            + Create new
          </button>
        </div>
        <div className="flex-grow">
            {scheduleForToday.length > 0 ? (
                 <ul className="space-y-3">
                    {scheduleForToday.slice(0, 2).map(item => (
                        <li key={item.id} className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                        <label className="ml-3 block text-sm text-gray-700">{item.title}</label>
                        </li>
                    ))}
                 </ul>
            ) : (
                <p className="text-sm text-gray-500">No classes scheduled for today.</p>
            )}
        </div>
         <div className="mt-auto pt-4 flex justify-between items-center text-sm font-semibold text-indigo-600">
            <span>View All Tasks</span>
            <ArrowRightIcon className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    );
    
    const CommunityFeedWidget: React.FC = () => (
        <div className="bg-white rounded-xl shadow-sm border">
            <h3 className="font-bold text-lg text-gray-800 p-6 pb-4">Community Feed</h3>
            <div className="space-y-0">
                {posts.length > 0 ? posts.map(post => (
                    <div key={post.id} className="border-t">
                        <PostCard 
                            post={post} currentUser={currentUser} onNavigate={onNavigate}
                            onEdit={onEditPost} onAddComment={onAddComment} onHashtagClick={onHashtagClick}
                        />
                    </div>
                )) : (
                    <div className="text-center py-10 text-gray-500">
                        <p>The community feed is empty. Be the first to share something!</p>
                    </div>
                )}
            </div>
        </div>
    );

    const PollsAndSurveysWidget: React.FC = () => {
        const latestPoll = polls[0];
        return (
            <div 
                onClick={() => onNavigate('polls')}
                className="bg-white p-6 rounded-xl shadow-sm border h-full cursor-pointer group transform hover:-translate-y-1 transition-transform duration-300 flex flex-col"
            >
                <h3 className="font-bold text-lg text-gray-800 mb-4">🧾 Polls &amp; Surveys</h3>
                {latestPoll ? (
                  <div className="space-y-3 flex-grow">
                      <p className="font-semibold text-gray-800 text-sm">{latestPoll.question}</p>
                      <div className="text-xs text-gray-500 space-y-2">
                        {latestPoll.options.slice(0, 2).map(opt => <p key={opt.id} className="truncate">- {opt.text}</p>)}
                        {latestPoll.options.length > 2 && <p>...and more.</p>}
                      </div>
                  </div>
                ) : (
                  <div className="flex-grow flex items-center justify-center">
                    <p className="text-sm text-gray-500">No active polls.</p>
                  </div>
                )}
                 <div className="mt-auto pt-4 flex justify-between items-center text-sm font-semibold text-indigo-600">
                    <span>Vote or Create</span>
                    <ArrowRightIcon className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        )
    };
    
  return (
    <div className="min-h-screen animate-fade-in-up">
        <div className="flex">
            <aside className="w-64 h-screen sticky top-0 hidden lg:block">
                 <LeftSidebar currentUser={currentUser} onNavigate={onNavigate} currentPage={currentPage} onOpenCreatePostModal={onOpenCreatePostModal} />
            </aside>

            <div className="flex-1 p-6 lg:p-8 bg-slate-50/50">
                {/* Main Content */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Good morning, {currentUser.name.split(' ')[0]}</h1>
                </header>

                <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                    <HeroSlider slides={heroSlides} />
                </div>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                       <TodoListWidget />
                       <PollsAndSurveysWidget />
                       <Timetable onNavigate={onNavigate} scheduleForToday={scheduleForToday} />
                    </div>
                    
                    <div className="lg:col-span-3">
                        <CommunityFeedWidget />
                    </div>

                </main>
            </div>
        </div>
    </div>
  );
};

export default HomePage;