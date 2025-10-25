import React, { useState, ChangeEvent } from 'react';
import { LostAndFoundItem } from '../types';
import { SpinnerIcon } from './icons';

interface CreateLostAndFoundItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateItem: (itemData: Omit<LostAndFoundItem, 'id' | 'postedBy' | 'postedAt'>) => Promise<void>;
}

const CreateLostAndFoundItemModal: React.FC<CreateLostAndFoundItemModalProps> = ({ isOpen, onClose, onCreateItem }) => {
    const [type, setType] = useState<'lost' | 'found'>('lost');
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [imageUrl, setImageUrl] = useState('');
    const [contact, setContact] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    
    const resetForm = () => {
        setType('lost');
        setItemName('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setImageUrl('');
        setContact('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isCreating) return;
        
        setIsCreating(true);
        await onCreateItem({
            type,
            itemName,
            description,
            date: new Date(date),
            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop',
            contact,
        });
        setIsCreating(false);
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Post a Lost or Found Item</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">This is a...</label>
                            <div className="flex space-x-4">
                                <RadioPill id="lost" name="type" label="Lost Item" checked={type === 'lost'} onChange={() => setType('lost')} />
                                <RadioPill id="found" name="type" label="Found Item" checked={type === 'found'} onChange={() => setType('found')} />
                            </div>
                        </div>
                        <Input id="itemName" label="Item Name" value={itemName} onChange={e => setItemName(e.target.value)} required placeholder="e.g., Black Jansport Backpack" />
                        <TextArea id="description" label="Description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} placeholder="Provide details like where you lost/found it, identifying features, etc." />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input id="date" label={type === 'lost' ? 'Date Lost' : 'Date Found'} type="date" value={date} onChange={e => setDate(e.target.value)} required />
                            <Input id="contact" label="Contact Info" value={contact} onChange={e => setContact(e.target.value)} required placeholder="Your email or phone number" />
                        </div>
                         <Input id="imageUrl" label="Image URL (Optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
                    </div>
                    <div className="p-4 border-t flex justify-end">
                        <button type="submit" disabled={isCreating} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 w-28 flex justify-center items-center disabled:bg-indigo-300">
                           {isCreating ? <SpinnerIcon /> : 'Post Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Input: React.FC<any> = ({ id, label, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} {...props} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>
);
const TextArea: React.FC<any> = ({ id, label, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea id={id} {...props} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>
);
const RadioPill: React.FC<{ id: string, name: string, label: string, checked: boolean, onChange: () => void }> = ({ id, name, label, checked, onChange }) => (
    <div>
        <input type="radio" id={id} name={name} checked={checked} onChange={onChange} className="sr-only" />
        <label htmlFor={id} className={`px-4 py-2 rounded-full cursor-pointer transition-colors text-sm font-medium ${checked ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            {label}
        </label>
    </div>
);

export default CreateLostAndFoundItemModal;
