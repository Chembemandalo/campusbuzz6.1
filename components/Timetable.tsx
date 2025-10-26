import React from 'react';
import { ClockIcon, ArrowRightIcon } from './icons';
import { Page, ScheduleItem } from '../types';

interface TimetableProps {
    onNavigate: (page: Page) => void;
    scheduleForToday: ScheduleItem[];
}

const getStatus = (startTime: string, endTime: string): { status: 'Ongoing' | 'Upcoming' | 'Completed'; color: string } => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const startTimeInMinutes = startHours * 60 + startMinutes;

    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const endTimeInMinutes = endHours * 60 + endMinutes;

    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
        return { status: 'Ongoing', color: 'bg-green-500' };
    } else if (currentTimeInMinutes < startTimeInMinutes) {
        return { status: 'Upcoming', color: 'bg-blue-500' };
    } else {
        return { status: 'Completed', color: 'bg-gray-400' };
    }
};


const Timetable: React.FC<TimetableProps> = ({ onNavigate, scheduleForToday }) => {
    return (
        <div 
            className="bg-white p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col"
            onClick={() => onNavigate('classes')}
            role="button"
            tabIndex={0}
            aria-label="View and manage your full class schedule"
        >
            <h3 className="font-bold mb-4 text-gray-800 border-b pb-2">Today's Schedule</h3>
            <ul className="space-y-4 flex-grow">
                {scheduleForToday.length > 0 ? (
                    scheduleForToday.map((item) => {
                        const { status, color } = getStatus(item.startTime, item.endTime);
                        return (
                            <li key={item.id} className="flex items-start space-x-3">
                                <div className={`p-2 rounded-md mt-0.5 ${item.color.replace(/border-[\w-]+\s?/g, '')}`}>
                                    <ClockIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                                    <p className="text-xs text-gray-500">{item.startTime} - {item.endTime} &bull; {item.venue}</p>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <span className={`w-2 h-2 rounded-full mr-2 ${color}`}></span>
                                        {status}
                                    </div>
                                </div>
                            </li>
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No classes scheduled for today. Enjoy your day off!</p>
                )}
            </ul>
            <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-sm font-semibold text-indigo-600 group">
                <span>View Details</span>
                <ArrowRightIcon className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
            </div>
        </div>
    );
};

export default Timetable;