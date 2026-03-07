import React from 'react';
import { Blog } from '@/types/blog';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="flex flex-col border p-2 rounded-[24px] overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white group"
      key={blog.id}
    >
      <div className="relative w-full h-[240px]">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover rounded-[14px] group-hover:opacity-90 transition-opacity"
        />
      </div>
      <div className="flex flex-col p-3 gap-4 flex-grow">
        <div className="flex flex-col gap-3 flex-grow">
          <span className="text-xl font-semibold leading-[130%] group-hover:opacity-80 transition-opacity ">
            {blog.title}
          </span>
          <p className="text-base leading-[150%]">{blog.description}</p>
          <p className="text-sm leading-[150%] text-description">{blog.date}</p>
        </div>
      </div>
    </Link>
  );
}
