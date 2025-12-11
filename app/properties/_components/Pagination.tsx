import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', String(page));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        aria-disabled={isFirstPage}
        tabIndex={isFirstPage ? -1 : 0}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50 aria-disabled:pointer-events-none aria-disabled:opacity-40"
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </Link>

      <div className="flex items-center gap-3">
        {pages.map((page, idx) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              tabIndex={page === currentPage ? -1 : 0}
              className={`grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-medium transition ${
                page === currentPage
                  ? 'border border-gray-900 text-gray-900'
                  : 'text-gray-800 hover:bg-gray-50'
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={isLastPage}
        tabIndex={isLastPage ? -1 : 0}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50 aria-disabled:pointer-events-none aria-disabled:opacity-40"
      >
        Next
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
