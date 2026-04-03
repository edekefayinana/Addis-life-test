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
  eyebrow: 'home.hero.videoSlide.eyebrow',
  headline: 'home.hero.videoSlide.headline',
  subhead: 'home.hero.videoSlide.subhead',
  highlights: [
    { label: 'home.hero.videoSlide.communities', value: '12+' },
    { label: 'home.hero.videoSlide.verifiedUnits', value: '480+' },
    {
      label: 'home.hero.videoSlide.paymentPlans',
      value: 'home.hero.videoSlide.flexible',
    },
  ],
};

export const fallbackHeroSlides: HeroSlide[] = [heroVideoSlide];
