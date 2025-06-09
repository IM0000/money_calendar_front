interface EmptySearchResultProps {
  message?: string;
}

export default function EmptySearchResult({
  message = '검색 결과가 없습니다.',
}: EmptySearchResultProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
