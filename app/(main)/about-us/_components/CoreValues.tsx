'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

type CoreValues = {
  id: number;
  titleKey: string;
  descriptionKey: string;
};

type Achievements = {
  id: number;
  titleKey: string;
  value: string;
};
export default function CoreValues() {
  const t = useTranslations('aboutUs.coreValues');

  const coreValues: CoreValues[] = [
    {
      id: 1,
      titleKey: 'qualityFirst',
      descriptionKey: 'qualityDescription',
    },
    {
      id: 2,
      titleKey: 'empowerment',
      descriptionKey: 'empowermentDescription',
    },
    {
      id: 3,
      titleKey: 'timelyDelivery',
      descriptionKey: 'timelyDescription',
    },
  ];

  const achievements: Achievements[] = [
    {
      id: 2,
      titleKey: 'employee',
      value: '300+',
    },
    {
      id: 3,
      titleKey: 'deliveredProjects',
      value: '3+',
    },
    {
      id: 4,
      titleKey: 'happyClient',
      value: '300+',
    },
    {
      id: 5,
      titleKey: 'experienceDays',
      value: '1000+',
    },
  ];
  return (
    <section className="bg-primary rounded-3xl py-10 lg:py-20 flex flex-col">
      <div className="flex w-full max-w-[1212px] px-3 lg:px-0 mx-auto gap-5 lg:gap-10 flex-col items-center justify-center">
        <div className="flex flex-col w-full max-w-[720px] justify-center items-center gap-2 lg:gap-3 text-white">
          <h2 className="text-3xl lg:text-4xl font-bold font-instrument leading-tight md:text-5xl">
            {t('title')}
          </h2>
          <p className=" text-center text-base lg:text-lg leading-relaxed ">
            {t('subtitle')}
          </p>
        </div>
        <div className="grid grid-cols1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-[1212px] mx-auto">
          {coreValues.map((value) => (
            <div
              key={value.id}
              className="flex flex-col w-full p-6 gap-2 bg-white rounded-2xl"
            >
              <span className="p-3 rounded-sm shadow-sm size-12 flex items-center justify-center bg-[#F5F5F5] text-xl font-semibold">
                {value.id}
              </span>
              <p className="text-lg font-semibold">{t(value.titleKey)}</p>
              <p className="text-description text-base leading-[150%]">
                {t(value.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
      <span className="w-full w-full mx-auto h-[1px] bg-white/20 my-10 lg:my-16" />
      <div className="flex flex-col gap-7 lg:gap-10 items-center justify-center text-white">
        <p className="text-xl font-medium">{t('numbersAchievements')}</p>
        <div className="flex flex-col md:flex-row w-full mt-5 max-w-[1100px] mx-auto items-center justify-around gap-8 relative">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="flex flex-col items-center justify-center gap-3 relative flex-1"
            >
              <p className="text-4xl font-semibold">{achievement.value}</p>
              <p className="text-base font-normal opacity-90">
                {t(achievement.titleKey)}
              </p>
              {index < achievements.length - 1 && (
                <span className="md:h-16 md:w-px absolute -right-4 top-1/2 -translate-y-1/2 bg-white/30"></span>
              )}
              {index < achievements.length - 1 && (
                <span className="md:hidden w-full h-px bg-white/30"></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
