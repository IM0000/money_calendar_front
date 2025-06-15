import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  roundedFull?: boolean;
  animationDuration?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  roundedFull = false,
  animationDuration = '1.5s',
}) => {
  const classes = [
    'bg-gray-200 animate-pulse',
    roundedFull ? 'rounded-full' : 'rounded',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties = {
    width: width,
    height: height,
    animationDuration,
  };

  return <div className={classes} style={style} />;
};

// 테이블 행을 위한 스켈레톤
export const TableRowSkeleton: React.FC<{
  columns: number;
  className?: string;
}> = ({ columns, className = '' }) => {
  return (
    <tr className={className}>
      {Array(columns)
        .fill(0)
        .map((_, i) => (
          <td key={i} className="px-4 py-2">
            <Skeleton width="100%" height="1.5rem" />
          </td>
        ))}
    </tr>
  );
};

// 테이블 그룹을 위한 스켈레톤 (날짜 헤더 + 여러 행)
export const TableGroupSkeleton: React.FC<{
  columns: number;
  rows: number;
  className?: string;
}> = ({ columns, rows, className = '' }) => {
  return (
    <React.Fragment>
      {/* 날짜 헤더 */}
      <tr className={`bg-gray-100 ${className}`}>
        <td colSpan={columns} className="px-4 py-2">
          <Skeleton width="40%" height="1.5rem" />
        </td>
      </tr>
      {/* 데이터 행 */}
      {Array(rows)
        .fill(0)
        .map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
    </React.Fragment>
  );
};

// 캘린더 패널 스켈레톤
export const CalendarPanelSkeleton: React.FC = () => {
  return (
    <div className="w-full">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-2">
        <Skeleton width="2.5rem" height="2.5rem" roundedFull />
        <Skeleton width="4rem" height="2rem" className="rounded" />
        <div className="flex items-center gap-1">
          <Skeleton width="2.5rem" height="2.5rem" roundedFull />
          <Skeleton width="2.5rem" height="2.5rem" roundedFull />
          <Skeleton width="2.5rem" height="2.5rem" roundedFull />
        </div>
        <Skeleton width="12rem" height="2rem" className="ml-2" />
      </div>

      {/* 날짜 이벤트 카드들 */}
      <div className="flex pb-2 overflow-x-auto">
        {Array(7)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 p-3 mr-2 bg-white border border-gray-300 rounded shadow-sm"
              style={{ width: '11rem' }}
            >
              <Skeleton width="60%" height="1.25rem" className="mb-2" />
              <div className="space-y-2">
                <Skeleton width="100%" height="1rem" />
                <Skeleton width="80%" height="1rem" />
                <Skeleton width="90%" height="1rem" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
