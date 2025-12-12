import React from 'react';
import BlogCard from './BlogCard';
import { Blog } from '../finding-your-ideal-property-what-matters-most/_components/LatestListings';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const mockBlogs: Blog[] = [
  {
    id: 1,
    title: 'Finding Your Ideal Property: What Matters Most?',
    description:
      'Learn how to choose the perfect home by focus on location, budget, and lifestyle needs',
    date: 'Jan 28, 2025',
    image: '/images/property-1.png',
    slug: '/finding-your-ideal-property-what-matters-most',
  },
  {
    id: 2,
    title: 'Investing in Addis Ababa Real Estate: Tips for Success',
    description:
      'Discover strategies to make smart property investments and maximize returns.',
    date: 'Jan 28, 2025',
    image: '/images/property-2.png',
    slug: '/finding-your-ideal-property-what-matters-most',
  },
  {
    id: 3,
    title: 'Top Neighborhoods to Watch This Year',
    description:
      'Explore the hottest areas in the city for living, investing, and future growth.',
    date: 'Jan 28, 2025',
    image: '/images/property-3.png',
    slug: '/finding-your-ideal-property-what-matters-most',
  },
  {
    id: 4,
    title: 'Investing in Addis Ababa Real Estate: Tips for Success ',
    description:
      'Discover strategies to make smart property investments and maximize returns.',
    date: 'Jan 28, 2025',
    image: '/images/property-1.png',
    slug: '/finding-your-ideal-property-what-matters-most',
  },
  {
    id: 5,
    title: 'Investing in Addis Ababa Real Estate: Tips for Success ',
    description:
      'Discover strategies to make smart property investments and maximize returns.',
    date: 'Jan 28, 2025',
    image: '/images/property-2.png',
    slug: '/finding-your-ideal-property-what-matters-most',
  },
  {
    id: 6,
    title: 'Investing in Addis Ababa Real Estate: Tips for Success ',
    description:
      'Discover strategies to make smart property investments and maximize returns.',
    date: 'Jan 28, 2025',
    image: '/images/property-3.png',
    slug: '/finding-your-ideal-property-what-matters-most',
  },
  {
    id: 7,
    title: 'Investing in Addis Ababa Real Estate: Tips for Success ',
    description:
      'Discover strategies to make smart property investments and maximize returns.',
    date: 'Jan 28, 2025',
    image: '/images/property-1.png',
    slug: '/finding-your-ideal-property-what-matters-most',
  },
  {
    id: 8,
    title: 'Investing in Addis Ababa Real Estate: Tips for Success ',
    description:
      'Discover strategies to make smart property investments and maximize returns.',
    date: 'Jan 28, 2025',
    image: '/images/property-2.png',
    slug: '/finding-your-ideal-property-what-matters-most',
  },
  {
    id: 9,
    title: 'Investing in Addis Ababa Real Estate: Tips for Success ',
    description:
      'Discover strategies to make smart property investments and maximize returns.',
    date: 'Jan 28, 2025',
    image: '/images/property-3.png',
    slug: '/finding-your-ideal-property-what-matters-most',
  },
];

export default function BlogsList() {
  return (
    <section className="flex flex-col gap-8 max-w-[1212px] mx-auto px-4 xl:px-0 py-10 mb-20 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex">
        <Pagination className="py-8">
          <PaginationContent className="min-w-full flex justify-between items-center">
            <div className="flex gap-4">
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
            </div>

            <div className="flex gap-4">
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">8</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">9</PaginationLink>
              </PaginationItem>
              <PaginationItem>
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
