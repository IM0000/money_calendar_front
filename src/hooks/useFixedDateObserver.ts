import { useEffect, useRef } from 'react';
import useCalendarStore from '@/zustand/useCalendarDateStore';

interface UseFixedDateObserverProps {
  headerRefs: React.RefObject<HTMLTableRowElement>[];
  containerSelector?: string;
}

export default function useFixedDateObserver({
  headerRefs,
  containerSelector = '.calendar-table-container',
}: UseFixedDateObserverProps) {
  const setCurrentTableTopDate = useCalendarStore(
    (state) => state.setCurrentTableTopDate,
  );
  const lastSetDateRef = useRef<string | null>(null);

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error('컨테이너를 찾을 수 없습니다:', containerSelector);
      return;
    }

    const handleScroll = () => {
      requestAnimationFrame(() => {
        const headerElement = document.querySelector('.calendar-table-header');
        if (!headerElement) return;

        const headerBottom = headerElement.getBoundingClientRect().bottom;
        let candidateDate: string | null = null;
        let candidateTop = -Infinity;

        // headerRefs에 있는 날짜 행들 중, 헤더의 bottom보다 위쪽에 있는 행들 중에서
        // header의 bottom에 가장 가까운(즉, 가장 아래쪽의) 행을 선택합니다.
        headerRefs.forEach((ref) => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            // console.log('🚀 ~ headerRefs.forEach ~ rect:', rect);
            if (rect.top <= headerBottom && rect.top > candidateTop) {
              candidateTop = rect.top;
              candidateDate = ref.current.getAttribute('data-date');
            }
          }
        });

        if (
          headerRefs[0]?.current?.getBoundingClientRect().top == headerBottom
        ) {
          candidateDate = headerRefs[0].current.getAttribute('data-date');
        }

        if (candidateDate == '날짜 없음') return;

        if (candidateDate && lastSetDateRef.current !== candidateDate) {
          lastSetDateRef.current = candidateDate;
          setCurrentTableTopDate(candidateDate);
          console.log('Updated fixed date to:', candidateDate);
        }
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    // 초기 상태 체크
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [headerRefs, containerSelector, setCurrentTableTopDate]);

  return null;
}
