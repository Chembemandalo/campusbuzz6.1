import React from 'react';
import { ScheduleItem } from '../types';
// FIX: Add BackButton to imports
import { PlusCircleIcon, BackButton } from '../components/icons';

interface ClassesPageProps {
  schedule: ScheduleItem[];
  onOpenModal: (item: ScheduleItem | null) => void;
  // FIX: Add handleBack to props interface
  handleBack: () => void;
}

const DAYS: ScheduleItem['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMES = Array.from({ length: 16 }, (_, i) => `${(i + 7).toString().padStart(2, '0')}:00`); // 7 AM to 10 PM

const timeToRow = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    // Grid rows start at 1. Our time starts at 7 AM. Each hour is 2 rows (30 min increments).
    // So, 7:00 -> (7-7)*2 + 1 = 1. 
    // 7:30 -> (7-7)*2 + 1.5 = 1.5 -> round to 2
    // 9:00 -> (9-7)*2 + 1 = 5
    // +1 because grid rows start at 1
    // The grid body starts after the header row, so we need to account for that. Let's adjust in the style.
    return (hours - 7) * 2 + (minutes / 30) + 1;
};

const ClassesPage: React.FC<ClassesPageProps> = ({ schedule, onOpenModal, handleBack }) => {
  return (
    <div className="bg-gray-50 min-h-screen animate-fade-in-up">
      <div className="container mx-auto px-4 py-8">
        {/* FIX: Add BackButton component */}
        <BackButton onClick={handleBack} className="mb-4" />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Weekly Schedule</h1>
          <button
            onClick={() => onOpenModal(null)}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            <PlusCircleIcon className="w-6 h-6" />
            <span>Add Class</span>
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="grid grid-cols-[auto_repeat(7,1fr)]">
                {/* Headers */}
                <div className="sticky top-20 bg-white z-10"></div>
                {DAYS.map(day => (
                    <div key={day} className="text-center font-semibold text-gray-600 py-2 sticky top-20 bg-white z-10 border-b">
                        <span className="hidden md:inline">{day}</span>
                        <span className="md:hidden">{day.substring(0,3)}</span>
                    </div>
                ))}

                {/* Grid Body */}
                <div className="col-start-1 col-end-9 grid grid-cols-[auto_repeat(7,1fr)] grid-rows-[repeat(32,25px)] gap-x-1 relative">
                    {/* Time Gutter */}
                    <div className="row-start-1 row-span-full col-start-1 col-end-2 grid grid-rows-[repeat(32,25px)]">
                        {TIMES.map(time => (
                            <div key={time} className="row-start-auto h-full text-right pr-2 text-xs text-gray-400 -mt-2.5">
                                {time}
                            </div>
                        ))}
                    </div>

                    {/* Day Columns backgrounds and lines */}
                    {DAYS.map((_, dayIndex) => (
                        <div key={dayIndex} className="row-start-1 row-span-full col-start-auto border-l border-gray-100 relative">
                            {/* Horizontal lines */}
                            {Array.from({length: 15}).map((_, i) => (
                                <div key={i} className="absolute border-t border-gray-100 w-full" style={{top: `${(i+1) * 50}px`}}></div>
                            ))}
                        </div>
                    ))}
                    
                    {/* Schedule Items */}
                    {schedule.map(item => {
                        const startRow = timeToRow(item.startTime);
                        const endRow = timeToRow(item.endTime);
                        const dayIndex = DAYS.indexOf(item.day) + 2; // +2 for grid column index

                        return (
                            <div
                                key={item.id}
                                className={`p-2 rounded-md border-l-4 cursor-pointer transition-all duration-200 hover:opacity-80 hover:shadow-md ${item.color} overflow-hidden animate-fade-in-up`}
                                style={{
                                    gridColumn: `${dayIndex} / span 1`,
                                    gridRow: `${startRow} / ${endRow}`,
                                }}
                                onClick={() => onOpenModal(item)}
                            >
                                <p className="font-bold text-sm leading-tight">{item.title}</p>
                                <p className="text-xs">{item.venue}</p>
                                <p className="text-xs mt-1 hidden sm:block">{item.startTime} - {item.endTime}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClassesPage;
