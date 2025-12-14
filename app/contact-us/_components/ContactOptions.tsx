import React from 'react';
import ContactForm from './ContactForm';
import LocationMap from './LocationMap';
import ContactAddresses from './ContactAdresses';

export default function ContactOptions() {
  return (
    <section className="p-4 lg:p-0">
      <div className="flex flex-col lg:flex-row-reverse w-full gap-12 max-w-[1212px] mx-auto">
        <div className="flex lg:w-1/2">
          <ContactForm />
        </div>
        <div className="flex w-full lg:max-w-1/2">
          <LocationMap />
        </div>
      </div>
      <ContactAddresses />
    </section>
  );
}
