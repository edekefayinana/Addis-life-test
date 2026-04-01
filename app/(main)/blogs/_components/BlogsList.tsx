'use client';
import React from 'react';
import BlogCard from './BlogCard';
import { Blog } from '@/types/blog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useTranslations } from 'next-intl';

export default function BlogsList({
  blogs,
  totalPages,
  currentPage,
}: {
  blogs: Blog[];
  totalPages: number;
  currentPage: number;
}) {
  const t = useTranslations('blogs.pagination');
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <section className="flex flex-col gap-8 max-w-[1212px] mx-auto px-4 xl:px-0 py-10 mb-20 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center">
          <Pagination className="py-8">
            <PaginationContent className="min-w-full flex justify-center md:justify-between items-center">
              <div className="flex gap-4">
                <PaginationItem>
                  <PaginationPrevious
                    href={
                      currentPage > 1 ? `/blogs?page=${currentPage - 1}` : '#'
                    }
                    className={
                      currentPage <= 1 ? 'pointer-events-none opacity-50' : ''
                    }
                  >
                    {t('previous')}
                  </PaginationPrevious>
                </PaginationItem>
              </div>

              <div className="flex gap-4">
                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href={`/blogs?page=${page}`}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
              </div>
              <div className="flex gap-4">
                <PaginationItem>
                  <PaginationNext
                    href={
                      currentPage < totalPages
                        ? `/blogs?page=${currentPage + 1}`
                        : '#'
                    }
                    className={
                      currentPage >= totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  >
                    {t('next')}
                  </PaginationNext>
                </PaginationItem>
              </div>
            </PaginationContent>
          </Pagination>
          <p className="text-sm ml-8 -mt-4 text-muted-foreground text-center">
            {t('showingPage', { current: currentPage, total: totalPages })}
          </p>
        </div>
      )}
    </section>
  );
}
