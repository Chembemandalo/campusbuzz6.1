import React, { useState } from 'react';
import { Event, User } from '../types';
import { CalendarDaysIcon, ClockIcon, UserGroupIcon, SpinnerIcon } from './icons';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onRsvp: (eventId: string) => Promise<void>;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, currentUser, onClose, onRsvp }) => {
  const [isRsvping, setIsRsvping] = useState(false);

  if (!isOpen || !event) {
    return null;
  }

  const isAttending = event.attendees.includes(currentUser.id);

  const handleRsvpClick = async () => {
    if(isRsvping) return;
    setIsRsvping(true);
    await onRsvp(event.id);
    setIsRsvping(false);
  };

  const formatDateRange = (start: Date, end: Date) => {
    const startDate = start.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const startTime = start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    const endTime = end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    // Assuming events are single-day for this simple format
    return `${startDate} from ${startTime} to ${endTime}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Campus Buzz: Large banner image for an event in the details modal */}
        <img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover rounded-t-lg" />
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none -mt-2">&times;</button>
          </div>
          <p className="text-sm text-gray-500 mb-4">Organized by <span className="font-semibold">{event.organizer.name}</span></p>

          <div className="space-y-3 text-gray-700 my-6">
            <div className="flex items-center">
              <CalendarDaysIcon className="w-5 h-5 mr-3 text-indigo-600" />
              <span>{formatDateRange(event.startTime, event.endTime)}</span>
            </div>
             <div className="flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-3 text-indigo-600" />
              <span>{event.attendees.length} {event.attendees.length === 1 ? 'person is' : 'people are'} going</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">About this event</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            onClick={handleRsvpClick}
            disabled={isRsvping}
            className={`px-6 py-3 rounded-lg font-bold text-white transition-colors w-full sm:w-auto flex justify-center items-center ${
                isAttending && !isRsvping ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
            } disabled:bg-gray-400`}
          >
            {isRsvping ? <SpinnerIcon /> : (isAttending ? '✓ Attending' : 'RSVP Now')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;