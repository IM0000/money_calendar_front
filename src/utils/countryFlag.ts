// 국가 코드로 국기 이모지를 가져오는 함수
export function getCountryFlag(countryCode: string): string {
  // 국가 코드가 3글자인 경우 (USA, GBR 등) 2글자로 변환
  if (countryCode.length === 3) {
    const mapping: Record<string, string> = {
      USA: 'US',
      KOR: 'KR',
    };

    countryCode = mapping[countryCode] || countryCode.substring(0, 2);
  }

  // 국가 코드를 대문자로 변환하여 유니코드 국기 이모지로 변환
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}
