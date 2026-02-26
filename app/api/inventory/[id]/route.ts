/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireAdmin } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const property = await prisma.property.findUnique({
      where: { id: id },
      include: {
        amenities: true,
        nearbyPlaces: true,
        images: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ...property });
  } catch {
    return NextResponse.json(
      { message: 'Error fetching property' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const authResult = await requireAdmin();

    if (authResult.error) {
      return authResult.error;
    }

    const body = await req.json();

    // Destructure and prepare nested updates for relations
    const { amenities, nearbyPlaces, images, ...propertyData } = body;

    const updateData: any = {
      ...propertyData,
      // availableFloors is a Json field, pass as is
    };

    // Handle amenities relation
    if (Array.isArray(amenities)) {
      updateData.amenities = {
        deleteMany: {},
        create: amenities,
      };
    }

    // Handle nearbyPlaces relation
    if (Array.isArray(nearbyPlaces)) {
      updateData.nearbyPlaces = {
        deleteMany: {},
        create: nearbyPlaces,
      };
    }

    // Handle images relation
    if (Array.isArray(images)) {
      updateData.images = {
        deleteMany: {},
        create: images,
      };
    }

    const updated = await prisma.property.update({
      where: { id: id },
      data: updateData,
      include: {
        amenities: true,
        nearbyPlaces: true,
        images: true,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { message: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const authResult = await requireAdmin();

    if (authResult.error) {
      return authResult.error;
    }

    await prisma.property.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch {
    return NextResponse.json(
      { message: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
