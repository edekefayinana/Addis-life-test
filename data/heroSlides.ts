export type HeroSlide = {
  id: string;
  type: 'image' | 'video';
  src: string;
  eyebrow?: string;
  headline: string;
  subhead: string;
  announcementType?: 'discount' | 'launch' | 'event' | 'news';
  cta?: {
    label: string;
    href: string;
  };
  highlights?: Array<{
    label: string;
    value: string;
  }>;
};

export const heroVideoSlide: HeroSlide = {
  id: 'intro-video',
  type: 'video',
  src: '/video/vid.mp4',
  eyebrow: 'Addis Life Signature Collection',
  headline: 'Experience Addis Life in Motion',
  subhead:
    'Take a cinematic look at our flagship communities and the lifestyle they unlock.',
  highlights: [
    { label: 'Communities', value: '12+' },
    { label: 'Verified units', value: '480+' },
    { label: 'Payment plans', value: 'Flexible' },
  ],
};

export const fallbackHeroSlides: HeroSlide[] = [heroVideoSlide];
