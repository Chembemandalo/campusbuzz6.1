import { User, Post, Notification, Conversation, Event, MarketplaceItem, Article, Group, FriendRequest, UserSettings, HeroSlide, ScheduleItem, Job, MentorshipRequest, LostAndFoundItem, LibraryResource, TodoItem, Poll } from '../types';

// FIX: Export defaultSettings to make it available for import.
export const defaultSettings: UserSettings = {
  theme: 'light',
  language: 'en-US',
  timezone: 'America/New_York',
  profileVisibility: 'public',
  allowFriendRequests: 'everyone',
  allowSearchIndexing: true,
  notifications: {
    newPost: true,
    newFriendRequest: true,
    commentOnPost: true,
    eventReminder: true,
    marketplaceUpdate: true,
  }
};

export const mockHomePageSlides: HeroSlide[] = [
    {
        category: 'Campus Life',
        title: 'Discover Your Community at Rockview',
        description: 'Explore clubs, events, and opportunities that make our campus vibrant and exciting. Find your passion and connect with like-minded peers.',
        imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop'
    },
    {
        category: 'Academics',
        title: 'Excellence in Education & Research',
        description: 'Our world-class faculty and state-of-the-art facilities are here to support your academic journey and push the boundaries of knowledge.',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop'
    },
    {
        category: 'Innovation',
        title: 'Building the Future, Today',
        description: 'From groundbreaking startups to cutting-edge research projects, see how Rockview students and faculty are shaping the world of tomorrow.',
        imageUrl: 'https://images.unsplash.com/photo-1581093458791-9a6685c2e5b3?q=80&w=2070&auto=format&fit=crop'
    }
];


export const mockUsers: User[] = [
  { id: 'u1', name: 'Jane Doe', email: 'jane.doe@rockview.edu', password: 'password', avatarUrl: 'https://picsum.photos/id/237/200/200', coverPhotoUrl: 'https://picsum.photos/id/1015/1000/300', bio: 'CS student passionate about AI and web development. 🚀 As a mentor, I focus on helping students navigate their early careers in tech, offering guidance on projects, internships, and interview preparation.', role: 'Student', department: 'Computer Science', major: 'Artificial Intelligence', joinedDate: 'August 2022', onlineStatus: 'online', friends: ['u3', 'u4'], status: 'active', settings: defaultSettings, isMentor: true, mentorshipCommunityId: 'g5', acceptingNewMentees: true, rating: { score: 4.9, reviews: 137 }, institute: 'Rockview University', joiningYear: 2022, passingYear: 2026, sessionFee: 15 },
  { id: 'u2', name: 'Daniel chembe', email: 'admin@gmail.com', password: 'admin123', avatarUrl: 'https://picsum.photos/id/238/200/200', coverPhotoUrl: 'https://picsum.photos/id/1016/1000/300', bio: 'University Administrator | Keeping things running smoothly.', role: 'Admin', department: 'Engineering', major: 'Mechanical Engineering', joinedDate: 'July 2018', onlineStatus: 'offline', friends: [], status: 'active', settings: { ...defaultSettings, theme: 'light' }, rating: { score: 4.8, reviews: 98 }, institute: 'Rockview University', joiningYear: 2010, passingYear: 2014, sessionFee: 0 },
  { id: 'u3', name: 'Alice Johnson', email: 'alice.j@rockview.edu', password: 'password', avatarUrl: 'https://picsum.photos/id/239/200/200', coverPhotoUrl: 'https://picsum.photos/id/1018/1000/300', bio: 'Art major with a love for photography and design.', role: 'Student', department: 'Arts & Humanities', major: 'Fine Arts', joinedDate: 'September 2021', onlineStatus: 'online', friends: ['u1'], status: 'active', settings: defaultSettings, rating: { score: 4.4, reviews: 25 }, institute: 'Rockview University', joiningYear: 2021, passingYear: 2025, sessionFee: 0 },
  { id: 'u4', name: 'Robert Brown', email: 'rob.brown@rockview.edu', password: 'password', avatarUrl: 'https://picsum.photos/id/240/200/200', coverPhotoUrl: 'https://picsum.photos/id/1019/1000/300', bio: 'Future software engineer. Currently learning React.', role: 'Student', department: 'Computer Science', major: 'Software Engineering', joinedDate: 'August 2022', onlineStatus: 'offline', friends: ['u1'], status: 'suspended', settings: defaultSettings, rating: { score: 4.5, reviews: 112 }, institute: 'Rockview University', joiningYear: 2022, passingYear: 2026, sessionFee: 20 },
  { id: 'u5', name: 'Emily White', email: 'emily.w@rockview.edu', password: 'password', avatarUrl: 'https://picsum.photos/id/241/200/200', coverPhotoUrl: 'https://picsum.photos/id/1020/1000/300', bio: 'Biology student exploring the wonders of the natural world.', role: 'Student', department: 'Biology', major: 'Molecular Biology', joinedDate: 'August 2023', onlineStatus: 'online', friends: [], status: 'active', settings: defaultSettings, rating: { score: 4.7, reviews: 56 }, institute: 'Rockview University', joiningYear: 2023, passingYear: 2027, sessionFee: 10 },
  { id: 'u6', name: 'Michael Green', email: 'michael.g@rockview.edu', password: 'password', avatarUrl: 'https://picsum.photos/id/242/200/200', coverPhotoUrl: 'https://picsum.photos/id/1021/1000/300', bio: 'Helping prospective students find their home at Rockview! With years of experience in university admissions, I mentor students on application strategies and personal statement writing.', role: 'Staff', department: 'Admissions', major: 'N/A', joinedDate: 'March 2020', onlineStatus: 'online', friends: [], status: 'active', settings: defaultSettings, isMentor: true, mentorshipCommunityId: 'g6', acceptingNewMentees: true, rating: { score: 4.9, reviews: 210 }, institute: 'Rockview University Staff', sessionFee: 0 },
];

