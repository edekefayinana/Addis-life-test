'use client';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('contact.home');
  return (
    <section className="pt-20 pb-10 mf:pt-0 md:py-20 px-4 lg:px-0">
      <div className="flex w-full max-w-[1212px] flex-col gap-3 lg:gap-5 mx-auto items-center justify-center">
        <h1 className="text-3xl md:text-4xl lg:text-[64px] max-w-[940px] font-semibold leading-[120%] text-center">
          {t('title')}
        </h1>
        <p className="text-base lg:text-lg max-w-[854px] leading-[150%] text-center text-description">
          {t('description')}
        </p>
      </div>
    </section>
  );
}
