export const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const getPageNumbers = () => {
    const pages = [];

    // Всегда показываем первую и последнюю
    const showLeftDots = currentPage > 3;
    const showRightDots = currentPage < totalPages - 2;

    pages.push(1);

    if (showLeftDots) pages.push('...');
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (showRightDots) pages.push('...');

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex justify-center items-center space-x-1 mt-6 flex-wrap">
      {/* Назад */}
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
      >
        ←
      </button>

      {/* Кнопки страниц */}
      {pages.map((page, index) =>
        page === '...' ? (
          <span
            key={`dots-${index}`}
            className="px-3 py-1 text-gray-400 select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded-md text-sm transition ${
              currentPage === page
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Вперёд */}
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
      >
        →
      </button>
    </div>
  );
};
