import type { Metadata } from 'next';
import { Inventory } from './_components/Inventory';

export const metadata: Metadata = {
  title: 'Properties | Addis Life',
  description:
    'Browse premium properties and filter by location, type, status, and bedrooms.',
};

export default function PropertiesPage() {
  return <Inventory />;
}
