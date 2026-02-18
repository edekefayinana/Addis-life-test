import Image from 'next/image';

const projects = [
  {
    title: 'Africa Union One',
    subtitle: '14 properties',
    imageUrl: '/AU2 site Building Renders/1_1 - Photo.jpg',
    className: 'md:col-span-2',
  },
  {
    title: 'Africa Union Two',
    subtitle: '14 properties',
    imageUrl: '/AU2 site Building Renders/1_2 - Photo.jpg',
    className: 'md:col-span-1',
  },
  {
    title: 'Vatican Site',
    subtitle: '14 properties',
    imageUrl: '/AU2 site Building Renders/1_3 - Photo.jpg',
    className: 'md:col-span-1',
  },
  {
    title: 'Bulgaria Site',
    subtitle: '14 properties',
    imageUrl: '/AU2 site Building Renders/1_4 - Photo.jpg',
    className: 'md:col-span-1',
  },
  {
    title: 'Upcoming Around East of Addis Ababa',
    // subtitle: '14 properties',
    imageUrl: '/AU2 site Building Renders/1_5 - Photo.jpg',
    className: 'md:col-span-2',
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

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 auto-rows-[300px]">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-lg ${project.className || ''}`}
          >
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
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
