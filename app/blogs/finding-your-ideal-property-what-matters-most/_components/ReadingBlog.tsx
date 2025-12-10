'use client';

import { useEffect, useRef, useState } from 'react';
import BlogIntroduction from './Introduction';
import ThinkAbout from './ThinkAbout';
import LocationDetermines from './LocationDetermines';
import BudgetPlanning from './BudgetPlanning';
import ResearchDeveloper from './ResearchDeveloper';
import ThinkAboutGrowth from './ThinkAboutGrowth';
import EvaluateQuality from './EvaluateQuality';
import ConsiderLifestyle from './ConsiderLifestyle';
import FinalThoughts from './FinalThoughts';

import TableOfContents from './TableOfContents';

export default function ReadingBlog() {
  const [activeSection, setActiveSection] = useState('');
  const tocRefs = useRef({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'think-about', title: 'Think About Your Lifestyle Needs' },
    { id: 'location-determines', title: 'Location Determines Long-Term Value' },
    {
      id: 'budget-planning',
      title: 'Budget Planning Protects You from Surprises',
    },
    { id: 'research-developer', title: 'Research the Developer' },
    {
      id: 'think-about-growth',
      title: 'Think About Growth and Future Potential',
    },
    { id: 'evaluate-quality', title: 'Evaluate Quality Beyond Appearance' },
    { id: 'consider-lifestyle', title: 'Consider Lifestyle Amenities' },
    { id: 'final-thoughts', title: 'Final Thoughts' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = '';
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section.id;
          }
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleLinkClick = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const yOffset = -80; // header offset
    const y =
      element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  };

  return (
    <div className="relative mx-auto w-full px-4 xl:px-0 max-w-[1162px] flex gap-16 pt-4 pb-20">
      <TableOfContents
        sections={sections}
        activeSection={activeSection}
        onLinkClick={handleLinkClick}
        tocRefs={tocRefs}
      />

      <div className="flex flex-col max-w-[827px] mx-auto gap-6 md:gap-8">
        <BlogIntroduction />
        <ThinkAbout />
        <LocationDetermines />
        <BudgetPlanning />
        <ResearchDeveloper />
        <ThinkAboutGrowth />
        <EvaluateQuality />
        <ConsiderLifestyle />
        <FinalThoughts />
      </div>
    </div>
  );
}
