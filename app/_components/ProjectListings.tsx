'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Download } from 'lucide-react';

const projects = [
  {
    title: 'Africa Union One',
    imageUrl: '/AU2 site Building Renders/1_1 - Photo.jpg',
    className: 'md:col-span-2 md:row-span-2',
    searchQuery: 'African',
    pdfUrl: '/pdfs/africa-union-one.pdf',
  },
  {
    title: 'Africa Union Two',
    imageUrl: '/AU2 site Building Renders/1_4 - Photo.jpg',
    className: 'md:col-span-2 md:row-span-1',
    searchQuery: 'African',
    pdfUrl: '/pdfs/africa-union-two.pdf',
  },
  {
    title: 'Bulgaria Site',
    imageUrl: '/bulgaria_Addis_life/Scene_1.png',
    className: 'md:col-span-1 md:row-span-2',
    searchQuery: 'Bulgaria',
    pdfUrl: '/pdfs/bulgaria-site.pdf',
  },
  {
    title: 'Vatican Site',
    imageUrl: '/AU2 site Building Renders/1_2 - Photo.jpg',
    className: 'md:col-span-1 md:row-span-2',
    searchQuery: 'Vatican',
    pdfUrl: '/pdfs/vatican-site.pdf',
  },
  {
    title: 'Upcoming Around East of Addis Ababa',
    imageUrl: '/upcoming.jpg',
    className: 'md:col-span-2 md:row-span-1',
    searchQuery: 'East',
    pdfUrl: '/pdfs/east-addis-ababa.pdf',
  },
];

export function ProjectListings() {
  return (
    <section className="container mx-auto py-20 px-4 lg:px-8">
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-semibold md:text-5xl text-foreground font-instrument">
          Our Project Listings
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground font-instrument">
          Explore our completed projects, ongoing developments, and prime sites
          to see our work firsthand, discover investment opportunities, and
          envision your future home.
        </p>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-4 md:auto-rows-[200px]">
        {projects.map((project, idx) => {
          const searchUrl = `/properties?search=${encodeURIComponent(project.searchQuery)}&page=1`;

          return (
            <Link
              key={idx}
              href={searchUrl}
              className={`group relative overflow-hidden rounded-lg min-h-[250px] md:min-h-0 cursor-pointer ${project.className || ''}`}
            >
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/30 group-hover:from-black/50 group-hover:to-black/40 transition-colors duration-300" />

              {/* Content */}
              <div className="absolute left-6 top-6 z-10">
                <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg group-hover:underline">
                  {project.title}
                </h3>
                <p className="text-sm text-white/90 drop-shadow-md">
                  View Properties →
                </p>
              </div>

              {/* Download PDF Button */}
              <a
                href={project.pdfUrl}
                download
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-6 right-6 z-10 flex items-center gap-2 bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
                aria-label={`Download ${project.title} PDF`}
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Download PDF</span>
              </a>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
