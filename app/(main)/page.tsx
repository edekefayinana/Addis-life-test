import { Hero } from '../_components/Hero';
import { PropertyCarousel } from '@/components/PropertyCarousel';
import { DeveloperSection } from '../_components/DeveloperSection';
import { ExpertiseSection } from '../_components/ExpertiseSection';
import { ProjectListings } from '../_components/ProjectListings';
import { Testimonials } from '../_components/Testimonials';
import { Insights } from '../_components/Insights';
import { AgentBanner } from '../_components/AgentBanner';
import { createClient } from '@/prismicio';
import { heroVideoSlide, type HeroSlide } from '@/data/heroSlides';
import { PropertyCardProps } from '@/components/PropertyCard';

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

type DbProperty = {
  title: string;
  listingType?: string;
  builtStartDate?: string;
  propertyType?: string;
  currentStatus?: string;
  totalBedrooms?: number;
  totalBathrooms?: number;
  parkingSpace?: number;
  areaSizeM2?: number;
  availableFloors?: number;
  buildingSize?: number;
  deliveryTime?: string;
  amenities?: Array<{ name: string }>;
  nearbyPlaces?: Array<{ name: string }>;
  address?: string;
  city?: string;
  country?: string;
  longitude?: number;
  latitude?: number;
  images?: Array<{ url: string }>;
};

const mapHeroSlides = (
  slides: PrismicHeroSlide[] = [],
  sourceId = 'hero'
): HeroSlide[] =>
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
        id: `${sourceId}-${index}`,
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

async function fetchFeaturedProperties(): Promise<PropertyCardProps[]> {
  try {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api';
    const response = await fetch(`${baseUrl}/inventory?limit=8`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch properties:', response.statusText);
      return [];
    }

    const result = await response.json();
    const dbProperties: DbProperty[] = result.data?.properties || [];

    // Transform and filter database properties to PropertyCard format
    return dbProperties
      .filter(
        (property) =>
          property.title &&
          property.builtStartDate &&
          property.propertyType &&
          property.currentStatus &&
          property.totalBedrooms &&
          property.totalBathrooms &&
          property.areaSizeM2 &&
          property.address &&
          property.city &&
          property.country
      )
      .map((property) => ({
        title: property.title,
        type: (property.listingType?.toLowerCase() || 'sale') as
          | 'rent'
          | 'sale',
        overview: {
          built_start_date: property.builtStartDate!,
          property_type: (property.propertyType || 'Residential') as
            | 'Residential'
            | 'Commercial',
          current_status: property.currentStatus!,
        },
        property_details: {
          total_bedrooms: property.totalBedrooms!,
          total_bathrooms: property.totalBathrooms!,
          parking_space: property.parkingSpace || 0,
          area_size_m2: property.areaSizeM2!,
          available_floors: property.availableFloors?.toString() || '0',
          building_size: property.buildingSize?.toString() || '0',
          delivery_time: property.deliveryTime || 'TBD',
        },
        amenities: property.amenities?.map((a) => a.name) || [],
        location_and_surroundings: {
          nearby_places: property.nearbyPlaces?.map((p) => p.name) || [],
        },
        location: {
          address: property.address!,
          city: property.city!,
          country: property.country!,
          longitude: property.longitude || 0,
          latitude: property.latitude || 0,
        },
        images: property.images?.map((img) => ({ url: img.url })) || [],
      }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export default async function HomePage() {
  const client = createClient();
  let prismicSlides: HeroSlide[] = [];

  try {
    const heroDocs = await client.getAllByType('hero' as never, {
      orderings: {
        field: 'document.last_publication_date',
        direction: 'desc',
      },
      limit: 4,
    });

    prismicSlides = heroDocs.flatMap((doc) => {
      const rawSlides = (doc as { data?: { slides?: PrismicHeroSlide[] } }).data
        ?.slides;
      return mapHeroSlides(rawSlides, doc.id);
    });
  } catch {
    prismicSlides = [];
  }

  const slides = [heroVideoSlide, ...prismicSlides];

  // Fetch featured properties from API
  const properties = await fetchFeaturedProperties();

  return (
    <main>
      <Hero slides={slides} />
      <PropertyCarousel
        title="Find Your Perfect Property"
        description="Browse top real estate options across Ethiopia. From modern apartments to luxury villas."
        properties={properties}
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
