import { User, Post, Notification, Conversation, Event, MarketplaceItem, Article, Group, FriendRequest, UserSettings, HeroSlide, ScheduleItem, Job, MentorshipRequest, LostAndFoundItem } from '../types';

const defaultSettings: UserSettings = {
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
  { id: 'u2', name: 'John Smith', email: 'admin@gmail.com', password: 'admin123', avatarUrl: 'https://picsum.photos/id/238/200/200', coverPhotoUrl: 'https://picsum.photos/id/1016/1000/300', bio: 'University Administrator | Keeping things running smoothly.', role: 'Admin', department: 'Engineering', major: 'Mechanical Engineering', joinedDate: 'July 2018', onlineStatus: 'offline', friends: [], status: 'active', settings: { ...defaultSettings, theme: 'light' }, rating: { score: 4.8, reviews: 98 }, institute: 'Rockview University', joiningYear: 2010, passingYear: 2014, sessionFee: 0 },
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
    timestamp: '8 hours ago',
    creationDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 42,
    reactions: { like: 40, love: 1, haha: 0, sad: 0, angry: 1 },
    comments: [],
    shares: 5,
  },
  {
    id: 'p3',
    author: mockUsers[0],
    content: 'Anyone heading to the basketball game tonight? Let\'s go Rockview Raptors! 🏀 #UniversityPride #GameDay',
    timestamp: '1 day ago',
    creationDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 230,
    reactions: { like: 150, love: 60, haha: 15, sad: 0, angry: 5 },
    comments: [
      { id: 'c3', author: mockUsers[2], text: 'I\'ll be there! Section C!', timestamp: '22 hours ago' },
    ],
    shares: 45,
    eventId: 'e3'
  },
  {
    id: 'p4',
    author: mockUsers[2],
    content: 'Found a lost ID card near the cafeteria. Belongs to a "Mark Evans". I\'ve handed it over to the Lost & Found office at the student center.',
    imageUrl: 'https://picsum.photos/id/102/800/600',
    timestamp: '2 days ago',
    creationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likes: 78,
    reactions: { like: 60, love: 10, haha: 2, sad: 6, angry: 0 },
    comments: [],
    shares: 3,
    eventId: 'e2'
  }
];

export const mockNotifications: Notification[] = [
    { id: 'n1', text: 'Alice Johnson commented on your post.', fromUser: mockUsers[2], linkId: 'p3', isRead: false, timestamp: '15m ago', type: 'comment' },
    { id: 'n2', text: 'You have an upcoming event: "Rockview ku chalo".', linkId: 'e1', isRead: false, timestamp: '1h ago', type: 'event' },
    { id: 'n3', text: 'Robert Brown liked your post about the Raptors game.', fromUser: mockUsers[3], linkId: 'p3', isRead: false, timestamp: '3h ago', type: 'like' },
    { id: 'n4', text: 'New announcement from John Smith.', fromUser: mockUsers[1], linkId: 'p2', isRead: true, timestamp: '1d ago', type: 'announcement' },
    { id: 'n5', text: 'Emily White sent you a friend request.', fromUser: mockUsers[4], linkId: 'fr1', isRead: false, timestamp: '2h ago', type: 'friend_request' },
    { id: 'n6', text: 'John Smith accepted your friend request.', fromUser: mockUsers[1], linkId: 'u2', isRead: true, timestamp: '2d ago', type: 'friend_request_accepted' },
];

