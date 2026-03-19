import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisible = 5,
  className = '',
}) {
  const getPageNumbers = () => {
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisible - 1, totalPages);

    if (end - start + 1 < maxVisible) {
      start = Math.max(end - maxVisible + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={`flex items-center justify-center space-x-1 ${className}`}>
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiChevronsLeft className="w-5 h-5" />
        </button>
      )}

      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>
      )}

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors
            ${currentPage === page
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          {page}
        </button>
      ))}

      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      )}

      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiChevronsRight className="w-5 h-5" />
        </button>
      )}
    </nav>
  );
}