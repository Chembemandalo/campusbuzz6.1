import React, { useState, useMemo } from 'react';
import { Event, User } from '../types';
import { CalendarDaysIcon, ClockIcon, UsersIcon, MapPinIcon, UserIcon, SpinnerIcon, SuccessCheckIcon } from './icons';

interface EventCardProps {
  event: Event;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRsvp: (eventId: string) => Promise<void>;
  currentUser: User;
  allUsers: User[];
}

const EventCard: React.FC<EventCardProps> = ({ event, isExpanded, onToggleExpand, onRsvp, currentUser, allUsers }) => {
  const [isRsvping, setIsRsvping] = useState(false);
  const [isRsvpSuccess, setIsRsvpSuccess] = useState(false);
  const isAttending = event.attendees.includes(currentUser.id);

  const attendees = useMemo(() => 
    allUsers.filter(user => event.attendees.includes(user.id)),
    [allUsers, event.attendees]
  );

  const handleRsvpClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRsvping || isRsvpSuccess) return;
    const wasAttending = isAttending;
    setIsRsvping(true);
    await onRsvp(event.id);
    setIsRsvping(false);
    if (!wasAttending) {
        setIsRsvpSuccess(true);
        setTimeout(() => setIsRsvpSuccess(false), 2000);
    }
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
            <h4 className="font-semibold text-gray-800 mb-3">Attendees ({attendees.length})</h4>
            {attendees.length > 0 ? (
                <div className="flex -space-x-2 overflow-hidden mb-4">
                    {attendees.slice(0, 10).map(attendee => (
                        <img
                            key={attendee.id}
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                            src={attendee.avatarUrl}
                            alt={attendee.name}
                            title={attendee.name}
                        />
                    ))}
                    {attendees.length > 10 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 ring-2 ring-white text-xs font-medium text-gray-600">
                            +{attendees.length - 10}
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-sm text-gray-500 mb-4">Be the first to RSVP!</p>
            )}
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
                disabled={isRsvping || isRsvpSuccess}
                className={`mt-4 w-full px-6 py-3 rounded-lg font-bold text-white transition-colors flex justify-center items-center ${
                    isRsvpSuccess ? 'bg-green-600' : (isAttending && !isRsvping ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700')
                } disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
                {isRsvping ? <SpinnerIcon /> : isRsvpSuccess ? <SuccessCheckIcon className="w-6 h-6 text-white"/> : (isAttending ? '✓ Going' : 'I\'m Going')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
