'use client';

import { usePagination, DOTS } from '@/hooks/use-pagination'; // Asegúrate que la ruta al hook sea correcta

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const paginationRange = usePagination({ totalPages });
  if (currentPage === 0 || totalPages < 2) {
    return null;
  }

  return (
    <div className="flex justify-center mt-4">
      <div className="flex items-center space-x-1">
        {paginationRange?.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return <span key={`dots-${index}`} className="px-4 py-2 text-gray-500">&#8230;</span>;
          }

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber as number)}
              className={`px-4 py-2 text-sm font-medium border rounded-md ${
                pageNumber === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}