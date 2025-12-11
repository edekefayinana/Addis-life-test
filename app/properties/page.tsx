import type { Metadata } from 'next';
import { SearchSummary } from './_components/SearchSummary';

export const metadata: Metadata = {
  title: 'Properties | Addis Life',
  description:
    'Browse premium properties and filter by location, type, status, and bedrooms.',
};

interface PropertiesPageProps {
  searchParams?: {
    location?: string;
    type?: string;
    status?: string;
    bedrooms?: string;
  };
}

export default function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const { location, type, status, bedrooms } = searchParams ?? {};

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col gap-8 px-4 py-16">
      <SearchSummary
        location={location}
        type={type}
        status={status}
        bedrooms={bedrooms}
      />

      <section className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-8 text-sm text-muted-foreground">
        <p>
          Results placeholder: connect this page to your data source to display
          matching listings. Keep the page a server component; add small client
          components only where interactivity is required.
        </p>
      </section>
    </main>
  );
}
