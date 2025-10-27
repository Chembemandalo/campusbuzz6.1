import React, { useState, useMemo } from 'react';
import { LostAndFoundItem } from '../types';
import LostAndFoundItemCard from '../components/LostAndFoundItemCard';
// FIX: Add BackButton to imports
import { PlusIcon, SearchIcon, BackButton } from '../components/icons';

interface LostAndFoundPageProps {
  items: LostAndFoundItem[];
  onOpenCreateModal: () => void;
  // FIX: Add handleBack to props interface
  handleBack: () => void;
}

const LostAndFoundPage: React.FC<LostAndFoundPageProps> = ({ items, onOpenCreateModal, handleBack }) => {
    const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

    const handleToggleExpand = (itemId: string) => {
        setExpandedItemId(prevId => (prevId === itemId ? null : itemId));
    };

    const activeItems = useMemo(() => {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return items.filter(item => item.postedAt >= thirtyDaysAgo);
    }, [items]);

    const filteredItems = useMemo(() => {
        if (filter === 'all') return activeItems;
        return activeItems.filter(item => item.type === filter);
    }, [activeItems, filter]);

    return (
        <div className="bg-gray-100 min-h-screen pt-8 animate-fade-in-up">
            <div className="container mx-auto px-4">
                {/* FIX: Add BackButton component */}
                <BackButton onClick={handleBack} className="mb-4" />
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg shadow-lg p-8 md:p-12 flex justify-center items-center relative overflow-hidden text-center">
                    <div className="absolute -left-10 -bottom-10 text-white/10">
                        <SearchIcon className="w-48 h-48 transform -rotate-12" />
                    </div>
                    <div className="z-10">
                        <h1 className="text-3xl md:text-4xl font-bold">Lost & Found</h1>
                        <p className="text-sm md:text-base text-yellow-200 mt-2">Help reunite items with their owners.</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md my-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-2">
                        <FilterButton label="All" isActive={filter === 'all'} onClick={() => setFilter('all')} />
                        <FilterButton label="Lost" isActive={filter === 'lost'} onClick={() => setFilter('lost')} />
                        <FilterButton label="Found" isActive={filter === 'found'} onClick={() => setFilter('found')} />
                    </div>
                    <button
                        onClick={onOpenCreateModal}
                        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Post an Item</span>
                    </button>
                </div>

                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map(item => (
                            <LostAndFoundItemCard 
                                key={item.id} 
                                item={item}
                                isExpanded={expandedItemId === item.id}
                                onToggleExpand={() => handleToggleExpand(item.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500">No items found for this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
            isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
    >
        {label}
    </button>
);

export default LostAndFoundPage;
