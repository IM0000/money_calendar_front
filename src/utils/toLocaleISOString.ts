export function formatLocalISOString(date: Date): string {
  const pad = (num: number) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  // 로컬 시간 기준의 ISO 8601 형식 (타임존 정보는 생략)
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000`;
}