export const mockConversations: Conversation[] = [
    {
        id: 'convo1',
        participants: [mockCurrentUser, mockUsers[2]],
        isGroup: false,
        unreadCount: 2,
        messages: [
            { id: 'm1', sender: mockUsers[2], text: 'Hey, did you finish the assignment for CS101?', timestamp: '10:30 AM' },
            { id: 'm2', sender: mockCurrentUser, text: 'Almost! Just putting the finishing touches on it. You?', timestamp: '10:31 AM' },
            { id: 'm3', sender: mockUsers[2], text: 'Yeah, I submitted it this morning.', timestamp: '10:32 AM' },
            { id: 'm4', sender: mockUsers[2], text: 'Let me know if you need help with the last part.', timestamp: '10:32 AM' },
        ],
    },
    {
        id: 'convo2',
        participants: [mockCurrentUser, mockUsers[1]],
        isGroup: false,
        unreadCount: 0,
        messages: [
            { id: 'm5', sender: mockUsers[1], text: 'Hi Jane, could you approve my leave request?', timestamp: 'Yesterday' },
            { id: 'm6', sender: mockCurrentUser, text: 'Sure, I\'ll take a look at it now.', timestamp: 'Yesterday' },
        ],
    },
    {
        id: 'convo3',
        participants: [mockCurrentUser, mockUsers[2], mockUsers[3]],
        isGroup: true,
        groupName: 'CS Project Group',
        unreadCount: 1,
        messages: [
            { id: 'm7', sender: mockUsers[3], text: 'Hey team, I pushed the latest code to the repo.', timestamp: '9:00 AM' },
            { id: 'm8', sender: mockUsers[2], text: 'Great, I\'ll review it.', timestamp: '9:05 AM' },
            { id: 'm9', sender: mockUsers[3], text: 'Don\'t forget our meeting at 2 PM!', timestamp: '9:06 AM' },
        ],
    },
     {
        id: 'convo4',
        participants: [mockCurrentUser, mockUsers[1], mockUsers[2]],
        isGroup: true,
        groupName: 'Campus Events Committee',
        unreadCount: 0,
        messages: [
            { id: 'm10', sender: mockUsers[1], text: 'Ideas for the Fall Festival?', timestamp: '3 days ago' },
        ],
    },
];

export const mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'Rockview ku chalo',
    description: 'Join us for the biggest tech event of the year! Featuring guest speakers from top tech companies, workshops, and networking opportunities. Don\'t miss out on the chance to learn about the latest trends in AI, software development, and cybersecurity.',
    imageUrl: 'https://picsum.photos/id/12/1200/600',
    startTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5, 9, 0), // 5 days from now at 9:00 AM
    endTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5, 17, 0), // 5 days from now at 5:00 PM
    organizer: mockUsers[1], // John Smith (Staff)
    attendees: ['u3', 'u4'],
  },
  {
    id: 'e2',
    title: 'Guest Lecture: The Ethics of AI',
    description: 'A thought-provoking lecture by Dr. Eleanor Vance, a leading expert in artificial intelligence ethics. This session will explore the moral implications of advanced AI and its impact on society.',
    imageUrl: 'https://picsum.photos/id/42/1200/600',
    startTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 10, 14, 0), // 10 days from now at 2:00 PM
    endTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 10, 15, 30), // 10 days from now at 3:30 PM
    organizer: mockUsers[3],
    attendees: ['u1', 'u2', 'u3'],
  },
  {
    id: 'e3',
    title: 'Rockview Raptors vs. State Bulldogs',
    description: 'Cheer on our basketball team as they take on their rivals, the State Bulldogs! Wear your university colors and get ready to make some noise. Go Raptors! 🏀',
    imageUrl: 'https://picsum.photos/id/145/1200/600',
    startTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 19, 0), // 2 days from now at 7:00 PM
    endTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 21, 0), // 2 days from now at 9:00 PM
    organizer: mockUsers[0],
    attendees: ['u1'],
  },
];

