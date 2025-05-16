import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarView = ({ timetableData, onRequestSwap }) => {
  const events = timetableData.flatMap(day => 
    day.shifts.map(shift => ({
      id: shift.id,
      title: `${shift.department?.name || 'All'} (${shift.employees.length} employees)`,
      start: new Date(`1970-01-01T${shift.startTime}`),
      end: new Date(`1970-01-01T${shift.endTime}`),
      day: day.day,
      allDay: false,
      resource: shift
    }))
  );

  const dayPropGetter = (date) => {
    const day = moment(date).format('dddd');
    return {
      className: `day-${day.toLowerCase()}`
    };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 h-[700px]">
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        views={['week']}
        min={new Date(1970, 0, 1, 6, 0, 0)}
        max={new Date(1970, 0, 1, 22, 0, 0)}
        dayPropGetter={dayPropGetter}
        components={{
          event: ({ event }) => (
            <div 
              className="p-1 cursor-pointer" 
              onClick={() => onRequestSwap(event.id)}
              title={`Click to request swap for ${event.day} ${event.title}`}
            >
              <strong>{event.day}</strong>
              <div>{event.title}</div>
            </div>
          )
        }}
      />
    </div>
  );
};

export default CalendarView;