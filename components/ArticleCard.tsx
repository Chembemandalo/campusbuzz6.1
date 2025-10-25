import React from 'react';
import { Article, User, Page } from '../types';

interface ArticleCardProps {
  article: Article;
  currentUser: User;
  onNavigate: (page: Page, data?: User | Article) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onNavigate }) => {

  const truncateText = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  return (
    <div 
        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        onClick={() => onNavigate('singleArticle', article)}
    >
      {article.imageUrl && (
        <div className="relative">
          <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
           <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {article.category}
        </div>
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-indigo-600">{article.title}</h3>
        
        <div className="my-2 flex justify-between items-center text-xs text-gray-500">
            <span>{article.timestamp}</span>
        </div>
        
        <p className="text-sm text-gray-700 mt-1 line-clamp-3 flex-grow">{truncateText(article.content, 100)}</p>
        
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center min-w-0">
             <img src={article.author.avatarUrl} alt={article.author.name} className="w-8 h-8 rounded-full mr-2" />
             <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{article.author.name}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;