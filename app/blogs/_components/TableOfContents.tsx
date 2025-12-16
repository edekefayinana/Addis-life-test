'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Facebook,
  Linkedin,
  Twitter,
  Link as LinkIcon,
  Check,
} from 'lucide-react';

interface TableOfContentsProps {
  sections: { id: string; title: string }[];
  activeSection: string;
  onLinkClick: (id: string) => void;
  tocRefs: React.RefObject<{ [key: string]: HTMLElement | null }>;
  title: string;
}

export default function TableOfContents({
  sections,
  activeSection,
  onLinkClick,
  tocRefs,
  title,
}: TableOfContentsProps) {
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="hidden lg:block w-[271px] min-h-screen h-auto">
      <div className="sticky top-20 flex flex-col gap-10 h-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
        <h3 className="text-xl font-semibold">Table of Contents</h3>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-black/10"></div>

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
          <button
            onClick={handleCopyLink}
            className="size-10 flex items-center justify-center rounded-full p-2.5 bg-gray-600 text-white transition-colors hover:bg-gray-700"
            title="Copy Link"
          >
            {copied ? (
              <Check className="text-white" />
            ) : (
              <LinkIcon className="text-white" />
            )}
          </button>
          <Link
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              currentUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="size-10 flex items-center justify-center rounded-full p-2.5 bg-[#0066C8] text-white"
          >
            <Linkedin className="text-white" />
          </Link>
          <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              currentUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="size-10 flex items-center justify-center rounded-full p-2.5 bg-[#1877F2] text-white"
          >
            <Facebook className="text-white" />
          </Link>
          <Link
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              title
            )}&url=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="size-10 flex items-center justify-center rounded-full p-2.5 bg-black text-white"
          >
            <Twitter className="text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
}
