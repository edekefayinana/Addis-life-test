import React from 'react';
import { PropertyMockData } from '../finding-your-ideal-property-what-matters-most/_components/LatestListings';
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedLists() {
  const featuredBlog = PropertyMockData[0];

  const latestBlogs = PropertyMockData.slice(1, 4);
  return (
    <div className="flex flex-col gap-8 max-w-[1212px] mx-auto px-4 xl:px-0 py-10">
      <p className="text-3xl font-semibold">Our Latest Articles</p>
      <div className="flex mx-auto flex-col items-start justify-center lg:flex-row gap-10 lg:gap-8 w-full">
        <div className="flex w-full lg:w-1/2 border rounded-3xl p-2">
          <div className="flex flex-col h-full gap-6 pb-2">
            <Link
              href={`/blogs/${featuredBlog.slug}`}
              className="relative w-full aspect-[16/11] max-h-[378px] rounded-2xl overflow-hidden hover:opacity-95 transition-opacity"
            >
              <Image
                src={featuredBlog.image}
                alt="Featured article image"
                fill
                className="object-cover"
              />
            </Link>
            <div className="flex flex-col gap-3 px-3">
              <Link
                href={`/blogs/${featuredBlog.slug}`}
                className="text-2xl hover:opacity-80 font-semibold leading-[135%]"
              >
                Investing in Addis Ababa Real Estate: Tips for Success
              </Link>
              <p className="text-base font-normal text-description leading-relaxed">
                {featuredBlog.description}
              </p>
              <p className="text-sm text-muted-foreground font-normal">
                {featuredBlog.date}
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full lg:w-1/2">
          <div className="flex flex-col gap-5 w-full">
            {latestBlogs.map((blog) => (
              <div
                key={blog.title}
                className="flex gap-5 border rounded-2xl p-2"
              >
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="flex-shrink-0  rounded-xl overflow-hidden hover:opacity-95 transition-opacity"
                >
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={196}
                    height={167}
                    className="object-cover w-full h-full max-w-[196px] max-h-[167px] "
                  />
                </Link>
                <div className="flex flex-col justify-between py-1">
                  <div className="flex flex-col gap-3">
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="text-lg hover:opacity-80 md:text-xl font-semibold line-clamp-2 font-gilroy leading-snug"
                    >
                      {blog.title}
                    </Link>
                    <p className="text-base text-description line-clamp-2 leading-relaxed">
                      {blog.description}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-[18px]">
                    {blog.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
