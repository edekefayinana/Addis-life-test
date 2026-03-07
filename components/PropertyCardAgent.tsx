'use client';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { truncate } from '@/lib/utils';
import {
  Bath,
  Bed,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Maximize,
  Edit,
  Eye,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { DeletePropertyDialog } from '@/components/inventory/DeletePropertyDialog';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export type PropertyCardProps = {
  id: string;
  title: string;
  builtStartDate: string;
  propertyType: string;
  listingType: string;
  currentStatus: string;
  totalBedrooms: number;
  totalBathrooms: number;
  parkingSpace: number;
  areaSizeM2: number;
  availableFloors: string | number[];
  buildingSize: string;
  deliveryTime: string;
  address: string;
  city: string;
  country: string;
  longitude: number;
  latitude: number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  images?: Image[];
  onDeleted?: () => void;
};

type Image = {
  url: string;
  id: string;
};

export function PropertyCard({
  id,
  title,
  address,
  city,
  totalBedrooms,
  totalBathrooms,
  areaSizeM2,
  images,
  onDeleted,
}: PropertyCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const { isAdmin } = useAuth();

  const showImage =
    images && images.length > 0 ? images[imgIndex] : { url: '/property-1.jpg' };
  // Handle both absolute and relative URLs
  let imageUrl = showImage.url;
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
    imageUrl = '/' + imageUrl;
  }

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => {
      const len = images?.length ?? 1;
      return (i - 1 + len) % len;
    });
  };
  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => {
      const len = images?.length ?? 1;
      return (i + 1) % len;
    });
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="block relative group">
      <Link href={`/admin/inventory/${id}`}>
        <Card className="overflow-hidden cursor-pointer transition-all p-2 hover:shadow-lg border-0 shadow-md rounded-lg">
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-gray-100">
            <Image src={imageUrl} alt={title} fill className="object-cover" />
            {/* Navigation buttons on image */}
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
              {imgIndex + 1}/{images ? images.length : 1}
            </div>
          </div>
          <CardContent className="p-4 pb-2">
            <h3 className="line-clamp-1 text-lg font-semibold text-black">
              {truncate(title, 30)}
            </h3>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <MapPin className="mr-2 h-4 w-4 shrink-0" />
              <span className="line-clamp-1">
                {/* {location}, {city} */}
                {address},{city}
              </span>
            </div>
          </CardContent>

          <div className="px-5">
            <div className="h-px w-full bg-gray-100" />
          </div>

          <CardFooter className="flex justify-between items-center p-4 text-sm text-black">
            <div className="flex items-center gap-1">
              <Bed className="h-5 w-5 stroke-1" />
              <span className="font-normal">{totalBedrooms} Beds</span>
            </div>
            <div className="h-8 w-px bg-gray-200 mx-1" />
            <div className="flex items-center gap-1">
              <Bath className="h-5 w-5 stroke-1" />
              <span className="font-normal">{totalBathrooms} Baths</span>
            </div>
            <div className="h-8 w-px bg-gray-200 mx-1" />
            <div className="flex items-center gap-1">
              <Maximize className="h-5 w-5 stroke-1" />
              <span className="font-normal">{areaSizeM2} m²</span>
            </div>
          </CardFooter>
        </Card>
      </Link>

      {/* Action buttons overlay - only show for admins */}
      {isAdmin && (
        <div
          className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={handleActionClick}
        >
          <Link href={`/admin/inventory/${id}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-gray-200"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/admin/inventory/${id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-gray-200"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <DeletePropertyDialog
            propertyId={id}
            propertyTitle={title}
            onDeleted={onDeleted}
          />
        </div>
      )}
    </div>
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
