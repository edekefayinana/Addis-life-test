// Property related types
export interface PropertyImage {
  id?: string;
  url: string;
  propertyId?: string;
}

export interface Amenity {
  id?: string;
  name: string;
  propertyId?: string;
}

export interface NearbyPlace {
  id?: string;
  name: string;
  propertyId?: string;
}

export interface Property {
  id?: string;
  title: string;
  builtStartDate: string | Date;
  propertyType: 'APARTMENT' | 'HOUSE' | 'VILLA' | 'CONDO' | 'COMMERCIAL';
  listingType: 'RENT' | 'SALE';
  currentStatus: string;
  totalBedrooms: number;
  totalBathrooms: number;
  parkingSpace: number;
  areaSizeM2: number;
  longitude: number;
  latitude: number;
  buildingSize?: string;
  deliveryTime?: string;
  address: string;
  city: string;
  country: string;
  availableFloors: string[] | string;
  projectId: string;

  // Relations
  amenities: Amenity[];
  nearbyPlaces: NearbyPlace[];
  images: PropertyImage[];

  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
  createdById?: string;
}

export interface PropertyFormData extends Omit<
  Property,
  'availableFloors' | 'amenities' | 'nearbyPlaces'
> {
  availableFloors: string; // Comma-separated for form
  amenities: string; // Comma-separated for form
  nearbyPlaces: string; // Comma-separated for form
}
