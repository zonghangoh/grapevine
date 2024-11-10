interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Paginator = ({ currentPage, totalPages, onPageChange }: PaginatorProps) => {
  return (
    <div className="mt-8 flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 text-sm rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 transition-colors duration-200"
      >
        ←
      </button>
      <span className="text-sm text-gray-600 font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 text-sm rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 transition-colors duration-200"
      >
        →
      </button>
    </div>
  );
};