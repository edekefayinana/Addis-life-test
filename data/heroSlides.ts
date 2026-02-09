export type HeroSlide = {
  id: string;
  type: 'image' | 'video';
  src: string;
  headline: string;
  subhead: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: 'intro-video',
    type: 'video',
    src: '/video/WEBESIT.mp4',
    headline: 'Experience Addis Life in Motion',
    subhead:
      'Take a cinematic look at our flagship communities and the lifestyle they unlock.',
  },
  {
    id: 'premium-living',
    type: 'image',
    src: '/hero-image.jpg',
    headline: 'Priority Access Now Open',
    subhead:
      'Secure early access to our newest releases with flexible payment plans and verified availability.',
  },
  {
    id: 'curated-options',
    type: 'image',
    src: '/property-1.jpg',
    headline: 'Limited Units, Verified Listings',
    subhead:
      'Explore a curated selection with clear pricing, transparent details, and priority scheduling.',
  },
];
