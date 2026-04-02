'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function DeveloperSection() {
  const t = useTranslations('home.developer');

  return (
    <section className="container mx-auto py-16 px-2 md:px-6 lg:px-8 z-0">
      <h2 className="text-3xl font-semibold mb-10 font-instrument">
        {t('title')}
      </h2>

      <div className="grid gap-5 md:grid-cols-13 lg:gap-5 items-center">
        <div className="relative overflow-hidden rounded-2xl h-full min-h-[300px] md:col-span-7">
          <Image
            src="/AU2 site Building Renders/2_11 - Photo.jpg"
            alt="Developer Team"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center gap-8 rounded-3xl bg-muted p-4 md:p-8 lg:p-12 md:col-span-6">
          <div className="space-y-4">
            <span className="text-base font-light uppercase tracking-wider text-foreground">
              • {t('aboutUs')}
            </span>
            <p className="text-xl leading-relaxed text-foreground mt-10 font-medium font-instrument">
              {t('description')}
            </p>
          </div>

          <div className="flex items-center gap-8 border-b border-border/50 pb-2 sm:border-0 sm:pb-0">
            <div>
              <h3 className="text-4xl font-semibold text-foreground">
                61,000 Hr+
              </h3>
              <p className="text-sm text-muted-foreground mt-3">
                {t('experience')}
              </p>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div>
              <h3 className="text-4xl font-semibold text-foreground">3+</h3>
              <p className="text-sm text-muted-foreground mt-3">
                {t('deliveredProjects')}
              </p>
            </div>
          </div>

          <Button
            className="w-fit rounded-full bg-brand-dark px-8 py-6 text-white hover:bg-brand-dark/90"
            size="lg"
          >
            <Link href="/about-us" className="flex items-center gap-2">
              {t('learnMore')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
