import React, { useState, useRef, useEffect } from 'react';
import { Post, User, Comment, ReactionType, Article, Page } from '../types';
import { 
    HeartIcon, 
    ChatBubbleOvalLeftEllipsisIcon, 
    ShareIcon, 
    EllipsisVerticalIcon,
    ThumbsUpIcon,
    ThumbsUpIconOutline,
    SpinnerIcon
} from './icons';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onNavigate: (page: Page, data?: User | Article) => void;
  onEdit: (post: Post) => void;
  onAddComment: (postId: string, commentText: string) => Promise<void>;
  onHashtagClick: (tag: string) => void;
}

const reactionTypes: ReactionType[] = ['like', 'love', 'haha', 'sad', 'angry'];

const ReactionImageMap: Partial<Record<ReactionType, string>> = {
    love: '/assists/love.png',
    haha: '/assists/haha.png',
    sad: '/assists/sad.png',
    angry: '/assists/angry.png',
};

const ReactionComponentMap: Partial<Record<ReactionType, React.FC<{ className?: string }>>> = {
    like: ThumbsUpIcon
};
  
const ReactionColorMap: Record<ReactionType, string> = {
    like: 'text-blue-500',
    love: 'text-red-500',
    haha: 'text-yellow-500',
    sad: 'text-blue-500',
    angry: 'text-red-500',
};

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onNavigate, onEdit, onAddComment, onHashtagClick }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [reactionCounts, setReactionCounts] = useState(post.reactions);
  const [reactionMenuVisible, setReactionMenuVisible] = useState(false);
  const menuTimeoutRef = useRef<number | null>(null);

  // FIX: Explicitly type accumulator and current value in reduce to fix TS error.
  const totalReactions = Object.values(reactionCounts).reduce((a: number, b: number) => a + b, 0);

  useEffect(() => {
    // Sync local state if post prop changes
    setReactionCounts(post.reactions);
  }, [post.reactions]);
  
  const handleReaction = (reaction: ReactionType) => {
    const newCounts = { ...reactionCounts };

    // If there's an old reaction, decrement its count
    if (userReaction) {
        newCounts[userReaction] = Math.max(0, (newCounts[userReaction] || 1) - 1);
    }

    // If the new reaction is the same as the old one, it's a toggle-off
    if (userReaction === reaction) {
        setUserReaction(null);
    } else {
        // Otherwise, set the new reaction and increment its count
        newCounts[reaction] = (newCounts[reaction] || 0) + 1;
        setUserReaction(reaction);
    }

    setReactionCounts(newCounts);
    setReactionMenuVisible(false); // Hide menu after selection
  };
  
  const handleLikeButtonClick = () => {
    // If a reaction is already selected, clicking the main button will toggle it off.
    // If no reaction is selected, it will default to toggling 'like'.
    const reactionToToggle = userReaction || 'like';
    handleReaction(reactionToToggle);
  };
  
  const showReactionMenu = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setReactionMenuVisible(true);
  };
  
  const hideReactionMenu = (delay: number = 200) => {
    menuTimeoutRef.current = window.setTimeout(() => {
        setReactionMenuVisible(false);
    }, delay);
  };
  
  const handleMouseEnterLike = () => {
    // Show menu after a short delay on hover
    menuTimeoutRef.current = window.setTimeout(() => {
        setReactionMenuVisible(true);
    }, 400);
  };
  
  const handleMouseLeaveLike = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    hideReactionMenu();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    
    setIsCommenting(true);
    await onAddComment(post.id, newComment.trim());
    setNewComment('');
    setIsCommenting(false);
  };

  const isAuthor = currentUser.id === post.author.id;
  
  const renderContentWithHashtags = (content: string) => {
    const hashtagRegex = /(#\w+)/g;
    const parts = content.split(hashtagRegex);

    return parts.map((part, index) => {
        if (part.startsWith('#')) {
            const tag = part.substring(1);
            return (
                <a
                    key={index}
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onHashtagClick(tag);
                    }}
                    className="text-indigo-600 hover:underline font-semibold"
                >
                    {part}
                </a>
            );
        }
        return part;
    });
  };

  const renderActionButton = () => {
    if (userReaction) {
        const text = userReaction.charAt(0).toUpperCase() + userReaction.slice(1);
        const color = ReactionColorMap[userReaction];
        const IconComponent = ReactionComponentMap[userReaction];
        const imageUrl = ReactionImageMap[userReaction];

        return (
            <button
                onClick={handleLikeButtonClick}
                className={`flex items-center space-x-2 py-2 px-4 rounded-lg w-full justify-center ${color}`}
            >
                {IconComponent ? (
                     <IconComponent className={`w-6 h-6`} />
                ) : (
                    <img src={imageUrl} alt={text} className="w-6 h-6" />
                )}
                <span className="font-semibold">{text}</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleLikeButtonClick}
            className={`flex items-center space-x-2 py-2 px-4 rounded-lg w-full justify-center text-gray-600 hover:bg-gray-100`}
        >
            <ThumbsUpIconOutline className="w-6 h-6" />
            <span className="font-semibold">Like</span>
        </button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
                {/* Campus Buzz: Post author's avatar */}
                <img 
                    src={post.author.avatarUrl} 
                    alt={post.author.name} 
                    className="w-12 h-12 rounded-full cursor-pointer" 
                    onClick={() => onNavigate('profile', post.author)}
                />
                <div>
                    <p 
                      className="font-bold text-gray-800 hover:underline cursor-pointer"
                      onClick={() => onNavigate('profile', post.author)}
                    >
                      {post.author.name}
                    </p>
                    <p className="text-xs text-gray-500">{post.timestamp}</p>
                </div>
            </div>
            {isAuthor && (
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg py-1 z-10">
                            <button 
                                onClick={() => {
                                    onEdit(post);
                                    setMenuOpen(false);
                                }}
                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Edit Post
                            </button>
                            <button className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                Delete Post
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
        <p className="my-4 text-gray-700 whitespace-pre-wrap">{renderContentWithHashtags(post.content)}</p>
      </div>
      {post.imageUrl && (
        // Campus Buzz: Main image for a post
        <img src={post.imageUrl} alt="Post content" className="w-full h-auto" />
      )}
      <div className="p-4">
        {/* Stats */}
        <div className="flex justify-between items-center text-gray-500 text-sm border-b pb-2">
            <div>
                <span>{totalReactions} Reactions</span>
            </div>
            <div className="flex space-x-4">
                <span className="cursor-pointer hover:underline" onClick={() => setCommentsVisible(!commentsVisible)}>{post.comments.length} Comments</span>
                <span>{post.shares} Shares</span>
            </div>
        </div>
        {/* Actions */}
        <div className="flex justify-around pt-2">
            <div 
                className="relative flex-1 flex justify-center"
                onMouseLeave={handleMouseLeaveLike}
            >
                <div onMouseEnter={handleMouseEnterLike} className="w-full">
                    {renderActionButton()}
                </div>

                {reactionMenuVisible && (
                    <div 
                        onMouseEnter={showReactionMenu}
                        className="absolute bottom-full mb-2 flex space-x-2 bg-white rounded-full shadow-lg p-2 transition-all duration-200"
                    >
                        {reactionTypes.map(reaction => {
                            const IconComponent = ReactionComponentMap[reaction];
                            const imageUrl = ReactionImageMap[reaction];
                            return (
                                <button key={reaction} onClick={() => handleReaction(reaction)} className="transform hover:scale-125 transition-transform p-1">
                                    {IconComponent ? (
                                        <IconComponent className={`w-8 h-8 ${ReactionColorMap[reaction]}`} />
                                    ) : (
                                        <img src={imageUrl} alt={reaction} className="w-8 h-8" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <button 
                onClick={() => setCommentsVisible(!commentsVisible)}
                className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 py-2 px-4 rounded-lg w-full justify-center"
            >
                <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
                <span className="font-semibold">Comment</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 py-2 px-4 rounded-lg w-full justify-center">
                <ShareIcon className="w-6 h-6" />
                <span className="font-semibold">Share</span>
            </button>
        </div>
        
        {/* Comments Section */}
        {commentsVisible && (
          <div className="pt-4 mt-4 border-t">
            {/* Existing Comments */}
            <div className="space-y-4 mb-4">
                {post.comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-3">
                        {/* Campus Buzz: Avatar of a user who commented */}
                        <img 
                            src={comment.author.avatarUrl} 
                            alt={comment.author.name} 
                            className="w-8 h-8 rounded-full cursor-pointer"
                            onClick={() => onNavigate('profile', comment.author)}
                        />
                        <div className="flex-1 bg-gray-100 rounded-lg p-2">
                            <p className="text-sm">
                                <span 
                                    className="font-semibold text-gray-800 hover:underline cursor-pointer"
                                    onClick={() => onNavigate('profile', comment.author)}
                                >
                                    {comment.author.name}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">{comment.timestamp}</span>
                            </p>
                            <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
                        </div>
                    </div>
                ))}
                 {post.comments.length === 0 && (
                    <p className="text-sm text-gray-500 text-center">No comments yet. Be the first to comment!</p>
                )}
            </div>

            {/* Add Comment Form */}
            <div className="flex items-center space-x-3">
                {/* Campus Buzz: Current user's avatar in the comment input field */}
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                <div className="flex-1 flex">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                    placeholder="Write a comment..."
                    className="w-full bg-gray-100 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    onClick={handleSubmitComment}
                    className="bg-indigo-600 text-white font-semibold px-4 rounded-r-full hover:bg-indigo-700 text-sm disabled:bg-indigo-300 w-20 flex justify-center items-center"
                    disabled={!newComment.trim() || isCommenting}
                  >
                    {isCommenting ? <SpinnerIcon className="w-4 h-4" /> : 'Post'}
                  </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;