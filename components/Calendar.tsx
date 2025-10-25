import React from 'react';

interface CalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  events: { date: Date }[];
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, onDateChange, events, selectedDate, onDateSelect }) => {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const eventDates = new Set(events.map(e => e.date.toDateString()));

  const handlePrevMonth = () => {
    onDateChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onDateChange(new Date(year, month + 1, 1));
  };
  
  const handleDayClick = (day: number) => {
      const clickedDate = new Date(year, month, day);
      if (selectedDate && selectedDate.toDateString() === clickedDate.toDateString()) {
          onDateSelect(null); // Deselect if clicked again
      } else {
          onDateSelect(clickedDate);
      }
  };

  const renderDays = () => {
    const days = [];
    // Blank days at the start of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`blank-${i}`} className="p-2"></div>);
    }

    // Actual days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const hasEvent = eventDates.has(date.toDateString());
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      const dayClasses = `
        text-center p-2 rounded-full cursor-pointer transition-colors duration-200
        ${isSelected ? 'bg-indigo-600 text-white font-bold' : ''}
        ${!isSelected && isToday ? 'bg-indigo-100 text-indigo-700' : ''}
        ${!isSelected && !isToday ? 'hover:bg-gray-100' : ''}
      `;

      days.push(
        <div key={day} onClick={() => handleDayClick(day)} className={dayClasses}>
          {day}
          {hasEvent && <div className="mx-auto mt-1 w-1 h-1 bg-red-500 rounded-full"></div>}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100">&lt;</button>
        <h3 className="font-bold text-lg">{monthNames[month]} {year}</h3>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm text-gray-600">
        {weekdays.map(day => (
          <div key={day} className="text-center font-semibold p-2">{day.slice(0, 1)}</div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
