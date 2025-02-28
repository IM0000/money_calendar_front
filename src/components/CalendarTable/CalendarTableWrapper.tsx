// CalendarTableWrapper.tsx
import React, { useRef, useEffect } from 'react';
import useFixedDateObserver from '@/hooks/useFixedDateObserver';
import useCalendarStore from '@/zustand/useCalendarDateStore';

interface CalendarTableWrapperProps {
  headerRefs: React.RefObject<HTMLTableRowElement>[];
  children: React.ReactNode;
}

export default function CalendarTableWrapper({
  headerRefs,
  children,
}: CalendarTableWrapperProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // 공통 observer 적용
  useFixedDateObserver({
    headerRefs,
    containerSelector: '.calendar-table-container',
  });

  // selectedDate가 변경될 때 해당 날짜 row로 스크롤 (header 바로 밑으로)
  const { selectedDate } = useCalendarStore();
  // 처음 마운트인지 여부 판단
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!selectedDate || !tableContainerRef.current) return;
    const dateStr = selectedDate.toISOString().slice(0, 10);
    const targetHeaderRef = headerRefs.find(
      (ref) => ref.current?.getAttribute('data-date') === dateStr,
    );
    if (targetHeaderRef && targetHeaderRef.current) {
      const tableHeader = document.querySelector('.calendar-table-header');
      const headerHeight = tableHeader
        ? tableHeader.getBoundingClientRect().height
        : 0;
      const tolerance = 0.3;

      const targetScrollTop =
        targetHeaderRef.current.offsetTop - headerHeight + tolerance;
      tableContainerRef.current.scrollTo({
        top: targetScrollTop,
        behavior: isInitialMount.current ? 'auto' : 'smooth',
      });
      console.log('Scrolled to header date:', dateStr);
    }
    // 최초 마운트가 아니라면 이후부터는 smooth 스크롤을 사용하도록 설정
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [selectedDate]);

  return (
    <div
      ref={tableContainerRef}
      className="relative w-screen max-w-full overflow-y-auto calendar-table-container"
      style={{ maxHeight: '600px' }}
    >
      {children}
    </div>
  );
}
