import Inventory from '@/components/inventory/Inventory';

interface PropertiesPageProps {
  searchParams?: {
    location?: string;
    propertyType?: string;
    totalBedrooms?: string;
    price?: string;
    view?: string;
    page?: string;
  };
}

export const metadata = {
  title: 'Inventory - Addis Life RE Admin',
  description: 'Browse and manage property inventory effectively.',
};

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const params = (await searchParams) || {};
  return (
    <Inventory
      location={params.location}
      propertyType={params.propertyType}
      totalBedrooms={params.totalBedrooms}
      price={params.price}
      page={Number(params?.page ?? '1')}
    />
  );
}
