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
    src: '/video/video.mp4',
    headline: 'Experience Addis Life in Motion',
    subhead:
      'Take a cinematic look at our flagship communities and the lifestyle they unlock.',
  },
  {
    id: 'premium-living',
    type: 'image',
    src: '/hero-image.jpg',
    headline: 'Discover Premium Real Estate With Confidence',
    subhead:
      'Explore ongoing and completed projects, find your ideal property, and connect with trusted freelance agents.',
  },
  {
    id: 'curated-options',
    type: 'image',
    src: '/addis%20life%202.jpg',
    headline: 'Curated Properties Across Ethiopia',
    subhead:
      'From city apartments to private villas, find a place that matches your goals and budget.',
  },
];
