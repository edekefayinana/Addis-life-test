/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PrismaApiFeaturesConfig {
  allowedFields?: string[];
  searchFields?: string[];
  defaultSort?: { field: string; order: 'asc' | 'desc' };
}

export interface QueryParams {
  [key: string]: any;
}

/**
 * T represents the Prisma Model Delegate (e.g., typeof prisma.user)
 * This allows us to maintain better internal consistency.
 */
export class PrismaApiFeatures {
  private query: QueryParams;
  private config: PrismaApiFeaturesConfig;

  // Using 'any' internally because Prisma types are model-specific
  private prismaOptions: {
    where: any;
    orderBy: any[];
    select?: any;
    skip?: number;
    take?: number;
  };

  constructor(query: QueryParams, config: PrismaApiFeaturesConfig = {}) {
    this.query = query;
    this.config = config;
    this.prismaOptions = {
      where: {},
      orderBy: [],
    };
  }

  /**
   * Filters out metadata and applies allowed fields.
   * Supports nested operators like ?price[gte]=100
   */
  filter(): this {
    const queryObj = { ...this.query };
    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
      'search',
      'searchFields',
    ];
    excludedFields.forEach((el) => delete queryObj[el]);

    Object.keys(queryObj).forEach((key) => {
      if (this.config.allowedFields && !this.config.allowedFields.includes(key))
        return;

      let value = queryObj[key];

      // Convert numeric strings to actual numbers for common filter keys
      if (typeof value === 'string' && !isNaN(Number(value))) {
        value = Number(value);
      }

      // Handle nested objects (for operators like gte, lte, in)
      if (typeof value === 'object' && value !== null) {
        // Ensure nested numeric strings are converted
        Object.keys(value).forEach((subKey) => {
          if (
            typeof value[subKey] === 'string' &&
            !isNaN(Number(value[subKey]))
          ) {
            value[subKey] = Number(value[subKey]);
          }
        });
      }

      this.prismaOptions.where[key] = value;
    });

    return this;
  }

  /**
   * Supports comma separated sorting: ?sort=-price,createdAt
   */
  sort(): this {
    if (this.query.sort) {
      const sortBy = (this.query.sort as string).split(',');
      this.prismaOptions.orderBy = sortBy.map((field) => {
        const desc = field.startsWith('-');
        const actualField = desc ? field.substring(1) : field;
        return { [actualField]: desc ? 'desc' : 'asc' };
      });
    } else if (this.config.defaultSort) {
      this.prismaOptions.orderBy = [
        { [this.config.defaultSort.field]: this.config.defaultSort.order },
      ];
    }
    return this;
  }

  /**
   * Select specific fields: ?fields=name,email
   */
  limitFields(): this {
    if (this.query.fields) {
      const fields = (this.query.fields as string).split(',');
      this.prismaOptions.select = fields.reduce((acc: any, field) => {
        acc[field.trim()] = true;
        return acc;
      }, {});
    }
    return this;
  }

  /**
   * Standard pagination: ?page=2&limit=20
   */
  paginate(): this {
    const page = Math.max(Number(this.query.page) || 1, 1);
    const limit = Math.max(Number(this.query.limit) || 10, 1);

    this.prismaOptions.skip = (page - 1) * limit;
    this.prismaOptions.take = limit;
    return this;
  }

  /**
   * Search across multiple fields using OR logic
   */
  search(): this {
    const searchStr = this.query.search as string;
    const fields = this.config.searchFields || [];

    if (searchStr && fields.length > 0) {
      const orConditions = fields.map((field) => ({
        [field]: { contains: searchStr, mode: 'insensitive' },
      }));

      this.prismaOptions.where = {
        ...this.prismaOptions.where,
        OR: orConditions,
      };
    }
    return this;
  }

  /**
   * Finalizes the object for Prisma.
   */
  build() {
    // Clean up empty fields to prevent Prisma errors
    const finalOptions: any = { ...this.prismaOptions };
    if (Object.keys(finalOptions.where).length === 0) delete finalOptions.where;
    if (finalOptions.orderBy.length === 0) delete finalOptions.orderBy;

    return finalOptions;
  }
}
