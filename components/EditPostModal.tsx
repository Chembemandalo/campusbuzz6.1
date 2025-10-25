import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { SpinnerIcon } from './icons';

interface EditPostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (postId: string, newContent: string) => Promise<void>;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, isOpen, onClose, onSave }) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setContent(post.content);
    }
  }, [post]);

  if (!isOpen || !post) {
    return null;
  }

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    await onSave(post.id, content);
    setIsSaving(false);
    // The parent component will close the modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Edit Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <div className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={6}
          />
          {post.imageUrl && (
            <div className="mt-4">
              <img src={post.imageUrl} alt="Post content" className="w-full h-auto rounded-lg max-h-64 object-cover" />
            </div>
          )}
        </div>
        <div className="p-4 border-t flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 w-32 flex justify-center items-center disabled:bg-indigo-300"
          >
            {isSaving ? <SpinnerIcon /> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;