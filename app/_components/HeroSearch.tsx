'use client';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

export function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [status, setStatus] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showFilters) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (filtersRef.current?.contains(target)) return;
      setShowFilters(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showFilters]);

  const searchParams = useMemo(
    () =>
      new URLSearchParams({
        ...(location ? { location } : {}),
        ...(propertyType ? { type: propertyType } : {}),
        ...(status ? { status } : {}),
        ...(bedrooms ? { bedrooms } : {}),
      }),
    [bedrooms, location, propertyType, status]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const paramsString = searchParams.toString();
    const href = paramsString ? `/properties?${paramsString}` : '/properties';
    router.push(href);
  };

  return (
    <div className="w-full max-w-[900px]">
      <form onSubmit={handleSubmit} className="relative">
        {/* Desktop: Single integrated pill with all elements */}
        <div className="hidden md:flex items-center gap-0 rounded-full border border-gray-200 bg-white px-3 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          {/* Search Input Section */}
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3 ">
            <Search className="h-5 w-5 shrink-0 text-gray-500" aria-hidden />
            <input
              id="altLocation"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search location, area, or property type..."
              className="w-full text-sm font-normal text-gray-700 outline-none placeholder:text-gray-500 bg-transparent"
            />
          </div>

          {/* Filter Button Section */}
          <div
            className="relative border-l border-gray-200 pl-3 pr-2"
            ref={filtersRef}
          >
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              aria-expanded={showFilters}
              aria-controls="hero-filters"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Filter
            </button>

            {showFilters && (
              <div
                id="hero-filters"
                className="absolute right-0 bottom-full z-50 mb-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
              >
                <div className="space-y-3 text-sm">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-600">
                      Property type
                    </span>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-800 outline-none focus:border-brand-dark"
                    >
                      <option value="">Any</option>
                      <option value="rent">Rent</option>
                      <option value="sale">Sale</option>
                    </select>
                  </label>

                  {/* <label className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-600">
                      Status
                    </span>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-800 outline-none focus:border-brand-dark"
                    >
                      <option value="">Any</option>
                      <option value="for-sale">For Sale</option>
                      <option value="for-rent">For Rent</option>
                      <option value="completed">Completed</option>
                    </select>
                  </label> */}

                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-600">
                      Bedrooms
                    </span>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-800 outline-none focus:border-brand-dark"
                    >
                      <option value="">Any</option>
                      <option value="studio">Studio</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4-plus">4+</option>
                    </select>
                  </label>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      className="text-xs font-semibold text-gray-600 hover:text-gray-800"
                      onClick={() => {
                        setPropertyType('');
                        setStatus('');
                        setBedrooms('');
                      }}
                    >
                      Reset
                    </button>
                    <Button
                      type="button"
                      size="sm"
                      className="rounded-full bg-brand-dark px-4 text-white hover:bg-brand-dark/90"
                      onClick={() => setShowFilters(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Button Section */}
          <button
            type="submit"
            className="ml-2 rounded-full bg-brand-dark px-6 py-3.5 text-sm font-medium text-white transition hover:bg-brand-dark/90"
            aria-label="Search"
          >
            Search
          </button>
        </div>

        {/* Mobile: Input with button at the end */}
        <div className="relative flex md:hidden items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border p-1 border-gray-200 bg-white px-4 py-3 pr-12 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            <Search className="h-5 w-5 shrink-0 text-gray-500" aria-hidden />
            <input
              id="altLocationMobile"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search location, area..."
              className="w-full text-sm font-normal text-gray-700 outline-none placeholder:text-gray-500 bg-transparent "
            />
          </div>

          <button
            type="submit"
            className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition hover:bg-brand-dark/90 z-10"
            aria-label="Search"
          >
            <Search className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </form>
    </div>
  );
}
