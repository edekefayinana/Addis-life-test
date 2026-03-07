import Link from 'next/link';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact Us', href: '/contact-us' },
];

export default function ResponsiveNavbar({ active }: { active?: string }) {
  return (
    <nav className="w-full flex justify-center items-center py-4 bg-white">
      <ul className="flex flex-wrap gap-6 md:gap-12 lg:gap-20 xl:gap-32">
        {navItems.map((item) => (
          <li key={item.label} className="relative">
            <Link
              href={item.href}
              className={
                'text-lg md:text-xl lg:text-2xl font-semibold text-black transition-colors hover:text-blue-700 px-2 md:px-4 lg:px-6' +
                (active === item.label
                  ? ' underline underline-offset-[8px] decoration-2 decoration-gray-200'
                  : '')
              }
            >
              {item.label}
            </Link>
            {/* Custom underline for active item */}
            {active === item.label && (
              <span className="block absolute left-0 right-0 bottom-0 h-[3px] bg-gray-200 rounded" />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
