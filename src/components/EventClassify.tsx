interface EventClassifyChipProps {
  className?: string;
  value: EventClassify;
  children?: React.ReactNode;
}

export default function EventClassifyChip({
  className = '',
  value,
  // children = <></>,
}: EventClassifyChipProps) {
  const classifyColors: { [key in EventClassify]: string } = {
    실적: 'text-rose-600',
    배당: 'text-indigo-600',
    경제지표: 'text-emerald-600',
  };

  const classifyColor = classifyColors[value] ?? '';

  return (
    <>
      <td className="text-center">
        <div className="inline-flex items-center rounded-full font-medium">
          <h2
            className={`${className} rounded-full px-2 text-sm font-normal ${classifyColor}`}
          >
            {value}
          </h2>
          {/* {children} */}
        </div>
      </td>
    </>
  );
}

interface MyEvent extends EventClassifyChipProps {
  tooltip: string;
}

export function AA(props: MyEvent) {
  const { value, tooltip } = props;
  return (
    <div>
      <div>{tooltip}</div>
      <EventClassifyChip {...props} value={value}></EventClassifyChip>
    </div>
  );
}