export const mockCurrentUser: User = mockUsers[0];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    author: mockUsers[0],
    content: 'Just finished my final project for the semester! So relieved. Shoutout to everyone in the library working late!',
    imageUrl: 'https://picsum.photos/id/101/800/600',
    timestamp: '2 hours ago',
    creationDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 125,
    reactions: { like: 75, love: 40, haha: 8, sad: 1, angry: 1 },
    comments: [
      { id: 'c1', author: mockUsers[1], text: 'Congratulations!', timestamp: '1 hour ago' },
      { id: 'c2', author: mockUsers[2], text: 'Awesome work! Time to celebrate!', timestamp: '30 mins ago' },
    ],
    shares: 12,
    eventId: 'e1'
  },
  {
    id: 'p2',
    author: mockUsers[1],
    content: 'Reminder to all staff: The quarterly department meeting is scheduled for this Friday at 10 AM in the main conference hall. Please confirm your attendance.',
    timestamp: '1 day ago',
    creationDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 34,
    reactions: { like: 30, love: 2, haha: 2, sad: 0, angry: 0 },
    comments: [
       { id: 'c3', author: mockUsers[5], text: 'Will be there.', timestamp: '22 hours ago' },
    ],
    shares: 2,
  },
];

export const mockNotifications: Notification[] = [
    { id: 'n1', recipientId: 'u1', text: 'Alice Johnson commented on your post.', isRead: false, timestamp: '15 mins ago', type: 'comment', linkId: 'p1', fromUser: mockUsers[2] },
    { id: 'n2', recipientId: 'u1', text: 'A new event "Tech Conference 2024" has been announced.', isRead: false, timestamp: '1 hour ago', type: 'event', linkId: 'e1' },
    { id: 'n3', recipientId: 'u1', text: 'Robert Brown sent you a friend request.', isRead: true, timestamp: '3 hours ago', type: 'friend_request', fromUser: mockUsers[3] },
    { id: 'n4', recipientId: 'u1', text: 'Your listing for "Used Calculus Textbook" has been sold.', isRead: true, timestamp: '1 day ago', type: 'listing' },
];

export const mockConversations: Conversation[] = [
    {
        id: 'convo1',
        participants: [mockUsers[0], mockUsers[2]],
        isGroup: false,
        messages: [
            { id: 'm1', sender: mockUsers[2], text: 'Hey, did you see the announcement about the design competition?', timestamp: '10:30 AM' },
            { id: 'm2', sender: mockUsers[0], text: 'Oh, no I missed it! Sounds cool. Where can I find the details?', timestamp: '10:31 AM' },
        ],
        unreadCount: 0,
    },
     {
        id: 'convo2',
        participants: [mockUsers[0], mockUsers[3]],
        isGroup: false,
        messages: [
            { id: 'm3', sender: mockUsers[3], text: 'Are you going to the library later?', timestamp: 'Yesterday' },
        ],
        unreadCount: 1,
    },
    {
        id: 'convo3',
        participants: [mockUsers[0], mockUsers[2], mockUsers[3]],
        isGroup: true,
        groupName: 'Final Project Group',
        messages: [
             { id: 'm4', sender: mockUsers[2], text: 'Let\'s meet tomorrow to finalize the presentation slides.', timestamp: '9:15 AM' },
        ],
        unreadCount: 2,
    }
];

