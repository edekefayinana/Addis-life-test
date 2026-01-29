import React from 'react';

export default function ResearchDeveloper() {
  return (
    <section
      id="research-developer"
      className="flex flex-col text-md md:text-lg leading-[150%] font-normal gap-4 md:gap-5"
    >
      <p className="text-xl md:text-2xl leading-[150%] font-semibold">
        Research the Developer
      </p>
      <p className="text-description">
        In markets where construction is growing rapidly, choosing a trusted
        developer becomes essential. A reliable developer not only offers
        quality construction but also follows legal requirements, transparent
        documentation, and responsible project management.
      </p>
      <p className="text-description">Before deciding:</p>
      <ul className="list-disc text-description pl-6 -mt-2">
        <li>review previous projects</li>
        <li>look for customer testimonials</li>
        <li>research their delivery track record</li>
      </ul>

      <p className="text-description">
        A strong developer reputation reduces investment risks and gives you
        peace of mind knowing your future home or investment is in trustworthy
        hands.
      </p>
    </section>
  );
}
