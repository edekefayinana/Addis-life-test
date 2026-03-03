'use client';

import { PropertiesMap } from './PropertiesMap';
import { PropertyCard, PropertyCardProps } from '@/components/PropertyCard';
import { Pagination } from '@/components/inventory/Pagination';

type AdaptedProperty = PropertyCardProps & {
  // Additional fields for map functionality
  id: string;
  totalBedrooms: number;
  totalBathrooms: number;
  areaSizeM2: number;
  latitude: number;
  longitude: number;
};

type PropertiesMapViewProps = {
  properties: AdaptedProperty[];
  totalPages: number;
};

export function PropertiesMapView({
  properties,
  totalPages,
}: PropertiesMapViewProps) {
  // Ensure images array is always defined for the map component
  const propertiesWithImages = properties.map((property) => ({
    ...property,
    images: property.images || [],
  }));

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-[600px] lg:h-[calc(100vh-280px)] w-full">
        {/* Map Section - 40% */}
        <div className="w-full lg:w-[40%] shrink-0 h-[400px] md:h-[500px] lg:h-[calc(100vh-280px)]">
          <PropertiesMap properties={propertiesWithImages} />
        </div>

        {/* Property Cards Section - 60% */}
        <div className="w-full lg:w-[60%] flex flex-col overflow-hidden lg:h-full relative">
          <div className="flex-1 overflow-y-auto pr-2 lg:pr-4 scrollbar-hide">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  type={property.type}
                  overview={property.overview}
                  property_details={property.property_details}
                  amenities={property.amenities}
                  location_and_surroundings={property.location_and_surroundings}
                  location={property.location}
                  images={property.images}
                />
              ))}
            </div>
          </div>
          {/* Bottom overlay shadow */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Pagination */}
      <Pagination totalPages={totalPages} />
    </div>
  );
}
