import React from 'react';
import { Event } from '../types';
import { CalendarDaysIcon, ClockIcon, UsersIcon } from './icons';

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row transition-shadow duration-300 hover:shadow-xl">
      {/* Campus Buzz: Main image for an event card */}
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
          <button
            onClick={() => onViewDetails(event)}
            className="bg-indigo-100 text-indigo-700 font-semibold px-4 py-2 rounded-md text-sm hover:bg-indigo-200 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;