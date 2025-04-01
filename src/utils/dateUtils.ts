/**
 * 날짜 관련 유틸리티 함수들을 모아둔 파일입니다.
 */

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
