'use client';

import { useTranslations } from 'next-intl';
import ProgressList from './_components/ProgressList';

export default function CurrentProgressPage() {
  const t = useTranslations('progress');
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      <ProgressList />
    </div>
  );
}
