'use client';
import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('blogs.hero');
  return (
    <section className="flex relative py-20 pt-40 rounded-3xl bg-[#1A1A1A] ">
      <div className="flex z-30 w-full max-w-[1212px] p-4 lg:p-0 text-white flex-col gap-6 md:gap-9 lg:gap-12 mx-auto items-start justify-end">
        <h1 className="text-4xl lg:text-[64px] max-w-[844px] font-instrument font-semibold leading-[120%]">
          {t('title')}
        </h1>
        <p className="text-base lg:text-lg max-w-[700px] leading-[150%]">
          {t('subtitle')}
        </p>
      </div>
      <Image
        src={'/images/blogs-hero-bg.svg'}
        width={1000}
        height={690}
        alt="hero bg"
        className="right-0 top-0 absolute h-full"
      />
    </section>
  );
}
