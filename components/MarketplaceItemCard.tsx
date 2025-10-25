import React, { useState } from 'react';
import { MarketplaceItem, User } from '../types';
import { ChatBubbleLeftRightIcon, PhotoIcon, SpinnerIcon } from './icons';
import StarRating from './StarRating';

interface MarketplaceItemCardProps {
  item: MarketplaceItem;
  currentUser: User;
  onInitiateChat: (seller: User) => void;
  onUpdateStatus: (itemId: string, status: 'Available' | 'Sold') => Promise<void>;
}

const MarketplaceItemCard: React.FC<MarketplaceItemCardProps> = ({ item, currentUser, onInitiateChat, onUpdateStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const averageRating = item.ratings.length > 0
    ? item.ratings.reduce((a, b) => a + b, 0) / item.ratings.length
    : 0;
    
  const handleStatusUpdate = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    await onUpdateStatus(item.id, item.status === 'Available' ? 'Sold' : 'Available');
    setIsUpdating(false);
  };

  const isSeller = currentUser.id === item.seller.id;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        {/* Campus Buzz: Main image for a marketplace item */}
        <img src={item.images[0]} alt={item.name} className="w-full h-48 object-cover" />
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
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-indigo-600">{item.name}</h3>
        
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
                 {/* Campus Buzz: Avatar of the item seller */}
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
                  onClick={() => onInitiateChat(item.seller)}
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
    </div>
  );
};

export default MarketplaceItemCard;