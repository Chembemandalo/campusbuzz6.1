import React from 'react';
import { LibraryResource } from '../types';
import { EyeIcon, BookOpenIcon, CalendarDaysIcon } from '../components/icons';

interface LibraryResourceCardProps {
    resource: LibraryResource;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

const LibraryResourceCard: React.FC<LibraryResourceCardProps> = ({ resource, isExpanded, onToggleExpand }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative cursor-pointer" onClick={onToggleExpand}>
                <img src={resource.coverImageUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1887&auto=format&fit=crop'} alt={resource.title} className="w-full h-56 object-cover" />
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {resource.type}
                </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center">
                    <p className="text-white font-bold text-center p-4">{isExpanded ? 'Collapse' : 'View Details'}</p>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-xs font-semibold text-indigo-600 mb-1">{resource.category}</p>
                <h3 className="text-md font-bold text-gray-800 line-clamp-2 group-hover:text-indigo-700 flex-grow cursor-pointer" onClick={onToggleExpand}>{resource.title}</h3>
                <p className="text-sm text-gray-500 mt-1">by {resource.author}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                     <span className="text-xs text-gray-400">{resource.publishedDate.getFullYear()}</span>
                    <a href={resource.fileUrl} download onClick={e => e.stopPropagation()} className="flex items-center space-x-2 text-sm text-white font-semibold bg-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-700">
                        <BookOpenIcon className="w-5 h-5"/>
                        <span>Read</span>
                    </a>
                </div>
            </div>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
                <div className="p-4 pt-0">
                    <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Abstract / Summary</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{resource.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibraryResourceCard;