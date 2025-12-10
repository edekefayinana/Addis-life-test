import React from 'react';

import Image from 'next/image';

interface Listing {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
}

const LISTINGS: Listing[] = [
  {
    id: 1,
    title: 'Finding Your Ideal Property: What Matters Most?',
    description:
      'Learn how to choose the perfect home by focus -ing on location, budget, and lifestyle needs',
    date: 'Jan 28, 2025',
    image: '/images/property-1.png',
  },
  {
    id: 2,
    title: 'Investing in Addis Ababa Real Estate: Tips for Success',
    description:
      'Discover strategies to make smart property investments and maximize returns.',
    date: 'Jan 28, 2025',
    image: '/images/property-2.png',
  },
  {
    id: 3,
    title: 'Top Neighborhoods to Watch This Year',
    description:
      'Explore the hottest areas in the city for living, investing, and future growth.',
    date: 'Jan 28, 2025',
    image: '/images/property-3.png',
  },
];

export default function LatestListings() {
  return (
    <section className="flex flex-col gap-8 max-w-[1212px] mx-auto py-20">
      <h1 className="text-xl md:text-[32px] leading-[150%] font-semibold text-[#0A0A0A]">
        Other Latest Listings
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LISTINGS.map((listing) => (
          <div
            key={listing.id}
            className="flex flex-col border p-2 rounded-[24px] overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            <div className="relative w-full h-[240px]">
              <Image
                src={listing.image}
                alt={listing.title}
                fill
                className="object-cover rounded-[24px]"
              />
            </div>
            <div className="flex flex-col p-3 gap-4 flex-grow">
              <div className="flex flex-col gap-3 flex-grow">
                <h2 className="text-xl font-semibold leading-[130%]">
                  {listing.title}
                </h2>
                <p className="text-base leading-[150%]">
                  {listing.description}
                </p>
                <p className="text-sm leading-[150%] text-description">
                  {listing.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
