import { Button } from '@/components/ui/button';
import type { Blog } from '@/types/blog';
import { createClient } from '@/prismicio';
import { ArrowRight } from 'lucide-react';
import BlogCard from '../(main)/blogs/_components/BlogCard';
import Link from 'next/link';

export async function Insights() {
  const client = createClient();
  const posts = await client.getAllByType('blog_post', {
    orderings: {
      field: 'my.blog_post.published_at',
      direction: 'desc',
    },
    limit: 3,
  });

  const insights: Blog[] = posts.map((post) => ({
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
    <section className="container mx-auto py-20 px-4 md:px-6">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Our Latest Insights</h2>
        <p className="mt-4 text-muted-foreground">
          Stay updated with the latest news and trends from the real estate
          world.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((item) => (
          <BlogCard key={item.id} blog={item} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          className="w-fit rounded-full px-8 py-6 text-black bg-white hover:bg-white/90 border border-border/50 text-base font-normal font-instrument"
          size="lg"
        >
          <Link href="/blogs" className="flex items-center gap-2">
            View All Blogs <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
