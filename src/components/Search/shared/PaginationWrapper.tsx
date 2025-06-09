import Pagination from '../../UI/Pagination';

interface PaginationWrapperProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function PaginationWrapper({
  totalPages,
  currentPage,
  onPageChange,
  className = 'mt-6 flex justify-center border-t border-gray-200 px-6 py-4',
}: PaginationWrapperProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={className}>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
