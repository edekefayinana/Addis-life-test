'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Blog } from '@/types/blog';
import { useTranslations } from 'next-intl';

export default function FeaturedLists({ blogs }: { blogs: Blog[] }) {
  const t = useTranslations('blogs.featured');

  if (!blogs || blogs.length === 0) {
    return null;
  }

  const featuredBlog = blogs[0];
  const latestBlogs = blogs.slice(1, 4);

  return (
    <div className="flex flex-col gap-3 lg:gap-8 max-w-[1212px] mx-auto px-3 xl:px-0 py-10">
      <p className="text-2xl lg:text-3xl font-semibold">{t('title')}</p>
      <div className="flex mx-auto flex-col items-start justify-center lg:flex-row gap-6 lg:gap-8 w-full">
        <Link
          href={`/blogs/${featuredBlog.slug}`}
          className="flex h-full w-full lg:w-1/2 border rounded-3xl p-2 group"
        >
          <div className="flex flex-col h-full gap-4 lg:gap-6 pb-5 w-full">
            <div className="relative w-full aspect-[16/11] max-h-[378px] rounded-2xl overflow-hidden group-hover:opacity-95 transition-opacity">
              <Image
                src={featuredBlog.image}
                alt="Featured article image"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex justify-between flex-col gap-4 px-3">
              <span className="text-xl lg:text-2xl group-hover:opacity-80 font-semibold leading-[135%]">
                {featuredBlog.title}
              </span>
              <p className="text-base font-normal text-description leading-relaxed">
                {featuredBlog.description}
              </p>
              <p className="text-sm text-muted-foreground font-normal">
                {featuredBlog.date}
              </p>
            </div>
          </div>
        </Link>
        <div className="flex w-full lg:w-1/2">
          <div className="flex flex-col gap-4 w-full">
            {latestBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="flex gap-5 border rounded-2xl p-2 group"
              >
                <div className="flex-shrink-0 relative w-[196px] h-[167px] rounded-xl overflow-hidden group-hover:opacity-95 transition-opacity">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover rounded-2xl"
                  />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div className="flex flex-col gap-1 lg:gap-3">
                    <span className="text-lg group-hover:opacity-80 md:text-xl font-semibold line-clamp-3 lg:line-clamp-2 font-instrument leading-snug">
                      {blog.title}
                    </span>
                    <p className="text-base text-description line-clamp-2 leading-relaxed">
                      {blog.description}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 lg:mt-[18px]">
                    {blog.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
