import Image from 'next/image';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export interface PropertyCardProps {
  title: string;
  location: string;
  beds: number;
  baths: number;
  area: number;
  imageUrl: string;
  price?: string;
  type?: string;
}

export function PropertyCard({
  title,
  location,
  beds,
  baths,
  area,
  imageUrl,
  // type,
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden group cursor-pointer transition-all hover:shadow-lg border-0 shadow-md rounded-3xl">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Type removed as it's not in the target design image, or if needed can be added back. 
            The image shows no badges on top of the image. 
            I will keep it hidden to be 'same as image' or maybe just comment it out. 
            Actually, let's keep it but maybe verify if the user wants it removed. 
            The user said "same as image", image has no badges. I will remove it. */}
      </div>
      <CardContent className="p-5 pb-2">
        <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
          {title}
        </h3>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPin className="mr-2 h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>
      </CardContent>

      <div className="px-5">
        <div className="h-px w-full bg-gray-100" />
      </div>

      <CardFooter className="flex justify-between items-center p-5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Bed className="h-5 w-5 stroke-1" />
          <span className="font-medium">{beds} Beds</span>
        </div>

        {/* Vertical divider simulated with margin/borders if needed. 
            The image has vertical lines between items? 
            Let's look closely... hard to tell if it's a line or just spacing. 
            Commonly it's a small vertical divider. I'll add a subtle one. */}
        <div className="h-8 w-px bg-gray-200 mx-2" />

        <div className="flex items-center gap-2">
          <Bath className="h-5 w-5 stroke-1" />
          <span className="font-medium">{baths} Baths</span>
        </div>

        <div className="h-8 w-px bg-gray-200 mx-2" />

        <div className="flex items-center gap-2">
          <Maximize className="h-5 w-5 stroke-1" />
          <span className="font-medium">{area} sqft</span>
        </div>
      </CardFooter>
    </Card>
  );
}
