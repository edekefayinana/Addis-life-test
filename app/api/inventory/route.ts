/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { PrismaApiFeatures, PrismaApiFeaturesConfig } from '@/lib/apiFeatures';
import { requireAdmin } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { handleApiError, sendResponse } from '@/lib/error-handler';

export async function GET(req: NextRequest) {
  try {
    const config: PrismaApiFeaturesConfig = {
      allowedFields: [
        'propertyType',
        'listingType',
        'currentStatus',
        'city',
        'totalBedrooms',
        'country',
      ],
      searchFields: [
        'title',
        'address',
        'city',
        'country',
        'currentStatus',
        'buildingSize',
        'deliveryTime',
      ],
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

    // Get total count for pagination metadata
    const totalCount = await prisma.property.count({
      where: features.build().where,
    });

    const properties = await prisma.property.findMany({
      ...features.build(),
      include: {
        amenities: true,
        nearbyPlaces: true,
        images: true,
      },
    });

    return sendResponse(
      {
        properties,
      },
      properties.length,
      features.getMeta(totalCount)
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin();

    if (authResult.error) {
      return authResult.error;
    }

    const body = await req.json();

    // Destructure and prepare nested creates for relations
    const { amenities, nearbyPlaces, images, ...propertyData } = body;

    const { projectId, ...rest } = propertyData;
    const createData: any = {
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
    const property = await prisma.property.create({
      data: createData,
      include: {
        amenities: true,
        nearbyPlaces: true,
        images: true,
      },
    });
    return sendResponse(property, 1);
  } catch (error) {
    return handleApiError(error);
  }
}
