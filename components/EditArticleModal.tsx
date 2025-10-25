import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { SpinnerIcon } from './icons';

const ARTICLE_CATEGORIES = ['Academics', 'Student Life', 'Career', 'Technology', 'Opinion', 'Other'];

interface EditArticleModalProps {
  isOpen: boolean;
  article: Article | null;
  onClose: () => void;
  onUpdateArticle: (articleId: string, updatedData: Partial<Article>) => Promise<void>;
}

const EditArticleModal: React.FC<EditArticleModalProps> = ({ isOpen, article, onClose, onUpdateArticle }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(ARTICLE_CATEGORIES[0]);
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [imageUrl, setImageUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
      setCategory(article.category);
      setStatus(article.status);
      setImageUrl(article.imageUrl || '');
    }
  }, [article]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || isUpdating) return;

    setIsUpdating(true);
    await onUpdateArticle(article.id, {
        title,
        content,
        category,
        status,
        imageUrl: imageUrl || undefined,
    });
    setIsUpdating(false);
    onClose();
  };

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Edit Article</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                    <label htmlFor="edit-article-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" id="edit-article-title" value={title} onChange={(e) => setTitle(e.target.value)} required
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="edit-article-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select id="edit-article-category" value={category} onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {ARTICLE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="edit-article-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select id="edit-article-status" value={status} onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>
                 <div>
                    <label htmlFor="edit-article-image" className="block text-sm font-medium text-gray-700 mb-1">Header Image URL (Optional)</label>
                    <input type="url" id="edit-article-image" placeholder="https://example.com/image.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                    <label htmlFor="edit-article-content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea id="edit-article-content" value={content} onChange={(e) => setContent(e.target.value)} required rows={10}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">Cancel</button>
                <button
                    type="submit" disabled={isUpdating}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 w-32 flex justify-center items-center disabled:bg-indigo-300">
                    {isUpdating ? <SpinnerIcon /> : 'Save Changes'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticleModal;