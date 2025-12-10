'use client';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

interface TableOfContentsProps {
  sections: { id: string; title: string }[];
  activeSection: string;
  onLinkClick: (id: string) => void;
  tocRefs: React.RefObject<{ [key: string]: HTMLElement | null }>;
}

export default function TableOfContents({
  sections,
  activeSection,
  onLinkClick,
  tocRefs,
}: TableOfContentsProps) {
  return (
    <div className="hidden lg:block w-[271px] min-h-screen h-auto">
      <div className="sticky top-20 flex flex-col gap-10 h-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
        <h3 className="text-xl font-semibold">Table of Contents</h3>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-secondary"></div>

          <ul className="space-y-4 relative ml-5">
            {sections.map((section) => (
              <li
                key={section.id}
                ref={(el) => {
                  tocRefs.current[section.id] = el;
                }}
                className="relative"
              >
                <button
                  onClick={() => onLinkClick(section.id)}
                  className={`block text-left leading-[150%] text-base text-description relative transition-all duration-300 ease-in-out ${
                    activeSection === section.id
                      ? 'text-black font-bold'
                      : 'text-description hover:cursor-pointer hover:text-black'
                  }`}
                >
                  {activeSection === section.id && (
                    <div className="absolute left-0 top-0 bottom-0 rounded-lg -ml-5 w-[3px] bg-primary transition-all duration-300 ease-in-out"></div>
                  )}
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <h3 className="text-xl font-semibold">Share Article</h3>
        <div className="flex gap-3">
          <Link
            href="/"
            className="size-10 flex items-center justify-center rounded-full p-2.5 bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045]"
          >
            <Instagram />
          </Link>
          <Link
            href="/"
            className="size-10 flex items-center justify-center rounded-full p-2.5 bg-[#0066C8] text-white"
          >
            <Linkedin />
          </Link>
          <Link
            href="/"
            className="size-10 flex items-center justify-center rounded-full p-2.5 bg-[#1877F2] text-white"
          >
            <Facebook />
          </Link>
          <Link
            href="/"
            className="size-10 flex items-center justify-center rounded-full p-2.5 bg-black text-white"
          >
            <Twitter />
          </Link>
        </div>
      </div>
    </div>
  );
}
