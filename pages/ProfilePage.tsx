import React, { useState, useMemo } from 'react';
import { User, Post as PostType, Article, Group, FriendRequest, Page } from '../types';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import UserCard from '../components/UserCard';
import { 
    PencilSquareIcon, 
    Cog6ToothIcon, 
    UserPlusIcon, 
    EnvelopeIcon, 
    UserMinusIcon,
    AcademicCapIcon,
    BriefcaseIcon,
    CalendarDaysIcon,
    CameraIcon,
    BackButton,
} from '../components/icons';

type ProfileTab = 'posts' | 'about' | 'friends' | 'photos';

interface ProfilePageProps {
  user: User;
  posts: PostType[];
  currentUser: User;
  allUsers: User[];
  groups: Group[];
  sentFriendRequests: FriendRequest[];
  onNavigate: (page: Page, data?: User | Article) => void;
  onEditPost: (post: PostType) => void;
  onAddComment: (postId: string, commentText: string) => Promise<void>;
  onHashtagClick: (tag: string) => void;
  onCreatePost: (content: string, image: string | null) => Promise<void>;
  onSendFriendRequest: (userId: string) => void;
  onCancelFriendRequest: (userId: string) => void;
  onUnfriend: (userId: string) => void;
  onInitiateChat: (user: User) => void;
  onOpenEditProfileModal: () => void;
  onOpenCreateJobModal: () => void;
  handleBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = (props) => {
  const { 
    user, posts, currentUser, allUsers, groups, sentFriendRequests,
    onNavigate, onEditPost, onAddComment, onHashtagClick, onCreatePost,
    onSendFriendRequest, onCancelFriendRequest, onUnfriend, onInitiateChat,
    onOpenEditProfileModal, onOpenCreateJobModal, handleBack
  } = props;
  
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

  const isCurrentUserProfile = user.id === currentUser.id;
  const isFriend = currentUser.friends.includes(user.id);
  const isRequestSent = sentFriendRequests.some(req => req.toUser.id === user.id);
  
  const userPosts = useMemo(() => posts.filter(post => post.author.id === user.id), [posts, user.id]);
  const userFriends = useMemo(() => allUsers.filter(u => user.friends.includes(u.id)), [allUsers, user.friends]);
  const userGroupsCount = useMemo(() => groups.filter(g => g.members.includes(user.id)).length, [groups, user.id]);
  const userPhotos = useMemo(() => {
    const photos = userPosts.map(p => p.imageUrl).filter((url): url is string => !!url);
    if(user.avatarUrl) photos.unshift(user.avatarUrl);
    if(user.coverPhotoUrl) photos.unshift(user.coverPhotoUrl);
    return [...new Set(photos)]; // Remove duplicates
  }, [userPosts, user.avatarUrl, user.coverPhotoUrl]);

  const renderInteractionButtons = () => {
    if (isCurrentUserProfile) {
      return (
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
           <button 
            onClick={onOpenCreateJobModal}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 flex items-center space-x-2">
            <BriefcaseIcon className="w-4 h-4" />
            <span>List Job</span>
          </button>
          <button 
            onClick={onOpenEditProfileModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center space-x-2">
            <PencilSquareIcon className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
          <button onClick={() => onNavigate('settings')} className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </div>
      );
    }

    if (isFriend) {
        return (
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                <button onClick={() => onUnfriend(user.id)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 flex items-center space-x-2">
                    <UserMinusIcon className="w-4 h-4"/>
                    <span>Unfriend</span>
                </button>
                <button onClick={() => onInitiateChat(user)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center space-x-2">
                    <EnvelopeIcon className="w-4 h-4"/>
                    <span>Message</span>
                </button>
            </div>
        );
    }

    if (isRequestSent) {
         return (
             <button onClick={() => onCancelFriendRequest(user.id)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">
                Cancel Request
             </button>
         );
    }
    
    return (
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            <button onClick={() => onSendFriendRequest(user.id)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center space-x-2">
                <UserPlusIcon className="w-4 h-4" />
                <span>Add Friend</span>
            </button>
            <button onClick={() => onInitiateChat(user)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 flex items-center space-x-2">
                <EnvelopeIcon className="w-4 h-4"/>
                <span>Message</span>
            </button>
        </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
        case 'about':
            return <AboutTab user={user} />;
        case 'friends':
            return <FriendsTab friends={userFriends} onNavigate={onNavigate} />;
        case 'photos':
            return <PhotosTab photos={userPhotos} />;
        case 'posts':
        default:
            return <PostsTab 
                        isCurrentUserProfile={isCurrentUserProfile} 
                        currentUser={currentUser} 
                        userPosts={userPosts}
                        onCreatePost={onCreatePost}
                        {...props} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
       <div className="container mx-auto max-w-5xl px-4 pt-4">
            <BackButton onClick={handleBack} />
        </div>
      <div className="bg-white shadow-sm">
        <div className="container mx-auto max-w-5xl">
          {/* Cover Photo */}
          <div className="relative h-48 md:h-64 bg-gray-200 rounded-b-lg group">
            <img src={user.coverPhotoUrl} alt={`${user.name}'s cover photo`} className="w-full h-full object-cover rounded-b-lg" />
            {isCurrentUserProfile && (
                <button className="absolute bottom-4 right-4 bg-white/80 hover:bg-white text-gray-800 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CameraIcon className="w-4 h-4"/>
                    <span>Edit Cover Photo</span>
                </button>
            )}
          </div>
          {/* Profile Header */}
          <div className="px-4">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20">
              <div className="relative flex-shrink-0 group">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white object-cover"
                />
                {isCurrentUserProfile && (
                    <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <CameraIcon className="w-8 h-8"/>
                    </button>
                )}
              </div>
              <div className="md:ml-6 mt-3 md:mt-0 text-center md:text-left flex-grow">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
                <div className="flex justify-center md:justify-start space-x-4 text-sm text-gray-500 mt-2">
                    <span><span className="font-semibold text-gray-800">{user.friends.length}</span> Friends</span>
                    <span><span className="font-semibold text-gray-800">{userGroupsCount}</span> Groups</span>
                </div>
              </div>
            </div>
            {/* Profile Nav & Actions */}
            <div className="mt-4 flex flex-col-reverse sm:flex-row justify-between items-center border-t pt-2">
              <div className="flex mt-2 sm:mt-0">
                <TabButton label="Posts" isActive={activeTab === 'posts'} onClick={() => setActiveTab('posts')} />
                <TabButton label="About" isActive={activeTab === 'about'} onClick={() => setActiveTab('about')} />
                <TabButton label="Friends" isActive={activeTab === 'friends'} onClick={() => setActiveTab('friends')} />
                <TabButton label="Photos" isActive={activeTab === 'photos'} onClick={() => setActiveTab('photos')} />
              </div>
              <div className="flex-shrink-0">
                {renderInteractionButtons()}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Profile Content */}
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

// Sub-components for tabs
const TabButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`py-3 px-4 text-sm font-semibold transition-colors ${isActive ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:bg-gray-100 rounded-md'}`}>
        {label}
    </button>
);

const PostsTab = (props: any) => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 hidden lg:block">
            <AboutTab user={props.user} isSidebar={true} />
        </aside>
        <main className="lg:col-span-8">
            {props.isCurrentUserProfile && <CreatePost currentUser={props.currentUser} onCreatePost={props.onCreatePost} />}
            <div className={`space-y-6 ${props.isCurrentUserProfile ? 'mt-6' : ''}`}>
                {props.userPosts.length > 0 ? (
                    props.userPosts.map((post: PostType) => (
                        <PostCard key={post.id} post={post} {...props} />
                    ))
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                        <p>{props.user.name} hasn't posted anything yet.</p>
                    </div>
                )}
            </div>
        </main>
    </div>
);

const AboutTab = ({ user, isSidebar = false }: { user: User, isSidebar?: boolean }) => (
    <div className={`bg-white p-4 rounded-lg shadow-sm ${isSidebar ? 'sticky top-28' : ''}`}>
        <h3 className="font-bold mb-4 text-gray-800 text-lg border-b pb-2">About</h3>
        <ul className="space-y-4 text-gray-700 text-sm">
            <li className="flex items-center"><AcademicCapIcon className="w-5 h-5 mr-3 text-gray-400"/><span className="font-semibold w-24">Major:</span> {user.major}</li>
            <li className="flex items-center"><BriefcaseIcon className="w-5 h-5 mr-3 text-gray-400"/><span className="font-semibold w-24">Department:</span> {user.department}</li>
            <li className="flex items-center"><CalendarDaysIcon className="w-5 h-5 mr-3 text-gray-400"/><span className="font-semibold w-24">Joined:</span> {user.joinedDate}</li>
        </ul>
    </div>
);

const FriendsTab = ({ friends, onNavigate }: { friends: User[], onNavigate: (page: Page, data: User) => void }) => (
    friends.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {friends.map(friend => (
                <UserCard 
                    key={friend.id} 
                    user={friend}
                    friendStatus='friend'
                    onNavigateToProfile={() => onNavigate('profile', friend)}
                    onSendRequest={() => {}} // Not applicable here
                />
            ))}
        </div>
    ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
            <p>This user hasn't added any friends yet.</p>
        </div>
    )
);

const PhotosTab = ({ photos }: { photos: string[] }) => (
     photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {photos.map((photoUrl, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img src={photoUrl} alt={`user photo ${index + 1}`} className="w-full h-full object-cover" />
                </div>
            ))}
        </div>
     ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
            <p>No photos to display.</p>
        </div>
     )
);

export default ProfilePage;