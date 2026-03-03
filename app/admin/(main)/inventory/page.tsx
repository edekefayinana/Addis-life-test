import Inventory from '@/components/inventory/Inventory';

export const metadata = {
  title: 'Inventory - Addis Life RE Admin',
  description: 'Browse and manage property inventory effectively.',
};

export default async function PropertiesPage() {
  return <Inventory />;
}
