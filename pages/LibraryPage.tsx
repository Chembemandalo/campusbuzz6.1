import React, { useState, useMemo, FC } from 'react';
import { LibraryResource } from '../types';
import {
  BookOpenIcon,
  SearchIcon,
  ChevronDownIcon,
  HomeIcon,
  ListBulletIcon,
  HeartIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  HeartIconSolid,
  ArrowDownTrayIcon,
  XMarkIcon,
  CalendarDaysIcon,
} from '../components/icons';

interface LibraryPageProps {
  resources: LibraryResource[];
  handleBack: () => void;
}

type LibraryView = 'discover' | 'categories' | 'my-library' | 'favorites';

const LibraryPage: React.FC<LibraryPageProps> = ({ resources }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeView, setActiveView] = useState<LibraryView>('discover');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>(['lr2']); // Pre-favorite one book for demo

    const allCategories = useMemo(() => Array.from(new Set(resources.map(r => r.category))), [resources]);

    const filteredResources = useMemo(() => {
        let results = resources;
        if (selectedCategory) {
            results = results.filter(r => r.category === selectedCategory);
        }
        if (searchTerm) {
            const lowercasedQuery = searchTerm.toLowerCase();
            results = results.filter(r => 
                r.title.toLowerCase().includes(lowercasedQuery) ||
                r.author.toLowerCase().includes(lowercasedQuery) ||
                r.description.toLowerCase().includes(lowercasedQuery)
            );
        }
        return results;
    }, [resources, searchTerm, selectedCategory]);

    const favoriteResources = useMemo(() => resources.filter(r => favorites.includes(r.id)), [resources, favorites]);
    const myLibraryResources = useMemo(() => resources.slice(0, 2), [resources]); // Placeholder for "My Library"

    const expandedBook = useMemo(() => resources.find(r => r.id === expandedBookId), [resources, expandedBookId]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // The filtering is already reactive, this function could be used for more complex logic if needed
            console.log("Searching for:", searchTerm);
        }
    };
    
    const toggleFavorite = (bookId: string) => {
        setFavorites(prev => 
            prev.includes(bookId)
            ? prev.filter(id => id !== bookId)
            : [...prev, bookId]
        );
    };

    const SidebarMenuItem: FC<{icon: FC<{className?: string}>, label: string, view: LibraryView}> = ({ icon: Icon, label, view }) => (
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveView(view); }} className={`flex items-center space-x-4 px-4 py-3 rounded-lg text-gray-700 transition-colors duration-200 ${activeView === view ? 'bg-orange-50 text-orange-600 font-bold' : 'hover:bg-gray-100'}`}>
            <Icon className="w-6 h-6" />
            <span>{label}</span>
        </a>
    );

    const BookCard: FC<{resource: LibraryResource}> = ({ resource }) => (
        <div className="flex-shrink-0 w-40 snap-start group" onClick={() => setExpandedBookId(resource.id)}>
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                <img src={resource.coverImageUrl || 'https://picsum.photos/seed/fallback/300/400'} alt={resource.title} className="w-full h-60 object-cover" />
            </div>
            <h4 className="mt-2 text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">{resource.title}</h4>
        </div>
    );
    
    const CategoryCard: FC<{categoryName: string}> = ({ categoryName }) => (
        <div className="text-center group cursor-pointer" onClick={() => { setSelectedCategory(categoryName); setActiveView('discover'); }}>
            <div className="bg-white p-4 rounded-lg shadow-md mb-2 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg aspect-square flex items-center justify-center">
                 <BookOpenIcon className="w-16 h-16 text-indigo-300" />
            </div>
            <p className="font-semibold text-gray-700 text-sm group-hover:text-indigo-600">{categoryName}</p>
        </div>
    );
    
    const ExpandedBookDetail: FC<{resource: LibraryResource; onClose: () => void; isFavorite: boolean; onToggleFavorite: (id: string) => void;}> = ({ resource, onClose, isFavorite, onToggleFavorite }) => (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-opacity" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-auto max-h-[90vh] flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
                <img src={resource.coverImageUrl || 'https://picsum.photos/seed/fallback/300/400'} alt={resource.title} className="w-full md:w-1/3 h-64 md:h-auto object-cover" />
                <div className="flex-1 flex flex-col p-8 overflow-y-auto">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-indigo-600 mb-1">{resource.category}</p>
                            <h2 className="text-3xl font-bold text-gray-900">{resource.title}</h2>
                            <p className="text-lg text-gray-500 mt-1">by {resource.author}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><XMarkIcon className="w-7 h-7"/></button>
                    </div>

                    <p className="text-gray-600 my-6 flex-grow">{resource.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mt-auto pt-4 border-t">
                        <CalendarDaysIcon className="w-4 h-4 mr-2" />
                        Published on {resource.publishedDate.toLocaleDateString()}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <a href={resource.fileUrl} download={resource.title} className="flex-1 flex items-center justify-center gap-2 bg-[#2A4039] text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors text-center">
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            Download
                        </a>
                        <button onClick={() => onToggleFavorite(resource.id)} className={`flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg transition-colors border-2 ${isFavorite ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}>
                            {isFavorite ? <HeartIconSolid className="w-5 h-5"/> : <HeartIcon className="w-5 h-5"/>}
                            {isFavorite ? 'Favorited' : 'Favorite'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const renderMainContent = () => {
        let title = "Discover";
        let itemsToDisplay: LibraryResource[] = filteredResources;

        switch(activeView) {
            case 'discover':
                title = selectedCategory ? `Category: ${selectedCategory}` : "Discover";
                itemsToDisplay = filteredResources;
                break;
            case 'categories':
                title = "All Categories";
                break;
            case 'my-library':
                title = "My Library";
                itemsToDisplay = myLibraryResources;
                break;
            case 'favorites':
                title = "My Favorites";
                itemsToDisplay = favoriteResources;
                break;
        }

        return (
            <>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                    {selectedCategory && activeView === 'discover' && (
                        <button onClick={() => setSelectedCategory(null)} className="text-sm font-semibold text-indigo-600 hover:underline">
                            Clear filter &times;
                        </button>
                    )}
                </div>

                {activeView === 'categories' ? (
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {allCategories.map(cat => (
                            <CategoryCard key={cat} categoryName={cat} />
                        ))}
                     </div>
                ) : (
                    itemsToDisplay.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
                            {itemsToDisplay.map(res => (
                                <BookCard key={res.id} resource={res} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-gray-500">
                            <p className="font-semibold">No books found.</p>
                            <p className="text-sm">Try adjusting your search or filters.</p>
                        </div>
                    )
                )}

                {activeView === 'discover' && !selectedCategory && (
                     <section className="mt-12">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Book Category</h3>
                         </div>
                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {allCategories.slice(0, 8).map(cat => (
                                <CategoryCard key={cat} categoryName={cat} />
                            ))}
                         </div>
                    </section>
                )}
            </>
        )
    }

    return (
        <div className="flex min-h-screen bg-[#F7F8FA]">
            {/* Sidebar */}
            <aside className="w-64 bg-white p-6 flex-col hidden lg:flex">
                <div className="flex items-center space-x-2 mb-10">
                    <BookOpenIcon className="w-8 h-8 text-orange-500"/>
                    <h1 className="text-xl font-bold text-gray-800">CAMPUS LIBRARY</h1>
                </div>
                
                <nav className="flex-grow">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">Menu</h2>
                    <div className="space-y-2">
                        <SidebarMenuItem icon={HomeIcon} label="Discover" view="discover" />
                        <SidebarMenuItem icon={ListBulletIcon} label="Category" view="categories" />
                        <SidebarMenuItem icon={BookOpenIcon} label="My Library" view="my-library" />
                        <SidebarMenuItem icon={HeartIcon} label="Favorite" view="favorites" />
                    </div>
                </nav>
                
                <div>
                     <div className="space-y-2">
                        <SidebarMenuItem icon={Cog6ToothIcon} label="Setting" view="discover" />
                        <SidebarMenuItem icon={QuestionMarkCircleIcon} label="Help" view="discover" />
                        <SidebarMenuItem icon={ArrowRightOnRectangleIcon} label="Log out" view="discover" />
                    </div>
                </div>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 bg-[#F5F3EF] lg:rounded-l-3xl p-6 sm:p-8 overflow-y-auto">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <h2 className="text-4xl font-bold text-gray-800">Discover</h2>
                    
                    <div className="flex items-center bg-white rounded-lg shadow-sm w-full max-w-lg">
                        <div className="flex items-center space-x-2 p-3 border-r cursor-pointer hover:bg-gray-50">
                           <span className="text-sm font-medium text-gray-600">All Categories</span>
                           <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Find the book you like..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-full py-3 px-4 text-sm text-gray-700 focus:outline-none bg-transparent"
                        />
                        <button onClick={() => console.log("Searching")} className="bg-[#2A4039] text-white font-semibold py-2 px-6 m-1.5 rounded-lg hover:bg-opacity-90 transition-colors">
                            Search
                        </button>
                    </div>

                </header>

                {renderMainContent()}
            </main>
            
            {expandedBook && (
                <ExpandedBookDetail 
                    resource={expandedBook} 
                    onClose={() => setExpandedBookId(null)}
                    isFavorite={favorites.includes(expandedBook.id)}
                    onToggleFavorite={toggleFavorite}
                />
            )}
        </div>
    );
};

export default LibraryPage;