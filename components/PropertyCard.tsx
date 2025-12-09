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
  type,
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden group cursor-pointer transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {type && (
          <div className="absolute top-3 left-3 rounded bg-white/90 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
            {type}
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="line-clamp-1 text-lg font-semibold">{title}</h3>
        <div className="mt-1 flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-3 w-3" />
          <span className="line-clamp-1">{location}</span>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2 border-t bg-muted/20 p-4 text-xs">
        <div className="flex items-center justify-center gap-1">
          <Bed className="h-4 w-4 text-muted-foreground" />
          <span>{beds} Beds</span>
        </div>
        <div className="flex items-center justify-center gap-1 border-l border-r border-border/50">
          <Bath className="h-4 w-4 text-muted-foreground" />
          <span>{baths} Baths</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <Maximize className="h-4 w-4 text-muted-foreground" />
          <span>{area} m²</span>
        </div>
      </CardFooter>
    </Card>
  );
}
