import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import NewsfeedPage from './pages/NewsfeedPage';
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
import LoadingSpinner from './components/LoadingSpinner';
import ToastNotification from './components/ToastNotification';
import { mockCurrentUser as staticCurrentUser, mockPosts as initialPosts, mockConversations as initialConversations, mockUsers as initialUsers, mockNotifications as initialNotifications, mockEvents as initialEvents, mockMarketplaceItems as initialMarketplaceItems, mockFriendRequests as initialFriendRequests, mockArticles as initialArticles, mockGroups as initialGroups, mockHomePageSlides, mockSchedule as initialSchedule, mockJobs as initialJobs, mockMentorshipRequests as initialMentorshipRequests } from './data/mockData';
import { User, Post, Comment, Conversation, Message, Event, Notification, MarketplaceItem, FriendRequest, Group, Article, ReactionType, UserSettings, Page, HeroSlide, ScheduleItem, Job, MentorshipRequest } from './types';

type SortOrder = 'newest' | 'oldest';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const initialHeroSlides: HeroSlide[] = [
    {
        category: 'Breaking News',
        title: 'New Engineering Complex Approved',
        description: 'The board of trustees has officially approved the construction of a state-of-the-art engineering and innovation complex, set to break ground in Fall 2025.',
        imageUrl: 'https://picsum.photos/seed/engineering-complex/1600/600'
    },
    {
        category: 'Trending',
        title: 'Annual Tech Summit Sells Out',
        description: 'This year\'s Tech Summit has broken all attendance records, featuring speakers from major industry leaders. Stay tuned for live updates.',
        imageUrl: 'https://picsum.photos/seed/tech-summit/1600/600'
    },
    {
        category: 'Sports',
        title: 'Raptors Secure Championship Title!',
        description: 'In a thrilling final match, the Rockview Raptors basketball team clinched the national championship for the first time in university history.',
        imageUrl: 'https://picsum.photos/seed/basketball-champs/1600/600'
    },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('admin');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(initialMarketplaceItems);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(initialFriendRequests);
  const [sentFriendRequests, setSentFriendRequests] = useState<FriendRequest[]>([]);
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(initialHeroSlides);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>(initialMentorshipRequests);
  const [sentMentorshipRequests, setSentMentorshipRequests] = useState<MentorshipRequest[]>([]);

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
  const [isLoading, setIsLoading] = useState(false);
  const [toastNotification, setToastNotification] = useState<Notification | null>(null);
  
  const currentUser = users.find(u => u.id === staticCurrentUser.id)!;
  const theme = 'light'; // Forcing light theme
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.colorScheme = 'light';
  }, []);

  // Real-time notification simulator
  useEffect(() => {
    if (!isAuthenticated) return;

    const intervals: number[] = [];

    // Simulate new post
    const postInterval = window.setInterval(() => {
        const randomUser = users.find(u => u.id !== currentUser.id && u.role === 'Student') || users[2];
        const newPost: Post = {
          id: `p${Date.now()}`,
          author: randomUser,
          content: `This is a new real-time post from ${randomUser.name}! Check it out. #realtime`,
          timestamp: 'Just now',
          creationDate: new Date(),
          likes: 0,
          reactions: { like: 0, love: 0, haha: 0, sad: 0, angry: 0 },
          comments: [],
          shares: 0,
        };
        setPosts(prev => [newPost, ...prev]);

        const newNotification: Notification = {
            id: `n${Date.now()}`,
            text: `${randomUser.name} just created a new post.`,
            isRead: false,
            timestamp: 'Just now',
            type: 'post',
        };
        setNotifications(prev => [newNotification, ...prev]);
        setToastNotification(newNotification);

    }, 22000); // Every 22 seconds
    intervals.push(postInterval);

    // Simulate new marketplace listing
    const listingInterval = window.setInterval(() => {
        const randomUser = users.find(u => u.id !== currentUser.id) || users[3];
        const newItem: MarketplaceItem = {
          id: `mkt${Date.now()}`,
          name: 'Vintage University Pennant',
          description: 'A cool retro pennant to show your school spirit. Great condition.',
          price: 18.00,
          category: 'Other',
          images: ['https://picsum.photos/seed/pennant/400/300'],
          seller: randomUser,
          ratings: [],
          status: 'Available',
        };
        setMarketplaceItems(prev => [newItem, ...prev]);
        
        const newNotification: Notification = {
            id: `n${Date.now()}`,
            text: `${randomUser.name} listed a new item: ${newItem.name}.`,
            isRead: false,
            timestamp: 'Just now',
            type: 'listing',
        };
        setNotifications(prev => [newNotification, ...prev]);
        setToastNotification(newNotification);

    }, 31000); // Every 31 seconds
    intervals.push(listingInterval);
    
    // Simulate new friend request
    const friendInterval = window.setInterval(() => {
        const potentialSenders = users.filter(u => u.id !== currentUser.id && !currentUser.friends.includes(u.id));
        const randomUser = potentialSenders[Math.floor(Math.random() * potentialSenders.length)] || users[1];
        if (!randomUser) return;
        
        const existingRequest = friendRequests.some(req => req.fromUser.id === randomUser.id && req.toUser.id === currentUser.id);
        if (existingRequest) return;
        
        const newFriendRequest: FriendRequest = {
            id: `fr${Date.now()}`,
            fromUser: randomUser,
            toUser: currentUser,
            timestamp: 'Just now',
            status: 'pending',
        };
        setFriendRequests(prev => [newFriendRequest, ...prev]);
        
        const newNotification: Notification = {
            id: `n${Date.now()}`,
            text: `${randomUser.name} sent you a friend request.`,
            isRead: false,
            timestamp: 'Just now',
            type: 'friend_request',
        };
        setNotifications(prev => [newNotification, ...prev]);
        setToastNotification(newNotification);
    }, 26000); // Every 26 seconds
    intervals.push(friendInterval);

    return () => {
        intervals.forEach(clearInterval);
    };
  }, [isAuthenticated, users, currentUser, friendRequests]);

  // Simulate real-time messaging
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
        if (conversations.length === 0) return;
        const randomConvoIndex = Math.floor(Math.random() * conversations.length);
        const randomConvo = conversations[randomConvoIndex];
        const otherParticipants = randomConvo.participants.filter(p => p.id !== currentUser.id);
        if (otherParticipants.length === 0) return;
        const randomSender = otherParticipants[Math.floor(Math.random() * otherParticipants.length)] || users[1];

        const newMessage: Message = {
            id: `m${Date.now()}`,
            sender: randomSender,
            text: `Hey! Just checking in. This is an automated message.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setConversations(prev => prev.map(convo => {
            if (convo.id === randomConvo.id) {
                return {
                    ...convo,
                    messages: [...convo.messages, newMessage],
                    unreadCount: convo.id === activeConversationId ? 0 : (convo.unreadCount || 0) + 1,
                };
            }
            return convo;
        }));
    }, 18000); // Every 18 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, conversations, activeConversationId, currentUser.id, users]);
  
  // Handlers
  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    await delay(1000);
    setIsAuthenticated(true);
    setCurrentPage('newsfeed');
    setIsLoading(false);
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentPage('home');
  }, []);

  const handleNavigate = useCallback((page: Page, data?: User | Article) => {
    setCurrentPage(page);
    if (page === 'profile' && data && 'role' in data) { // Type guard for User
      setSelectedUser(data);
    } else if (page === 'singleArticle' && data && 'title' in data) { // Type guard for Article
      setViewingArticle(data);
    } else {
      setSelectedUser(null);
      setViewingArticle(null);
    }
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setHashtagFilter(null); // Clear hashtag filter when searching
    setCurrentPage('newsfeed');
  }, []);

  const handleHashtagClick = useCallback((tag: string) => {
    setHashtagFilter(tag);
    setSearchQuery(''); // Clear search query when filtering by hashtag
    setCurrentPage('newsfeed');
  }, []);
  
  const handleClearTextFilters = useCallback(() => {
    setSearchQuery('');
    setHashtagFilter(null);
  }, []);

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSortChange = (order: SortOrder) => {
    setSortOrder(order);
  };
  
  const handleCreatePost = useCallback(async (content: string, image: string | null) => {
    await delay(1000); // Simulate API latency
    const newPost: Post = {
      id: `p${Date.now()}`,
      author: currentUser,
      content,
      imageUrl: image || undefined,
      timestamp: 'Just now',
      creationDate: new Date(),
      likes: 0,
      reactions: { like: 0, love: 0, haha: 0, sad: 0, angry: 0 },
      comments: [],
      shares: 0,
    };
    setPosts(prev => [newPost, ...prev]);
  }, [currentUser]);

  const handleUpdatePost = useCallback(async (postId: string, newContent: string) => {
    await delay(500);
    setPosts(posts.map(p => p.id === postId ? { ...p, content: newContent } : p));
    setEditModalOpen(false);
  }, [posts]);
  
  const handleAddComment = useCallback(async (postId: string, commentText: string) => {
    await delay(500);
    const newComment: Comment = {
      id: `c${Date.now()}`,
      author: currentUser,
      text: commentText,
      timestamp: 'Just now'
    };
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
  }, [posts, currentUser]);

  const handleSendMessage = useCallback(async (conversationId: string, text: string) => {
    await delay(300);
    const newMessage: Message = {
      id: `m${Date.now()}`,
      sender: currentUser,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setConversations(prev => prev.map(c => 
      c.id === conversationId 
      ? { ...c, messages: [...c.messages, newMessage] } 
      : c
    ));
  }, [currentUser]);
  
  const handleRsvp = useCallback(async (eventId: string) => {
    await delay(500);
    setEvents(events.map(e => {
        if (e.id === eventId) {
            const isAttending = e.attendees.includes(currentUser.id);
            const newAttendees = isAttending 
                ? e.attendees.filter(id => id !== currentUser.id)
                : [...e.attendees, currentUser.id];
            return { ...e, attendees: newAttendees };
        }
        return e;
    }));
  }, [events, currentUser.id]);

  const handleMarkAllNotificationsRead = useCallback(() => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  }, [notifications]);

  const handleSelectConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
    setConversations(prev => prev.map(c => 
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
    ));
  }, []);

  const handleCreateConversation = useCallback(async (participants: User[]) => {
    await delay(500);
    const newConversation: Conversation = {
        id: `convo${Date.now()}`,
        participants: [currentUser, ...participants],
        isGroup: participants.length > 1,
        groupName: participants.length > 1 ? `Group with ${participants.map(p => p.name).join(', ')}` : undefined,
        messages: [],
        unreadCount: 0,
    };
    setConversations(prev => [newConversation, ...prev]);
    setNewMessageModalOpen(false);
    handleSelectConversation(newConversation.id);
    setCurrentPage('chat');
  }, [currentUser, handleSelectConversation]);

  const handleCreateEvent = useCallback(async (eventData: Omit<Event, 'id' | 'organizer' | 'attendees' | 'startTime' | 'endTime'> & { startTime: string, endTime: string }) => {
    await delay(1000);
    const newEvent: Event = {
      ...eventData,
      id: `e${Date.now()}`,
      organizer: currentUser,
      attendees: [currentUser.id],
      startTime: new Date(eventData.startTime),
      endTime: new Date(eventData.endTime),
    };
    setEvents(prev => [newEvent, ...prev]);
  }, [currentUser]);
  
  const handleSendFriendRequest = useCallback(async (userId: string) => {
    const toUser = users.find(u => u.id === userId);
    if (!toUser) return;
    await delay(500);
    const newRequest: FriendRequest = {
        id: `fr${Date.now()}`,
        fromUser: currentUser,
        toUser: toUser,
        timestamp: 'Just now',
        status: 'pending'
    };
    setSentFriendRequests(prev => [...prev, newRequest]);
  }, [currentUser, users]);

  const handleCancelFriendRequest = useCallback(async (userId: string) => {
    await delay(500);
    setSentFriendRequests(prev => prev.filter(req => req.toUser.id !== userId));
  }, []);

  const handleAcceptFriendRequest = useCallback(async (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (!request) return;
    await delay(500);
    // Add to each other's friends list
    setUsers(prevUsers => prevUsers.map(u => {
        if (u.id === currentUser.id) {
            return { ...u, friends: [...u.friends, request.fromUser.id] };
        }
        if (u.id === request.fromUser.id) {
            return { ...u, friends: [...u.friends, currentUser.id] };
        }
        return u;
    }));
    // Remove the request
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  }, [friendRequests, currentUser.id]);

  const handleDeclineFriendRequest = useCallback(async (requestId: string) => {
    await delay(500);
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  }, []);
  
  const handleUnfriend = useCallback(async (userId: string) => {
    if (!window.confirm("Are you sure you want to unfriend this person?")) return;
    await delay(500);
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, friends: u.friends.filter(id => id !== userId) };
      }
      if (u.id === userId) {
        return { ...u, friends: u.friends.filter(id => id !== currentUser.id) };
      }
      return u;
    }));
  }, [currentUser.id]);
  
  const handleInitiateChat = useCallback((user: User) => {
      // Check if a conversation already exists
      const existingConvo = conversations.find(c => 
          !c.isGroup && c.participants.length === 2 && c.participants.some(p => p.id === user.id)
      );
      if(existingConvo) {
          handleSelectConversation(existingConvo.id);
          setCurrentPage('chat');
      } else {
          handleCreateConversation([user]);
      }
  }, [conversations, handleCreateConversation, handleSelectConversation]);

  const handleCreateListing = useCallback(async (listingData: Omit<MarketplaceItem, 'id' | 'seller' | 'ratings' | 'status'>) => {
      await delay(1000);
      const newListing: MarketplaceItem = {
          ...listingData,
          id: `mkt${Date.now()}`,
          seller: currentUser,
          ratings: [],
          status: 'Available',
      };
      setMarketplaceItems(prev => [newListing, ...prev]);
  }, [currentUser]);

  const handleUpdateListingStatus = useCallback(async (itemId: string, status: 'Available' | 'Sold') => {
      await delay(500);
      setMarketplaceItems(prev => prev.map(item => item.id === itemId ? { ...item, status } : item));
  }, []);
  
  const handleJoinGroup = useCallback(async (groupId: string) => {
      await delay(500);
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, members: [...g.members, currentUser.id] } : g));
  }, [currentUser.id]);

  const handleLeaveGroup = useCallback(async (groupId: string) => {
      await delay(500);
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, members: g.members.filter(id => id !== currentUser.id) } : g));
  }, [currentUser.id]);
  
  const handleCreateArticle = useCallback(async (articleData: Omit<Article, 'id' | 'author' | 'timestamp' | 'creationDate' | 'views' | 'reactions' | 'comments'>) => {
    await delay(1000);
    const newArticle: Article = {
      ...articleData,
      id: `a${Date.now()}`,
      author: currentUser,
      timestamp: 'Just now',
      creationDate: new Date(),
      views: 0,
      reactions: { like: 0, love: 0, haha: 0, sad: 0, angry: 0 },
      comments: [],
    };
    setArticles(prev => [newArticle, ...prev]);
  }, [currentUser]);

  const handleUpdateArticle = useCallback(async (articleId: string, updatedData: Partial<Article>) => {
    await delay(500);
    setArticles(prev => prev.map(a => a.id === articleId ? { ...a, ...updatedData } : a));
    setEditArticleModalOpen(false);
  }, []);
  
  const handleDeleteArticle = useCallback(async (articleId: string) => {
    await delay(500);
    setArticles(prev => prev.filter(a => a.id !== articleId));
    handleNavigate('blog');
  }, [handleNavigate]);

  const handleAddArticleComment = useCallback(async (articleId: string, commentText: string) => {
    await delay(500);
    const newComment: Comment = {
      id: `ca${Date.now()}`,
      author: currentUser,
      text: commentText,
      timestamp: 'Just now',
    };
    setArticles(prev => prev.map(a => a.id === articleId ? { ...a, comments: [...a.comments, newComment] } : a));
  }, [currentUser]);
  
  const handleReactToArticle = useCallback(async (articleId: string, reaction: ReactionType) => {
    await delay(200);
    setArticles(prev => prev.map(a => {
      if (a.id === articleId) {
        // Simplified: just toggle 'like' count for now
        const newReactions = { ...a.reactions };
        newReactions.like = a.reactions.like + 1; // In a real app, this logic would be more complex
        return { ...a, reactions: newReactions };
      }
      return a;
    }));
  }, []);
  
  const handleUpdateProfile = useCallback(async (updatedData: Partial<User>) => {
    await delay(1000);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updatedData } : u));
    setEditProfileModalOpen(false);
  }, [currentUser.id]);

  const handleUpdateSettings = useCallback(async (updatedSettings: Partial<UserSettings>) => {
    await delay(500);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, settings: { ...u.settings, ...updatedSettings } } : u));
  }, [currentUser.id]);

  const handleOpenScheduleModal = useCallback((item: ScheduleItem | null) => {
    setEditingScheduleItem(item);
    setScheduleModalOpen(true);
  }, []);

  const handleSaveScheduleItem = useCallback(async (itemData: Omit<ScheduleItem, 'id'>, id?: string) => {
    await delay(500);
    if (id) { // Editing existing item
      setSchedule(prev => prev.map(item => item.id === id ? { ...item, ...itemData } : item));
    } else { // Creating new item
      const newItem: ScheduleItem = {
        ...itemData,
        id: `s${Date.now()}`,
      };
      setSchedule(prev => [...prev, newItem]);
    }
    setScheduleModalOpen(false);
  }, []);

  const handleDeleteScheduleItem = useCallback(async (id: string) => {
    await delay(500);
    setSchedule(prev => prev.filter(item => item.id !== id));
    setScheduleModalOpen(false);
  }, []);

  const handleCreateJob = useCallback(async (jobData: Omit<Job, 'id' | 'postedDate' | 'applyLink'>) => {
    await delay(1000);
    const newJob: Job = {
        ...jobData,
        id: `job${Date.now()}`,
        postedDate: new Date(),
        applyLink: '#', // Placeholder
    };
    setJobs(prev => [newJob, ...prev]);
    setCreateJobModalOpen(false);
  }, []);
  
  const handleApplyForMentorship = useCallback(async (applicationData: any) => {
    await delay(1000);
    console.log("Mentorship Application Submitted:", applicationData);
    alert('Your application to become a mentor has been submitted for review!');
    setBecomeMentorModalOpen(false);
  }, []);

  const handleSendMentorshipRequest = useCallback(async (mentorId: string) => {
    const mentor = users.find(u => u.id === mentorId);
    if (!mentor || !mentor.mentorshipCommunityId) {
      alert('This mentor is not accepting requests at this time.');
      return;
    }
    await delay(500);
    const newRequest: MentorshipRequest = {
      id: `mr${Date.now()}`,
      fromUser: currentUser,
      toMentor: mentor,
      communityId: mentor.mentorshipCommunityId,
      status: 'pending',
      timestamp: 'Just now',
    };
    setSentMentorshipRequests(prev => [...prev, newRequest]);
    // Also add to the mentor's received requests
    setMentorshipRequests(prev => [...prev, newRequest]);
    alert(`Your request to join ${mentor.name}'s mentorship community has been sent!`);
  }, [currentUser, users]);

  const handleAcceptMentorshipRequest = useCallback(async (requestId: string) => {
    const request = mentorshipRequests.find(r => r.id === requestId);
    if (!request) return;
    await delay(500);
    // Add user to the community group
    setGroups(prev => prev.map(g => 
      g.id === request.communityId 
      ? { ...g, members: [...g.members, request.fromUser.id] } 
      : g
    ));
    // Update request status
    setMentorshipRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r));
  }, [mentorshipRequests]);

  const handleDeclineMentorshipRequest = useCallback(async (requestId: string) => {
    await delay(500);
    setMentorshipRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
  }, []);
  
  const handleCreateMentorshipCommunity = useCallback(async (name: string, description: string) => {
    await delay(1000);
    const newCommunity: Group = {
      id: `g${Date.now()}`,
      name,
      description,
      avatarUrl: `https://picsum.photos/seed/${name.replace(/\s+/g, '-')}/200`,
      members: [currentUser.id],
      admins: [currentUser.id],
    };
    setGroups(prev => [...prev, newCommunity]);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, mentorshipCommunityId: newCommunity.id } : u));
  }, [currentUser]);

  const handleUpdateMentorSettings = useCallback(async (mentorId: string, settings: Partial<Pick<User, 'acceptingNewMentees'>>) => {
    await delay(500);
    setUsers(prev => prev.map(u => u.id === mentorId ? { ...u, ...settings } : u));
  }, []);

  const handleRemoveMenteeFromGroup = useCallback(async (groupId: string, menteeId: string) => {
    if (!window.confirm("Are you sure you want to remove this mentee from your community?")) return;
    await delay(500);
    setGroups(prev => prev.map(g => 
        g.id === groupId 
        ? { ...g, members: g.members.filter(id => id !== menteeId) } 
        : g
    ));
  }, []);

  const handleUpdateGroupDetails = useCallback(async (groupId: string, details: Partial<Pick<Group, 'name' | 'description'>>) => {
    await delay(500);
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, ...details } : g));
  }, []);

  // Admin Handlers
  const handleAdminUpdateUser = useCallback(async (userId: string, updates: Partial<Pick<User, 'role' | 'status'>>) => {
    await delay(500);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  }, []);

  const handleAdminDeleteUser = useCallback(async (userId: string) => {
    await delay(500);
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const handleAdminCreatePost = useCallback(async (content: string) => {
    await delay(500);
    const newPost: Post = {
      id: `p${Date.now()}`,
      author: currentUser,
      content,
      timestamp: 'Just now',
      creationDate: new Date(),
      likes: 0,
      reactions: { like: 0, love: 0, haha: 0, sad: 0, angry: 0 },
      comments: [],
      shares: 0,
    };
    setPosts(prev => [newPost, ...prev]);
  }, [currentUser]);

  const handleAdminDeletePost = useCallback(async (postId: string) => {
    await delay(500);
    setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);
  
  const handleAdminDeleteEvent = useCallback(async (eventId: string) => {
    await delay(500);
    setEvents(prev => prev.filter(e => e.id !== eventId));
  }, []);

  const handleAdminDeleteListing = useCallback(async (listingId: string) => {
    await delay(500);
    setMarketplaceItems(prev => prev.filter(item => item.id !== listingId));
  }, []);
  
  const handleAdminDeleteJob = useCallback(async (jobId: string) => {
    await delay(500);
    setJobs(prev => prev.filter(j => j.id !== jobId));
  }, []);

  const handleUpdateHeroSlide = useCallback(async (slideIndex: number, updatedSlide: HeroSlide) => {
    await delay(500);
    setHeroSlides(prev => prev.map((slide, index) => index === slideIndex ? updatedSlide : slide));
  }, []);
  
  const handleAdminAddHeroSlide = useCallback(async (newSlide: HeroSlide) => {
    await delay(500);
    setHeroSlides(prev => [...prev, newSlide]);
  }, []);

  const handleAdminDeleteHeroSlide = useCallback(async (slideIndex: number) => {
    await delay(500);
    setHeroSlides(prev => prev.filter((_, index) => index !== slideIndex));
  }, []);

  // Modal Openers
  const openEditModal = useCallback((post: Post) => {
    setEditingPost(post);
    setEditModalOpen(true);
  }, []);
  
  const openEventModal = useCallback((event: Event) => {
    setViewingEvent(event);
    setEventModalOpen(true);
  }, []);

  const openEditArticleModal = useCallback((article: Article) => {
    setEditingArticle(article);
    setEditArticleModalOpen(true);
  }, []);
  
  const totalUnreadMessages = conversations.reduce((acc, convo) => acc + (convo.unreadCount || 0), 0);

  // Filtering and sorting logic for Newsfeed
  const filteredAndSortedPosts = posts
    .filter(post => {
      // Date filtering
      const postDate = post.creationDate;
      const startMatch = !startDate || postDate >= startDate;
      const endMatch = !endDate || postDate <= new Date(endDate.getTime() + 24 * 60 * 60 * 1000 - 1); // include the whole end day

      // Text filtering
      const textMatch = !searchQuery && !hashtagFilter
        ? true
        : searchQuery
          ? post.content.toLowerCase().includes(searchQuery.toLowerCase()) || post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
          : post.content.toLowerCase().includes(`#${hashtagFilter?.toLowerCase()}`);

      return startMatch && endMatch && textMatch;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.creationDate.getTime() - a.creationDate.getTime();
      }
      return a.creationDate.getTime() - b.creationDate.getTime();
    });

  const renderPage = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (!isAuthenticated) {
      return <HomePage onJoin={handleLogin} slides={mockHomePageSlides} onNavigate={handleNavigate} />;
    }
    switch (currentPage) {
      case 'home':
      case 'newsfeed':
        return <NewsfeedPage 
                  currentUser={currentUser} 
                  posts={filteredAndSortedPosts}
                  allPosts={posts}
                  allUsers={users}
                  heroSlides={heroSlides}
                  onNavigate={handleNavigate} 
                  onEditPost={openEditModal} 
                  onAddComment={handleAddComment}
                  onCreatePost={handleCreatePost}
                  searchQuery={searchQuery}
                  hashtagFilter={hashtagFilter}
                  onHashtagClick={handleHashtagClick}
                  onClearTextFilters={handleClearTextFilters}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  startDate={startDate}
                  endDate={endDate}
                  onDateRangeChange={handleDateRangeChange}
                  currentPage={currentPage}
                  schedule={schedule}
                />;
      case 'profile':
        if (selectedUser) {
          return <ProfilePage 
                    user={selectedUser} 
                    posts={posts} 
                    currentUser={currentUser}
                    allUsers={users}
                    groups={groups}
                    sentFriendRequests={sentFriendRequests}
                    onNavigate={handleNavigate}
                    onEditPost={openEditModal}
                    onAddComment={handleAddComment}
                    onHashtagClick={handleHashtagClick}
                    onCreatePost={handleCreatePost}
                    onSendFriendRequest={handleSendFriendRequest}
                    onCancelFriendRequest={handleCancelFriendRequest}
                    onUnfriend={handleUnfriend}
                    onInitiateChat={handleInitiateChat}
                    onOpenEditProfileModal={() => setEditProfileModalOpen(true)}
                    onOpenCreateJobModal={() => setCreateJobModalOpen(true)}
                  />;
        }
        return <NewsfeedPage currentUser={currentUser} posts={posts} allPosts={posts} allUsers={users} heroSlides={heroSlides} onNavigate={handleNavigate} onEditPost={openEditModal} onAddComment={handleAddComment} onCreatePost={handleCreatePost} onHashtagClick={handleHashtagClick} onClearTextFilters={handleClearTextFilters} sortOrder={sortOrder} onSortChange={handleSortChange} startDate={startDate} endDate={endDate} onDateRangeChange={handleDateRangeChange} currentPage={currentPage} schedule={schedule} />; // Fallback
      case 'chat':
        return <ChatPage 
                  conversations={conversations} 
                  currentUser={currentUser}
                  activeConversationId={activeConversationId}
                  onSelectConversation={handleSelectConversation}
                  onSendMessage={handleSendMessage}
                  onOpenNewMessageModal={() => setNewMessageModalOpen(true)}
                />;
      case 'events':
        return <EventsPage events={events} onViewDetails={openEventModal} onOpenCreateEventModal={() => setCreateEventModalOpen(true)} />;
      case 'marketplace':
        return <MarketplacePage items={marketplaceItems} currentUser={currentUser} onInitiateChat={handleInitiateChat} onUpdateListingStatus={handleUpdateListingStatus} onOpenCreateListingModal={() => setCreateListingModalOpen(true)} />;
      case 'mentors':
        return <MentorsPage 
                  allUsers={users} 
                  currentUser={currentUser} 
                  sentMentorshipRequests={sentMentorshipRequests}
                  onNavigate={handleNavigate}
                  onSendMentorshipRequest={handleSendMentorshipRequest}
                  onOpenBecomeMentorModal={() => setBecomeMentorModalOpen(true)}
                 />;
      case 'blog':
        return <BlogPage articles={articles} currentUser={currentUser} onNavigate={handleNavigate} onOpenCreateArticleModal={() => setCreateArticleModalOpen(true)} />;
      case 'singleArticle':
        if (viewingArticle) {
          return <SingleArticlePage 
                    article={viewingArticle} 
                    currentUser={currentUser}
                    onNavigate={handleNavigate} 
                    onEditArticle={openEditArticleModal}
                    onDeleteArticle={handleDeleteArticle}
                    onAddComment={handleAddArticleComment}
                    onReactToArticle={handleReactToArticle}
                   />;
        }
        return <BlogPage articles={articles} currentUser={currentUser} onNavigate={handleNavigate} onOpenCreateArticleModal={() => setCreateArticleModalOpen(true)} />; // Fallback
      case 'gallery':
        return <GalleryPage 
                posts={posts} 
                events={events} 
                onNavigate={handleNavigate}
                onOpenCreatePostModal={() => setCreatePostModalOpen(true)}
               />;
      case 'groups':
        return <GroupsPage groups={groups} currentUser={currentUser} onJoinGroup={handleJoinGroup} onLeaveGroup={handleLeaveGroup} />;
      case 'settings':
        return <SettingsPage currentUser={currentUser} onUpdateSettings={handleUpdateSettings} />;
      case 'admin':
        return <AdminDashboardPage 
                    currentUser={currentUser}
                    allUsers={users}
                    allPosts={posts}
                    allArticles={articles}
                    allEvents={events}
                    allListings={marketplaceItems}
                    allJobs={jobs}
                    heroSlides={heroSlides}
                    onUpdateUser={handleAdminUpdateUser}
                    onDeleteUser={handleAdminDeleteUser}
                    onAdminCreatePost={handleAdminCreatePost}
                    onDeletePost={handleAdminDeletePost}
                    onDeleteArticle={handleDeleteArticle}
                    onDeleteEvent={handleAdminDeleteEvent}
                    onDeleteListing={handleAdminDeleteListing}
                    onDeleteJob={handleAdminDeleteJob}
                    onOpenCreateJobModal={() => setCreateJobModalOpen(true)}
                    onUpdateHeroSlide={handleUpdateHeroSlide}
                    onAddHeroSlide={handleAdminAddHeroSlide}
                    onDeleteHeroSlide={handleAdminDeleteHeroSlide}
                />;
       case 'classes':
        return <ClassesPage schedule={schedule} onOpenModal={handleOpenScheduleModal} />;
       case 'jobs':
        return <JobsPage jobs={jobs} currentUser={currentUser} />;
       case 'mentor-dashboard':
        return <MentorDashboardPage 
                  currentUser={currentUser}
                  requests={mentorshipRequests.filter(r => r.toMentor.id === currentUser.id)}
                  groups={groups}
                  allUsers={users}
                  onAccept={handleAcceptMentorshipRequest}
                  onDecline={handleDeclineMentorshipRequest}
                  onCreateCommunity={handleCreateMentorshipCommunity}
                  onUpdateSettings={handleUpdateMentorSettings}
                  onRemoveMentee={handleRemoveMenteeFromGroup}
                  onUpdateCommunity={handleUpdateGroupDetails}
                  onNavigate={handleNavigate}
                />;
      default:
        return <HomePage onJoin={handleLogin} slides={mockHomePageSlides} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className={`font-sans ${theme}`}>
      <Header
        currentUser={currentUser}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        totalUnreadMessages={totalUnreadMessages}
        notifications={notifications}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
        currentPage={currentPage}
      />
      <main>
        {renderPage()}
      </main>
      
      {/* Modals */}
      <EditPostModal
        post={editingPost}
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleUpdatePost}
      />
      <EventModal
        event={viewingEvent}
        isOpen={isEventModalOpen}
        currentUser={currentUser}
        onClose={() => setEventModalOpen(false)}
        onRsvp={handleRsvp}
      />
      <NewMessageModal
        isOpen={isNewMessageModalOpen}
        onClose={() => setNewMessageModalOpen(false)}
        currentUser={currentUser}
        allUsers={users}
        onCreateConversation={handleCreateConversation}
      />
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setCreateEventModalOpen(false)}
        onCreateEvent={handleCreateEvent}
      />
      <CreateArticleModal
        isOpen={isCreateArticleModalOpen}
        onClose={() => setCreateArticleModalOpen(false)}
        onCreateArticle={handleCreateArticle}
      />
      <EditArticleModal
        isOpen={isEditArticleModalOpen}
        article={editingArticle}
        onClose={() => setEditArticleModalOpen(false)}
        onUpdateArticle={handleUpdateArticle}
      />
      <CreateListingModal
        isOpen={isCreateListingModalOpen}
        onClose={() => setCreateListingModalOpen(false)}
        onCreateListing={handleCreateListing}
      />
       <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
      />
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        itemToEdit={editingScheduleItem}
        onSave={handleSaveScheduleItem}
        onDelete={handleDeleteScheduleItem}
      />
      <CreateJobModal
        isOpen={isCreateJobModalOpen}
        onClose={() => setCreateJobModalOpen(false)}
        onCreateJob={handleCreateJob}
      />
      <BecomeMentorModal
        isOpen={isBecomeMentorModalOpen}
        onClose={() => setBecomeMentorModalOpen(false)}
        onSubmit={handleApplyForMentorship}
      />
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setCreatePostModalOpen(false)}
        currentUser={currentUser}
        onCreatePost={handleCreatePost}
      />

      <ToastNotification 
        notification={toastNotification}
        onClose={() => setToastNotification(null)}
      />
    </div>
  );
};

export default App;