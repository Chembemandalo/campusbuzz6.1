import React, { useState, useMemo } from 'react';
import { MarketplaceItem, User } from '../types';
import MarketplaceItemCard from '../components/MarketplaceItemCard';
import { BuildingStorefrontIcon } from '../components/icons';

interface MarketplacePageProps {
  items: MarketplaceItem[];
  currentUser: User;
  onInitiateChat: (seller: User) => void;
  onUpdateListingStatus: (itemId: string, status: 'Available' | 'Sold') => Promise<void>;
  onOpenCreateListingModal: () => void;
}

const CATEGORIES = ['All', 'Textbooks', 'Electronics', 'Furniture', 'Clothing', 'Other'];

const MarketplacePage: React.FC<MarketplacePageProps> = ({ items, currentUser, onInitiateChat, onUpdateListingStatus, onOpenCreateListingModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const handleToggleExpand = (itemId: string) => {
    // This function ensures only one item can be expanded at a time by using a functional state update.
    // Clicking a new item will close the previously expanded one.
    // Clicking the currently expanded item will collapse it.
    setExpandedItemId(currentExpandedId => {
      if (currentExpandedId === itemId) {
        return null; // Collapse if the same item is clicked again.
      }
      return itemId; // Otherwise, expand the new item.
    });
  };
  
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
      // Search query is no longer used in an input, but keeping logic for future use
      const searchMatch = searchQuery === '' || 
                          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return searchMatch && categoryMatch;
    });
  }, [items, searchQuery, selectedCategory]);


  return (
    <div className="bg-gray-100 min-h-screen pt-8 animate-fade-in-up">
      {/* Banner */}
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg shadow-lg p-8 md:p-12 flex justify-between items-center relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 text-white/10">
                <BuildingStorefrontIcon className="w-48 h-48 transform -rotate-12" />
            </div>
            <div className="z-10 text-center w-full">
                <h1 className="text-4xl font-bold">Shop Page</h1>
                <p className="text-indigo-200 mt-1">Home / Shop</p>
            </div>
            <div className="absolute -right-4 -top-4 text-white/10">
                 <span className="block text-[8rem] transform rotate-12">🛒</span>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <label htmlFor="category-select" className="text-sm font-medium text-gray-600">Filter By:</label>
                    <select
                        id="category-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        id="sort-select"
                        className="bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option>Sort by Popularity</option>
                        <option>Sort by Price: Low to High</option>
                        <option>Sort by Price: High to Low</option>
                    </select>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors">
                    Filter Product
                </button>
                <button 
                    onClick={onOpenCreateListingModal}
                    className="bg-green-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
                >
                    Create Listing
                </button>
            </div>
        </div>

        {/* Main Content */}
        <main>
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredItems.map(item => (
                        <MarketplaceItemCard 
                          key={item.id} 
                          item={item} 
                          currentUser={currentUser}
                          isExpanded={expandedItemId === item.id}
                          onToggleExpand={() => handleToggleExpand(item.id)}
                          onInitiateChat={onInitiateChat}
                          onUpdateStatus={onUpdateListingStatus}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                    <p className="font-semibold text-lg">No items found</p>
                    <p className="text-sm mt-1">Try adjusting your filters.</p>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default MarketplacePage;
