import React, { useState, useMemo } from 'react';
import { LibraryResource } from '../types';
import LibraryResourceCard from '../components/LibraryResourceCard';
import { BookOpenIcon, SearchIcon } from '../components/icons';

interface LibraryPageProps {
  resources: LibraryResource[];
}

const CATEGORIES = ['All', 'Computer Science', 'Artificial Intelligence', 'Arts & Humanities', 'Science'];

const LibraryPage: React.FC<LibraryPageProps> = ({ resources }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [expandedResourceId, setExpandedResourceId] = useState<string | null>(null);

    const handleToggleExpand = (resourceId: string) => {
        setExpandedResourceId(prevId => (prevId === resourceId ? null : resourceId));
    };

    const filteredResources = useMemo(() => {
        return resources.filter(res => {
            const categoryMatch = selectedCategory === 'All' || res.category === selectedCategory;
            const searchMatch = searchQuery === '' || 
                                res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                res.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                res.description.toLowerCase().includes(searchQuery.toLowerCase());
            return searchMatch && categoryMatch;
        });
    }, [resources, searchQuery, selectedCategory]);

    return (
        <div className="bg-gray-100 min-h-screen pt-8 animate-fade-in-up">
            <div className="container mx-auto px-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-lg p-8 md:p-12 flex justify-center items-center relative overflow-hidden text-center">
                    <div className="absolute -left-10 -bottom-10 text-white/10">
                        <BookOpenIcon className="w-48 h-48 transform -rotate-12" />
                    </div>
                    <div className="z-10">
                        <h1 className="text-4xl font-bold">Digital Library</h1>
                        <p className="text-indigo-200 mt-2 max-w-2xl mx-auto">Access millions of digital books, academic journals, and research papers from our extensive online collection.</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md my-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="relative flex-grow min-w-[250px]">
                        <input
                            type="text"
                            placeholder="Search by title, author, or keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="category-select" className="text-sm font-medium text-gray-600">Category:</label>
                        <select
                            id="category-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>

                {filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResources.map(res => (
                            <LibraryResourceCard 
                                key={res.id} 
                                resource={res}
                                isExpanded={expandedResourceId === res.id}
                                onToggleExpand={() => handleToggleExpand(res.id)} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-lg shadow-sm text-center text-gray-500">
                        <p className="font-semibold text-lg">No Resources Found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibraryPage;