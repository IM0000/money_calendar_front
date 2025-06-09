import { ReactNode } from 'react';
import PaginationWrapper from './PaginationWrapper';

interface DataTableBaseProps {
  title: string;
  isLoading: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function DataTableBase({
  title,
  isLoading,
  isEmpty,
  emptyMessage,
  children,
  currentPage,
  totalPages,
  onPageChange,
  className = 'mb-8',
}: DataTableBaseProps) {
  return (
    <div className={className}>
      <h3 className="mb-3 text-lg font-semibold text-gray-800">{title}</h3>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : isEmpty ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-full divide-y divide-gray-200 lg:min-w-0">
              {children}
            </table>
          </div>

          <PaginationWrapper
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
            className="flex justify-center p-4"
          />
        </div>
      )}
    </div>
  );
}
