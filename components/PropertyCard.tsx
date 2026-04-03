'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn, truncate } from '@/lib/utils';
import { useTranslations } from 'next-intl';

type PropertyType = 'Residential' | 'Commercial';

export type PropertyCardProps = {
  id?: string;
  title: string;
  type?: 'rent' | 'sale';

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

  // Images from API
  images?: { url: string; id?: string }[];

  // Optional images base folder under public for this property (legacy)
  imagesFolder?: string;
};

// Generate a random ID from title if not provided
// function slugify(title: string): string {
//   return title
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-+|-+$/g, '');
// }

export function PropertyCard({
  id,
  title,
  type,
  location,
  property_details,
  images,
}: PropertyCardProps) {
  const t = useTranslations('properties.details');
  const propertyId = id;

  // Use API images if available, otherwise fallback to default
  // Filter out invalid URLs
  const validImageUrls =
    images && images.length > 0
      ? images
          .map((img) => img.url)
          .filter((url) => {
            // Check if URL is valid
            if (!url || typeof url !== 'string') return false;
            // Check if it's a valid URL format (starts with http/https or /)
            return (
              url.startsWith('http://') ||
              url.startsWith('https://') ||
              url.startsWith('/')
            );
          })
      : [];

  const imageUrls =
    validImageUrls.length > 0
      ? validImageUrls
      : ['/property-1.jpg', '/property-2.jpg', '/property-3.jpg'];

  const [imgIndex, setImgIndex] = useState(0);
  const showImage = imageUrls[imgIndex] ?? '/property-1.jpg';

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length);
  };

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % imageUrls.length);
  };

  return (
    <Link href={`/properties/${propertyId}`} className="block">
      <Card className="overflow-hidden group cursor-pointer transition-all p-2 hover:shadow-lg border-0 shadow-md rounded-lg">
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-gray-100">
          <Image
            key={showImage}
            src={showImage}
            alt={title}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback to default image on error
              const target = e.target as HTMLImageElement;
              target.src = '/property-1.jpg';
            }}
          />
          {type && (
            <span
              className={cn(
                'absolute left-3 top-3 rounded-[4px] border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm backdrop-blur',
                type === 'rent'
                  ? 'border-emerald-200 bg-emerald-50/90 text-emerald-800'
                  : 'border-amber-200 bg-amber-50/90 text-amber-800'
              )}
            >
              {type}
            </span>
          )}
          {/* Navigation buttons on image */}
          {imageUrls.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-black flex items-center justify-center shadow hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-black flex items-center justify-center shadow hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {/* Small index indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded-full bg-black/50 text-white">
                {imgIndex + 1}/{imageUrls.length}
              </div>
            </>
          )}
        </div>
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
              {property_details.total_bedrooms} {t('beds')}
            </span>
          </div>

          <div className="h-8 w-px bg-gray-200 mx-1" />

          <div className="flex items-center gap-1">
            <Bath className="h-5 w-5 stroke-1" />
            <span className="font-normal">
              {property_details.total_bathrooms} {t('baths')}
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

// Skeleton loader for PropertyCard
export function PropertyCardSkeleton() {
  return (
    <div className="block">
      <Card className="overflow-hidden group cursor-pointer transition-all p-2 border-0 shadow-md rounded-lg animate-pulse bg-gray-100">
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-gray-200" />
        <CardContent className="p-4 pb-2">
          <div className="h-5 w-3/4 bg-gray-300 rounded mb-2" />
          <div className="mt-2 flex items-center text-sm">
            <div className="h-4 w-4 bg-gray-300 rounded mr-2" />
            <div className="h-4 w-1/2 bg-gray-300 rounded" />
          </div>
        </CardContent>
        <div className="px-5">
          <div className="h-px w-full bg-gray-200" />
        </div>
        <CardFooter className="flex justify-between items-center p-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 bg-gray-300 rounded" />
            <div className="h-4 w-10 bg-gray-300 rounded" />
          </div>
          <div className="h-8 w-px bg-gray-200 mx-1" />
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 bg-gray-300 rounded" />
            <div className="h-4 w-10 bg-gray-300 rounded" />
          </div>
          <div className="h-8 w-px bg-gray-200 mx-1" />
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 bg-gray-300 rounded" />
            <div className="h-4 w-10 bg-gray-300 rounded" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
