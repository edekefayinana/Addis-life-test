/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireAdmin } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { handleApiError, sendResponse } from '@/lib/error-handler';
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
      return sendResponse({ error: 'Property not found' }, 0, undefined, 404);
    }

    return sendResponse(property, 1);
  } catch (error) {
    return handleApiError(error);
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

    return sendResponse(updated, 1);
  } catch (error) {
    return handleApiError(error);
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

    // Check if property exists and get related data
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        reservations: true,
        images: true,
        amenities: true,
        nearbyPlaces: true,
      },
    });

    if (!property) {
      return sendResponse({ error: 'Property not found' }, 0, undefined, 404);
    }

    // Check for active reservations
    const activeReservations = property.reservations.filter(
      (reservation) =>
        reservation.status === 'PENDING' || reservation.status === 'CONFIRMED'
    );

    if (activeReservations.length > 0) {
      return sendResponse(
        {
          error: 'Cannot delete property with active reservations',
          activeReservations: activeReservations.length,
        },
        0,
        undefined,
        400
      );
    }

    // Perform cascade deletion in transaction
    await prisma.$transaction(async (tx) => {
      // Delete all reservations (including cancelled/expired ones)
      await tx.reservation.deleteMany({
        where: { propertyId: id },
      });

      // Delete all images
      await tx.propertyImage.deleteMany({
        where: { propertyId: id },
      });

      // Delete all amenities
      await tx.amenity.deleteMany({
        where: { propertyId: id },
      });

      // Delete all nearby places
      await tx.nearbyPlace.deleteMany({
        where: { propertyId: id },
      });

      // Finally delete the property
      await tx.property.delete({
        where: { id },
      });
    });

    return sendResponse(
      {
        message: 'Property and all related data deleted successfully',
        deletedItems: {
          property: 1,
          reservations: property.reservations.length,
          images: property.images.length,
          amenities: property.amenities.length,
          nearbyPlaces: property.nearbyPlaces.length,
        },
      },
      1
    );
  } catch (error) {
    return handleApiError(error);
  }
}
