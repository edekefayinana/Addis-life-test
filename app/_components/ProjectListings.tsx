import Image from 'next/image';

const projects = [
  {
    title: 'African Union 1 Site',
    subtitle: '14 properties',
    imageUrl: '/pro-1.jpg',
    className: 'md:col-span-2',
  },
  {
    title: 'Summit Real Estate Site',
    subtitle: '14 properties',
    imageUrl: '/pro-6.jpg',
    className: 'md:col-span-1',
  },
  {
    title: 'African Union 2 Site',
    subtitle: '14 properties',
    imageUrl: '/pro-3.jpg',
    className: 'md:col-span-1',
  },
  {
    title: 'Vatican City 2 Site',
    subtitle: '14 properties',
    imageUrl: '/pro-2.jpg',
    className: 'md:col-span-1',
  },
  {
    title: 'CMC Residential Site',
    subtitle: '14 properties',
    imageUrl: '/pro-4.jpg',
    className: 'md:col-span-2',
  },
  {
    title: 'Vatican City Site',
    subtitle: '14 properties',
    imageUrl: '/pro-5.jpg',
    className: 'md:col-span-1',
  },
];

export function ProjectListings() {
  return (
    <section className="container mx-auto py-20 px-4 lg:px-20">
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-bold md:text-5xl text-foreground">
          Our Project Listings
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Explore our completed projects, ongoing developments, and prime sites
          to see our work firsthand, discover investment opportunities, and
          envision your future home.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[300px]">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-lg ${project.className || ''}`}
          >
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/0 to-black/0" />

            {/* Content */}
            <div className="absolute left-6 top-6">
              <h3 className="text-xl font-bold text-white mb-1">
                {project.title}
              </h3>
              <p className="text-sm font-medium text-white/80">
                {project.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
