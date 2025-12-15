import React from 'react';

export default function EvaluateQuality() {
  return (
    <section
      id="evaluate-quality"
      className="flex flex-col text-md md:text-lg leading-[150%] font-normal gap-4 md:gap-5"
    >
      <p className="text-xl md:text-2xl leading-[150%] font-semibold">
        Evaluate Quality Beyond Appearance
      </p>
      <p className="text-description">
        Beautiful finishes can be attractive, but true comfort comes from solid
        construction quality. Pay attention to:
      </p>
      <ul className="list-disc text-description pl-6 -mt-2">
        <li>building materials</li>
        <li>structural durability</li>
        <li>water and electrical systems</li>
        <li>ventilation</li>
        <li>natural lighting</li>
        <li>emergency and security systems</li>
      </ul>
      <p className="text-description">
        High-quality buildings reduce maintenance costs over time, ensure
        safety, and provide a better living experience. A visually appealing
        property should also be functionally dependable.
      </p>
    </section>
  );
}
