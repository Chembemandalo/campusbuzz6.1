import React, { useState, useMemo } from 'react';
import { Post, Event, Page, Article, User } from '../types';
import ImageCard from '../components/ImageCard';
import { PlusIcon } from '../components/icons';
import EditPostModal from '../components/EditPostModal'; // Re-using for viewing

interface GalleryPageProps {
  posts: Post[];
  events: Event[];
  onNavigate: (page: Page, data?: User | Article) => void;
  onOpenCreatePostModal: () => void;
}

const GalleryPage: React.FC<GalleryPageProps> = ({ posts, events, onNavigate, onOpenCreatePostModal }) => {
    const [view, setView] = useState<'all' | string>('all'); // 'all' or an eventId
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const imagePosts = useMemo(() => 
        posts.filter(p => p.imageUrl).sort((a, b) => b.creationDate.getTime() - a.creationDate.getTime()),
    [posts]);

    const filteredImagePosts = useMemo(() => {
        if (view === 'all') {
            return imagePosts;
        }
        return imagePosts.filter(p => p.eventId === view);
    }, [imagePosts, view]);

    const selectedEvent = useMemo(() => {
        if (view === 'all') return null;
        return events.find(e => e.id === view);
    }, [events, view]);

    return (
        <>
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div 
                    className="h-64 rounded-lg bg-cover bg-center flex items-center justify-center text-white p-4 mb-8"
                    style={{backgroundImage: 'url(https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'}}
                >
                    <div className="text-center bg-black/40 p-6 rounded-lg">
                        <h1 className="text-4xl font-bold">Campus Gallery</h1>
                        <p className="mt-2 text-gray-200">A visual journey through life at Rockview University.</p>
                    </div>
                </div>

                {/* Event Galleries */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Galleries</h2>
                    <div className="flex space-x-4 overflow-x-auto pb-4">
                        <div 
                            onClick={() => setView('all')} 
                            className={`relative rounded-lg overflow-hidden shadow-md group cursor-pointer h-24 w-48 flex-shrink-0 transition-all duration-300 ${view === 'all' ? 'ring-4 ring-indigo-500' : 'hover:scale-105'}`}
                        >
                            <div className="absolute inset-0 bg-gray-700"></div>
                             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-3 text-white w-full">
                                <h3 className="font-bold text-sm">All Photos</h3>
                            </div>
                        </div>
                        {events.map(event => (
                            <div 
                                key={event.id}
                                onClick={() => setView(event.id)}
                                className={`relative rounded-lg overflow-hidden shadow-md group cursor-pointer h-24 w-48 flex-shrink-0 transition-all duration-300 ${view === event.id ? 'ring-4 ring-indigo-500' : 'hover:scale-105'}`}
                            >
                                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-3 text-white w-full">
                                    <h3 className="font-bold text-sm truncate">{event.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* Main Gallery Grid */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {selectedEvent ? `Photos from ${selectedEvent.title}` : 'Latest Photos'}
                    </h2>
                    {filteredImagePosts.length > 0 ? (
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                           {filteredImagePosts.map(post => (
                               <ImageCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />
                           ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                            <p>No photos found for this event.</p>
                        </div>
                    )}
                </section>
            </div>
            {/* FAB to create post */}
            <button 
                onClick={onOpenCreatePostModal}
                className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-110"
                aria-label="Post a new picture"
            >
                <PlusIcon className="w-8 h-8"/>
            </button>
        </div>
        
        {/* Using EditPostModal as a simple viewer for now */}
        <EditPostModal 
            post={selectedPost}
            isOpen={!!selectedPost}
            onClose={() => setSelectedPost(null)}
            onSave={async () => {}} // Read-only, so save does nothing
        />
        </>
    );
};

export default GalleryPage;