import React from 'react';
import { LostAndFoundItem } from '../types';
import { CalendarDaysIcon, ChatBubbleOvalLeftEllipsisIcon } from './icons';

interface LostAndFoundItemCardProps {
  item: LostAndFoundItem;
}

const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
};

const LostAndFoundItemCard: React.FC<LostAndFoundItemCardProps> = ({ item }) => {
    const isLost = item.type === 'lost';
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative">
                <img src={item.imageUrl} alt={item.itemName} className="w-full h-48 object-cover" />
                <div className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded-full ${isLost ? 'bg-red-500' : 'bg-green-500'}`}>
                    {item.type.toUpperCase()}
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-xs text-gray-500">{timeAgo(item.postedAt)}</p>
                <h3 className="text-lg font-bold text-gray-800 truncate my-1">{item.itemName}</h3>
                
                <div className="flex items-center text-sm text-gray-600 my-2">
                    <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{isLost ? 'Lost on' : 'Found on'}: {item.date.toLocaleDateString()}</span>
                </div>
                
                <p className="text-sm text-gray-700 line-clamp-3 flex-grow">{item.description}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-100">
                     <a 
                        href={item.contact.includes('@') ? `mailto:${item.contact}` : `tel:${item.contact}`}
                        className="w-full flex items-center justify-center space-x-2 bg-indigo-50 text-indigo-700 font-semibold px-3 py-2 rounded-md text-sm hover:bg-indigo-100 transition-colors"
                     >
                        <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5"/>
                        <span>Contact</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LostAndFoundItemCard;
