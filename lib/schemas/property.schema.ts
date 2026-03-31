import * as z from 'zod';

export const propertyFormSchema = z.object({
  title: z.string().min(3, 'Required'),
  builtStartDate: z.string().min(1, 'Construction date is required'),
  propertyType: z.enum(['APARTMENT', 'HOUSE', 'VILLA', 'CONDO', 'COMMERCIAL']),

  // FIX: Added .default or .optional
  listingType: z.enum(['RENT', 'SALE']).default('RENT'),
  currentStatus: z.string().default('Available'),

  totalBedrooms: z.coerce.number(),
  totalBathrooms: z.coerce.number(),
  parkingSpace: z.coerce.number(),
  areaSizeM2: z.coerce.number(),
  longitude: z.coerce.number(),
  latitude: z.coerce.number(),

  // FIX: These were triggering your error log
  buildingSize: z.string().optional().default(''),
  deliveryTime: z.string().optional().default(''),
  address: z.string(),
  city: z.string(),
  country: z.string().default('Ethiopia'), // Or .optional()

  availableFloors: z.string().describe('Comma separated floors'),
  amenities: z.string().describe('Comma separated amenities'),
  nearbyPlaces: z.string().default(''), // FIX: Added default
  images: z
    .array(
      z.object({
        id: z.string().optional(),
        url: z.string().url('Invalid image URL'),
      })
    )
    .optional()
    .default([]),
  projectId: z.string(),
});
