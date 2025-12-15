'use client';

import type { SVGProps } from 'react';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const sectionTitleClass = 'text-footer-title text-base mb-6';
const linkClass = 'hover:text-white transition-colors';
const listClass = 'space-y-4 text-base font-normal text-footer-text';
const socialLinkClass = 'hover:text-white transition-colors';

const services = [
  'African Union 1 Site',
  'Vatican City Site',
  'Summit Real Estate Site',
  'CMC Residential Site',
  'African Union 2 Site',
  'Megenagna Square Site',
];

const links = [
  { href: '/about', label: 'About Us' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/projects', label: 'Projects' },
  { href: '/properties', label: 'Properties' },
  { href: '#', label: 'Privacy Policy' },
  { href: '#', label: 'Terms & Conditions' },
  { href: '#', label: 'Disclaimer' },
];

const socialLinks = [
  { href: '#', Icon: Facebook },
  { href: '#', Icon: Instagram },
  { href: '#', Icon: Linkedin },
  { href: '#', Icon: XIcon },
];

const contactItems = [
  { Icon: Mail, label: 'info@Example1.com', multiline: false },
  { Icon: Phone, label: '0911201096', multiline: false },
  {
    Icon: MapPin,
    label: 'Kirkos ,in front of Africa union, AA, Ethiopia',
    multiline: true,
  },
];

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}

function FooterList({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className={sectionTitleClass}>{title}</h3>
      <ul className={listClass}>
        {items.map(({ href, label }) => (
          <li key={`${title}-${label}`}>
            <Link href={href} className={linkClass}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="flex items-center gap-6">
      <span className="text-base font-medium">Follow Us</span>
      <div className="flex gap-4">
        {socialLinks.map(({ href, Icon }, index) => (
          <Link
            key={`${href}-${index}`}
            href={href}
            className={socialLinkClass}
          >
            <Icon className="h-5 w-5" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function ContactList() {
  return (
    <div>
      <h3 className={sectionTitleClass}>Contact</h3>
      <ul className="space-y-6 text-base font-normal text-footer-text">
        {contactItems.map(({ Icon, label, multiline }) => (
          <li
            key={label}
            className={`flex items-${multiline ? 'start' : 'center'} gap-3`}
          >
            <Icon
              className={`h-5 w-5 text-footer-text shrink-0 ${multiline ? 'mt-0.5' : ''}`}
            />
            <span className={multiline ? 'leading-tight' : ''}>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SubscribeForm() {
  return (
    <div className="space-y-4">
      <div className="flex items-center border-b border-footer-border/10 pb-2">
        <input
          type="email"
          placeholder="Your e-mail"
          className="bg-transparent border-none text-sm w-full focus:ring-0 placeholder:text-footer-title focus:outline-none"
        />
        <button className="bg-footer-button hover:bg-footer-button-hover text-white text-xs px-6 py-3 rounded-full transition-colors">
          Subscribe
        </button>
      </div>
      <p className="text-footer-white text-base font-normal">
        Subscribe to our newsletter to receive our weekly feed.
      </p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-footer-bg text-footer-text pt-16 pb-8 font-instrument rounded-lg lg:px-20">
      <div className="container mx-auto px-4 md:px-8">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16 border-b border-footer-border/10 pb-12">
          <Link href="/" className="mb-6 md:mb-0">
            <Image
              src="/logo.svg"
              alt="Addis Life Real Estate"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          <SocialLinks />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16 py-4">
          {/* Column 1: Description & Subscribe */}
          <div className="space-y-8 lg:col-span-2">
            <p className="text-footer-white text-base leading-relaxed max-w-xs">
              Addis Life Real Estate provides modern, reliable housing in Addis
              Ababa with transparency, quality construction, and a seamless
              experience.
            </p>

            <SubscribeForm />
          </div>

          <FooterList
            title="Services"
            items={services.map((label) => ({ href: '#', label }))}
          />

          <FooterList title="Links" items={links} />

          <ContactList />
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-footer-border/10 pt-12 pb-4 flex flex-col md:flex-row justify-center items-center relative">
          <p className="text-footer-white text-base text-center">
            Copyright &copy; 2025. Addis Life Real Estate
          </p>
        </div>
      </div>
    </footer>
  );
}
