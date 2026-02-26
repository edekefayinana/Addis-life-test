import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from "@/app/generated/prisma";
import { PrismaApiFeatures, PrismaApiFeaturesConfig } from '@/lib/apiFeatures';
import { requireAdmin } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const config: PrismaApiFeaturesConfig = {
      allowedFields: ['propertyType', 'currentStatus', 'city'],
      searchFields: ['title'],
      defaultSort: { field: 'createdAt', order: 'desc' },
    } as const;

    const features = new PrismaApiFeatures(
      Object.fromEntries(req.nextUrl.searchParams),
      config
    )
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search();

    const properties = await prisma.property.findMany({
      ...features.build(),
      include: {
        amenities: true,
        nearbyPlaces: true,
        images: true,
      },
    });

    return NextResponse.json({
      status: 'success',
      results: properties.length,
      data: properties,
    });
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireAdmin();

  if (authResult.error) {
    return authResult.error;
  }

  const body = await req.json();

  // Destructure and prepare nested creates for relations
  const { amenities, nearbyPlaces, images, ...propertyData } = body;

  const { projectId, ...rest } = propertyData;
  const createData = {
    ...rest,
    createdBy: {
      connect: {
        id: authResult.session.user.id,
      },
    },
    ...(projectId && {
      project: {
        connect: { id: projectId },
      },
    }),
  };

  // Handle amenities relation
  if (Array.isArray(amenities)) {
    createData.amenities = {
      create: amenities,
    };
  }

  // Handle nearbyPlaces relation
  if (Array.isArray(nearbyPlaces)) {
    createData.nearbyPlaces = {
      create: nearbyPlaces,
    };
  }

  // Handle images relation
  if (Array.isArray(images)) {
    createData.images = {
      create: images,
    };
  }
  console.log('Create Data:', createData);

  const property = await prisma.property.create({
    data: createData,
    include: {
      amenities: true,
      nearbyPlaces: true,
      images: true,
    },
  });
  return NextResponse.json(property);
}
