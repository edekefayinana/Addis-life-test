interface SearchSummaryProps {
  location?: string;
  type?: string;
  status?: string;
  bedrooms?: string;
}

export function SearchSummary({
  location,
  type,
  status,
  bedrooms,
}: SearchSummaryProps) {
  const hasFilters = location || type || status || bedrooms;

  return (
    <div className="space-y-2 rounded-xl border border-border/70 bg-card/60 p-6 shadow-sm">
      <p className="text-sm font-semibold text-primary">Properties</p>
      <h1 className="text-2xl font-semibold tracking-tight">Search results</h1>
      <p className="text-sm text-muted-foreground">
        {hasFilters
          ? 'Showing properties that match your filters.'
          : 'Use the search on the home page to find properties by location, type, status, and bedrooms.'}
      </p>

      {hasFilters && (
        <dl className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {location && (
            <div>
              <dt className="font-medium text-foreground">Location</dt>
              <dd>{location}</dd>
            </div>
          )}
          {type && (
            <div>
              <dt className="font-medium text-foreground">Property Type</dt>
              <dd>{type}</dd>
            </div>
          )}
          {status && (
            <div>
              <dt className="font-medium text-foreground">Status</dt>
              <dd>{status}</dd>
            </div>
          )}
          {bedrooms && (
            <div>
              <dt className="font-medium text-foreground">Bedrooms</dt>
              <dd>{bedrooms}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}
