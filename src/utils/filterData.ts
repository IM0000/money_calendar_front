import { EventData } from '../components/Calendar/CalendarTable/EventRowRenderer';

export function filterData(
  data: EventData[],
  importances: string[],
  eventTypes: string[],
): EventData[] {
  if (importances.length === 0 && eventTypes.length === 0) {
    return data;
  }

  return data.filter((item) => {
    const isEventTypeSelected =
      eventTypes.length === 0 || eventTypes.includes(item.type);
    const isImportanceSelected =
      item.type === '경제지표'
        ? importances.length === 0 || importances.includes(item.importance)
        : true;

    return isEventTypeSelected && isImportanceSelected;
  });
}
