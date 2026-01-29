import { Hero } from '../_components/Hero';
import { PropertyCarousel } from '@/components/PropertyCarousel';
import { DeveloperSection } from '../_components/DeveloperSection';
import { ExpertiseSection } from '../_components/ExpertiseSection';
import { ProjectListings } from '../_components/ProjectListings';
import { Testimonials } from '../_components/Testimonials';
import { Insights } from '../_components/Insights';
import { AgentBanner } from '../_components/AgentBanner';
import propertiesData from '@/data/african Union 2 site-all units';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <PropertyCarousel
        title="Find Your Perfect Property"
        description="Browse top real estate options across Ethiopia . From modern apartments to luxury villas."
        properties={propertiesData}
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
