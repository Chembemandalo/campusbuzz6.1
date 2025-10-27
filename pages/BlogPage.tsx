import React, { useState, useMemo } from 'react';
import { Article, User, Page } from '../types';
import ArticleCard from '../components/ArticleCard';
import { RssIcon, SearchIcon, PencilSquareIcon, BackButton } from '../components/icons';

const ARTICLE_CATEGORIES = ['All', 'Academics', 'Student Life', 'Career', 'Technology', 'Opinion', 'Other'];

interface BlogPageProps {
  articles: Article[];
  currentUser: User;
  onNavigate: (page: Page, data?: User | Article) => void;
  onOpenCreateArticleModal: () => void;
  handleBack: () => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ articles, currentUser, onNavigate, onOpenCreateArticleModal, handleBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const publishedArticles = useMemo(() =>
    articles.filter(a => a.status === 'published').sort((a, b) => b.creationDate.getTime() - a.creationDate.getTime()),
    [articles]
  );
  
  const filteredArticles = useMemo(() => {
    return publishedArticles.filter(article => {
      const searchMatch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatch = selectedCategory === 'All' || article.category === selectedCategory;
      return searchMatch && categoryMatch;
    });
  }, [publishedArticles, searchQuery, selectedCategory]);

  return (
    <div className="bg-gray-100 min-h-screen pt-8 animate-fade-in-up">
       {/* Banner */}
      <div className="container mx-auto px-4">
        <BackButton onClick={handleBack} className="mb-4" />
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-lg p-8 md:p-12 flex justify-center items-center relative overflow-hidden text-center">
            <div className="absolute -left-10 -bottom-10 text-white/10">
                <RssIcon className="w-48 h-48 transform -rotate-12" />
            </div>
            
            <div className="z-10">
                <h1 className="text-2xl md:text-4xl font-bold">Campus Buzz News</h1>
                <p className="text-sm md:text-base text-purple-200 mt-2">Insights, stories, and news from the Rockview community.</p>
            </div>
            
            <div className="absolute -right-4 -top-4 text-white/10">
                 <PencilSquareIcon className="w-32 h-32 transform rotate-12" />
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-grow flex-wrap">
            <div className="relative flex-grow min-w-[200px]">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {ARTICLE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
           <div>
            <button
                onClick={onOpenCreateArticleModal}
                className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-500 transition-colors w-full sm:w-auto"
            >
                Write Article
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
                <ArticleCard 
                    key={article.id} 
                    article={article} 
                    currentUser={currentUser}
                    onNavigate={onNavigate}
                />
            ))
           ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500 col-span-full">
                <p>No articles found matching your criteria.</p>
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;