export const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: 'mkt1',
    name: 'Introduction to Algorithms (CLRS)',
    description: 'Slightly used textbook for CS3510. No markings or highlights inside. Perfect condition.',
    price: 45.00,
    category: 'Textbooks',
    images: ['https://picsum.photos/seed/textbook/400/300'],
    seller: mockUsers[3], // Robert Brown
    ratings: [5, 4, 5, 5],
    status: 'Available',
  },
  {
    id: 'mkt2',
    name: 'Noise-Cancelling Headphones',
    description: 'Sony WH-1000XM4. Great for studying in noisy environments. Comes with the original case and cables.',
    price: 150.00,
    category: 'Electronics',
    images: ['https://picsum.photos/seed/headphones/400/300', 'https://picsum.photos/seed/headphones2/400/300'],
    seller: mockUsers[2], // Alice Johnson
    ratings: [5, 5, 4, 5, 5, 5],
    status: 'Sold',
  },
  {
    id: 'mkt3',
    name: 'Mini Fridge for Dorm',
    description: 'Compact mini-fridge, ideal for a dorm room. Keeps drinks and snacks cold. Clean and works perfectly.',
    price: 50.00,
    category: 'Furniture',
    images: ['https://picsum.photos/seed/fridge/400/300'],
    seller: mockUsers[0], // Jane Doe
    ratings: [4, 4, 5],
    status: 'Available',
  },
  {
    id: 'mkt4',
    name: 'Rockview University Hoodie',
    description: 'Official university hoodie, size M. Worn a few times, still in great shape. Show your school spirit!',
    price: 20.00,
    category: 'Clothing',
    images: ['https://picsum.photos/seed/hoodie/400/300'],
    seller: mockUsers[3], // Robert Brown
    ratings: [5],
    status: 'Available',
  },
  {
    id: 'mkt5',
    name: 'Desk Lamp with USB Port',
    description: 'Modern LED desk lamp with adjustable brightness and a handy USB port for charging your phone.',
    price: 15.00,
    category: 'Electronics',
    images: ['https://picsum.photos/seed/lamp/400/300', 'https://picsum.photos/seed/lamp2/400/300', 'https://picsum.photos/seed/lamp3/400/300'],
    seller: mockUsers[2], // Alice Johnson
    ratings: [],
    status: 'Available',
  },
  {
    id: 'mkt6',
    name: 'Calculus: Early Transcendentals',
    description: 'Required textbook for MATH1554. Good condition, some pencil notes on a few pages.',
    price: 30.00,
    category: 'Textbooks',
    images: ['https://picsum.photos/seed/calculus/400/300'],
    seller: mockUsers[0], // Jane Doe
    ratings: [3, 4, 4],
    status: 'Available',
  },
];

export const mockArticles: Article[] = [
  {
    id: 'a1',
    author: mockUsers[1],
    title: 'The Future of AI in Academia',
    content: 'The integration of Artificial Intelligence into academia is no longer a futuristic concept but a present-day reality transforming teaching, learning, and research. From personalized learning paths for students to AI-powered research tools that accelerate discovery, the potential is immense. This article explores the current applications of AI in education, the ethical considerations we must navigate, and what the future holds for both educators and students at Rockview University and beyond.',
    imageUrl: 'https://picsum.photos/seed/ai-article/800/400',
    timestamp: '3 days ago',
    creationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    category: 'Academics',
    status: 'published',
    views: 1245,
    reactions: { like: 120, love: 25, haha: 2, sad: 0, angry: 3 },
    comments: [
        { id: 'ca1', author: mockUsers[0], text: 'Great insights, John!', timestamp: '2 days ago'}
    ],
  },
  {
    id: 'a2',
    author: mockUsers[2],
    title: 'A Guide to Effective Study Habits for Finals',
    content: 'As finals week approaches, mastering effective study habits is the key to academic success. This guide explores proven techniques like the Pomodoro Technique for time management, active recall for memory retention, and spaced repetition to ensure long-term learning. We will also cover the importance of a good study environment, sleep, and stress management to help you perform your best. Let\'s get ready to ace those exams!',
    imageUrl: 'https://picsum.photos/seed/study-article/800/400',
    timestamp: '1 week ago',
    creationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    category: 'Student Life',
    status: 'published',
    views: 3489,
    reactions: { like: 250, love: 20, haha: 0, sad: 5, angry: 0 },
    comments: [],
  },
  {
    id: 'a3',
    author: mockUsers[0],
    title: 'My Summer Internship Experience (Draft)',
    content: 'This is a draft of my upcoming article about my summer internship. I will detail my experiences, the challenges I faced, and the valuable lessons I learned. Stay tuned for the full story!',
    timestamp: '1 day ago',
    creationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    category: 'Career',
    status: 'draft',
    views: 0,
    reactions: { like: 0, love: 0, haha: 0, sad: 0, angry: 0 },
    comments: [],
  }
];

