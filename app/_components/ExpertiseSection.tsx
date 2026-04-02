'use client';

import {
  CircleUserRound,
  HandCoins,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { useTranslations } from 'next-intl';

export function ExpertiseSection() {
  const t = useTranslations('home.expertise');

  const features = [
    {
      icon: ShieldCheck,
      titleKey: 'qualityExcellence',
      descriptionKey: 'qualityDescription',
    },
    {
      icon: UserCheck,
      titleKey: 'trustTransparency',
      descriptionKey: 'trustDescription',
    },
    {
      icon: CircleUserRound,
      titleKey: 'customerConfidence',
      descriptionKey: 'customerDescription',
    },
    {
      icon: HandCoins,
      titleKey: 'sustainableGrowth',
      descriptionKey: 'sustainableDescription',
    },
  ];

  return (
    <section className="bg-brand-dark py-20 text-white rounded-lg">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          {/* Left Text Content */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <h2 className="text-4xl font-bold leading-tight md:text-5xl">
              {t('title')}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              {t('subtitle')}
            </p>
          </div>

          {/* Right Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {features.map((feature, idx) => (
              <FeatureCard
                key={idx}
                icon={feature.icon}
                title={t(feature.titleKey)}
                description={t(feature.descriptionKey)}
                className="h-full"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
