'use client';

import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import './calendar.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * @interface CalendarProps
 * @description Props for the Calendar component
 *
 * @property {string[]} [availableDates] - Array of available dates in 'YYYY-MM-DD' format
 * @property {function} onSelectDate - Callback function when a date is selected
 * @property {Date} startDate - Start date for the calendar
 * @property {Date} endDate - End date for the calendar
 */
interface CalendarProps {
  availableDates?: string[];
  onSelectDate: (date: Date) => void;
  startDate: Date;
  endDate: Date;
}

/**
 * @function Calendar
 * @description Calendar component for selecting dates within a specified range
 *
 * @param {CalendarProps} props - Props for the Calendar component
 * @returns {JSX.Element} Rendered Calendar component
 *
 * @example
 * <Calendar
 *   availableDates={['2023-01-01', '2023-01-02']}
 *   onSelectDate={(date) => console.log(date)}
 *   startDate={new Date('2023-01-01')}
 *   endDate={new Date('2023-12-31')}
 * />
 */
export const Calendar: React.FC<CalendarProps> = ({ availableDates, onSelectDate, startDate, endDate }: CalendarProps): JSX.Element => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(startDate));

  const availableDatesSet = useMemo(() => {
    if (!availableDates || availableDates.length === 0) {
      return null; // Todas las fechas están disponibles
    }
    return new Set(
      availableDates.map(dateStr => {
        const date = new Date(dateStr);
        const localDateStr = date.toLocaleDateString('en-CA'); // Formato 'YYYY-MM-DD'
        return localDateStr;
      })
    );
  }, [availableDates]);

  const weeks = useMemo(() => {
    const start = new Date(currentMonth);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);

    const dates = [];
    let currentDate = new Date(start);

    while (currentDate < end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Agrupar fechas en semanas
    const weeks: (Date | null)[][] = [];
    let week: (Date | null)[] = [];

    dates.forEach(date => {
      if (week.length === 0) {
        const dayOfWeek = date.getDay();
        for (let i = 0; i < dayOfWeek; i++) {
          week.push(null);
        }
      }

      week.push(date);

      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    });

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }

    return weeks;
  }, [currentMonth]);

  const handleDateClick = (date: Date) => {
    const dateStr = date.toLocaleDateString('en-CA');
    if (!availableDatesSet || availableDatesSet.has(dateStr)) {
      setSelectedDate(date);
      onSelectDate(date);
    }
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const monthYear = format(currentMonth, 'MMMM yyyy');
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className='calendar w-full'>
      <div className='flex flex-row justify-between font-bold items-center mb-5'>
        <button className='hover:bg-gray-400 p-1 rounded-lg' onClick={handlePrevMonth} disabled={currentMonth <= startDate}>
          <ChevronLeft />
        </button>

        <div className='calendar-title'>{monthYear}</div>

        <button className='hover:bg-gray-400 p-1 rounded-lg' onClick={handleNextMonth} disabled={currentMonth >= endDate}>
          <ChevronRight />
        </button>
      </div>

      <div className='font-bold flex flex-row justify-around'>
        {daysOfWeek.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>

      <div className=''>
        {weeks.map((week, weekIndex) => (
          <div className='flex w-full justify-around' key={weekIndex}>
            {week.map((day, dayIndex) => {
              if (day === null) {
                return <div className='calendar-cell rounded-lg w-full' key={dayIndex}></div>;
              } else {
                const dateStr = day.toLocaleDateString('en-CA');
                const isAvailable = !availableDatesSet || availableDatesSet.has(dateStr);
                const isSelected = selectedDate && dateStr === selectedDate.toLocaleDateString('en-CA');

                return (
                  <div
                    className={`calendar-cell rounded-lg text-white ${
                      isAvailable ? 'bg-blue-500 hover:bg-gray-400' : 'bg-gray-300'
                    } ${isSelected ? 'bg-gray-600' : ''}`}
                    key={dayIndex}
                    onClick={() => handleDateClick(day)}
                  >
                    {day.getDate()}
                  </div>
                );
              }
            })}
          </div>
        ))}
      </div>
    </div>
  );
};