export function renderTableHeaders() {
  const headers = [
    {
      label: '시간',
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
    {
      label: '유형',
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
    {
      label: '이벤트',
      className:
        'col-span-2 py-3.5 pl-2 text-left text-sm font-normal text-gray-500',
    },
    {
      label: '타입',
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
    {
      label: '실제',
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
    {
      label: '예측',
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
    {
      label: '이전',
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
    {
      label: '+',
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
  ];

  return headers.map((header, index) => (
    <div key={index} className={header.className}>
      {header.label}
    </div>
  ));
}
