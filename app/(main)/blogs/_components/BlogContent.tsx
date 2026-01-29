'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { PrismicRichText, JSXMapSerializer } from '@prismicio/react';
import TableOfContents from './TableOfContents';
import { RichTextField } from '@prismicio/client';
import Image from 'next/image';

interface BlogContentProps {
  content: RichTextField;
  title: string;
}

// Define specific node types for Prismic Rich Text
interface RTNode {
  type: string;
  text?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  spans?: any[];
  url?: string;
  alt?: string | null;
  dimensions?: { width: number; height: number };
}

interface HeadingNode extends RTNode {
  type: 'heading1' | 'heading2' | 'heading3';
  text: string;
}

interface ImageNode extends RTNode {
  type: 'image';
  url: string;
  alt?: string;
  dimensions?: { width: number; height: number };
}

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export default function BlogContent({ content, title }: BlogContentProps) {
  const [activeSection, setActiveSection] = useState('');
  const tocRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Extract headings for TOC
  const sections = useMemo(() => {
    if (!content) return [];
    return content
      .filter((node: RTNode): node is HeadingNode =>
        ['heading1', 'heading2', 'heading3'].includes(node.type)
      )
      .map((node) => {
        const heading = node as HeadingNode;
        return {
          id: slugify(heading.text),
          title: heading.text,
        };
      });
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = '';
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust offset as needed
          if (rect.top <= 150 && rect.bottom >= 100) {
            currentSection = section.id;
          }
        }
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleLinkClick = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const yOffset = -100; // header offset
    const y =
      element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const components: JSXMapSerializer = {
    heading1: ({ children, node }) => (
      <h1
        id={slugify((node as HeadingNode).text || '')}
        className="text-3xl lg:text-4xl font-semibold font-instrument mt-7 mb-2"
      >
        {children}
      </h1>
    ),
    heading2: ({ children, node }) => (
      <h2
        id={slugify((node as HeadingNode).text || '')}
        className="text-2xl lg:text-3xl font-semibold font-instrument mt-7 mb-2"
      >
        {children}
      </h2>
    ),
    heading3: ({ children, node }) => (
      <h3
        id={slugify((node as HeadingNode).text || '')}
        className="text-xl lg:text-2xl font-semibold font-instrument mt-6 mb-3"
      >
        {children}
      </h3>
    ),
    paragraph: ({ children }) => (
      <p className="mb-4 leading-relaxed text-lg text-description">
        {children}
      </p>
    ),
    list: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
    ),
    oList: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
    ),
    image: ({ node }) => (
      <div className="relative w-full aspect-video my-8 rounded-xl overflow-hidden">
        <Image
          src={(node as ImageNode).url || ''}
          alt={(node as ImageNode).alt || ''}
          fill
          className="object-cover"
        />
      </div>
    ),
  };

  return (
    <div className="relative mx-auto w-full px-4 xl:px-0 max-w-[1082px] flex flex-col lg:flex-row gap-16 pt-4 pb-20">
      {sections.length > 0 && (
        <TableOfContents
          sections={sections}
          activeSection={activeSection}
          onLinkClick={handleLinkClick}
          tocRefs={tocRefs}
          title={title}
        />
      )}

      <div className="flex flex-col max-w-[807px] mx-auto w-full">
        <div className="prose prose-lg max-w-none">
          <PrismicRichText field={content} components={components} />
        </div>
      </div>
    </div>
  );
}
