import Link from 'next/link';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { truncate } from '@/lib/utils';

type PropertyType = 'Residential' | 'Commercial';

export type PropertyCardProps = {
  title: string;

  overview: {
    built_start_date: string;
    property_type: PropertyType;
    current_status: string;
  };

  property_details: {
    total_bedrooms: number;
    total_bathrooms: number;
    parking_space: number;
    area_size_m2: number;
    available_floors: string | number[];
    building_size: string;
    delivery_time: string;
  };

  amenities: string[];

  location_and_surroundings: {
    nearby_places: string[];
  };

  location: {
    address: string;
    city: string;
    country: string;
    longitude: number;
    latitude: number;
  };
};

// Generate a random ID from title if not provided
function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function PropertyCard({
  title,
  location,
  property_details,
}: PropertyCardProps) {
  const propertyId = slugify(title);

  return (
    <Link href={`/properties/${propertyId}`} className="block">
      <Card className="overflow-hidden group cursor-pointer transition-all p-2 hover:shadow-lg border-0 shadow-md rounded-lg">
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-gray-100" />
        <CardContent className="p-4 pb-2">
          <h3 className="line-clamp-1 text-lg font-semibold text-black">
            {truncate(title, 30)}
          </h3>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <MapPin className="mr-2 h-4 w-4 shrink-0" />
            <span className="line-clamp-1">
              {location.address}, {location.city}
            </span>
          </div>
        </CardContent>

        <div className="px-5">
          <div className="h-px w-full bg-gray-100" />
        </div>

        <CardFooter className="flex justify-between items-center p-4 text-sm text-black">
          <div className="flex items-center gap-1">
            <Bed className="h-5 w-5 stroke-1" />
            <span className="font-normal">
              {property_details.total_bedrooms} Beds
            </span>
          </div>

          {/* Vertical divider simulated with margin/borders if needed. 
            The image has vertical lines between items? 
            Let's look closely... hard to tell if it's a line or just spacing. 
            Commonly it's a small vertical divider. I'll add a subtle one. */}
          <div className="h-8 w-px bg-gray-200 mx-1" />

          <div className="flex items-center gap-1">
            <Bath className="h-5 w-5 stroke-1" />
            <span className="font-normal">
              {property_details.total_bathrooms} Baths
            </span>
          </div>

          <div className="h-8 w-px bg-gray-200 mx-1" />

          <div className="flex items-center gap-1">
            <Maximize className="h-5 w-5 stroke-1" />
            <span className="font-normal">
              {property_details.area_size_m2} m²
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
