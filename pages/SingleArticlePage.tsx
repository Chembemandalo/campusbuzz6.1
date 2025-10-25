import React, { useState, useRef, useEffect } from 'react';
import { Article, User, Comment, ReactionType, Page } from '../types';
import {
  EllipsisVerticalIcon,
  ThumbsUpIcon,
  ThumbsUpIconOutline,
  SpinnerIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ShareIcon,
  EyeIcon,
} from '../components/icons';

interface SingleArticlePageProps {
  article: Article;
  currentUser: User;
  onNavigate: (page: Page, data?: User | Article) => void;
  onEditArticle: (article: Article) => void;
  onDeleteArticle: (articleId: string) => Promise<void>;
  onAddComment: (articleId: string, commentText: string) => Promise<void>;
  onReactToArticle: (articleId: string, reaction: ReactionType) => Promise<void>;
}

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

const SingleArticlePage: React.FC<SingleArticlePageProps> = ({ article, currentUser, onNavigate, onEditArticle, onDeleteArticle, onAddComment, onReactToArticle }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Simplified reaction state for demo purposes
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);

  // FIX: Explicitly type accumulator and current value in reduce to fix TS error.
  const totalReactions = Object.values(article.reactions).reduce((a: number, b: number) => a + b, 0);
  const isAuthor = currentUser.id === article.author.id || currentUser.role === 'Admin';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleReaction = (reaction: ReactionType) => {
    onReactToArticle(article.id, reaction);
    setUserReaction(prev => prev === reaction ? null : reaction); // Optimistic toggle
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    setIsCommenting(true);
    await onAddComment(article.id, newComment.trim());
    setNewComment('');
    setIsCommenting(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      onDeleteArticle(article.id);
    }
    setMenuOpen(false);
  };
  
  const renderActionButton = () => {
    if (userReaction) {
        const text = userReaction.charAt(0).toUpperCase() + userReaction.slice(1);
        const color = ReactionColorMap[userReaction];
        const IconComponent = ReactionComponentMap[userReaction];
        const imageUrl = ReactionImageMap[userReaction];
        return (
            <button onClick={() => handleReaction(userReaction)} className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 py-2 px-4 rounded-lg w-full justify-center">
                {IconComponent ? (
                    <IconComponent className={`w-6 h-6 ${color}`} />
                ) : (
                    <img src={imageUrl} alt={text} className="w-6 h-6" />
                )}
                <span className={`font-semibold ${color}`}>{text}</span>
            </button>
        );
    }
    return (
        <button onClick={() => handleReaction('like')} className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 py-2 px-4 rounded-lg w-full justify-center">
            <ThumbsUpIconOutline className="w-6 h-6" />
            <span className="font-semibold">Like</span>
        </button>
    );
  };


  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        {/* Back navigation */}
        <button onClick={() => onNavigate('blog')} className="text-sm font-semibold text-indigo-600 hover:underline mb-4">
          &larr; Back to all articles
        </button>

        {/* Article Header */}
        <div className="mb-6">
            <span className="text-base font-semibold text-indigo-600">{article.category}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">{article.title}</h1>
        </div>

        {/* Author Meta */}
        <div className="flex justify-between items-center border-t border-b py-3">
             <div className="flex items-center">
                <img src={article.author.avatarUrl} alt={article.author.name} className="w-12 h-12 rounded-full mr-3 cursor-pointer" onClick={() => onNavigate('profile', article.author)} />
                <div>
                    <p className="font-semibold text-gray-800 cursor-pointer" onClick={() => onNavigate('profile', article.author)}>{article.author.name}</p>
                    <div className="flex items-center text-sm text-gray-500">
                        <span>{article.timestamp}</span>
                        <span className="mx-2">·</span>
                        <EyeIcon className="w-4 h-4 mr-1"/>
                        <span>{article.views.toLocaleString()} views</span>
                    </div>
                </div>
            </div>
             {isAuthor && (
                 <div className="relative" ref={menuRef}>
                    <button onClick={() => setMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg py-1 z-10">
                            <button onClick={() => { onEditArticle(article); setMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
                            <button onClick={handleDelete} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</button>
                        </div>
                    )}
                </div>
            )}
        </div>
        
        {/* Article Body */}
        <article className="prose lg:prose-xl max-w-none mt-8 text-gray-800">
            {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="w-full rounded-lg mb-8" />}
            <p className="whitespace-pre-wrap">{article.content}</p>
        </article>

        {/* Interaction Section */}
        <div className="pt-6 mt-8 border-t">
            <div className="flex justify-between items-center text-gray-500 text-sm py-2">
                <div><span>{totalReactions} Reactions</span></div>
                <div className="flex space-x-4"><span>{article.comments.length} Comments</span></div>
            </div>
            <div className="flex justify-around pt-1 border-t border-b">
                {renderActionButton()}
                <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 py-2 px-4 rounded-lg w-full justify-center">
                    <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
                    <span className="font-semibold">Comment</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 py-2 px-4 rounded-lg w-full justify-center">
                    <ShareIcon className="w-6 h-6" />
                    <span className="font-semibold">Share</span>
                </button>
            </div>
        </div>

        {/* Comments Section */}
        <div className="pt-6 mt-6">
            <h3 className="text-xl font-bold mb-4">Comments ({article.comments.length})</h3>
            <div className="space-y-4 mb-6">
                {article.comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-3">
                        <img src={comment.author.avatarUrl} alt={comment.author.name} className="w-10 h-10 rounded-full"/>
                        <div className="flex-1 bg-gray-50 rounded-lg p-3">
                            <p className="text-sm">
                                <span className="font-semibold text-gray-800">{comment.author.name}</span>
                                <span className="text-xs text-gray-500 ml-2">{comment.timestamp}</span>
                            </p>
                            <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
                        </div>
                    </div>
                ))}
                 {article.comments.length === 0 && (
                    <p className="text-sm text-gray-500">Be the first to leave a comment!</p>
                )}
            </div>
            <div className="flex items-start space-x-3">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1 flex">
                <textarea
                    value={newComment} onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmitComment())}
                    placeholder="Write a comment..."
                    rows={2}
                    className="w-full bg-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                />
                <button
                    onClick={handleSubmitComment}
                    className="bg-indigo-600 text-white font-semibold px-4 py-2 ml-2 rounded-lg hover:bg-indigo-700 text-sm disabled:bg-indigo-300 self-start"
                    disabled={!newComment.trim() || isCommenting}
                >
                    {isCommenting ? <SpinnerIcon className="w-5 h-5" /> : 'Post'}
                </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SingleArticlePage;