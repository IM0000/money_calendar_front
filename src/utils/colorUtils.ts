export function getColorClass(actual?: string, forecast?: string): string {
  if (!actual || !forecast) return '';
  const a = parseFloat(actual.replace(/[^0-9.-]+/g, ''));
  const f = parseFloat(forecast.replace(/[^0-9.-]+/g, ''));
  if (a > f) return 'text-green-600';
  if (a < f) return 'text-red-600';
  return '';
}
