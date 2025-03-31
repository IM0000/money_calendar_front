import { getCountryFlag } from '@/utils/countryFlag';

// 국가 표시를 국기와 함께 렌더링
export const renderCountry = (countryCode: string) => {
  const flag = getCountryFlag(countryCode);

  return (
    <div className="flex items-center" title={countryCode}>
      <span className="mr-2 text-xl">{flag}</span>
      {/* <span className="text-xs text-gray-600">{countryCode}</span> */}
    </div>
  );
};
