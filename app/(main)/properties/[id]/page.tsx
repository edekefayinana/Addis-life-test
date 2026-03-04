import { PropertyClient } from '@/components/inventory/PropertyClient';
import { apiFetch } from '@/lib/api';

export const metadata = {
  title: 'Property Details - Addis Life RE Admin',
  description:
    'Detailed view of the selected property with images, overview, and amenities.',
};

export default async function PropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const property = await apiFetch(
    `${process.env.API_BASE_URL}/inventory/${id}`
  );

  return <PropertyClient property={property.data} />;
}
