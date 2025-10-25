import React from 'react';
import { Post as PostType, User, Article, Page, HeroSlide, ScheduleItem } from '../types';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import HeroSlider from '../components/HeroSlider';
import Timetable from '../components/Timetable';
import { SearchIcon } from '../components/icons';


type SortOrder = 'newest' | 'oldest';

interface NewsfeedPageProps {
  currentUser: User;
  posts: PostType[];
  allPosts: PostType[];
  allUsers: User[];
  heroSlides: HeroSlide[];
  onNavigate: (page: Page, data?: User | Article) => void;
  onEditPost: (post: PostType) => void;
  onAddComment: (postId: string, commentText: string) => Promise<void>;
  onCreatePost: (content: string, image: string | null) => Promise<void>;
  searchQuery?: string;
  hashtagFilter?: string | null;
  onHashtagClick: (tag: string) => void;
  onClearTextFilters: () => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
  currentPage: Page;
  schedule: ScheduleItem[];
}

const NewsfeedPage: React.FC<NewsfeedPageProps> = ({ 
    currentUser, 
    posts,
    allPosts,
    allUsers,
    heroSlides,
    onNavigate, 
    onEditPost, 
    onAddComment,
    onCreatePost,
    searchQuery,
    hashtagFilter,
    onHashtagClick,
    onClearTextFilters,
    sortOrder, 
    onSortChange,
    startDate,
    endDate,
    onDateRangeChange,
    currentPage,
    schedule
}) => {

    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const scheduleForToday = schedule.filter(item => item.day === todayName).sort((a, b) => a.startTime.localeCompare(b.startTime));

    const formatDateForInput = (date: Date | null) => {
        if (!date) return '';
        // Adjust for timezone offset before converting to ISO string
        const tempDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return tempDate.toISOString().split('T')[0];
    };
    
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onDateRangeChange(value ? new Date(value) : null, endDate);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onDateRangeChange(startDate, value ? new Date(value) : null);
    };

    const clearDates = () => {
        onDateRangeChange(null, null);
    };


  return (
    <div className="bg-gray-100 min-h-screen">
       {/* Search Bar Section */}
      <div className="bg-slate-100 py-8">
        {/* The search bar was here. This container is left to maintain spacing. */}
      </div>
      <HeroSlider slides={heroSlides} />
      <div className="container mx-auto px-4 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-28 space-y-6">
            <LeftSidebar currentUser={currentUser} onNavigate={onNavigate} currentPage={currentPage} />
            <Timetable onNavigate={onNavigate} scheduleForToday={scheduleForToday} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-6">
          <CreatePost currentUser={currentUser} onCreatePost={onCreatePost} />
          
          {(searchQuery || hashtagFilter) && (
            <div className="bg-white p-4 rounded-lg shadow-sm my-6 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                    {searchQuery ? 'Showing results for: ' : 'Showing posts for: '}
                    <span className="text-indigo-600 font-bold">
                        {searchQuery ? `"${searchQuery}"` : `#${hashtagFilter}`}
                    </span>
                </h2>
                <button 
                    onClick={onClearTextFilters}
                    className="text-sm font-medium text-red-600 hover:underline"
                >
                    Clear
                </button>
            </div>
          )}

          {/* Sort and Filter Bar */}
          <div className="bg-white p-3 rounded-lg shadow-sm my-6 flex flex-wrap justify-end items-center gap-x-4 gap-y-2">
             <div className="flex items-center gap-2">
                <label htmlFor="start-date" className="text-sm font-medium text-gray-700">From:</label>
                <input
                    type="date"
                    id="start-date"
                    value={formatDateForInput(startDate)}
                    onChange={handleStartDateChange}
                    className="rounded-md border-gray-300 bg-gray-50 text-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm py-1.5"
                />
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="end-date" className="text-sm font-medium text-gray-700">To:</label>
                <input
                    type="date"
                    id="end-date"
                    value={formatDateForInput(endDate)}
                    onChange={handleEndDateChange}
                    min={formatDateForInput(startDate)}
                    className="rounded-md border-gray-300 bg-gray-50 text-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm py-1.5"
                />
            </div>
            {(startDate || endDate) && (
                <button onClick={clearDates} className="text-sm font-medium text-indigo-600 hover:underline">Clear</button>
            )}
             <div>
                <label htmlFor="sort-posts" className="text-sm font-medium text-gray-700 mr-2">Sort by:</label>
                <select
                  id="sort-posts"
                  value={sortOrder}
                  onChange={(e) => onSortChange(e.target.value as SortOrder)}
                  className="rounded-md border-gray-300 bg-gray-50 text-gray-800 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm py-1.5"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
            </div>
          </div>


          <div className="space-y-6">
            {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    currentUser={currentUser}
                    onNavigate={(page, data) => onNavigate(page, data)}
                    onEdit={onEditPost}
                    onAddComment={onAddComment}
                    onHashtagClick={onHashtagClick}
                  />
                ))
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                    {searchQuery || hashtagFilter || startDate || endDate ? (
                        <p>No posts found matching your criteria.</p>
                    ) : (
                        <p>The newsfeed is empty. Be the first to share something!</p>
                    )}
                </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="lg:col-span-3">
            <RightSidebar allPosts={allPosts} allUsers={allUsers} onNavigate={onNavigate} />
        </aside>
      </div>
    </div>
  );
};

export default NewsfeedPage;