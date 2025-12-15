import React from 'react';
import Home from './_components/Home';
import ContactOptions from './_components/ContactOptions';
import Faq from './_components/Faq';
import { AgentBanner } from '../_components/AgentBanner';

export default function page() {
  return (
    <main>
      <Home />
      <ContactOptions />
      <Faq />
      <AgentBanner />
    </main>
  );
}
