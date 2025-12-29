import React from 'react';

export default function ThinkAboutGrowth() {
  return (
    <section
      id="think-about-growth"
      className="flex flex-col text-md md:text-lg leading-[150%] font-normal gap-4 md:gap-5"
    >
      <p className="text-xl md:text-2xl leading-[150%] font-semibold">
        Think About Growth and Future Potential
      </p>
      <p className="text-description">
        A neighborhood that looks quiet today may become a major investment zone
        tomorrow. Cities expand over time, and areas surrounded by ongoing
        infrastructure projects, road improvements, or commercial development
        have higher potential for appreciation.
      </p>

      <p className="text-description">Future development often increases:</p>
      <ul className="list-disc text-description pl-6 -mt-2">
        <li>property value</li>
        <li>rental demand</li>
        <li>commercial interest</li>
      </ul>
      <p className="text-description">
        If you intend to invest, focusing on future potential rather than
        current appearance can lead to stronger returns and meaningful financial
        growth.
      </p>
    </section>
  );
}
