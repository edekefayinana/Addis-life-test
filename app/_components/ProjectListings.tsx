import { PropertyCard } from '@/components/PropertyCard';

// Mock data
const listings = [
  {
    title: 'Modern City Apartment',
    location: 'Bole, Addis Ababa',
    beds: 3,
    baths: 2,
    area: 150,
    imageUrl:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop',
    type: 'For Sale',
  },
  {
    title: 'Luxury Villa',
    location: 'CMC, Addis Ababa',
    beds: 5,
    baths: 4,
    area: 450,
    imageUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop',
    type: 'For Rent',
  },
  {
    title: 'Cozy Studio',
    location: 'Kazanchis, Addis Ababa',
    beds: 1,
    baths: 1,
    area: 50,
    imageUrl:
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000&auto=format&fit=crop',
    type: 'Sold',
  },
  {
    title: 'Penthouse Suite',
    location: 'Meskel Square',
    beds: 4,
    baths: 3,
    area: 300,
    imageUrl:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop',
    type: 'For Sale',
  },
  {
    title: 'Family Home',
    location: 'Ayat, Addis Ababa',
    beds: 4,
    baths: 3,
    area: 250,
    imageUrl:
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=1000&auto=format&fit=crop',
    type: 'For Rent',
  },
  {
    title: 'Commercial Space',
    location: 'Mexico, Addis Ababa',
    beds: 0,
    baths: 2,
    area: 200,
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
    type: 'For Lease',
  },
];

export function ProjectListings() {
  return (
    <section className="container mx-auto py-16 px-4 md:px-6">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold md:text-4xl text-foreground">
          Our Project Listings
        </h2>
        <p className="mt-4 text-muted-foreground">
          Explore our wide range of properties available for sale and rent.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((prop, idx) => (
          <PropertyCard key={idx} {...prop} />
        ))}
      </div>
    </section>
  );
}