export const mockEvents: Event[] = [
    {
        id: 'e1',
        title: 'Tech Conference 2024',
        description: 'Join us for the annual tech conference featuring guest speakers from major tech companies. A great opportunity for networking and learning about the latest trends.',
        imageUrl: 'https://picsum.photos/seed/tech-conf/1200/600',
        startTime: new Date('2025-10-31T09:00:00'),
        endTime: new Date('2025-10-31T17:00:00'),
        organizer: mockUsers[1],
        attendees: ['u1', 'u3', 'u4', 'u5'],
        location: 'Main Auditorium, Building A'
    },
    {
        id: 'e2',
        title: 'Guest Lecture: The Ethics of AI',
        description: 'A thought-provoking lecture by Dr. Eleanor Vance on the ethical implications of artificial intelligence in modern society.',
        imageUrl: 'https://picsum.photos/seed/ai-ethics/1200/600',
        startTime: new Date('2025-11-05T14:00:00'),
        endTime: new Date('2025-11-05T15:30:00'),
        organizer: mockUsers[0],
        attendees: ['u1', 'u4'],
        location: 'Room 301, Science Hall'
    },
];

export const mockMarketplaceItems: MarketplaceItem[] = [
    {
        id: 'mkt1',
        name: 'Used Calculus Textbook',
        description: 'Slightly used textbook for MATH 101. No highlighting or writing inside. Perfect condition.',
        price: 45.00,
        category: 'Textbooks',
        images: ['https://picsum.photos/seed/calculus-book/400/300', 'https://picsum.photos/seed/calculus-book-inside/400/300'],
        seller: mockUsers[2],
        ratings: [4, 5, 5],
        status: 'Available'
    },
     {
        id: 'mkt2',
        name: 'Dorm Mini-Fridge',
        description: 'Compact mini-fridge, great for a dorm room. Works perfectly. Selling because I am graduating.',
        price: 75.00,
        category: 'Electronics',
        images: ['https://picsum.photos/seed/mini-fridge/400/300'],
        seller: mockUsers[3],
        ratings: [],
        status: 'Sold'
    },
];

export const mockArticles: Article[] = [
    {
        id: 'a1',
        author: mockUsers[0],
        title: 'The Rise of AI in University Education',
        content: 'Artificial intelligence is no longer a concept of the future; it\'s a tool of the present. From personalized learning paths to automated grading, AI is reshaping the landscape of higher education. This article explores the benefits, challenges, and ethical considerations of integrating AI into our academic lives. We\'ll look at case studies from universities at the forefront of this technological wave and discuss what the future holds for students and educators alike...',
        category: 'Technology',
        status: 'published',
        imageUrl: 'https://picsum.photos/seed/ai-article/800/400',
        timestamp: '2 days ago',
        creationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        views: 1523,
        reactions: { like: 150, love: 30, haha: 5, sad: 2, angry: 1 },
        comments: [],
    },
    {
        id: 'a2',
        author: mockUsers[2],
        title: 'A Guide to Effective Study Habits for Finals',
        content: 'Finals week can be stressful, but with the right strategies, you can tackle it with confidence. This guide breaks down proven study techniques, time management tips, and wellness practices to help you succeed. Learn about the Pomodoro Technique, active recall, and how to create a study schedule that works for you. Remember, it\'s not just about studying harder, but studying smarter...',
        category: 'Academics',
        status: 'published',
        imageUrl: 'https://picsum.photos/seed/study-article/800/400',
        timestamp: '5 days ago',
        creationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        views: 2890,
        reactions: { like: 230, love: 50, haha: 2, sad: 1, angry: 0 },
        comments: [],
    },
];

export const mockGroups: Group[] = [
    { id: 'g1', name: 'Computer Science Club', description: 'A club for all CS enthusiasts. We host weekly coding challenges, workshops, and guest speaker events.', avatarUrl: 'https://picsum.photos/seed/cs-club/200', members: ['u1', 'u4'], admins: ['u1'] },
    { id: 'g2', name: 'Rockview Hiking Club', description: 'Exploring the great outdoors around campus. All skill levels welcome!', avatarUrl: 'https://picsum.photos/seed/hiking-club/200', members: ['u3', 'u5'], admins: ['u3'] },
    { id: 'g3', name: 'Photography Club', description: 'Share your passion for photography. Weekly photo walks and critique sessions.', avatarUrl: 'https://picsum.photos/seed/photo-club/200', members: ['u2', 'u3'], admins: ['u2'] },
];

export const mockFriendRequests: FriendRequest[] = [
    { id: 'fr1', fromUser: mockUsers[4], toUser: mockUsers[0], status: 'pending', timestamp: '2 hours ago' },
];

