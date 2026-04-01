'use client';
import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';

export default function MissionVision() {
  const t = useTranslations('aboutUs.missionVision');
  return (
    <section className="py-10 lg:py-20">
      <div className="max-w-[1212px] mx-auto">
        <div className="flex flex-wrap space-y-9 justify-between items-start">
          {/* Left Column - Main Heading and CTA */}
          <div className="flex flex-col gap-3 lg:gap-5 w-full max-w-[537px]">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-instrument font-semibold leading-[120%]">
              {t('title')}
            </h2>
            <p className="text-base lg:text-lg leading-[150%] font-instrument text-description">
              {t('description')}
            </p>
            <button className="bg-primary mt-3 lg:mt-5 w-fit text-white px-5 py-3 lg:px-9 lg:py-4 rounded-full font-medium transition-colors duration-200">
              <Link href="/contact-us" className="flex items-center gap-2">
                {t('workWithUs')}
              </Link>
            </button>
          </div>

          {/* Right Column - Mission and Vision */}
          <div className="relative flex flex-col gap-12 w-full max-w-[574px]">
            {/* Our Mission */}
            <span className="absolute w-0.5 top-7 left-3 lg:left-1.5 bg-amber-100 h-1/2" />
            <div className="flex gap-4">
              <div className="flex flex-col gap-3 lg:gap-6">
                <div className="flex items-center gap-9 lg:gap-10">
                  <span className="size-4 ml-1.5 lg:ml-0 rounded-full bg-[#FEAE01]"></span>
                  <h3 className="text-2xl font-semibold font-instrument">
                    {t('ourMission')}
                  </h3>
                </div>
                <p className="text-base lg:text-lg ml-[58.5px] leading-[165%] font-instrument text-description">
                  {t('missionText')}
                </p>
              </div>
            </div>

            {/* Our Vision */}
            <div className="flex gap-4">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-9 lg:gap-10">
                  <span className="size-4 ml-1.5 lg:ml-0 rounded-full bg-[#FEAE01]"></span>
                  <h3 className="text-2xl font-semibold font-instrument">
                    {t('ourVision')}
                  </h3>
                </div>
                <p className="text-base lg:text-lg ml-[58.5px] leading-[165%] font-instrument text-description">
                  {t('visionText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
