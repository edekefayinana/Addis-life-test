'use client';

import { PropertiesMap } from './PropertiesMap';
import { PropertyCard } from '@/components/PropertyCard';
import type { PropertyCardProps as Listing } from '@/components/PropertyCard';

type PropertiesMapViewProps = {
  properties: Listing[];
};

export function PropertiesMapView({ properties }: PropertiesMapViewProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-[600px] lg:h-[calc(100vh-280px)] w-full">
      {/* Map Section - 40% */}
      <div className="w-full lg:w-[40%] shrink-0 h-[400px] md:h-[500px] lg:h-[calc(100vh-280px)]">
        <PropertiesMap properties={properties} />
      </div>

      {/* Property Cards Section - 60% */}
      <div className="w-full lg:w-[60%] flex flex-col overflow-hidden lg:h-full relative">
        <div className="flex-1 overflow-y-auto pr-2 lg:pr-4 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {properties.map((property, idx) => (
              <PropertyCard key={`${property.title}-${idx}`} {...property} />
            ))}
          </div>
        </div>
        {/* Bottom overlay shadow */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
