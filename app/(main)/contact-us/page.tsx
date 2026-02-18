import { AgentBanner } from '../../_components/AgentBanner';
import ContactOptions from './_components/ContactOptions';
import Faq from './_components/Faq';
import Home from './_components/Home';

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
