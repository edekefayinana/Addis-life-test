'use client';

import { useState } from 'react';
import { Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeletePropertyDialog } from './DeletePropertyDialog';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

interface PropertyListItemProps {
  property: {
    id: string;
    title: string;
    propertyType: string;
    listingType: string;
    city: string;
    totalBedrooms: number;
    totalBathrooms: number;
    areaSizeM2: number;
    images?: { url: string }[];
  };
  onEdit?: (propertyId: string) => void;
  onView?: (propertyId: string) => void;
  onDeleted?: () => void;
}

export function PropertyListItem({
  property,
  onEdit,
  onView,
  onDeleted,
}: PropertyListItemProps) {
  const { isAdmin } = useAuth();
  const [imageError, setImageError] = useState(false);

  const firstImage = property.images?.[0]?.url;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-video bg-gray-100 relative">
        {firstImage && !imageError ? (
          <Image
            src={firstImage}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Eye className="w-8 h-8" />
          </div>
        )}

        {/* Property Type Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium">
            {property.propertyType}
          </span>
        </div>

        {/* Listing Type Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              property.listingType === 'RENT'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {property.listingType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {property.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3">{property.city}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span>{property.totalBedrooms} beds</span>
          <span>{property.totalBathrooms} baths</span>
          <span>{property.areaSizeM2} m²</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView?.(property.id)}
              className="h-8"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>

            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(property.id)}
                className="h-8"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>

          {isAdmin && (
            <DeletePropertyDialog
              propertyId={property.id}
              propertyTitle={property.title}
              onDeleted={onDeleted}
            />
          )}
        </div>
      </div>
    </div>
  );
}
