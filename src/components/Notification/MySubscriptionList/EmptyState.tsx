import React from 'react';

interface EmptyStateProps {
  message: string;
}

/**
 * 데이터가 없을 때 표시되는 빈 상태 컴포넌트
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="py-8 text-center">
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);
