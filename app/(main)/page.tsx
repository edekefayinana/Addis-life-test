import { Hero } from '../_components/Hero';
import { PropertyCarousel } from '@/components/PropertyCarousel';
import { DeveloperSection } from '../_components/DeveloperSection';
import { ExpertiseSection } from '../_components/ExpertiseSection';
import { ProjectListings } from '../_components/ProjectListings';
import { Testimonials } from '../_components/Testimonials';
import { Insights } from '../_components/Insights';
import { AgentBanner } from '../_components/AgentBanner';
import propertiesData from '@/data/african Union 2 site-all units';
import { createClient } from '@/prismicio';
import { heroVideoSlide, type HeroSlide } from '@/data/heroSlides';

type PrismicHeroSlide = {
  image?: { url?: string | null } | null;
  eyebrow?: string | null;
  headline?: string | null;
  subhead?: string | null;
  announcement_type?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
  highlight_1_label?: string | null;
  highlight_1_value?: string | null;
  highlight_2_label?: string | null;
  highlight_2_value?: string | null;
  highlight_3_label?: string | null;
  highlight_3_value?: string | null;
};

const mapHeroSlides = (slides: PrismicHeroSlide[] = []): HeroSlide[] =>
  slides
    .map((slide, index) => {
      const imageUrl = slide.image?.url ?? undefined;
      if (!imageUrl || !slide.headline || !slide.subhead) {
        return null;
      }

      const highlightPairs = [
        {
          label: slide.highlight_1_label,
          value: slide.highlight_1_value,
        },
        {
          label: slide.highlight_2_label,
          value: slide.highlight_2_value,
        },
        {
          label: slide.highlight_3_label,
          value: slide.highlight_3_value,
        },
      ]
        .filter((item) => item.label && item.value)
        .map((item) => ({
          label: item.label as string,
          value: item.value as string,
        }));

      const announcementTypeRaw = slide.announcement_type?.toLowerCase();
      const announcementType =
        announcementTypeRaw === 'discount' ||
        announcementTypeRaw === 'launch' ||
        announcementTypeRaw === 'event' ||
        announcementTypeRaw === 'news'
          ? announcementTypeRaw
          : undefined;

      return {
        id: `hero-${index}`,
        type: 'image',
        src: imageUrl,
        eyebrow: slide.eyebrow ?? undefined,
        headline: slide.headline,
        subhead: slide.subhead,
        announcementType,
        cta:
          slide.cta_label && slide.cta_href
            ? { label: slide.cta_label, href: slide.cta_href }
            : undefined,
        highlights: highlightPairs.length > 0 ? highlightPairs : undefined,
      } satisfies HeroSlide;
    })
    .filter(Boolean) as HeroSlide[];

export default async function HomePage() {
  const client = createClient();
  let prismicSlides: HeroSlide[] = [];

  try {
    const heroDoc = await client.getSingle('hero' as never);
    const rawSlides = (heroDoc as { data?: { slides?: PrismicHeroSlide[] } })
      .data?.slides;
    prismicSlides = mapHeroSlides(rawSlides);
  } catch {
    prismicSlides = [];
  }

  const slides = [heroVideoSlide, ...prismicSlides];

  return (
    <main>
      <Hero slides={slides} />
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
