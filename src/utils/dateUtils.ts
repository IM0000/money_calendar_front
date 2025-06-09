/**
 * 날짜를 'YYYY-MM-DD' 형식으로 포맷팅합니다.
 */
export function formatDate(date: Date, delimiter: string = '-'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${delimiter}${month}${delimiter}${day}`;
}

/**
 * 날짜와 시간을 'YYYY-MM-DD HH:MM' 형식으로 포맷팅합니다.
 */
export function formatDateTime(date: Date, delimiter: string = '-'): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${formatDate(date, delimiter)} ${hours}:${minutes}`;
}

/**
 * 로컬 시간 기준의 ISO 8601 형식 문자열을 반환합니다. (타임존 정보는 생략)
 * 형식: 'YYYY-MM-DDTHH:MM:SS.000'
 */
export function formatLocalISOString(date: Date): string {
  const pad = (num: number) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000`;
}

/**
 * 날짜를 'YYYY년 MM월 DD일' 형식으로 포맷팅합니다.
 */
export function formatDateKorean(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 날짜를 'YYYY년 MM월 DD일 (요일)' 형식으로 포맷팅합니다.
 */
export function formatDateWithDayOfWeek(date: Date): string {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = dayNames[date.getDay()];
  return `${formatDateKorean(date)} (${dayOfWeek})`;
}

/**
 * 밀리초 단위 timestamp를 받아 "YYYY-MM-DD" 형식의 문자열로 반환합니다.
 */
export function formatDateFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 밀리초 단위 timestamp를 받아 "YYYY년 MM월 DD일 (요일)" 형식의 문자열로 반환합니다.
 */
export function formatKoreanDateWithWeekday(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // 요일 배열 (0: 일요일, 1: 월요일, …, 6: 토요일)
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];

  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

/**
 * 타임스탬프를 한국 날짜 형식으로 변환 (검색 컴포넌트용)
 */
export const formatSearchDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * 타임스탬프를 한국 시간 형식으로 변환
 */
export const formatSearchTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
