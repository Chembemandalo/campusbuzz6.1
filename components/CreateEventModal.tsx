import React, { useState } from 'react';
import { Event } from '../types';
import { SpinnerIcon } from './icons';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (eventData: Omit<Event, 'id' | 'organizer' | 'attendees' | 'startTime' | 'endTime'> & { startTime: string, endTime: string }) => Promise<void>;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onCreateEvent }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating || !title || !description || !startTime || !endTime) return;

    setIsCreating(true);
    await onCreateEvent({
        title,
        description,
        imageUrl: imageUrl || `https://picsum.photos/seed/${title.replace(/\s+/g, '-')}/1200/600`,
        startTime,
        endTime,
    });
    setIsCreating(false);
    onClose();
    // Reset form
    setTitle('');
    setDescription('');
    setImageUrl('');
    setStartTime('');
    setEndTime('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Create New Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                    <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                    <input
                        type="text" id="event-title" value={title} onChange={(e) => setTitle(e.target.value)} required
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                 <div>
                    <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        id="event-description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                 <div>
                    <label htmlFor="event-image" className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                    <input
                        type="url" id="event-image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="https://picsum.photos/..."
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="event-start" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                            type="datetime-local" id="event-start" value={startTime} onChange={(e) => setStartTime(e.target.value)} required
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="event-end" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                            type="datetime-local" id="event-end" value={endTime} onChange={(e) => setEndTime(e.target.value)} required
                             min={startTime}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
            <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={isCreating}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 w-32 flex justify-center items-center disabled:bg-indigo-300"
            >
                {isCreating ? <SpinnerIcon /> : 'Create Event'}
            </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
