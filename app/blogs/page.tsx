import Home from './_components/Home';
import FeaturedLists from './_components/FeaturedLists';
import BlogsList from './_components/BlogsList';
import { AgentBanner } from '../_components/AgentBanner';
import { createClient } from '@/prismicio';

export default async function page() {
  const client = createClient();
  const posts = await client.getAllByType('blog_post');
  console.log('blogs , ', posts);
  return (
    <main>
      <Home />
      <FeaturedLists />
      <BlogsList />
      <AgentBanner />
    </main>
  );
}
