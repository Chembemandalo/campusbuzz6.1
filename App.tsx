import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/NewsfeedPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import EventsPage from './pages/EventsPage';
import MarketplacePage from './pages/MarketplacePage';
import MentorsPage from './pages/MentorsPage';
import BlogPage from './pages/BlogPage';
import SingleArticlePage from './pages/SingleArticlePage';
import GroupsPage from './pages/GroupsPage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ClassesPage from './pages/ClassesPage';
import JobsPage from './pages/JobsPage';
import MentorDashboardPage from './pages/MentorDashboardPage';
import GalleryPage from './pages/GalleryPage';
import AuthPage from './pages/AuthPage';
import ContactPage from './pages/ContactPage';
import LostAndFoundPage from './pages/LostAndFoundPage';
import FriendsPage from './pages/FriendsPage';
import LibraryPage from './pages/LibraryPage';
import TodoListPage from './pages/TodoListPage';
import ClearancePage from './pages/ClearancePage';
import PollsPage from './pages/PollsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import SitemapPage from './pages/SitemapPage';
import AboutUsPage from './pages/AboutUsPage';
import EditPostModal from './components/EditPostModal';
import EventModal from './components/EventModal';
import NewMessageModal from './components/NewMessageModal';
import CreateEventModal from './components/CreateEventModal';
import CreateArticleModal from './components/CreateArticleModal';
import EditArticleModal from './components/EditArticleModal';
import CreateListingModal from './components/CreateListingModal';
import EditProfileModal from './components/EditProfileModal';
import ScheduleModal from './components/ScheduleModal';
import CreateJobModal from './components/CreateJobModal';
import BecomeMentorModal from './components/BecomeMentorModal';
import CreatePostModal from './components/CreatePostModal';
import CreateLostAndFoundItemModal from './components/CreateLostAndFoundItemModal';
import CreatePollModal from './components/CreatePollModal';
import LoadingSpinner from './components/LoadingSpinner';
import ToastNotification from './components/ToastNotification';
import Footer from './components/Footer';
import { mockPosts, mockConversations as initialConversations, mockUsers as initialUsers, mockNotifications as initialNotifications, mockEvents as initialEvents, mockMarketplaceItems as initialMarketplaceItems, mockFriendRequests as initialFriendRequests, mockArticles as initialArticles, mockGroups as initialGroups, mockHomePageSlides, mockSchedule as initialSchedule, mockJobs as initialJobs, mockMentorshipRequests as initialMentorshipRequests, defaultSettings, mockLostAndFoundItems, mockLibraryResources, mockTodos, mockPolls } from './data/mockData';
import { User, Post, Comment, Conversation, Message, Event, Notification, MarketplaceItem, FriendRequest, Group, Article, ReactionType, UserSettings, Page, HeroSlide, ScheduleItem, Job, MentorshipRequest, LostAndFoundItem, LibraryResource, TodoItem, TodoStatus, Poll, PollOption } from './types';

