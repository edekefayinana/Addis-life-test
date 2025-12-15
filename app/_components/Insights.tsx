import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import BlogCard from '../blogs/_components/BlogCard';
import type { Blog } from '../blogs/finding-your-ideal-property-what-matters-most/_components/LatestListings';

const insights: Blog[] = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop',
    title: 'Finding Your Perfect Home In Addis Ababa',
    date: 'Dec 12, 2024',
    description:
      'Detailed guide on what to look for when buying property in the bustling capital.',
    slug: 'finding-your-perfect-home-in-addis-ababa',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1000&auto=format&fit=crop',
    title: 'Real Estate Trends for 2025',
    date: 'Nov 28, 2024',
    description:
      'Market analysis and predictions for the upcoming year in the Ethiopian market.',
    slug: 'real-estate-trends-for-2025',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1000&auto=format&fit=crop',
    title: 'Top Tips for First-Time Buyers',
    date: 'Nov 15, 2024',
    description:
      'Everything you need to know before making your first real estate investment.',
    slug: 'top-tips-for-first-time-buyers',
  },
];

export function Insights() {
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
          View All Properties <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
