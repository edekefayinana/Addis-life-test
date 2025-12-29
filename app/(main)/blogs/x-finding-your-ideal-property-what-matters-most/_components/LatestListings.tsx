import BlogCard from '../../_components/BlogCard';
import { Blog } from '@/types/blog';

export const PropertyMockData: Blog[] = [
  {
    id: '1',
    title: 'Finding Your Ideal Property: What Matters Most?',
    description:
      'Learn how to choose the perfect home by focus on location, budget, and lifestyle needs',
    date: 'Jan 28, 2025',
    image: '/images/property-1.png',
    slug: 'finding-your-ideal-property-what-matters-most',
  },
  {
    id: '2',
    title: 'Investing in Addis Ababa Real Estate: Tips for Success',
    description:
      'Discover strategies to make smart property investments and maximize returns.',
    date: 'Jan 28, 2025',
    image: '/images/property-2.png',
    slug: 'investing-in-addis-ababa-real-estate-tips-for-success',
  },
  {
    id: '3',
    title: 'Top Neighborhoods to Watch This Year',
    description:
      'Explore the hottest areas in the city for living, investing, and future growth.',
    date: 'Jan 28, 2025',
    image: '/images/property-3.png',
    slug: 'top-neighborhoods-to-watch-this-year',
  },
  {
    id: '4',
    title: 'Investing in Addis Ababa Real Estate: Tips for Success ',
    description:
      'Discover strategies to make smart property investments and maximize returns.',
    date: 'Jan 28, 2025',
    image: '/images/property-2.png',
    slug: 'investing-in-addis-ababa-real-estate-tips-for-success',
  },
];

export default function LatestListings() {
  return (
    <section className="flex flex-col gap-8 max-w-[1230px] mx-auto py-20">
      <h1 className="text-xl md:text-[32px] leading-[150%] font-semibold text-[#0A0A0A]">
        Other Latest Blogs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PropertyMockData.slice(0, 3).map((listing) => (
          <BlogCard key={listing.id} blog={listing} />
        ))}
      </div>
    </section>
  );
}