type SortOrder = 'newest' | 'oldest';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(initialMarketplaceItems);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(initialFriendRequests);
  const [sentFriendRequests, setSentFriendRequests] = useState<FriendRequest[]>([]);
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(mockHomePageSlides);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>(initialMentorshipRequests);
  const [sentMentorshipRequests, setSentMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [lostAndFoundItems, setLostAndFoundItems] = useState<LostAndFoundItem[]>(mockLostAndFoundItems);
  const [libraryResources, setLibraryResources] = useState<LibraryResource[]>(mockLibraryResources);
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos);
  const [polls, setPolls] = useState<Poll[]>(mockPolls);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hashtagFilter, setHashtagFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [isNewMessageModalOpen, setNewMessageModalOpen] = useState(false);
  const [isCreateEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [isCreateArticleModalOpen, setCreateArticleModalOpen] = useState(false);
  const [isEditArticleModalOpen, setEditArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);
  const [isCreateListingModalOpen, setCreateListingModalOpen] = useState(false);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editingScheduleItem, setEditingScheduleItem] = useState<ScheduleItem | null>(null);
  const [isCreateJobModalOpen, setCreateJobModalOpen] = useState(false);
  const [isBecomeMentorModalOpen, setBecomeMentorModalOpen] = useState(false);
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [isCreateLostFoundModalOpen, setCreateLostFoundModalOpen] = useState(false);
  const [isCreatePollModalOpen, setCreatePollModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [toastNotification, setToastNotification] = useState<Notification | null>(null);
  
  useEffect(() => {
    // Simulate initial data fetching for first app load
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);
  
  const theme = 'light'; // Forcing light theme
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.colorScheme = 'light';
  }, []);

  useEffect(() => {
    const body = document.body;
    if (currentPage === 'auth') {
      body.classList.add('auth-bg');
    } else {
      body.classList.remove('auth-bg');
    }
    return () => {
      body.classList.remove('auth-bg');
    };
  }, [currentPage]);

  const showToast = (text: string, type: Notification['type'] = 'announcement') => {
    setToastNotification({ id: `toast-${Date.now()}`, text, type, isRead: false, timestamp: 'Just now' });
  };

  const handleLogin = async (email: string, password: string): Promise<{ success: boolean, message: string }> => {
    await delay(1000);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        return { success: true, message: "Login successful!" };
    } else {
        return { success: false, message: "Invalid email or password." };
    }
  };

  const handleSignUp = async (newUserData: any): Promise<{ success: boolean, message: string }> => {
    await delay(1000);
    if (users.some(u => u.email.toLowerCase() === newUserData.email.toLowerCase())) {
        return { success: false, message: "An account with this email already exists." };
    }
    
    const currentYear = new Date().getFullYear();
    let joiningYear;
    switch(newUserData.yearOfStudy) {
        case '1st Year': joiningYear = currentYear; break;
        case '2nd Year': joiningYear = currentYear - 1; break;
        case '3rd Year': joiningYear = currentYear - 2; break;
        case '4th Year': joiningYear = currentYear - 3; break;
        default: joiningYear = currentYear;
    }

    const newUser: User = {
        id: `u${Date.now()}`,
        name: `${newUserData.firstName} ${newUserData.lastName}`,
        email: newUserData.email,
        password: newUserData.password,
        avatarUrl: 'https://picsum.photos/seed/newuser/200/200',
        coverPhotoUrl: 'https://picsum.photos/id/1040/1000/300',
        bio: 'New to Campus Buzz! Excited to connect.',
        role: 'Student',
        department: newUserData.department,
        major: newUserData.major,
        joiningYear,
        joinedDate: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        onlineStatus: 'online',
        friends: [],
        status: 'active',
        settings: defaultSettings,
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return { success: true, message: "Account created successfully!" };
  };

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('home');
  }, []);

  const handleNavigate = useCallback((page: Page, data?: User | Article) => {
    if (page === currentPage) return;

    if (page === 'auth' && currentPage !== 'auth') {
      setCurrentPage('auth');
      return;
    }

    // Special, faster transition when coming from auth to the community
    if (currentPage === 'auth' && page === 'community') {
        setCurrentPage('community');
        window.scrollTo(0, 0);
        return;
    }

    setIsPageLoading(true);
    setTimeout(() => {
        const targetPage = page;

        const protectedPages: Page[] = [
            'community', 'profile', 'chat', 'events', 'marketplace', 'mentors', 
            'blog', 'groups', 'singleArticle', 'settings', 'admin', 'classes', 
            'jobs', 'mentor-dashboard', 'gallery', 'lostandfound', 'friends', 'library', 'todolist', 'clearance', 'polls', 'about'
        ];
        
        if (protectedPages.includes(targetPage) && !isAuthenticated) {
          setCurrentPage('auth');
          setIsPageLoading(false);
          return;
        }

        setCurrentPage(targetPage);
        if (targetPage === 'profile' && data && 'role' in data) {
          setSelectedUser(data);
        } else if (targetPage === 'singleArticle' && data && 'title' in data) {
          setViewingArticle(data);
        } else {
          setSelectedUser(null);
          setViewingArticle(null);
        }
        window.scrollTo(0, 0);
        setIsPageLoading(false);
    }, 400); // Artificial delay to show loading animation
  }, [isAuthenticated, currentPage]);


  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setHashtagFilter(null);
    setCurrentPage('community');
  }, []);

  const handleHashtagClick = useCallback((tag: string) => {
    setHashtagFilter(tag);
    setSearchQuery('');
    setCurrentPage('community');
  }, []);
  
  const handleClearTextFilters = useCallback(() => {
    setSearchQuery('');
    setHashtagFilter(null);
  }, []);

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSortChange = (order: SortOrder) => { setSortOrder(order); };
  
  const handleCreatePost = useCallback(async (content: string, image: string | null) => {
    if(!currentUser) return;
    await delay(1000);
    const newPost: Post = {
      id: `p${Date.now()}`, author: currentUser, content, imageUrl: image || undefined, timestamp: 'Just now', creationDate: new Date(), likes: 0,
      reactions: { like: 0, love: 0, haha: 0, sad: 0, angry: 0 }, comments: [], shares: 0,
    };
    setPosts(prev => [newPost, ...prev]);
  }, [currentUser]);

  const handleUpdatePost = useCallback(async (postId: string, newContent: string) => {
    await delay(500);
    setPosts(posts.map(p => p.id === postId ? { ...p, content: newContent } : p));
    setEditModalOpen(false);
  }, [posts]);
  
  const handleAddComment = useCallback(async (postId: string, commentText: string) => {
    if(!currentUser) return;
    await delay(500);
    const newComment: Comment = { id: `c${Date.now()}`, author: currentUser, text: commentText, timestamp: 'Just now' };
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
  }, [posts, currentUser]);

  const handleSendMessage = useCallback(async (conversationId: string, text: string) => {
    if(!currentUser) return;
    await delay(300);
    const newMessage: Message = { id: `m${Date.now()}`, sender: currentUser, text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, messages: [...c.messages, newMessage] } : c ));
  }, [currentUser]);
  
  const handleRsvp = useCallback(async (eventId: string) => {
    if (!currentUser) return;
    await delay(500);

    setEvents(prevEvents => {
      const eventToUpdate = prevEvents.find(e => e.id === eventId);
      if (!eventToUpdate) return prevEvents;

      const isAttending = eventToUpdate.attendees.includes(currentUser.id);
      
      if (!isAttending) {
        showToast(`You are now going to "${eventToUpdate.title}"!`, 'event');
      }

      return prevEvents.map(e => {
        if (e.id === eventId) {
          const newAttendees = isAttending
            ? e.attendees.filter(id => id !== currentUser.id)
            : [...e.attendees, currentUser.id];
          return { ...e, attendees: newAttendees };
        }
        return e;
      });
    });
  }, [currentUser]);

  const handleMarkAllNotificationsRead = useCallback(() => { setNotifications(notifications.map(n => ({ ...n, isRead: true }))); }, [notifications]);

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));

    if (!notification.linkId) return;

    switch (notification.type) {
        case 'like':
        case 'comment':
        case 'post':
        case 'announcement':
            handleNavigate('community');
            break;
        case 'event':
            const event = events.find(e => e.id === notification.linkId);
            if (event) {
                setViewingEvent(event);
                setEventModalOpen(true);
            }
            break;
        case 'listing':
            handleNavigate('marketplace');
            break;
        case 'friend_request':
            handleNavigate('friends');
            break;
        case 'friend_request_accepted':
            if (notification.fromUser) {
                handleNavigate('profile', notification.fromUser);
            }
            break;
        case 'article_like':
        case 'article_comment':
            const article = articles.find(a => a.id === notification.linkId);
            if (article) {
                handleNavigate('singleArticle', article);
            }
            break;
        default:
            console.warn(`Unhandled notification type: ${notification.type}`);
    }
  };

  const handleSelectConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c ));
  }, []);

  const handleCreateConversation = useCallback(async (participants: User[]) => {
    if(!currentUser) return;
    await delay(500);
    const newConversation: Conversation = {
        id: `convo${Date.now()}`, participants: [currentUser, ...participants], isGroup: participants.length > 1,
        groupName: participants.length > 1 ? `Group with ${participants.map(p => p.name).join(', ')}` : undefined,
        messages: [], unreadCount: 0,
    };
    setConversations(prev => [newConversation, ...prev]);
    setNewMessageModalOpen(false);
    handleSelectConversation(newConversation.id);
    setCurrentPage('chat');
  }, [currentUser, handleSelectConversation]);

  const handleCreateEvent = useCallback(async (eventData: Omit<Event, 'id' | 'organizer' | 'attendees' | 'startTime' | 'endTime'> & { startTime: string, endTime: string }) => {
    if(!currentUser) return;
    await delay(1000);
    const newEvent: Event = { ...eventData, id: `e${Date.now()}`, organizer: currentUser, attendees: [currentUser.id], startTime: new Date(eventData.startTime), endTime: new Date(eventData.endTime) };
    setEvents(prev => [newEvent, ...prev]);
  }, [currentUser]);
  
  const handleSendFriendRequest = useCallback(async (userId: string) => {
    if(!currentUser) return;
    const toUser = users.find(u => u.id === userId);
    if (!toUser) return;
    await delay(500);
    const newRequest: FriendRequest = { id: `fr${Date.now()}`, fromUser: currentUser, toUser: toUser, timestamp: 'Just now', status: 'pending' };
    setSentFriendRequests(prev => [...prev, newRequest]);
  }, [currentUser, users]);

  const handleCancelFriendRequest = useCallback(async (userId: string) => {
    await delay(500);
    setSentFriendRequests(prev => prev.filter(req => req.toUser.id !== userId));
  }, []);

  const handleAcceptFriendRequest = useCallback(async (requestId: string) => {
    if(!currentUser) return;
    const request = friendRequests.find(r => r.id === requestId);
    if (!request) return;
    await delay(500);
    setUsers(prevUsers => prevUsers.map(u => {
        if (u.id === currentUser.id) return { ...u, friends: [...u.friends, request.fromUser.id] };
        if (u.id === request.fromUser.id) return { ...u, friends: [...u.friends, currentUser.id] };
        return u;
    }));
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  }, [friendRequests, currentUser]);

  const handleDeclineFriendRequest = useCallback(async (requestId: string) => {
    await delay(500);
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  }, []);
  
  const handleUnfriend = useCallback(async (userId: string) => {
    if(!currentUser || !window.confirm("Are you sure you want to unfriend this person?")) return;
    await delay(500);
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === currentUser.id) return { ...u, friends: u.friends.filter(id => id !== userId) };
      if (u.id === userId) return { ...u, friends: u.friends.filter(id => id !== currentUser.id) };
      return u;
    }));
  }, [currentUser]);
  
  const handleInitiateChat = useCallback((user: User) => {
      const existingConvo = conversations.find(c => !c.isGroup && c.participants.length === 2 && c.participants.some(p => p.id === user.id) );
      if(existingConvo) {
          handleSelectConversation(existingConvo.id);
          setCurrentPage('chat');
      } else {
          handleCreateConversation([user]);
      }
  }, [conversations, handleCreateConversation, handleSelectConversation]);

  const handleCreateListing = useCallback(async (listingData: Omit<MarketplaceItem, 'id' | 'seller' | 'ratings' | 'status'>) => {
      if(!currentUser) return;
      await delay(1000);
      const newListing: MarketplaceItem = { ...listingData, id: `mkt${Date.now()}`, seller: currentUser, ratings: [], status: 'Available' };
      setMarketplaceItems(prev => [newListing, ...prev]);
  }, [currentUser]);

  const handleUpdateListingStatus = useCallback(async (itemId: string, status: 'Available' | 'Sold') => {
    await delay(500);
    setMarketplaceItems(prev => prev.map(item => item.id === itemId ? { ...item, status } : item));
  }, []);

  const handleCreateArticle = useCallback(async (articleData: Omit<Article, 'id' | 'author' | 'timestamp' | 'creationDate' | 'views' | 'reactions' | 'comments'>) => {
    if(!currentUser) return;
    await delay(1000);
    const newArticle: Article = { ...articleData, id: `a${Date.now()}`, author: currentUser, timestamp: 'Just now', creationDate: new Date(), views: 0, reactions: { like: 0, love: 0, haha: 0, sad: 0, angry: 0 }, comments: [] };
    setArticles(prev => [newArticle, ...prev]);
  }, [currentUser]);

  const handleUpdateArticle = useCallback(async (articleId: string, updatedData: Partial<Article>) => {
    await delay(500);
    setArticles(prev => prev.map(a => a.id === articleId ? { ...a, ...updatedData } : a));
    setViewingArticle(prev => (prev && prev.id === articleId) ? { ...prev, ...updatedData } : prev);
  }, []);
  
  const handleDeleteArticle = async (articleId: string) => { setArticles(prev => prev.filter(a => a.id !== articleId)); handleNavigate('blog'); };
  const handleAddArticleComment = async (articleId: string, text: string) => { if (!currentUser) return; const newComment = { id: `c${Date.now()}`, author: currentUser, text, timestamp: 'Just now' }; setArticles(prev => prev.map(a => a.id === articleId ? { ...a, comments: [...a.comments, newComment] } : a)); setViewingArticle(prev => prev && prev.id === articleId ? { ...prev, comments: [...prev.comments, newComment] } : prev); };
  const handleReactToArticle = useCallback(async (articleId: string, reaction: ReactionType) => { await delay(300); setArticles(prev => prev.map(a => a.id === articleId ? { ...a, reactions: { ...a.reactions, [reaction]: (a.reactions[reaction] || 0) + 1 } } : a)); }, []);

  const handleUpdateSettings = useCallback(async (updatedSettings: Partial<UserSettings>) => {
    if (!currentUser) return;
    await delay(500);
    const newSettings = { ...currentUser.settings, ...updatedSettings };
    const updatedUser = { ...currentUser, settings: newSettings };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  }, [currentUser]);

  const handleCreateLostAndFoundItem = useCallback(async (itemData: Omit<LostAndFoundItem, 'id' | 'postedBy' | 'postedAt'>) => {
    if (!currentUser) return;
    await delay(1000);
    const newItem: LostAndFoundItem = {
      ...itemData,
      id: `lf${Date.now()}`,
      postedBy: currentUser,
      postedAt: new Date(),
    };
    setLostAndFoundItems(prev => [newItem, ...prev]);
  }, [currentUser]);

  const handleUpdateHeroSlide = async (index: number, slide: HeroSlide) => { await delay(300); setHeroSlides(prev => prev.map((s, i) => i === index ? slide : s)); };
  const handleAddHeroSlide = async (slide: HeroSlide) => { await delay(300); setHeroSlides(prev => [...prev, slide]); };
  const handleDeleteHeroSlide = async (index: number) => { await delay(300); setHeroSlides(prev => prev.filter((_, i) => i !== index)); };
  
  const handleCreateLibraryResource = useCallback(async (data: Omit<LibraryResource, 'id' | 'publishedDate'>) => {
    await delay(500);
    const newResource: LibraryResource = { ...data, id: `lib${Date.now()}`, publishedDate: new Date() };
    setLibraryResources(prev => [newResource, ...prev]);
  }, []);
  const handleUpdateLibraryResource = useCallback(async (id: string, data: Partial<LibraryResource>) => {
    await delay(500);
    setLibraryResources(prev => prev.map(res => res.id === id ? { ...res, ...data } : res));
  }, []);
  const handleDeleteLibraryResource = useCallback(async (id: string) => {
    await delay(500);
    setLibraryResources(prev => prev.filter(res => res.id !== id));
  }, []);

  const handleAddTask = useCallback(async (title: string) => { 
    if(!currentUser) return;
    await delay(300); 
    const newTask: TodoItem = { 
        id: `t${Date.now()}`, 
        title, 
        status: 'todo', 
        assignees: [currentUser] 
    }; 
    setTodos(prev => [newTask, ...prev]); 
  }, [currentUser]);
  const handleUpdateTodoStatus = useCallback(async (id: string, newStatus: TodoStatus) => { await delay(300); setTodos(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t)); }, []);
  const handleDeleteTodo = useCallback(async (id: string) => { await delay(300); setTodos(prev => prev.filter(t => t.id !== id)); }, []);
  
  const handleVoteOnPoll = useCallback(async (pollId: string, optionId: string) => {
    if (!currentUser) return;
    await delay(500);
    setPolls(prevPolls => prevPolls.map(poll => {
      if (poll.id === pollId && !poll.votedBy.includes(currentUser.id)) {
        return {
          ...poll,
          options: poll.options.map(option =>
            option.id === optionId ? {
                ...option,
                votes: option.votes + 1,
                voterIds: [...(option.voterIds || []), currentUser.id] 
            } : option
          ),
          votedBy: [...poll.votedBy, currentUser.id],
        };
      }
      return poll;
    }));
  }, [currentUser]);

  const handleCreatePoll = useCallback(async (question: string, options: string[]) => {
    if (!currentUser) return;
    await delay(1000);
    const newPoll: Poll = {
      id: `poll${Date.now()}`,
      question,
      options: options.map((opt, i) => ({ id: `opt${Date.now() + i}`, text: opt, votes: 0 })),
      createdBy: currentUser,
      creationDate: new Date(),
      votedBy: [],
    };
    setPolls(prev => [newPoll, ...prev]);
  }, [currentUser]);

  const handleDeletePoll = async (pollId: string) => {
    if (window.confirm("Are you sure you want to delete this poll?")) {
        await delay(500);
        setPolls(prev => prev.filter(p => p.id !== pollId));
    }
  };

  const handleUpdateProfile = useCallback(async (updatedData: Partial<User>) => { if (!currentUser) return; await delay(500); const updatedUser = { ...currentUser, ...updatedData }; setCurrentUser(updatedUser); setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u)); setEditProfileModalOpen(false); showToast('Profile updated successfully!'); }, [currentUser]);
  const handleSaveScheduleItem = useCallback(async (item: Omit<ScheduleItem, 'id'>, id?: string) => { await delay(500); if (id) { setSchedule(prev => prev.map(s => s.id === id ? { ...s, ...item } : s)); } else { const newId = `s${Date.now()}`; setSchedule(prev => [...prev, { id: newId, ...item }]); } setScheduleModalOpen(false); }, []);
  const handleDeleteScheduleItem = useCallback(async (id: string) => { await delay(500); setSchedule(prev => prev.filter(s => s.id !== id)); setScheduleModalOpen(false); }, []);
  const handleCreateJob = useCallback(async (jobData: Omit<Job, 'id' | 'postedDate' | 'applyLink'>) => { await delay(1000); const newJob: Job = { ...jobData, id: `job${Date.now()}`, postedDate: new Date(), applyLink: '#' }; setJobs(prev => [newJob, ...prev]); setCreateJobModalOpen(false); }, []);
  const handleBecomeMentor = useCallback(async (applicationData: any) => { if (!currentUser) return; await delay(1000); const updatedUser = { ...currentUser, isMentor: true, acceptingNewMentees: true, rating: { score: 0, reviews: 0 }, bio: `${currentUser.bio}\n\nMentor specializing in ${applicationData.expertise}. ${applicationData.reason}`}; setCurrentUser(updatedUser); setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u)); setBecomeMentorModalOpen(false); showToast('Congratulations! You are now a mentor.'); }, [currentUser]);
  const handleSendMentorshipRequest = useCallback(async (mentorId: string) => { if (!currentUser) return; const mentor = users.find(u => u.id === mentorId); if (!mentor || !mentor.mentorshipCommunityId) return; await delay(500); const newRequest: MentorshipRequest = { id: `mr${Date.now()}`, fromUser: currentUser, toMentor: mentor, communityId: mentor.mentorshipCommunityId, status: 'pending', timestamp: 'Just now' }; setSentMentorshipRequests(prev => [...prev, newRequest]); }, [currentUser, users]);
  const handleAcceptMentorshipRequest = useCallback(async (requestId: string) => { await delay(500); const request = mentorshipRequests.find(r => r.id === requestId); if (!request) return; setGroups(prev => prev.map(g => g.id === request.communityId ? { ...g, members: [...g.members, request.fromUser.id] } : g)); setMentorshipRequests(prev => prev.filter(r => r.id !== requestId)); }, [mentorshipRequests]);
  const handleDeclineMentorshipRequest = useCallback(async (requestId: string) => { await delay(500); setMentorshipRequests(prev => prev.filter(r => r.id !== requestId)); }, []);
  const handleCreateMentorCommunity = useCallback(async (name: string, description: string) => { if (!currentUser) return; await delay(1000); const newGroup: Group = { id: `g${Date.now()}`, name, description, avatarUrl: `https://picsum.photos/seed/mentor-${currentUser.id}/200`, members: [currentUser.id], admins: [currentUser.id]}; setGroups(prev => [...prev, newGroup]); const updatedUser = { ...currentUser, mentorshipCommunityId: newGroup.id }; setCurrentUser(updatedUser); setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u)); }, [currentUser]);
  const handleUpdateMentorSettings = useCallback(async (mentorId: string, settings: Partial<Pick<User, 'acceptingNewMentees'>>) => { if (!currentUser || currentUser.id !== mentorId) return; await delay(500); const updatedUser = { ...currentUser, ...settings }; setCurrentUser(updatedUser); setUsers(prev => prev.map(u => u.id === mentorId ? updatedUser : u)); }, [currentUser]);
  const handleRemoveMentee = useCallback(async (groupId: string, menteeId: string) => { if (!window.confirm("Are you sure you want to remove this mentee?")) return; await delay(500); setGroups(prev => prev.map(g => g.id === groupId ? { ...g, members: g.members.filter(id => id !== menteeId) } : g)); }, []);
  const handleUpdateCommunity = useCallback(async (groupId: string, details: Partial<Pick<Group, 'name' | 'description'>>) => { await delay(500); setGroups(prev => prev.map(g => g.id === groupId ? { ...g, ...details } : g)); }, []);
  const handleUpdateUser = useCallback(async (userId: string, updates: Partial<Pick<User, 'role' | 'status'>>) => { await delay(500); setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u)); }, []);
  const handleDeleteUser = useCallback(async (userId: string) => { await delay(500); setUsers(prev => prev.filter(u => u.id !== userId)); setPosts(prev => prev.filter(p => p.author.id !== userId)); setArticles(prev => prev.filter(a => a.author.id !== userId)); }, []);

  const filteredPosts = posts.filter(post => { const searchMatch = !searchQuery || post.content.toLowerCase().includes(searchQuery.toLowerCase()); const hashtagMatch = !hashtagFilter || post.content.toLowerCase().includes(`#${hashtagFilter.toLowerCase()}`); return searchMatch && hashtagMatch; }).sort((a, b) => sortOrder === 'newest' ? b.creationDate.getTime() - a.creationDate.getTime() : a.creationDate.getTime() - b.creationDate.getTime());
  const totalUnreadMessages = conversations.reduce((sum, convo) => sum + convo.unreadCount, 0);

  const renderPage = () => {
    switch (currentPage) {
      case 'community': return <CommunityPage currentUser={currentUser!} posts={filteredPosts} allUsers={users} allPosts={posts} schedule={schedule} polls={polls} heroSlides={heroSlides} onNavigate={handleNavigate} onEditPost={(post) => { setEditingPost(post); setEditModalOpen(true); }} onAddComment={handleAddComment} onCreatePost={handleCreatePost} onHashtagClick={handleHashtagClick} currentPage={currentPage} onOpenCreatePostModal={() => setCreatePostModalOpen(true)} />;
      case 'profile': return <ProfilePage user={selectedUser || currentUser!} posts={posts} currentUser={currentUser!} allUsers={users} groups={groups} sentFriendRequests={sentFriendRequests} onNavigate={handleNavigate} onEditPost={(post) => { setEditingPost(post); setEditModalOpen(true); }} onAddComment={handleAddComment} onHashtagClick={handleHashtagClick} onCreatePost={handleCreatePost} onSendFriendRequest={handleSendFriendRequest} onCancelFriendRequest={handleCancelFriendRequest} onUnfriend={handleUnfriend} onInitiateChat={handleInitiateChat} onOpenEditProfileModal={() => setEditProfileModalOpen(true)} onOpenCreateJobModal={() => setCreateJobModalOpen(true)} />;
      case 'chat': return <ChatPage conversations={conversations} currentUser={currentUser!} activeConversationId={activeConversationId} onSelectConversation={handleSelectConversation} onSendMessage={handleSendMessage} onOpenNewMessageModal={() => setNewMessageModalOpen(true)} />;
      case 'events': return <EventsPage events={events} currentUser={currentUser!} onRsvp={handleRsvp} onOpenCreateEventModal={() => setCreateEventModalOpen(true)} />;
      case 'marketplace': return <MarketplacePage items={marketplaceItems} currentUser={currentUser!} onInitiateChat={handleInitiateChat} onUpdateListingStatus={handleUpdateListingStatus} onOpenCreateListingModal={() => setCreateListingModalOpen(true)} />;
      case 'mentors': return <MentorsPage allUsers={users} currentUser={currentUser!} sentMentorshipRequests={sentMentorshipRequests} onNavigate={handleNavigate} onSendMentorshipRequest={handleSendMentorshipRequest} onOpenBecomeMentorModal={() => setBecomeMentorModalOpen(true)} />;
      case 'blog': return <BlogPage articles={articles} currentUser={currentUser!} onNavigate={handleNavigate} onOpenCreateArticleModal={() => setCreateArticleModalOpen(true)} />;
      case 'singleArticle': if (!viewingArticle) { handleNavigate('blog'); return null; } return <SingleArticlePage article={viewingArticle} currentUser={currentUser!} onNavigate={handleNavigate} onEditArticle={(article) => { setEditingArticle(article); setEditArticleModalOpen(true); }} onDeleteArticle={handleDeleteArticle} onAddComment={handleAddArticleComment} onReactToArticle={handleReactToArticle} />;
      case 'groups': return <GroupsPage groups={groups} currentUser={currentUser!} onJoinGroup={async (id) => setGroups(prev => prev.map(g => g.id === id ? { ...g, members: [...g.members, currentUser!.id] } : g))} onLeaveGroup={async (id) => setGroups(prev => prev.map(g => g.id === id ? { ...g, members: g.members.filter(mId => mId !== currentUser!.id) } : g))} />;
      case 'settings': return <SettingsPage currentUser={currentUser!} onUpdateSettings={handleUpdateSettings} />;
      case 'admin': return <AdminDashboardPage currentUser={currentUser!} allUsers={users} allPosts={posts} allArticles={articles} allEvents={events} allListings={marketplaceItems} allJobs={jobs} heroSlides={heroSlides} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} onAdminCreatePost={(content) => handleCreatePost(content, null)} onDeletePost={async (id) => setPosts(prev => prev.filter(p => p.id !== id))} onDeleteArticle={async (id) => setArticles(prev => prev.filter(a => a.id !== id))} onDeleteEvent={async (id) => setEvents(prev => prev.filter(e => e.id !== id))} onDeleteListing={async (id) => setMarketplaceItems(prev => prev.filter(i => i.id !== id))} onDeleteJob={async (id) => setJobs(prev => prev.filter(j => j.id !== id))} onOpenCreateJobModal={() => setCreateJobModalOpen(true)} onUpdateHeroSlide={handleUpdateHeroSlide} onAddHeroSlide={handleAddHeroSlide} onDeleteHeroSlide={handleDeleteHeroSlide} allLibraryResources={libraryResources} onCreateLibraryResource={handleCreateLibraryResource} onUpdateLibraryResource={handleUpdateLibraryResource} onDeleteLibraryResource={handleDeleteLibraryResource} allPolls={polls} onDeletePoll={handleDeletePoll} onOpenCreatePollModal={() => setCreatePollModalOpen(true)} />;
      case 'classes': return <ClassesPage schedule={schedule} onOpenModal={(item) => { setEditingScheduleItem(item); setScheduleModalOpen(true); }} />;
      case 'jobs': return <JobsPage jobs={jobs} currentUser={currentUser!} />;
      case 'mentor-dashboard': return <MentorDashboardPage currentUser={currentUser!} requests={mentorshipRequests} groups={groups} allUsers={users} onAccept={handleAcceptMentorshipRequest} onDecline={handleDeclineMentorshipRequest} onCreateCommunity={handleCreateMentorCommunity} onUpdateSettings={handleUpdateMentorSettings} onRemoveMentee={handleRemoveMentee} onUpdateCommunity={handleUpdateCommunity} onNavigate={handleNavigate} />;
      case 'gallery': return <GalleryPage posts={posts} events={events} onNavigate={handleNavigate} onOpenCreatePostModal={() => setCreatePostModalOpen(true)} />;
      case 'contact': return <ContactPage />;
      case 'lostandfound': return <LostAndFoundPage items={lostAndFoundItems} onOpenCreateModal={() => setCreateLostFoundModalOpen(true)} />;
      case 'friends': return <FriendsPage allUsers={users} currentUser={currentUser!} friendRequests={friendRequests} sentFriendRequests={sentFriendRequests} onNavigate={handleNavigate} onSendFriendRequest={handleSendFriendRequest} onAcceptFriendRequest={handleAcceptFriendRequest} onDeclineFriendRequest={handleDeclineFriendRequest} />;
      case 'library': return <LibraryPage resources={libraryResources} />;
      case 'todolist': return <TodoListPage todos={todos} allUsers={users} onAddTask={handleAddTask} onDeleteTodo={handleDeleteTodo} onUpdateTodoStatus={handleUpdateTodoStatus} />;
      case 'clearance': return <ClearancePage />;
      case 'polls': return <PollsPage polls={polls} currentUser={currentUser!} onVote={handleVoteOnPoll} onOpenCreatePollModal={() => setCreatePollModalOpen(true)} />;
      case 'privacy': return <PrivacyPolicyPage />;
      case 'terms': return <TermsOfServicePage />;
      case 'cookies': return <CookiePolicyPage />;
      case 'sitemap': return <SitemapPage onNavigate={handleNavigate} />;
      case 'about': return <AboutUsPage currentUser={currentUser!} onNavigate={handleNavigate} />;
      case 'home': default: return <HomePage onJoin={() => setCurrentPage('auth')} onNavigate={handleNavigate} />;
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  
  if (currentPage === 'auth') {
    return <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} onBack={() => handleNavigate('home')} onNavigate={handleNavigate} />;
  }

  return (
    <div className={`theme-${theme} font-sans flex flex-col min-h-screen`}>
        <Header currentUser={currentUser ?? undefined} onNavigate={handleNavigate} onSearch={handleSearch} totalUnreadMessages={totalUnreadMessages} notifications={notifications} onMarkAllNotificationsRead={handleMarkAllNotificationsRead} onNotificationClick={handleNotificationClick} isAuthenticated={isAuthenticated} onLogin={() => setCurrentPage('auth')} onLogout={handleLogout} currentPage={currentPage} />
        <main className="flex-grow">
          {isPageLoading ? <LoadingSpinner /> : renderPage()}
        </main>
        
        <Footer onNavigate={handleNavigate} />

        <EditPostModal isOpen={isEditModalOpen} post={editingPost} onClose={() => setEditModalOpen(false)} onSave={handleUpdatePost} />
        
        {currentUser && (
          <>
            <EventModal isOpen={isEventModalOpen} event={viewingEvent} currentUser={currentUser} onClose={() => setEventModalOpen(false)} onRsvp={handleRsvp} />
            <NewMessageModal isOpen={isNewMessageModalOpen} onClose={() => setNewMessageModalOpen(false)} currentUser={currentUser} allUsers={users} onCreateConversation={handleCreateConversation} />
            <EditProfileModal isOpen={isEditProfileModalOpen} onClose={() => setEditProfileModalOpen(false)} currentUser={currentUser} onUpdateProfile={handleUpdateProfile} />
            <CreatePostModal isOpen={isCreatePostModalOpen} onClose={() => setCreatePostModalOpen(false)} currentUser={currentUser} onCreatePost={handleCreatePost} />
            <CreateLostAndFoundItemModal isOpen={isCreateLostFoundModalOpen} onClose={() => setCreateLostFoundModalOpen(false)} onCreateItem={async (data) => { await handleCreateLostAndFoundItem(data); setCreateLostFoundModalOpen(false); }} />
            <CreatePollModal isOpen={isCreatePollModalOpen} onClose={() => setCreatePollModalOpen(false)} onCreatePoll={handleCreatePoll} />
          </>
        )}
        
        <CreateEventModal isOpen={isCreateEventModalOpen} onClose={() => setCreateEventModalOpen(false)} onCreateEvent={async (data) => { await handleCreateEvent(data); setCreateEventModalOpen(false); }} />
        <CreateArticleModal isOpen={isCreateArticleModalOpen} onClose={() => setCreateArticleModalOpen(false)} onCreateArticle={async (data) => { await handleCreateArticle(data); setCreateArticleModalOpen(false); }} />
        <EditArticleModal isOpen={isEditArticleModalOpen} article={editingArticle} onClose={() => { setEditArticleModalOpen(false); setEditingArticle(null); }} onUpdateArticle={async (id, data) => { await handleUpdateArticle(id, data); setEditArticleModalOpen(false); setEditingArticle(null); }} />
        <CreateListingModal isOpen={isCreateListingModalOpen} onClose={() => setCreateListingModalOpen(false)} onCreateListing={async (data) => { await handleCreateListing(data); setCreateListingModalOpen(false); }} />
        <ScheduleModal isOpen={isScheduleModalOpen} onClose={() => setScheduleModalOpen(false)} itemToEdit={editingScheduleItem} onSave={handleSaveScheduleItem} onDelete={handleDeleteScheduleItem} />
        <CreateJobModal isOpen={isCreateJobModalOpen} onClose={() => setCreateJobModalOpen(false)} onCreateJob={async (data) => { await handleCreateJob(data); }} />
        <BecomeMentorModal isOpen={isBecomeMentorModalOpen} onClose={() => setBecomeMentorModalOpen(false)} onSubmit={handleBecomeMentor} />
        <ToastNotification notification={toastNotification} onClose={() => setToastNotification(null)} />
    </div>
  );
};

export default App;
