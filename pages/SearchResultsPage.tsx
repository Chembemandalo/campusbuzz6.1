import React, { useState, useMemo } from 'react';
import { User, Post, Event, Page, Article, FriendRequest } from '../types';
import { BackButton, SearchIcon } from '../components/icons';
import UserCard from '../components/UserCard';
import PostCard from '../components/PostCard';
import EventCard from '../components/EventCard';

interface SearchResultsPageProps {
  initialQuery: string;
  allUsers: User[];
  posts: Post[];
  events: Event[];
  onNavigate: (page: Page, data?: User | Article) => void;
  handleBack: () => void;
  currentUser: User;
  onEditPost: (post: Post) => void;
  onAddComment: (postId: string, commentText: string) => Promise<void>;
  onHashtagClick: (tag: string) => void;
  onRsvp: (eventId: string) => Promise<void>;
  onSendFriendRequest: (userId: string) => void;
  sentFriendRequests: FriendRequest[];
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = (props) => {
  const { initialQuery, allUsers, posts, events, onNavigate, handleBack, currentUser, sentFriendRequests, onSendFriendRequest } = props;
  const [query, setQuery] = useState(initialQuery);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setQuery((e.target as HTMLInputElement).value);
    }
  };

  const lowercasedQuery = query.toLowerCase();

  const filteredUsers = useMemo(() => {
    if (!lowercasedQuery) return [];
    return allUsers.filter(user => user.name.toLowerCase().includes(lowercasedQuery));
  }, [allUsers, lowercasedQuery]);

  const filteredPosts = useMemo(() => {
    if (!lowercasedQuery) return [];
    return posts.filter(post => post.content.toLowerCase().includes(lowercasedQuery));
  }, [posts, lowercasedQuery]);

  const filteredEvents = useMemo(() => {
    if (!lowercasedQuery) return [];
    return events.filter(event => 
      event.title.toLowerCase().includes(lowercasedQuery) || 
      event.description.toLowerCase().includes(lowercasedQuery)
    );
  }, [events, lowercasedQuery]);

  const hasResults = filteredUsers.length > 0 || filteredPosts.length > 0 || filteredEvents.length > 0;

  const getFriendStatus = (user: User) => {
    if (currentUser.friends.includes(user.id)) return 'friend';
    if (sentFriendRequests.some(req => req.toUser.id === user.id)) return 'sent';
    return 'none';
  };
  
  const Section: React.FC<{ title: string, count: number, children: React.ReactNode }> = ({ title, count, children }) => {
    if (count === 0) return null;
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title} ({count})</h2>
        {children}
      </section>
    );
  };
  
  return (
    <div className="bg-gray-50 min-h-screen animate-fade-in-up">
      <div className="container mx-auto px-4 py-8">
        <BackButton onClick={handleBack} className="mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Search</h1>
        
        <div className="relative mb-8 max-w-2xl">
          <input
            type="search"
            placeholder="Search for people, posts, events..."
            defaultValue={query}
            onKeyDown={handleSearchKeyDown}
            className="w-full bg-white border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        </div>
        
        {query ? (
          hasResults ? (
            <div>
              <Section title="People" count={filteredUsers.length}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredUsers.map(user => (
                    <UserCard 
                        key={user.id} 
                        user={user} 
                        friendStatus={getFriendStatus(user)}
                        onNavigateToProfile={() => onNavigate('profile', user)}
                        onSendRequest={onSendFriendRequest}
                    />
                  ))}
                </div>
              </Section>
              
              <Section title="Posts" count={filteredPosts.length}>
                <div className="space-y-6">
                  {filteredPosts.map(post => <PostCard key={post.id} {...props} post={post} onEdit={props.onEditPost} />)}
                </div>
              </Section>
              
              <Section title="Events" count={filteredEvents.length}>
                <div className="space-y-6">
                  {filteredEvents.map(event => (
                    <EventCard 
                        key={event.id}
                        event={event}
                        isExpanded={expandedEventId === event.id}
                        onToggleExpand={() => setExpandedEventId(prev => prev === event.id ? null : event.id)}
                        {...props}
                    />
                  ))}
                </div>
              </Section>

            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700">No results found for "{query}"</h3>
              <p className="text-gray-500 mt-2">Try searching for something else.</p>
            </div>
          )
        ) : (
           <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700">What are you looking for?</h3>
              <p className="text-gray-500 mt-2">Search for people, posts, events, and more across Campus Buzz.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
