import React, { useState, useMemo } from 'react';
import { Event as EventType, User } from '../types';
import Calendar from '../components/Calendar';
import EventCard from '../components/EventCard';
import { CalendarDaysIcon, MegaphoneIcon, BackButton } from '../components/icons';

interface EventsPageProps {
  events: EventType[];
  currentUser: User;
  onRsvp: (eventId: string) => Promise<void>;
  onOpenCreateEventModal: () => void;
  handleBack: () => void;
}

const EventsPage: React.FC<EventsPageProps> = ({ events, currentUser, onRsvp, onOpenCreateEventModal, handleBack }) => {
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const sortedEvents = useMemo(() => 
    [...events].sort((a, b) => a.startTime.getTime() - b.startTime.getTime()),
    [events]
  );
  
  const filteredEvents = useMemo(() => {
      if (!selectedDate) {
          // Show upcoming events
          const today = new Date();
          today.setHours(0,0,0,0);
          return sortedEvents.filter(event => event.startTime >= today);
      }
      return sortedEvents.filter(event => 
          event.startTime.toDateString() === selectedDate.toDateString()
      );
  }, [sortedEvents, selectedDate]);

  const calendarEvents = sortedEvents.map(e => ({ date: e.startTime }));

  const handleToggleExpand = (eventId: string) => {
    setExpandedEventId(prevId => (prevId === eventId ? null : eventId));
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-8 animate-fade-in-up">
      {/* Banner */}
      <div className="container mx-auto px-4">
        <BackButton onClick={handleBack} className="mb-4" />
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-lg shadow-lg p-8 md:p-12 flex justify-center items-center relative overflow-hidden text-center">
            <div className="absolute -left-10 -bottom-10 text-white/10">
                <CalendarDaysIcon className="w-48 h-48 transform -rotate-12" />
            </div>
            
            <div className="z-10">
                <h1 className="text-2xl md:text-4xl font-bold">University Events</h1>
                <p className="text-sm md:text-base text-blue-200 mt-2">Stay up to date with campus happenings.</p>
            </div>
            
            <div className="absolute -right-4 -top-4 text-white/10">
                 <MegaphoneIcon className="w-32 h-32 transform rotate-12" />
            </div>
        </div>
      </div>


      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4">
          <div className="sticky top-28">
            <Calendar 
              currentDate={currentCalendarDate}
              onDateChange={setCurrentCalendarDate}
              events={calendarEvents}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>
        </aside>
        
        <main className="lg:col-span-8">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    {selectedDate 
                        ? `Events for ${selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}` 
                        : 'Upcoming Events'}
                </h2>
                <button
                    onClick={onOpenCreateEventModal}
                    className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
                >
                    <span>Create Event</span>
                </button>
            </div>
            <div className="space-y-6">
            {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                    <EventCard 
                        key={event.id} 
                        event={event} 
                        isExpanded={expandedEventId === event.id}
                        onToggleExpand={() => handleToggleExpand(event.id)}
                        currentUser={currentUser}
                        onRsvp={onRsvp}
                    />
                ))
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                    <p>No events found for this selection.</p>
                </div>
            )}
            </div>
        </main>
      </div>
    </div>
  );
};

export default EventsPage;