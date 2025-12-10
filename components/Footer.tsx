'use client';

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

          <div className="flex items-center gap-6">
            <span className="text-sm font-medium">Follow Us</span>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                {/* X Icon (Twitter) */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16 py-4">
          {/* Column 1: Description & Subscribe */}
          <div className="space-y-8 lg:col-span-2">
            <p className="text-footer-white text-sm leading-relaxed max-w-xs">
              Addis Life Real Estate provides modern, reliable housing in Addis
              Ababa with transparency, quality construction, and a seamless
              experience.
            </p>

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
              <p className="text-footer-white text-xs">
                Subscribe to our newsletter to receive our weekly feed.
              </p>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-footer-title text-sm font-light mb-6">
              Services
            </h3>
            <ul className="space-y-4 text-sm text-footer-text">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  African Union 1 Site
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Vatican City Site
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Summit Real Estate Site
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  CMC Residential Site
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  African Union 2 Site
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Megenagna Square Site
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Links */}
          <div>
            <h3 className="text-footer-title text-sm font-light mb-6">Links</h3>
            <ul className="space-y-4 text-sm text-footer-text">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="hover:text-white transition-colors"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-white transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="hover:text-white transition-colors"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-footer-title text-sm font-light mb-6">
              Contact
            </h3>
            <ul className="space-y-6 text-sm text-footer-text">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-footer-text shrink-0" />
                <span>info@Example1.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-footer-text shrink-0" />
                <span>0911201096</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-footer-text shrink-0 mt-0.5" />
                <span className="leading-tight">
                  Kirkos ,in front of Africa union, AA, Ethiopia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-footer-border/10 pt-12 pb-4 flex flex-col md:flex-row justify-center items-center relative">
          <p className="text-footer-title text-sm text-center">
            Copyright &copy; 2025. Addis Life Real Estate
          </p>
        </div>
      </div>
    </footer>
  );
}
