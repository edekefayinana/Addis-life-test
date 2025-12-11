import React from 'react';

export default function BudgetPlanning() {
  return (
    <section
      id="budget-planning"
      className="flex flex-col text-md md:text-lg leading-[150%] font-normal gap-4 md:gap-5"
    >
      <p className="text-xl md:text-2xl leading-[150%] font-semibold">
        Budget Planning Protects You from Surprises
      </p>
      <p className="text-description">
        Financial planning is one of the most important steps in property
        selection. Without a clear budget, it’s easy to get carried away by
        attractive offers or visually appealing interiors. Beyond purchasing
        price, think about:
      </p>
      <ul className="list-disc text-description pl-6 -mt-2">
        <li>accessibility to main roads</li>
        <li>distance from workplaces</li>
        <li>transportation availability</li>
        <li>proximity to hospitals, schools, or commercial areas</li>
      </ul>
      <p className="text-description">
        Setting a practical budget early helps narrow down your search and gives
        you confidence when comparing different properties. A well-planned
        budget also protects your financial stability after purchasing, ensuring
        your investment remains comfortable, not stressful.
      </p>
    </section>
  );
}
