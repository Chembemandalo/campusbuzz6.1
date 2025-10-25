export type Page = 'home' | 'newsfeed' | 'profile' | 'chat' | 'events' | 'marketplace' | 'mentors' | 'blog' | 'groups' | 'singleArticle' | 'settings' | 'admin' | 'classes' | 'jobs' | 'mentor-dashboard' | 'gallery';

export type ReactionType = 'like' | 'love' | 'haha' | 'sad' | 'angry';

export interface UserSettings {
  theme: 'light' | 'dark';
  language: 'en-US' | 'es-ES' | 'fr-FR';
  timezone: string;
  profileVisibility: 'public' | 'friends';
  allowFriendRequests: 'everyone' | 'friendsOfFriends';
  allowSearchIndexing: boolean;
  notifications: {
    newPost: boolean;
    newFriendRequest: boolean;
    commentOnPost: boolean;
    eventReminder: boolean;
    marketplaceUpdate: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  coverPhotoUrl: string;
  bio: string;
  role: 'Student' | 'Staff' | 'Admin';
  department: string;
  major: string;
  joinedDate: string;
  onlineStatus: 'online' | 'offline';
  friends: string[]; // Array of user IDs
  status?: 'active' | 'suspended';
  settings: UserSettings;
  // Mentor-specific fields
  isMentor?: boolean;
  mentorshipCommunityId?: string;
  acceptingNewMentees?: boolean;
  rating?: {
    score: number;
    reviews: number;
  };
  institute?: string;
  joiningYear?: number;
  passingYear?: number;
  sessionFee?: number; // 0 for free
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  timestamp: string;
  creationDate: Date;
  likes: number; // Represents total reactions
  reactions: {
    like: number;
    love: number;
    haha: number;
    sad: number;
    angry: number;
  };
  comments: Comment[];
  shares: number;
  eventId?: string; // Optional: Link post to an event
}

export interface Notification {
  id: string;
  text: string;
  isRead: boolean;
  timestamp: string;
  type: 'like' | 'comment' | 'event' | 'announcement' | 'post' | 'listing' | 'friend_request' | 'friend_request_accepted' | 'article_like' | 'article_comment';
}

export interface Message {
  id: string;
  sender: User;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id:string;
  participants: User[];
  messages: Message[];
  isGroup: boolean;
  groupName?: string;
  unreadCount: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  startTime: Date;
  endTime: Date;
  organizer: User;
  attendees: string[]; // Array of user IDs
}

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Textbooks' | 'Electronics' | 'Furniture' | 'Clothing' | 'Other';
  images: string[];
  seller: User;
  ratings: number[]; // Array of ratings from 1-5
  status: 'Available' | 'Sold';
}

export interface Article {
  id: string;
  author: User;
  title: string;
  content: string;
  category: string;
  status: 'published' | 'draft';
  imageUrl?: string;
  timestamp: string;
  creationDate: Date;
  views: number;
  reactions: {
    like: number;
    love: number;
    haha: number;
    sad: number;
    angry: number;
  };
  comments: Comment[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  members: string[]; // array of user IDs
  admins: string[]; // array of user IDs
}

export interface FriendRequest {
    id: string;
    fromUser: User;
    toUser: User;
    timestamp: string;
    status: 'pending' | 'accepted' | 'rejected';
}

export interface HeroSlide {
  category: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // "HH:MM" format
  endTime: string;   // "HH:MM" format
  venue: string;
  color: string; // e.g., 'bg-blue-200'
}

export interface Job {
    id: string;
    type: 'Job' | 'Internship';
    title: string;
    company: string;
    location: string;
    postedDate: Date;
    description: string;
    applyLink: string;
}

export interface MentorshipRequest {
  id: string;
  fromUser: User;
  toMentor: User;
  communityId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}