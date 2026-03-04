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
  eyebrow: 'Beyond Promises, We Deliver.',
  headline: 'Where Quality Meets Integrity',
  subhead:
    'Experience real estate built on trust and delivered with excellence.',
  highlights: [
    { label: 'Communities', value: '12+' },
    { label: 'Verified units', value: '480+' },
    { label: 'Payment plans', value: 'Flexible' },
  ],
};

export const fallbackHeroSlides: HeroSlide[] = [heroVideoSlide];
