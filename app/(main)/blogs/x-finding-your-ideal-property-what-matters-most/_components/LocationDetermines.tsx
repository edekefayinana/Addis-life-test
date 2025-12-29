import Image from 'next/image';
import React from 'react';

export default function LocationDetermines() {
  return (
    <section
      id="location-determines"
      className="flex flex-col text-md md:text-lg leading-[150%] font-normal gap-4 md:gap-5"
    >
      <p className="text-xl md:text-2xl leading-[150%] font-semibold">
        Location Determines Long-Term Value
      </p>
      <p className="text-description">
        Property value is closely tied to its location. In expanding cities,
        certain districts develop faster due to infrastructure, security, or
        proximity to commercial centers. These areas tend to provide better
        appreciation over time, making them ideal for investment or future
        resale.
      </p>
      <p className="text-description">Consider:</p>
      <ul className="list-disc text-description pl-6 -mt-2">
        <li>accessibility to main roads</li>
        <li>distance from workplaces</li>
        <li>transportation availability</li>
        <li>proximity to hospitals, schools, or commercial areas</li>
      </ul>
      <p className="text-description">
        Properties with good location advantages continue to grow in demand,
        ensuring strong long-term stability whether you plan to live in the
        property or rent it out.
      </p>
      <Image
        className="w-full mt-3"
        src={'/images/blog-2.png'}
        width={1000}
        height={480}
        alt="Location Determines Long-Term Value"
      />
    </section>
  );
}
