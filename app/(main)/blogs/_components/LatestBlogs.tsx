import React from 'react';
import BlogCard from './BlogCard';
import { createClient } from '@/prismicio';

export default async function LatestBlogs() {
  const client = createClient();
  const posts = await client.getAllByType('blog_post', {
    orderings: {
      field: 'my.blog_post.published_at',
      direction: 'desc',
    },
    limit: 3,
  });

  const latestBlogs = posts.map((post) => ({
    id: post.id,
    title: post.data.title as string,
    description: post.data.description as string,
    date: new Date(post.data.published_at as string).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
    ),
    image: post.data.cover.url || '/images/property-1.png',
    slug: (post.data.slug as string) || post.uid,
  }));

  return (
    <section className="flex flex-col gap-8 max-w-[1230px] mx-auto pt-5 pb-10 px-4 xl:px-0">
      <h1 className="text-xl md:text-[32px] leading-[150%] font-semibold text-[#0A0A0A]">
        Other Latest Articles
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
}
