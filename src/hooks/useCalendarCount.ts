// useCalendarCounts.ts
import { useQuery } from '@tanstack/react-query';
import { getCalendarEvents } from '@/api/services/CalendarService';
import { useMemo } from 'react';

export function useCalendarCounts(startDate: string, endDate: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['calendarEvents', startDate, endDate],
    queryFn: () => getCalendarEvents(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });

  const counts = useMemo(() => {
    if (!data) return { earnings: 0, dividends: 0, economicIndicators: 0 };

    return {
      earnings: data?.data?.earnings?.length || 0,
      dividends: data?.data?.dividends?.length || 0,
      economicIndicators: data?.data?.economicIndicators?.length || 0,
    };
  }, [data]);

  return { counts, isLoading, error };
}
