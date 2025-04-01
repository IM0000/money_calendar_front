/**
 * 국가 코드로부터 국기 이모티콘을 생성하는 유틸리티 함수
 */

/**
 * 국가 코드에서 해당하는 국기 이모지를 생성합니다.
 *
 * @param countryCode 국가 코드 (ISO 3166-1 alpha-2 또는 일부 alpha-3 코드)
 * @returns 국기 이모지 문자열
 */
export function getCountryFlag(countryCode: string): string {
  // 국가 코드가 3글자인 경우 (USA, KOR 등) 2글자로 변환
  if (countryCode.length === 3) {
    const mapping: Record<string, string> = {
      USA: 'US',
      KOR: 'KR',
    };

    countryCode = mapping[countryCode] || countryCode.substring(0, 2);
  }

  // 국가 코드를 대문자로 변환하여 유니코드 국기 이모지로 변환
  // Regional Indicator Symbols: 각 알파벳에 대한 유니코드 offset은 127397
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}
