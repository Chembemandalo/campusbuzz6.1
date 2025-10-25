import React, { useState, ChangeEvent } from 'react';
import { MarketplaceItem } from '../types';
import { SpinnerIcon, CameraIcon, XCircleIcon } from './icons';

const CATEGORIES: MarketplaceItem['category'][] = ['Textbooks', 'Electronics', 'Furniture', 'Clothing', 'Other'];

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateListing: (listingData: Omit<MarketplaceItem, 'id' | 'seller' | 'ratings' | 'status'>) => Promise<void>;
}

const CreateListingModal: React.FC<CreateListingModalProps> = ({ isOpen, onClose, onCreateListing }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<MarketplaceItem['category']>('Textbooks');
  const [images, setImages] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // FIX: Explicitly type the 'file' parameter to fix type inference issue.
      const imagePromises = filesArray.map((file: File) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then(base64Images => {
        setImages(prev => [...prev, ...base64Images]);
      }).catch(error => {
        console.error("Error reading files:", error);
        alert("There was an error uploading images.");
      });
    }
  };
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Textbooks');
    setImages([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating || !name || !description || !price || images.length === 0) return;

    setIsCreating(true);
    await onCreateListing({
        name,
        description,
        price: parseFloat(price),
        category,
        images,
    });
    setIsCreating(false);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">List a New Item</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                    <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" id="item-name" value={name} onChange={(e) => setName(e.target.value)} required
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                    <label htmlFor="item-desc" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea id="item-desc" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="item-price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input type="number" id="item-price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01"
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="item-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select id="item-category" value={category} onChange={(e) => setCategory(e.target.value as MarketplaceItem['category'])} required
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images (add at least 1)</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {images.map((img, index) => (
                           <div key={index} className="relative aspect-square">
                             <img src={img} alt={`preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                             <button type="button" onClick={() => removeImage(index)} className="absolute -top-1 -right-1 bg-gray-700 text-white rounded-full">
                                <XCircleIcon className="w-5 h-5"/>
                             </button>
                           </div>
                        ))}
                        <label htmlFor="image-upload" className="cursor-pointer aspect-square flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-200 hover:border-gray-400">
                           <CameraIcon className="w-8 h-8 text-gray-400" />
                           <span className="text-xs text-gray-500 mt-1">Add</span>
                           <input id="image-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
                <button type="button" onClick={handleClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={isCreating} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 w-32 flex justify-center items-center disabled:bg-indigo-300">
                    {isCreating ? <SpinnerIcon /> : 'List Item'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingModal;