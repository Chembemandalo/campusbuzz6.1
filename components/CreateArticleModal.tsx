import React, { useState } from 'react';
import { Article } from '../types';
import { SpinnerIcon } from './icons';

const ARTICLE_CATEGORIES = ['Academics', 'Student Life', 'Career', 'Technology', 'Opinion', 'Other'];

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateArticle: (articleData: Omit<Article, 'id' | 'author' | 'timestamp' | 'creationDate' | 'views' | 'reactions' | 'comments'>) => Promise<void>;
}

const CreateArticleModal: React.FC<CreateArticleModalProps> = ({ isOpen, onClose, onCreateArticle }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(ARTICLE_CATEGORIES[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [statusToSubmit, setStatusToSubmit] = useState<'published' | 'draft' | null>(null);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImageUrl('');
    setCategory(ARTICLE_CATEGORIES[0]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (status: 'published' | 'draft') => {
    if (!title.trim() || !content.trim() || isCreating) return;

    setIsCreating(true);
    setStatusToSubmit(status);
    
    await onCreateArticle({
        title,
        content,
        category,
        status,
        imageUrl: imageUrl || undefined,
    });
    
    setIsCreating(false);
    setStatusToSubmit(null);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Write a New Article</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                    <label htmlFor="article-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" id="article-title" value={title} onChange={(e) => setTitle(e.target.value)} required
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="article-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select id="article-category" value={category} onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {ARTICLE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="article-image" className="block text-sm font-medium text-gray-700 mb-1">Header Image URL (Optional)</label>
                        <input type="url" id="article-image" placeholder="https://example.com/image.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>
                <div>
                    <label htmlFor="article-content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea id="article-content" value={content} onChange={(e) => setContent(e.target.value)} required rows={10}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
                <button type="button" onClick={handleClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">Cancel</button>
                <button
                    type="button" onClick={() => handleSubmit('draft')} disabled={isCreating}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 w-32 flex justify-center items-center disabled:bg-gray-300">
                    {isCreating && statusToSubmit === 'draft' ? <SpinnerIcon /> : 'Save as Draft'}
                </button>
                <button
                    type="button" onClick={() => handleSubmit('published')} disabled={isCreating}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 w-32 flex justify-center items-center disabled:bg-indigo-300">
                    {isCreating && statusToSubmit === 'published' ? <SpinnerIcon /> : 'Publish'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticleModal;