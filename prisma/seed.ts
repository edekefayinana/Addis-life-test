import 'dotenv/config';
import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. Make sure .env file exists.'
  );
}

console.log('📡 Connecting to database...');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma client with adapter
const prisma = new PrismaClient({ adapter });

// Helper function to map property type
function mapPropertyType(
  type: string
): 'APARTMENT' | 'HOUSE' | 'VILLA' | 'CONDO' | 'COMMERCIAL' {
  const typeMap: Record<
    string,
    'APARTMENT' | 'HOUSE' | 'VILLA' | 'CONDO' | 'COMMERCIAL'
  > = {
    Residential: 'APARTMENT',
    Commercial: 'COMMERCIAL',
  };
  return typeMap[type] || 'APARTMENT';
}

// Helper function to get image URLs from public folder
function getImageUrls(imagesFolder: string, projectName: string): string[] {
  const basePath = projectName.includes('African Union')
    ? 'African Union Site- visual Assets'
    : 'VATICAN-SITE';

  const fullPath = path.join(process.cwd(), 'public', basePath, imagesFolder);

  try {
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath);
      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
      );
      const imageUrls = imageFiles.map(
        (file) => `/${basePath}/${imagesFolder}/${file}`
      );

      // Reorder images starting from the middle
      const middleIndex = Math.floor(imageUrls.length / 2);
      const reorderedImages = [
        ...imageUrls.slice(middleIndex),
        ...imageUrls.slice(0, middleIndex),
      ];

      return reorderedImages;
    }
  } catch (error) {
    console.warn(`Could not read images from ${fullPath}:`, error);
  }

  // Return placeholder if no images found
  return [`/images/placeholder-property.jpg`];
}

// Property data from your files
const africanUnionProperties = [
  {
    title: 'African Union Site 2 – Type A Two Bedroom Apartment',
    type: 'sale',
    imagesFolder: 'Type A 3 bedroom + maids',
    overview: {
      built_start_date: '2025-03-14',
      property_type: 'Residential',
      current_status: '6th Floor Slab',
    },
    property_details: {
      total_bedrooms: 2,
      total_bathrooms: 2,
      parking_space: 1,
      area_size_m2: 101.62,
      available_floors: 'Not Available',
      building_size: '3B + G + 22 + Roof',
      delivery_time: '16 Months (January 2028)',
    },
    amenities: [
      'Garbage Chute',
      'Lift',
      'Parking Space',
      'Underground Water',
      'Terrace',
    ],
    location_and_surroundings: {
      nearby_places: [
        'African Union',
        'IGAD',
        'Orbis Ethiopia',
        'Embassies',
        'Government Office',
        'Church',
        'Mosque',
      ],
    },
    location: {
      address: 'Wereda 05, Kirkos',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      longitude: 8.99876,
      latitude: 38.7463,
    },
  },
  {
    title: 'African Union Site 2 – Type B Three Bedroom Apartment',
    type: 'sale',
    imagesFolder: 'Type B 3 bedroom + maids',
    overview: {
      built_start_date: '2025-03-14',
      property_type: 'Residential',
      current_status: '6th Floor Slab',
    },
    property_details: {
      total_bedrooms: 3,
      total_bathrooms: 2,
      parking_space: 1,
      area_size_m2: 116.33,
      available_floors: 'Not Available',
      building_size: '3B + G + 22 + Roof',
      delivery_time: '16 Months (January 2028)',
    },
    amenities: [
      'Garbage Chute',
      'Lift',
      'Parking Space',
      'Underground Water',
      'Terrace',
    ],
    location_and_surroundings: {
      nearby_places: [
        'African Union',
        'IGAD',
        'Orbis Ethiopia',
        'Embassies',
        'Government Office',
        'Church',
        'Mosque',
      ],
    },
    location: {
      address: 'Wereda 05, Kirkos',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      longitude: 8.99876,
      latitude: 38.7463,
    },
  },
  {
    title: 'African Union Site 2 – Type C Two Bedroom Apartment',
    type: 'sale',
    imagesFolder: 'Type C 2 bedroom + maids',
    overview: {
      built_start_date: '2025-03-14',
      property_type: 'Residential',
      current_status: '6th Floor Slab',
    },
    property_details: {
      total_bedrooms: 2,
      total_bathrooms: 2,
      parking_space: 1,
      area_size_m2: 97.91,
      available_floors: [4, 5, 8, 9, 10, 11, 12, 13],
      building_size: '3B + G + 22 + Roof',
      delivery_time: '16 Months (January 2028)',
    },
    amenities: [
      'Garbage Chute',
      'Lift',
      'Parking Space',
      'Underground Water',
      'Terrace',
    ],
    location_and_surroundings: {
      nearby_places: [
        'African Union',
        'IGAD',
        'Orbis Ethiopia',
        'Embassies',
        'Government Office',
        'Church',
        'Mosque',
      ],
    },
    location: {
      address: 'Wereda 05, Kirkos',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      longitude: 8.99876,
      latitude: 38.7463,
    },
  },
  {
    title: 'African Union Site 2 – Type D Two Bedroom Apartment',
    type: 'sale',
    imagesFolder: 'Type D 2 bedroom + maids',
    overview: {
      built_start_date: '2025-03-14',
      property_type: 'Residential',
      current_status: '6th Floor Slab',
    },
    property_details: {
      total_bedrooms: 2,
      total_bathrooms: 2,
      parking_space: 1,
      area_size_m2: 101.27,
      available_floors: [5, 7, 9, 10, 12, 13, 15],
      building_size: '3B + G + 22 + Roof',
      delivery_time: '16 Months (January 2028)',
    },
    amenities: [
      'Garbage Chute',
      'Lift',
      'Parking Space',
      'Underground Water',
      'Terrace',
    ],
    location_and_surroundings: {
      nearby_places: [
        'African Union',
        'IGAD',
        'Orbis Ethiopia',
        'Embassies',
        'Government Office',
        'Church',
        'Mosque',
      ],
    },
    location: {
      address: 'Wereda 05, Kirkos',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      longitude: 8.99876,
      latitude: 38.7463,
    },
  },
  {
    title: 'African Union Site 2 – Type E One Bedroom Apartment',
    type: 'sale',
    imagesFolder: 'Type E 2 bedroom + maids',
    overview: {
      built_start_date: '2025-03-14',
      property_type: 'Residential',
      current_status: '6th Floor Slab',
    },
    property_details: {
      total_bedrooms: 1,
      total_bathrooms: 1,
      parking_space: 1,
      area_size_m2: 68.71,
      available_floors: 'Not Available',
      building_size: '3B + G + 22 + Roof',
      delivery_time: '16 Months (January 2028)',
    },
    amenities: [
      'Garbage Chute',
      'Lift',
      'Parking Space',
      'Underground Water',
      'Terrace',
    ],
    location_and_surroundings: {
      nearby_places: [
        'African Union',
        'IGAD',
        'Orbis Ethiopia',
        'Embassies',
        'Government Office',
        'Church',
        'Mosque',
      ],
    },
    location: {
      address: 'Wereda 05, Kirkos',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      longitude: 8.99876,
      latitude: 38.7463,
    },
  },
];

const vaticanProperties = [
  {
    title: 'Vatican Site – Type A Three Bedroom Apartment',
    type: 'sale',
    imagesFolder: 'F 3',
    overview: {
      built_start_date: '2022-12-17',
      property_type: 'Residential',
      current_status: 'Plastering',
    },
    property_details: {
      total_bedrooms: 3,
      total_bathrooms: 3,
      parking_space: 1,
      area_size_m2: 208.21,
      available_floors: 'Not Available',
      building_size: '2B + G + 24 + Roof',
      delivery_time: 'After 6 months (June 2026)',
    },
    amenities: [
      'Garbage Chute',
      'Lift',
      'Parking Space',
      'Green Area',
      'Terrace',
      'Underground Water',
    ],
    location_and_surroundings: {
      nearby_places: [
        'Vatican Embassy',
        'Canada Embassy',
        'ICS International School',
        'Church',
        'Mosque',
      ],
    },
    location: {
      address: 'Wereda 08, Lideta',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      longitude: 8.990955237,
      latitude: 38.7356,
    },
  },
  {
    title: 'Vatican Site – Type B Three Bedroom Apartment',
    type: 'sale',
    imagesFolder: 'F 4',
    overview: {
      built_start_date: '2022-12-17',
      property_type: 'Residential',
      current_status: 'Plastering',
    },
    property_details: {
      total_bedrooms: 3,
      total_bathrooms: 3,
      parking_space: 1,
      area_size_m2: 211.25,
      available_floors: 'Not Available',
      building_size: '2B + G + 24 + Roof',
      delivery_time: 'After 6 months (June 2026)',
    },
    amenities: [
      'Garbage Chute',
      'Lift',
      'Parking Space',
      'Green Area',
      'Terrace',
      'Underground Water',
    ],
    location_and_surroundings: {
      nearby_places: [
        'Vatican Embassy',
        'Canada Embassy',
        'ICS International School',
        'Church',
        'Mosque',
      ],
    },
    location: {
      address: 'Wereda 08, Lideta',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      longitude: 8.990955237,
      latitude: 38.7356,
    },
  },
  {
    title: 'Vatican Site – Type C Three Bedroom Apartment',
    type: 'sale',
    imagesFolder: 'F 6',
    overview: {
      built_start_date: '2022-12-17',
      property_type: 'Residential',
      current_status: 'Plastering',
    },
    property_details: {
      total_bedrooms: 3,
      total_bathrooms: 3,
      parking_space: 1,
      area_size_m2: 216.5,
      available_floors: [13, 14, 15],
      building_size: '2B + G + 24 + Roof',
      delivery_time: 'After 6 months (June 2026)',
    },
    amenities: [
      'Garbage Chute',
      'Lift',
      'Parking Space',
      'Green Area',
      'Terrace',
      'Underground Water',
    ],
    location_and_surroundings: {
      nearby_places: [
        'Vatican Embassy',
        'Canada Embassy',
        'ICS International School',
        'Church',
        'Mosque',
      ],
    },
    location: {
      address: 'Wereda 08, Lideta',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      longitude: 8.990955237,
      latitude: 38.7356,
    },
  },
  {
    title: 'Vatican Site – Type D Three Bedroom Apartment',
    type: 'sale',
    imagesFolder: 'F 6',
    overview: {
      built_start_date: '2022-12-17',
      property_type: 'Residential',
      current_status: 'Plastering',
    },
    property_details: {
      total_bedrooms: 3,
      total_bathrooms: 3,
      parking_space: 1,
      area_size_m2: 218.43,
      available_floors: 'Not Available',
      building_size: '2B + G + 24 + Roof',
      delivery_time: 'After 6 months (June 2026)',
    },
    amenities: [
      'Garbage Chute',
      'Lift',
      'Parking Space',
      'Green Area',
      'Terrace',
      'Underground Water',
    ],
    location_and_surroundings: {
      nearby_places: [
        'Vatican Embassy',
        'Canada Embassy',
        'ICS International School',
        'Church',
        'Mosque',
      ],
    },
    location: {
      address: 'Wereda 08, Lideta',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      longitude: 8.990955237,
      latitude: 38.7356,
    },
  },
  {
    title: 'Vatican Site – Type A Three Bedroom Apartment (Variant)',
    type: 'sale',
    imagesFolder: 'F 3',
    overview: {
      built_start_date: '2022-12-17',
      property_type: 'Residential',
      current_status: 'Plastering',
    },
    property_details: {
      total_bedrooms: 3,
      total_bathrooms: 3,
      parking_space: 1,
      area_size_m2: 212.36,
      available_floors: [6, 16],
      building_size: '2B + G + 24 + Roof',
      delivery_time: 'After 6 months (June 2026)',
    },
    amenities: [
      'Garbage Chute',
      'Lift',
      'Parking Space',
      'Green Area',
      'Terrace',
      'Underground Water',
    ],
    location_and_surroundings: {
      nearby_places: [
        'Vatican Embassy',
        'Canada Embassy',
        'ICS International School',
        'Church',
        'Mosque',
      ],
    },
    location: {
      address: 'Wereda 08, Lideta',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      longitude: 8.990955237,
      latitude: 38.7356,
    },
  },
  {
    title: 'Vatican Site – Type B Three Bedroom Apartment (Variant)',
    type: 'sale',
    imagesFolder: 'F 4',
    overview: {
      built_start_date: '2022-12-17',
      property_type: 'Residential',
      current_status: 'Plastering',
    },
    property_details: {
      total_bedrooms: 3,
      total_bathrooms: 3,
      parking_space: 1,
      area_size_m2: 213.57,
      available_floors: [9, 10, 16],
      building_size: '2B + G + 24 + Roof',
      delivery_time: 'After 6 months (June 2026)',
    },
    amenities: [
      'Garbage Chute',
      'Lift',
      'Parking Space',
      'Green Area',
      'Terrace',
      'Underground Water',
    ],
    location_and_surroundings: {
      nearby_places: [
        'Vatican Embassy',
        'Canada Embassy',
        'ICS International School',
        'Church',
        'Mosque',
      ],
    },
    location: {
      address: 'Wereda 08, Lideta',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      longitude: 8.990955237,
      latitude: 38.7356,
    },
  },
  {
    title: 'Vatican Site – Type C One Bedroom Apartment',
    type: 'sale',
    imagesFolder: 'F 6',
    overview: {
      built_start_date: '2022-12-17',
      property_type: 'Residential',
      current_status: 'Plastering',
    },
    property_details: {
      total_bedrooms: 1,
      total_bathrooms: 1,
      parking_space: 1,
      area_size_m2: 67.02,
      available_floors: [10],
      building_size: '2B + G + 24 + Roof',
      delivery_time: 'After 6 months (June 2026)',
    },
    amenities: [
      'Garbage Chute',
      'Lift',
      'Parking Space',
      'Green Area',
      'Terrace',
      'Underground Water',
    ],
    location_and_surroundings: {
      nearby_places: [
        'Vatican Embassy',
        'Canada Embassy',
        'ICS International School',
        'Church',
        'Mosque',
      ],
    },
    location: {
      address: 'Wereda 08, Lideta',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      longitude: 8.990955237,
      latitude: 38.7356,
    },
  },
  {
    title: 'Vatican Site – Type D One Bedroom Apartment',
    type: 'sale',
    imagesFolder: 'F 4',
    overview: {
      built_start_date: '2022-12-17',
      property_type: 'Residential',
      current_status: 'Plastering',
    },
    property_details: {
      total_bedrooms: 1,
      total_bathrooms: 1,
      parking_space: 1,
      area_size_m2: 81.65,
      available_floors: 'Not Available',
      building_size: '2B + G + 24 + Roof',
      delivery_time: 'After 6 months (June 2026)',
    },
    amenities: [
      'Garbage Chute',
      'Lift',
      'Parking Space',
      'Green Area',
      'Terrace',
      'Underground Water',
    ],
    location_and_surroundings: {
      nearby_places: [
        'Vatican Embassy',
        'Canada Embassy',
        'ICS International School',
        'Church',
        'Mosque',
      ],
    },
    location: {
      address: 'Wereda 08, Lideta',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      longitude: 8.990955237,
      latitude: 38.7356,
    },
  },
  {
    title: 'Vatican Site – Type E Two Bedroom Apartment',
    type: 'sale',
    imagesFolder: 'F 6',
    overview: {
      built_start_date: '2022-12-17',
      property_type: 'Residential',
      current_status: 'Plastering',
    },
    property_details: {
      total_bedrooms: 2,
      total_bathrooms: 2,
      parking_space: 1,
      area_size_m2: 155.08,
      available_floors: [6, 7, 8],
      building_size: '2B + G + 24 + Roof',
      delivery_time: 'After 6 months (June 2026)',
    },
    amenities: [
      'Garbage Chute',
      'Lift',
      'Parking Space',
      'Green Area',
      'Terrace',
      'Underground Water',
    ],
    location_and_surroundings: {
      nearby_places: [
        'Vatican Embassy',
        'Canada Embassy',
        'ICS International School',
        'Church',
        'Mosque',
      ],
    },
    location: {
      address: 'Wereda 08, Lideta',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      longitude: 8.990955237,
      latitude: 38.7356,
    },
  },
  {
    title: 'Vatican Site – Type F Two Bedroom Apartment',
    type: 'sale',
    imagesFolder: 'F 6',
    overview: {
      built_start_date: '2022-12-17',
      property_type: 'Residential',
      current_status: 'Plastering',
    },
    property_details: {
      total_bedrooms: 2,
      total_bathrooms: 2,
      parking_space: 1,
      area_size_m2: 142.89,
      available_floors: 'Not Available',
      building_size: '2B + G + 24 + Roof',
      delivery_time: 'After 6 months (June 2026)',
    },
    amenities: [
      'Garbage Chute',
      'Lift',
      'Parking Space',
      'Green Area',
      'Terrace',
      'Underground Water',
    ],
    location_and_surroundings: {
      nearby_places: [
        'Vatican Embassy',
        'Canada Embassy',
        'ICS International School',
        'Church',
        'Mosque',
      ],
    },
    location: {
      address: 'Wereda 08, Lideta',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      longitude: 8.990955237,
      latitude: 38.7356,
    },
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user first
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@addislife.com' },
    update: {},
    create: {
      email: 'admin@addislife.com',
      name: 'Admin User',
      password: '$2a$10$YourHashedPasswordHere', // Change this to a real hashed password
      role: 'ADMIN',
      approvalStatus: 'APPROVED',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create African Union Project
  const africanUnionProject = await prisma.project.upsert({
    where: { id: 'african-union-site-2' },
    update: { name: 'African Union Site 2' },
    create: {
      id: 'african-union-site-2',
      name: 'African Union Site 2',
    },
  });

  console.log('✅ African Union Project created');

  // Create Vatican Project
  const vaticanProject = await prisma.project.upsert({
    where: { id: 'vatican-site' },
    update: { name: 'Vatican Site' },
    create: {
      id: 'vatican-site',
      name: 'Vatican Site',
    },
  });

  console.log('✅ Vatican Project created');

  // Seed Vatican Properties
  for (const prop of vaticanProperties) {
    const imageUrls = getImageUrls(prop.imagesFolder, prop.title);
    const availableFloors = Array.isArray(
      prop.property_details.available_floors
    )
      ? prop.property_details.available_floors
      : [];

    const property = await prisma.property.create({
      data: {
        title: prop.title,
        builtStartDate: new Date(prop.overview.built_start_date),
        propertyType: mapPropertyType(prop.overview.property_type),
        listingType: prop.type?.toUpperCase() === 'SALE' ? 'SALE' : 'RENT',
        currentStatus: prop.overview.current_status,
        totalBedrooms: prop.property_details.total_bedrooms,
        totalBathrooms: prop.property_details.total_bathrooms,
        parkingSpace: prop.property_details.parking_space,
        areaSizeM2: prop.property_details.area_size_m2,
        availableFloors: availableFloors,
        buildingSize: prop.property_details.building_size,
        deliveryTime: prop.property_details.delivery_time,
        address: prop.location.address,
        city: prop.location.city,
        country: prop.location.country,
        longitude: prop.location.longitude,
        latitude: prop.location.latitude,
        createdById: adminUser.id,
        projectId: vaticanProject.id,
        amenities: {
          create: prop.amenities.map((name) => ({ name })),
        },
        nearbyPlaces: {
          create: prop.location_and_surroundings.nearby_places.map((name) => ({
            name,
          })),
        },
        images: {
          create: imageUrls.map((url) => ({ url })),
        },
      },
    });

    console.log(`✅ Created property: ${property.title}`);
  }
  // Seed African Union Properties
  for (const prop of africanUnionProperties) {
    const imageUrls = getImageUrls(prop.imagesFolder, prop.title);
    const availableFloors = Array.isArray(
      prop.property_details.available_floors
    )
      ? prop.property_details.available_floors
      : [];

    const property = await prisma.property.create({
      data: {
        title: prop.title,
        builtStartDate: new Date(prop.overview.built_start_date),
        propertyType: mapPropertyType(prop.overview.property_type),
        listingType: prop.type?.toUpperCase() === 'SALE' ? 'SALE' : 'RENT',
        currentStatus: prop.overview.current_status,
        totalBedrooms: prop.property_details.total_bedrooms,
        totalBathrooms: prop.property_details.total_bathrooms,
        parkingSpace: prop.property_details.parking_space,
        areaSizeM2: prop.property_details.area_size_m2,
        availableFloors: availableFloors,
        buildingSize: prop.property_details.building_size,
        deliveryTime: prop.property_details.delivery_time,
        address: prop.location.address,
        city: prop.location.city,
        country: prop.location.country,
        longitude: prop.location.longitude,
        latitude: prop.location.latitude,
        createdById: adminUser.id,
        projectId: africanUnionProject.id,
        amenities: {
          create: prop.amenities.map((name) => ({ name })),
        },
        nearbyPlaces: {
          create: prop.location_and_surroundings.nearby_places.map((name) => ({
            name,
          })),
        },
        images: {
          create: imageUrls.map((url) => ({ url })),
        },
      },
    });

    console.log(`✅ Created property: ${property.title}`);
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
