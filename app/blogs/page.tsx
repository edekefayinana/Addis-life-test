import Home from './_components/Home';
import FeaturedLists from './_components/FeaturedLists';
import BlogsList from './_components/BlogsList';
import { AgentBanner } from '../_components/AgentBanner';
import { createClient } from '@/prismicio';

export default async function page() {
  const client = createClient();
  const posts = await client.getAllByType('blog_post', {
    orderings: {
      field: 'my.blog_post.published_at',
      direction: 'desc',
    },
  });

  const blogs = posts.map((post) => ({
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
    image: post.data.cover.url || '/images/property-1.png', // Fallback image
    slug: (post.data.slug as string) || post.uid,
  }));

  const featuredBlogs = blogs.slice(0, 4);
  const listedBlogs = blogs.slice(4);

  return (
    <main>
      <Home />
      <FeaturedLists blogs={featuredBlogs} />
      <BlogsList blogs={listedBlogs} />
      <AgentBanner />
    </main>
  );
}
