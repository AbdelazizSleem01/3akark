// components/Pagination.js
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Pagination({ currentPage, totalPages }) {
  const searchParams = useSearchParams();
  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center gap-2">
      {currentPage > 1 && (
        <Link
          href={createPageURL(currentPage - 1)}
          className="btn btn-sm btn-ghost"
        >
          السابق
        </Link>
      )}
      
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        let pageNum;
        if (totalPages <= 5) {
          pageNum = i + 1;
        } else if (currentPage <= 3) {
          pageNum = i + 1;
        } else if (currentPage >= totalPages - 2) {
          pageNum = totalPages - 4 + i;
        } else {
          pageNum = currentPage - 2 + i;
        }

        return (
          <Link
            key={pageNum}
            href={createPageURL(pageNum)}
            className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost'}`}
          >
            {pageNum}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={createPageURL(currentPage + 1)}
          className="btn btn-sm btn-ghost"
        >
          التالي
        </Link>
      )}
    </div>
  );
}