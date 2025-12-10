import { Hero } from './_components/Hero';
import { PropertyCarousel } from '@/components/PropertyCarousel';
import { DeveloperSection } from './_components/DeveloperSection';
import { ExpertiseSection } from './_components/ExpertiseSection';
import { ProjectListings } from './_components/ProjectListings';
import { Testimonials } from './_components/Testimonials';
import { Insights } from './_components/Insights';
import { AgentBanner } from './_components/AgentBanner';

const featuredProperties = [
  {
    title: 'AU1 site - Two Bed Room Apartment',

    location: 'Sarbet Blue Point, Sarbet',
    beds: 4,
    baths: 2,
    area: 450,
    imageUrl: '/property-1.jpg',
    type: 'For Sale',
    price: '$250,000',
  },
  {
    title: 'AU1 site - Two Bed Room Apartment',
    location: 'Sarbet Blue Point, Sarbet',
    beds: 4,
    baths: 2,
    area: 450,
    imageUrl: '/property-3.jpg',
    type: 'For Rent',
    price: '$3,000/mo',
  },
  {
    title: 'AU1 site - Three Bed Room Apartment',
    location: 'Sarbet Blue Point, Sarbet',
    beds: 4,
    baths: 2,
    area: 450,
    imageUrl: '/property-2.jpg',
    type: 'For Sale',
    price: '$450,000',
  },
  {
    title: 'Penthouse View',
    location: 'Lideta, Addis Ababa',
    beds: 4,
    baths: 3,
    area: 280,
    imageUrl: '/property-1.jpg',
    type: 'For Sale',
    price: '$450,000',
  },
];

export default function HomePage() {
  return (
    <main>
      <Hero />
      <PropertyCarousel
        title="Find Your Perfect Property"
        description="Browse top real estate options across Ethiopia . From modern apartments to luxury villas."
        properties={featuredProperties}
      />
      <DeveloperSection />
      <ExpertiseSection />
      <ProjectListings />
      <Testimonials />
      <Insights />
      <AgentBanner />
    </main>
  );
}
