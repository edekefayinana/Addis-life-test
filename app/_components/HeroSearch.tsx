'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [status, setStatus] = useState('');
  const [bedrooms, setBedrooms] = useState('');

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
    <div className="w-full max-w-[1000px] rounded-full bg-white p-3 shadow-2xl">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 md:flex-row md:items-center"
      >
        <div className="relative flex-1">
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="h-12 w-full rounded-full border border-gray-200 bg-transparent px-6 text-sm font-medium text-black outline-none placeholder:text-gray-500 focus:border-gray-400"
          />
        </div>

        <div className="relative w-full md:w-[200px]">
          <select
            id="propertyType"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="h-12 w-full appearance-none rounded-full border border-gray-200 bg-transparent px-6 text-sm font-medium text-black outline-none placeholder:text-gray-500 focus:border-gray-400"
          >
            <option value="">Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="relative w-full md:w-[180px]">
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-12 w-full appearance-none rounded-full border border-gray-200 bg-transparent px-6 text-sm font-medium text-black outline-none placeholder:text-gray-500 focus:border-gray-400"
          >
            <option value="">Status</option>
            <option value="for-sale">For Sale</option>
            <option value="for-rent">For Rent</option>
            <option value="completed">Completed</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="relative w-full md:w-[180px]">
          <select
            id="bedrooms"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="h-12 w-full appearance-none rounded-full border border-gray-200 bg-transparent px-6 text-sm font-medium text-black outline-none placeholder:text-gray-500 focus:border-gray-400"
          >
            <option value="">Bedrooms</option>
            <option value="studio">Studio</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4-plus">4+</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-full bg-[#002B3D] px-8 text-base font-semibold text-white hover:bg-[#002B3D]/90 md:w-auto"
        >
          Search
        </Button>
      </form>
    </div>
  );
}