export const mockGroups: Group[] = [
  { id: 'g1', name: 'Computer Science Club', description: 'A club for all things CS. From competitive programming to project workshops.', avatarUrl: 'https://picsum.photos/seed/csc/200', members: ['u1', 'u4'], admins: ['u4'] },
  { id: 'g2', name: 'University Hiking Group', description: 'Exploring the great outdoors around campus. All skill levels welcome!', avatarUrl: 'https://picsum.photos/seed/hiking/200', members: ['u1', 'u3'], admins: ['u3'] },
  { id: 'g3', name: 'Debate Team', description: 'Sharpen your public speaking and argumentation skills with us.', avatarUrl: 'https://picsum.photos/seed/debate/200', members: [], admins: ['u2'] },
  { id: 'g4', name: 'Photography Club', description: 'Capture the beauty of campus and beyond. Join us for photo walks and workshops.', avatarUrl: 'https://picsum.photos/seed/photo/200', members: ['u3'], admins: ['u3'] },
  { id: 'g5', name: 'Jane\'s Tech Mentorship', description: 'A community for students seeking guidance in the tech industry. We discuss projects, interview prep, and career paths.', avatarUrl: 'https://picsum.photos/seed/mentor-jane/200', members: ['u1', 'u4'], admins: ['u1'] },
  { id: 'g6', name: 'Admissions & Career Prep', description: 'Guidance from university staff on applications, personal statements, and career planning.', avatarUrl: 'https://picsum.photos/seed/mentor-michael/200', members: ['u6'], admins: ['u6'] },
];

export const mockFriendRequests: FriendRequest[] = [
    { id: 'fr1', fromUser: mockUsers[4], toUser: mockUsers[0], timestamp: '2 hours ago', status: 'pending' },
    { id: 'fr2', fromUser: mockUsers[5], toUser: mockUsers[0], timestamp: '1 day ago', status: 'pending' },
];

export const mockMentorshipRequests: MentorshipRequest[] = [
    { id: 'mr1', fromUser: mockUsers[4], toMentor: mockUsers[0], communityId: 'g5', status: 'pending', timestamp: '4 hours ago' }
];

export const mockSchedule: ScheduleItem[] = [
  {
    id: 's1',
    title: 'CS101: Intro to Programming',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    venue: 'Hall A',
    color: 'bg-blue-200 border-blue-400 text-blue-800'
  },
  {
    id: 's2',
    title: 'MA101: Calculus I',
    day: 'Monday',
    startTime: '11:00',
    endTime: '12:30',
    venue: 'Room 203',
    color: 'bg-green-200 border-green-400 text-green-800'
  },
  {
    id: 's3',
    title: 'PH101: Physics',
    day: 'Tuesday',
    startTime: '14:00',
    endTime: '15:30',
    venue: 'Lab 5',
    color: 'bg-yellow-200 border-yellow-400 text-yellow-800'
  },
    {
    id: 's4',
    title: 'ENGL101: Composition',
    day: 'Wednesday',
    startTime: '16:00',
    endTime: '17:00',
    venue: 'Room 112',
    color: 'bg-purple-200 border-purple-400 text-purple-800'
  },
  {
    id: 's5',
    title: 'CS101: Lab Session',
    day: 'Thursday',
    startTime: '10:00',
    endTime: '12:00',
    venue: 'CS Lab 1',
    color: 'bg-blue-200 border-blue-400 text-blue-800'
  }
];

