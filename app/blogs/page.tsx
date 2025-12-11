import Home from './_components/Home';
import FeaturedLists from './_components/FeaturedLists';
import BlogsList from './_components/BlogsList';
import { AgentBanner } from '../_components/AgentBanner';

export default function page() {
  return (
    <main>
      <Home />
      <FeaturedLists />
      <BlogsList />
      <AgentBanner />
    </main>
  );
}