export const mockSchedule: ScheduleItem[] = [
    { id: 's1', title: 'Intro to AI', day: 'Monday', startTime: '10:00', endTime: '11:30', venue: 'Hall C', color: 'bg-blue-200 border-blue-400 text-blue-800' },
    { id: 's2', title: 'Web Development Lab', day: 'Monday', startTime: '14:00', endTime: '16:00', venue: 'Lab 3B', color: 'bg-green-200 border-green-400 text-green-800' },
    { id: 's3', title: 'Data Structures', day: 'Tuesday', startTime: '09:00', endTime: '10:30', venue: 'Hall A', color: 'bg-yellow-200 border-yellow-400 text-yellow-800' },
    { id: 's4', title: 'Calculus II', day: 'Wednesday', startTime: '11:00', endTime: '12:30', venue: 'Hall D', color: 'bg-purple-200 border-purple-400 text-purple-800' },
    { id: 's5', title: 'Intro to AI', day: 'Wednesday', startTime: '10:00', endTime: '11:30', venue: 'Hall C', color: 'bg-blue-200 border-blue-400 text-blue-800' },
];

export const mockJobs: Job[] = [
    { id: 'j1', type: 'Internship', title: 'Software Engineer Intern', company: 'Tech Solutions Inc.', location: 'Remote', postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), description: 'Assist in developing new features for our flagship product...', applyLink: '#' },
    { id: 'j2', type: 'Job', title: 'Junior Web Developer', company: 'Innovate Web Co.', location: 'New York, NY', postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), description: 'Join our front-end team to build amazing user experiences...', applyLink: '#' },
];

export const mockMentorshipRequests: MentorshipRequest[] = [
    { id: 'mr1', fromUser: mockUsers[3], toMentor: mockUsers[0], communityId: 'g5', status: 'pending', timestamp: '3 hours ago' },
];

export const mockLostAndFoundItems: LostAndFoundItem[] = [
    { id: 'lf1', type: 'lost', itemName: 'Black Jansport Backpack', description: 'Lost it near the main library yesterday. Contains a laptop and textbooks.', imageUrl: 'https://picsum.photos/seed/lost-backpack/400/300', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), contact: 'jane.doe@rockview.edu', postedBy: mockUsers[0], postedAt: new Date(), location: 'Main Library' },
    { id: 'lf2', type: 'found', itemName: 'Student ID Card', description: 'Found a student ID for Alice Johnson near the cafeteria.', imageUrl: 'https://picsum.photos/seed/found-id/400/300', date: new Date(Date.now() - 2 * 60 * 60 * 1000), contact: 'rob.brown@rockview.edu', postedBy: mockUsers[3], postedAt: new Date(), location: 'Cafeteria' },
];

export const mockLibraryResources: LibraryResource[] = [
    { id: 'lr1', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', type: 'Book', fileUrl: '#', coverImageUrl: 'https://picsum.photos/seed/algo-book/300/400', description: 'A comprehensive textbook on algorithms.', publishedDate: new Date('2009-07-31') },
    { id: 'lr2', title: 'Deep Learning with Python', author: 'François Chollet', category: 'Artificial Intelligence', type: 'Book', fileUrl: '#', coverImageUrl: 'https://picsum.photos/seed/dl-book/300/400', description: 'An introduction to deep learning.', publishedDate: new Date('2017-11-21') },
];

export const mockTodos: TodoItem[] = [
    { id: 't1', title: 'Finalize project proposal for Web Dev class', status: 'inprogress', tags: [{name: 'Urgent', color: 'bg-red-200 text-red-800'}], dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), assignees: [mockUsers[0]] },
    { id: 't2', title: 'Review Chapter 5 of Algorithms textbook', status: 'todo', tags: [{name: 'Reading', color: 'bg-blue-200 text-blue-800'}], assignees: [mockUsers[0]] },
    { id: 't3', title: 'Submit assignment for Calculus II', status: 'done', dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), assignees: [mockUsers[0]] },
];

export const mockPolls: Poll[] = [
    {
        id: 'poll1',
        question: 'What should be the theme for the next big campus event?',
        options: [
            { id: 'opt1', text: '80s Retro Night', votes: 28 },
            { id: 'opt2', text: 'Masquerade Ball', votes: 55 },
            { id: 'opt3', text: 'Sci-Fi Convention', votes: 19 },
            { id: 'opt4', text: 'Cultural Festival', votes: 41 },
        ],
        createdBy: mockUsers[2],
        creationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        votedBy: ['u2', 'u3', 'u4', 'u5'],
    },
    {
        id: 'poll2',
        question: 'Which new course would you most like to see added to the curriculum?',
        options: [
            { id: 'opt5', text: 'Advanced Game Development', votes: 78 },
            { id: 'opt6', text: 'Ethical Hacking and Cybersecurity', votes: 102 },
            { id: 'opt7', text: 'Virtual Reality Design', votes: 61 },
        ],
        createdBy: mockUsers[0],
        creationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        votedBy: ['u3', 'u4'],
    },
];