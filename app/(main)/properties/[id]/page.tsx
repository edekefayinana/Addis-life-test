import PropertyPage from './_components/PropertyPage';

export const metadata = {
  title: 'Property Details - Real Estate Listings',
  description:
    'Explore detailed information about this property, including amenities, location, and more. Contact us for inquiries.',
};

export default async function PropertyDetail() {
  return <PropertyPage />;
}
