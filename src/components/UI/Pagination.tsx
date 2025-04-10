import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // 페이지 버튼 수를 제한하기 위한 로직
  const getPageNumbers = () => {
    const pageNumbers: number[] = [];
    const maxPagesToShow = 5;

    // 총 페이지가 최대 표시 페이지보다 적거나 같으면 모든 페이지를 표시
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 현재 페이지 주변의 페이지와 처음/마지막 페이지를 표시
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      // 첫 페이지 표시
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push(-1); // ... 표시를 위한 플래그
        }
      }

      // 중간 페이지들
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // 마지막 페이지 표시
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push(-1); // ... 표시를 위한 플래그
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center space-x-1">
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex h-8 w-8 items-center justify-center rounded-md ${
          currentPage === 1
            ? 'cursor-not-allowed text-gray-400'
            : 'text-gray-700 hover:bg-gray-200'
        }`}
      >
        <FaChevronLeft size={14} />
      </button>

      {/* 페이지 번호 */}
      {pageNumbers.map((page, index) =>
        page === -1 ? (
          // ... 표시
          <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-700">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-8 w-8 rounded-md ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {page}
          </button>
        ),
      )}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={`flex h-8 w-8 items-center justify-center rounded-md ${
          currentPage === totalPages
            ? 'cursor-not-allowed text-gray-400'
            : 'text-gray-700 hover:bg-gray-200'
        }`}
      >
        <FaChevronRight size={14} />
      </button>
    </div>
  );
}
