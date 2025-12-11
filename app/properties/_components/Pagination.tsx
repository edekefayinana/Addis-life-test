import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  basePath?: string;
  searchParams?: Record<string, string | undefined>;
}

export function Pagination({
  totalPages,
  currentPage,
  basePath = '/properties',
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageRange = () => {
    const pages: (number | 'ellipsis')[] = [];
    const add = (page: number | 'ellipsis') => pages.push(page);

    const window = 1;
    const start = Math.max(2, currentPage - window);
    const end = Math.min(totalPages - 1, currentPage + window);

    add(1);
    if (start > 2) add('ellipsis');
    for (let p = start; p <= end; p += 1) add(p);
    if (end < totalPages - 1) add('ellipsis');
    if (totalPages > 1) add(totalPages);

    return pages;
  };

  const pages = createPageRange();
  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', String(page));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 aria-disabled:pointer-events-none aria-disabled:opacity-60"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Link>

      <div className="flex items-center gap-2">
        {pages.map((page, idx) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
              …
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`grid h-9 w-9 place-items-center rounded-full text-sm font-medium transition ${
                page === currentPage
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 aria-disabled:pointer-events-none aria-disabled:opacity-60"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
