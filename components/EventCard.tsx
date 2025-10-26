import React, { useState } from 'react';
import { Event, User } from '../types';
import { CalendarDaysIcon, ClockIcon, UsersIcon, MapPinIcon, UserIcon, SpinnerIcon } from './icons';

interface EventCardProps {
  event: Event;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRsvp: (eventId: string) => Promise<void>;
  currentUser: User;
}

const EventCard: React.FC<EventCardProps> = ({ event, isExpanded, onToggleExpand, onRsvp, currentUser }) => {
  const [isRsvping, setIsRsvping] = useState(false);
  const isAttending = event.attendees.includes(currentUser.id);

  const handleRsvpClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if(isRsvping) return;
    setIsRsvping(true);
    await onRsvp(event.id);
    setIsRsvping(false);
  };

  const formatDate = (date: Date) => date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (date: Date) => date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="flex flex-col md:flex-row cursor-pointer" onClick={onToggleExpand}>
        <img src={event.imageUrl} alt={event.title} className="w-full md:w-1/3 h-48 md:h-auto object-cover" />
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <CalendarDaysIcon className="w-4 h-4 mr-2" />
              <span>{formatDate(event.startTime)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <ClockIcon className="w-4 h-4 mr-2" />
              <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
            </div>
            <p className="text-gray-700 text-sm mb-4 line-clamp-2">{event.description}</p>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center text-sm text-gray-600 font-medium">
              <UsersIcon className="w-5 h-5 mr-2" />
              <span>{event.attendees.length} {event.attendees.length === 1 ? 'person' : 'people'} going</span>
            </div>
            <span className="text-indigo-600 font-semibold text-sm">
                {isExpanded ? 'Collapse' : 'View Details'}
            </span>
          </div>
        </div>
      </div>
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
        <div className="p-4 pt-0">
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Full Details</h4>
            <div className="space-y-3 text-sm text-gray-700 mb-4">
                 <div className="flex items-start">
                    <MapPinIcon className="w-5 h-5 mr-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{event.location}</span>
                </div>
                 <div className="flex items-start">
                    <UserIcon className="w-5 h-5 mr-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>Organized by <strong>{event.organizer.name}</strong></span>
                </div>
            </div>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{event.description}</p>
            <button
                onClick={handleRsvpClick}
                disabled={isRsvping}
                className={`mt-4 w-full px-6 py-3 rounded-lg font-bold text-white transition-colors flex justify-center items-center ${
                    isAttending && !isRsvping ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'
                } disabled:bg-gray-400`}
            >
                {isRsvping ? <SpinnerIcon /> : (isAttending ? '✓ Going' : 'I\'m Going')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;