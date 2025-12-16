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

export default function BlogsList({ blogs }: { blogs: Blog[] }) {
  return (
    <section className="flex flex-col gap-8 max-w-[1212px] mx-auto px-4 xl:px-0 py-10 mb-20 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex">
        <Pagination className="py-8">
          <PaginationContent className="min-w-full flex justify-center md:justify-between items-center">
            <div className="flex gap-4">
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
            </div>

            <div className="flex gap-4">
              <PaginationItem className="mt-1.5 md:mt-3 ml-1">
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem className="hidden md:block mt-3">
                <PaginationLink>2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink className="hidden md:block" href="#">
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis className="md:mt-2" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink className="hidden md:block" href="#">
                  8
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink className="hidden md:block" href="#">
                  9
                </PaginationLink>
              </PaginationItem>
              <PaginationItem className="mt-1.5 md:mt-3 mr-1 md:mr-0">
                <PaginationLink href="#">10</PaginationLink>
              </PaginationItem>
            </div>
            <div className="flex gap-4">
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </div>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}
