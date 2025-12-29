import Home from './_components/Home';
import FeaturedLists from './_components/FeaturedLists';
import BlogsList from './_components/BlogsList';
import { AgentBanner } from '../../_components/AgentBanner';
import { createClient } from '@/prismicio';

import { filter } from '@prismicio/client';

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 6;
  const client = createClient();

  // Fetch Featured Blogs (Top 4)
  const featuredPosts = await client.getAllByType('blog_post', {
    orderings: {
      field: 'my.blog_post.published_at',
      direction: 'desc',
    },
    limit: 4,
  });

  const featuredBlogs = featuredPosts.map((post) => ({
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

  // Fetch Listed Blogs (Paginated, excluding featured)
  const featuredIds = featuredPosts.map((post) => post.id);
  const listedPostsResponse = await client.getByType('blog_post', {
    orderings: {
      field: 'my.blog_post.published_at',
      direction: 'desc',
    },
    filters: featuredIds.map((id) => filter.not('document.id', id)),
    page: currentPage,
    pageSize: pageSize,
  });

  const listedBlogs = listedPostsResponse.results.map((post) => ({
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
    <main>
      <Home />
      <FeaturedLists blogs={featuredBlogs} />
      <BlogsList
        blogs={listedBlogs}
        totalPages={listedPostsResponse.total_pages}
        currentPage={currentPage}
      />
      <AgentBanner />
    </main>
  );
}
