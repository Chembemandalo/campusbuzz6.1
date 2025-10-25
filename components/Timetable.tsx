import React from 'react';
import { ClockIcon, ArrowRightIcon } from './icons';
import { Page, ScheduleItem } from '../types';

interface TimetableProps {
    onNavigate: (page: Page) => void;
    scheduleForToday: ScheduleItem[];
}

const Timetable: React.FC<TimetableProps> = ({ onNavigate, scheduleForToday }) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    return (
        <div 
            className="bg-white p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            onClick={() => onNavigate('classes')}
            role="button"
            tabIndex={0}
            aria-label="View and manage your full class schedule"
        >
            <h3 className="font-bold mb-4 text-gray-800 border-b pb-2">Today's Schedule ({today})</h3>
            <ul className="space-y-4">
                {scheduleForToday.length > 0 ? (
                    scheduleForToday.map((item) => (
                        <li key={item.id} className="flex items-start space-x-3">
                            <div className={`p-2 rounded-md mt-0.5 ${item.color.replace(/border-[\w-]+\s?/g, '')}`}>
                                <ClockIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                                <p className="text-xs text-gray-500">{item.startTime} - {item.endTime} &bull; {item.venue}</p>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No classes scheduled for today. Enjoy your day off!</p>
                )}
            </ul>
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-sm font-semibold text-indigo-600 group">
                <span>Manage Full Schedule</span>
                <ArrowRightIcon className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
            </div>
        </div>
    );
};

export default Timetable;