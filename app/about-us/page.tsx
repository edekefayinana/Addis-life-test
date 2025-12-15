import MissionVision from './_components/MissionVision';
import CoreValues from './_components/CoreValues';
import { Testimonials } from '../_components/Testimonials';
import Faq from '../contact-us/_components/Faq';
import { AgentBanner } from '../_components/AgentBanner';
import Intro from './_components/Intro';
import Home from './_components/Home';

export default function page() {
  return (
    <main className="m-4 lg:m-0">
      <Home />
      <Intro />
      <MissionVision />
      <CoreValues />
      <Testimonials />
      <Faq />
      <AgentBanner />
    </main>
  );
}
