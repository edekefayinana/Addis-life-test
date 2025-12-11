import React from 'react';
import Home from './_components/Home';
import ContactOptions from './_components/ContactOptions';
import Faq from './_components/Faq';

export default function page() {
  return (
    <main>
      <Home />
      <ContactOptions />
      <Faq />
    </main>
  );
}
