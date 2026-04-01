import { getTranslations } from 'next-intl/server';

export async function ServerComponentExample() {
  const t = await getTranslations('home.featuredProperties');

  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold">{t('title')}</h2>
        <p className="text-gray-600 mt-2">{t('description')}</p>
      </div>
    </section>
  );
}