export const mockJobs: Job[] = [
    {
        id: 'job1',
        type: 'Job',
        title: 'MTS Silicon Design Engineer',
        company: 'Advanced Micro Devices (AMD)',
        location: 'Hyderabad, India',
        postedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        description: 'Join a team of talented engineers to design and develop next-generation silicon products. Requires a degree in Electrical or Computer Engineering.',
        applyLink: '#'
    },
    {
        id: 'job2',
        type: 'Internship',
        title: 'Interim Engineering Intern',
        company: 'Qualcomm',
        location: 'Hyderabad, India',
        postedDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        description: 'A 3-month internship program for students passionate about mobile technology and hardware engineering. Gain hands-on experience with industry leaders.',
        applyLink: '#'
    },
    {
        id: 'job3',
        type: 'Job',
        title: 'Software Development Engineer',
        company: 'Amazon',
        location: 'Seattle, WA (Remote)',
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        description: 'Work on large-scale distributed systems and contribute to the Amazon Web Services (AWS) cloud platform. Strong proficiency in Java or C++ required.',
        applyLink: '#'
    },
    {
        id: 'job4',
        type: 'Internship',
        title: 'UX Design Intern',
        company: 'Google',
        location: 'Mountain View, CA',
        postedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        description: 'Collaborate with designers, researchers, and engineers to create intuitive and delightful user experiences for Google products.',
        applyLink: '#'
    }
];

export const mockLostAndFoundItems: LostAndFoundItem[] = [
    {
        id: 'lf1',
        type: 'lost',
        itemName: 'Black Jansport Backpack',
        description: 'Lost my backpack somewhere near the main library. It has a CS101 textbook and a blue water bottle inside. Please contact me if you find it!',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb68c6a62?q=80&w=1887&auto=format&fit=crop',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        contact: 'jane.doe@rockview.edu',
        postedBy: mockUsers[0],
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
        id: 'lf2',
        type: 'found',
        itemName: 'iPhone 13 with a green case',
        description: 'Found an iPhone near the student center cafeteria. The lock screen is a picture of a golden retriever. Currently holding it at the student center front desk.',
        imageUrl: 'https://images.unsplash.com/photo-1633424991336-23758b77e3c4?q=80&w=1964&auto=format&fit=crop',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        contact: 'Student Center Front Desk',
        postedBy: mockUsers[5],
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
        id: 'lf3',
        type: 'found',
        itemName: 'Set of Keys',
        description: 'Found a set of keys on a Rockview University lanyard on the main campus quad. Has a car key and two smaller keys.',
        imageUrl: 'https://images.unsplash.com/photo-1564375117282-13e31637c373?q=80&w=1887&auto=format&fit=crop',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        contact: 'Campus Security',
        postedBy: mockUsers[1],
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
        id: 'lf4',
        type: 'lost',
        itemName: 'Student ID Card - Robert Brown',
        description: 'I think I dropped my ID card somewhere in the engineering building this morning. If found, please drop it at the admissions office or email me.',
        imageUrl: 'https://images.unsplash.com/photo-1611603599225-5b403c4f4946?q=80&w=1780&auto=format&fit=crop',
        date: new Date(),
        contact: 'rob.brown@rockview.edu',
        postedBy: mockUsers[3],
        postedAt: new Date()
    },
    {
        id: 'lf5',
        type: 'found',
        itemName: 'Textbook - "Introduction to Algorithms"',
        description: 'This textbook was left behind in lecture hall 203 after the 3pm class. It has some highlighting on the first few chapters.',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop',
        date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago, should be expired
        contact: 'Professor Green\'s office',
        postedBy: mockUsers[5],
        postedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)
    }
];

export { defaultSettings };