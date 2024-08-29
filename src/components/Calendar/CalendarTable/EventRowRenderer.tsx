import {
  EconomicIndicator,
  EconomicIndicatorRow,
} from './EconomicIndicatorRow';
import { Performance, PerformanceRow } from './PerformanceRow';
import { Dividend, DividendRow } from './DividendRow';

export type EventData = EconomicIndicator | Performance | Dividend;

export function renderEventRow(event: EventData) {
  switch (event.type) {
    case '경제지표':
      return (
        <EconomicIndicatorRow
          key={event.announcementDate.toISOString()}
          event={event}
        />
      );
    case '실적':
      return (
        <PerformanceRow
          key={event.announcementDate.toISOString()}
          event={event}
        />
      );
    case '배당':
      return (
        <DividendRow key={event.exDividendDate.toISOString()} event={event} />
      );
    default:
      return null;
  }
}
