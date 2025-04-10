import { getCountryFlag } from '@/utils/countryFlag';

interface CountryFlagProps {
  countryCode: string;
  showText?: boolean;
}

/**
 * 국가 코드에 해당하는 국기 이모지를 표시하는 컴포넌트
 * @param countryCode 국가 코드 (예: 'KR', 'US', 'JP')
 * @param showText 국가 코드 텍스트 표시 여부 (선택 사항, 기본값: false)
 */
export const CountryFlag = ({
  countryCode,
  showText = false,
}: CountryFlagProps) => {
  const flag = getCountryFlag(countryCode);

  return (
    <div className="flex items-center" title={countryCode}>
      <span className="mr-2 text-xl">{flag}</span>
      {showText && <span className="text-xs text-gray-600">{countryCode}</span>}
    </div>
  );
};
