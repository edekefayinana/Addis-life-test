import { Header } from '@/components/Header';
import { Hero } from './_components/Hero';
import { PropertyCarousel } from '@/components/PropertyCarousel';
import { DeveloperSection } from './_components/DeveloperSection';
import { ExpertiseSection } from './_components/ExpertiseSection';
import { ProjectListings } from './_components/ProjectListings';
import { Testimonials } from './_components/Testimonials';
import { Insights } from './_components/Insights';
import { Footer } from '@/components/Footer';

const featuredProperties = [
  {
    title: 'Modern City Apartment',
    location: 'Bole, Addis Ababa',
    beds: 3,
    baths: 2,
    area: 150,
    imageUrl:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop',
    type: 'For Sale',
    price: '$250,000',
  },
  {
    title: 'Luxury Villa',
    location: 'CMC, Addis Ababa',
    beds: 5,
    baths: 4,
    area: 450,
    imageUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop',
    type: 'For Rent',
    price: '$3,000/mo',
  },
  {
    title: 'Cozy Studio',
    location: 'Kazanchis, Addis Ababa',
    beds: 1,
    baths: 1,
    area: 50,
    imageUrl:
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000&auto=format&fit=crop',
    type: 'Sold',
    price: 'Sold',
  },
  {
    title: 'Penthouse View',
    location: 'Lideta, Addis Ababa',
    beds: 4,
    baths: 3,
    area: 280,
    imageUrl:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop',
    type: 'For Sale',
    price: '$450,000',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background p-2 font-sans md:p-2 lg:p-2">
      <div className="relative mx-auto min-h-[calc(100vh-2rem)] max-w-[1920px] overflow-hidden bg-white md:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)]">
        <Header />
        <main>
          <Hero />
          <PropertyCarousel
            title="Find Your Perfect Property"
            description="Discover our hand-picked selection of properties for you."
            properties={featuredProperties}
          />
          <DeveloperSection />
          <ExpertiseSection />
          <ProjectListings />
          <Testimonials />
          <Insights />
        </main>
        <Footer />
      </div>
    </div>
  );
}
