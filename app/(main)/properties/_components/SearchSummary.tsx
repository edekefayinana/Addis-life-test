export type SearchSummaryProps = {
  total: number;
  visible: number;
  location?: string;
  type?: string;
  bedrooms?: string;
  price?: string;
};

export function SearchSummary({
  total,
  visible,
  location,
  type,
  bedrooms,
  price,
}: SearchSummaryProps) {
  const hasFilters = location || type || bedrooms || price;
  const pills = [
    location ? { label: 'Location', value: location } : null,
    type ? { label: 'Type', value: type } : null,
    bedrooms ? { label: 'Bedrooms', value: bedrooms } : null,
    price ? { label: 'Price', value: priceLabel(price) } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card/60 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Properties for Sale In Addis Ababa
          </h1>
          <p className="text-sm text-muted-foreground">Search results</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing{' '}
          <span className="font-semibold text-foreground">{visible}</span> of{' '}
          <span className="font-semibold text-foreground">{total}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {hasFilters
          ? 'Listings matching your current filters.'
          : 'Browse all available properties or refine by filters above.'}
      </p>

      {hasFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {pills.map((pill) => (
            <span
              key={`${pill.label}-${pill.value}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700"
            >
              <span className="text-gray-500">{pill.label}:</span>
              <span className="font-medium text-gray-800">{pill.value}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function priceLabel(value: string) {
  switch (value) {
    case 'lt-300k':
      return '$0 - $300k';
    case '300-500k':
      return '$300k - $500k';
    case 'gt-500k':
      return '$500k+';
    case 'rent-low':
      return 'Rent: up to $2k/mo';
    case 'rent-high':
      return 'Rent: $2k+/mo';
    default:
      return value;
  }
}
