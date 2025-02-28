import { EventData } from '../components/CalendarTable/EventRowRenderer';

export function groupEventsByDate(
  data: EventData[],
): Record<string, EventData[]> {
  return data.reduce(
    (acc, event) => {
      const dateKey =
        event.type === '배당'
          ? event.exDividendDate.toISOString().split('T')[0]
          : event.announcementDate.toISOString().split('T')[0];

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    },
    {} as Record<string, EventData[]>,
  );
}
