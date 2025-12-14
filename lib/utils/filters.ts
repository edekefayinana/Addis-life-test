/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Filters } from '../hooks/useFilters';

export function buildFilterQuery(filters: Partial<Filters>) {
  const { location, type, bedrooms, price } = filters;

  const where: any = {};

  if (location) {
    where.location = {
      contains: location,
      mode: 'insensitive',
    };
  }

  if (type) {
    where.type = {
      equals: type,
      mode: 'insensitive',
    };
  }

  if (bedrooms) {
    where.beds = {
      equals: Number(bedrooms),
    };
  }

  if (price) {
    // Assuming priceBand is a string field
    where.priceBand = {
      equals: price,
    };
  }

  return { where };
}

// For pagination
export function buildPaginationQuery(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { skip, take };
}
