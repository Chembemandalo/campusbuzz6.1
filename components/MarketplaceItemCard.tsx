import React, { useState } from 'react';
import { MarketplaceItem, User } from '../types';
import { ChatBubbleLeftRightIcon, PhotoIcon, SpinnerIcon, PaperAirplaneIcon } from './icons';
import StarRating from './StarRating';

interface MarketplaceItemCardProps {
  item: MarketplaceItem;
  currentUser: User;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onInitiateChat: (seller: User) => void;
  onUpdateStatus: (itemId: string, status: 'Available' | 'Sold') => Promise<void>;
}

const MarketplaceItemCard: React.FC<MarketplaceItemCardProps> = ({ item, currentUser, isExpanded, onToggleExpand, onInitiateChat, onUpdateStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [mainImage, setMainImage] = useState(item.images[0]);
  const [comments, setComments] = useState<{author: string, text: string}[]>([]);
  const [newComment, setNewComment] = useState('');

  const averageRating = item.ratings.length > 0
    ? item.ratings.reduce((a, b) => a + b, 0) / item.ratings.length
    : 0;
    
  const handleStatusUpdate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpdating) return;
    setIsUpdating(true);
    await onUpdateStatus(item.id, item.status === 'Available' ? 'Sold' : 'Available');
    setIsUpdating(false);
  };
  
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(newComment.trim()) {
        setComments(prev => [...prev, { author: currentUser.name, text: newComment.trim() }]);
        setNewComment('');
    }
  }

  const isSeller = currentUser.id === item.seller.id;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative cursor-pointer" onClick={onToggleExpand}>
        <img src={mainImage} alt={item.name} className="w-full h-48 object-cover transition-all duration-300" />
        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {item.category}
        </div>
        {item.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <PhotoIcon className="w-3 h-3 mr-1" /> {item.images.length}
            </div>
        )}
        {item.status === 'Sold' && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white text-2xl font-bold border-4 px-4 py-2 rotate-[-15deg] transform">SOLD</span>
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center">
            <p className="text-white font-bold text-center p-4">{isExpanded ? 'Close' : 'View Details'}</p>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-indigo-600 cursor-pointer" onClick={onToggleExpand}>{item.name}</h3>
        
        <div className="mt-2 flex justify-between items-center">
          {item.ratings.length > 0 ? (
              <StarRating rating={averageRating} ratingCount={item.ratings.length} size="sm" />
          ) : (
              <p className="text-xs text-gray-400">No ratings yet</p>
          )}
        </div>
        
        <p className="text-sm text-gray-700 mt-2 line-clamp-2 flex-grow">{item.description}</p>
        
        <div className="mt-auto pt-4">
          <div className="flex justify-between items-center mb-3">
             <div className="flex items-center min-w-0">
                 <img src={item.seller.avatarUrl} alt={item.seller.name} className="w-8 h-8 rounded-full mr-2" />
                 <div className="min-w-0">
                    <p className="text-xs text-gray-500">Seller</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.seller.name}</p>
                 </div>
             </div>
             <p className="text-xl font-extrabold text-indigo-700">
                ${item.price.toFixed(2)}
            </p>
          </div>

          {isSeller ? (
              <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                  className={`w-full flex items-center justify-center space-x-2 font-semibold px-3 py-2 rounded-md text-sm transition-colors disabled:opacity-70 ${
                      item.status === 'Available' 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                  aria-label={item.status === 'Available' ? 'Mark item as sold' : 'Mark item as available'}
              >
                  {isUpdating ? <SpinnerIcon className="w-5 h-5 text-gray-600" /> : <span>{item.status === 'Available' ? 'Mark as Sold' : 'Mark as Available'}</span>}
              </button>
          ) : (
              <button
                  onClick={(e) => { e.stopPropagation(); onInitiateChat(item.seller); }}
                  disabled={item.status === 'Sold'}
                  className="w-full flex items-center justify-center space-x-2 bg-indigo-50 text-indigo-700 font-semibold px-3 py-2 rounded-md text-sm hover:bg-indigo-100 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  aria-label={`Chat with ${item.seller.name}`}
              >
                  <ChatBubbleLeftRightIcon className="w-5 h-5"/>
                  <span>Chat with Seller</span>
              </button>
          )}

        </div>
      </div>
       <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
            <div className="p-4 border-t">
                <h4 className="font-semibold text-gray-800 mb-2">Full Description</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap mb-4">{item.description}</p>
                
                {item.images.length > 1 && (
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Image Gallery</h4>
                        <div className="flex space-x-2">
                            {item.images.map((img, index) => (
                                <img key={index} src={img} onClick={(e) => { e.stopPropagation(); setMainImage(img); }} alt={`thumbnail ${index+1}`} className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-indigo-500' : 'border-transparent'}`} />
                            ))}
                        </div>
                    </div>
                )}

                <h4 className="font-semibold text-gray-800 mb-2">Comments & Inquiries</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    {comments.map((comment, i) => (
                        <div key={i} className="text-sm bg-gray-100 p-2 rounded-md">
                            <span className="font-semibold">{comment.author}: </span>
                            <span>{comment.text}</span>
                        </div>
                    ))}
                    {comments.length === 0 && <p className="text-xs text-gray-500">No comments yet.</p>}
                </div>
                 <form onSubmit={handleAddComment} className="flex items-center space-x-2 mt-3">
                    <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} onClick={e => e.stopPropagation()} placeholder="Ask a question..." className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                    <button type="submit" onClick={e => e.stopPropagation()} className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700"><PaperAirplaneIcon className="w-5 h-5"/></button>
                </form>
            </div>
      </div>
    </div>
  );
};

export default MarketplaceItemCard;