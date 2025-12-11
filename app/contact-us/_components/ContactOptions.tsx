import React from 'react';
import ContactForm from './ContactForm';
import LocationMap from './LocationMap';
import ContactAddresses from './ContactAdresses';

export default function ContactOptions() {
  return (
    <section className="">
      <div className="flex w-full gap-12 max-w-[1212px] mx-auto">
        <div className="flex w-full max-w-1/2">
          <LocationMap />
        </div>
        <div className="flex w-1/2">
          <ContactForm />
        </div>
      </div>
      <ContactAddresses />
    </section>
  );
}
