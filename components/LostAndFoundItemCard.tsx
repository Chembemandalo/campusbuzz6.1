import React, { useState } from 'react';
import { LostAndFoundItem } from '../types';
import { CalendarDaysIcon, ChatBubbleOvalLeftEllipsisIcon, MapPinIcon, PaperAirplaneIcon } from './icons';

interface LostAndFoundItemCardProps {
  item: LostAndFoundItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
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

const LostAndFoundItemCard: React.FC<LostAndFoundItemCardProps> = ({ item, isExpanded, onToggleExpand }) => {
    const isLost = item.type === 'lost';
    const [comments, setComments] = useState<{author: string, text: string}[]>([]);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if(newComment.trim()) {
            setComments(prev => [...prev, { author: 'You', text: newComment.trim() }]);
            setNewComment('');
        }
    }
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative cursor-pointer" onClick={onToggleExpand}>
                <img src={item.imageUrl} alt={item.itemName} className="w-full h-48 object-cover" />
                <div className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded-full ${isLost ? 'bg-red-500' : 'bg-green-500'}`}>
                    {item.type.toUpperCase()}
                </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center">
                    <p className="text-white font-bold text-center p-4">{isExpanded ? 'Collapse' : 'View Details'}</p>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-xs text-gray-500">{timeAgo(item.postedAt)}</p>
                <h3 className="text-lg font-bold text-gray-800 truncate my-1 cursor-pointer" onClick={onToggleExpand}>{item.itemName}</h3>
                
                <div className="flex items-center text-sm text-gray-600 my-2">
                    <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{isLost ? 'Lost on' : 'Found on'}: {item.date.toLocaleDateString()}</span>
                </div>
                
                <p className="text-sm text-gray-700 line-clamp-3 flex-grow">{item.description}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-100">
                     <a 
                        href={item.contact.includes('@') ? `mailto:${item.contact}` : `tel:${item.contact}`}
                        onClick={e => e.stopPropagation()}
                        className="w-full flex items-center justify-center space-x-2 bg-indigo-50 text-indigo-700 font-semibold px-3 py-2 rounded-md text-sm hover:bg-indigo-100 transition-colors"
                     >
                        <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5"/>
                        <span>Contact Poster</span>
                    </a>
                </div>
            </div>
             <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
                <div className="p-4 pt-0">
                    <div className="border-t pt-4">
                        <div className="space-y-2 text-sm text-gray-700 mb-4">
                            <div className="flex items-start">
                                <MapPinIcon className="w-5 h-5 mr-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div><strong>Location:</strong> {item.location}</div>
                            </div>
                            <div className="flex items-start">
                                <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 mr-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div><strong>Contact:</strong> {item.contact}</div>
                            </div>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">Full Description</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap mb-4">{item.description}</p>
                        
                        <h4 className="font-semibold text-gray-800 mb-2">Comments</h4>
                        <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                            {comments.map((comment, i) => (
                                <div key={i} className="text-sm bg-gray-100 p-2 rounded-md">
                                    <span className="font-semibold">{comment.author}: </span>
                                    <span>{comment.text}</span>
                                </div>
                            ))}
                             {comments.length === 0 && <p className="text-xs text-gray-500">No comments yet.</p>}
                        </div>
                        <form onSubmit={handleAddComment} className="flex items-center space-x-2 mt-3">
                            <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} onClick={e => e.stopPropagation()} placeholder="Add a comment..." className="flex-grow bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                            <button type="submit" onClick={e => e.stopPropagation()} className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700"><PaperAirplaneIcon className="w-5 h-5"/></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LostAndFoundItemCard;