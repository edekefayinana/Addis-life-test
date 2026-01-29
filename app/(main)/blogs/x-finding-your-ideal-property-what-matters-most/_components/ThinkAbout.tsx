import React from 'react';

export default function ThinkAbout() {
  return (
    <section
      id="think-about"
      className="flex flex-col text-md md:text-lg leading-[150%] font-normal gap-4 md:gap-5"
    >
      <p className="text-xl md:text-2xl leading-[150%] font-semibold">
        Think About Your Lifestyle Needs
      </p>
      <p className="text-description">
        Before anything else, think about how you live today and how you expect
        to live in the future. Do you want to be close to entertainment options,
        or do you prefer quieter neighborhoods away from the busy city? Are you
        looking for a family-friendly environment, or a modern apartment close
        to business centers?
      </p>
      <p className="text-description">Lifestyle considerations influence:</p>
      <ul className="list-disc text-description pl-6 -mt-2">
        <li>the type of property that suits you</li>
        <li>the community you’ll become part of</li>
        <li>your daily routines and comfort</li>
      </ul>
      <p className="text-description">
        Buyers with children may prioritize safety, green spaces, and schools,
        while young professionals might focus on convenience and accessibility.
        Understanding your lifestyle prevents you from choosing a property that
        feels limiting or out of place as time passes.
      </p>
    </section>
  );
}
