'use client';

import { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { Deadline, CalendarEvent } from '@/types';
import { deadlineToCalendarEvent } from '@/lib/utils';

interface DeadlineCalendarProps {
  deadlines: Deadline[];
  onEventClick?: (deadline: Deadline) => void;
}

export default function DeadlineCalendar({ deadlines, onEventClick }: DeadlineCalendarProps) {
  const events: CalendarEvent[] = useMemo(() => {
    return deadlines.map(deadlineToCalendarEvent);
  }, [deadlines]);

  const handleEventClick = (info: EventClickArg) => {
    if (onEventClick) {
      const deadline = info.event.extendedProps.deadline as Deadline;
      if (deadline) {
        onEventClick(deadline);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        }}
        height="auto"
        eventDisplay="block"
        dayMaxEvents={3}
        moreLinkClick="popover"
        eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
      />
    </div>
  );
}
