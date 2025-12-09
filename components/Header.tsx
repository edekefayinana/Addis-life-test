import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/properties', label: 'Properties' },
  { href: '/about', label: 'About Us' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/contact-us', label: 'Contact US' },
];

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="relative mx-auto flex h-24 max-w-7xl items-center justify-between px-6 text-white">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Addis Life Logo"
            width={100}
            height={30}
            className="object-contain"
            priority
          />
        </Link>

        {/* Centered Navigation */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/90 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-white/90 hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-white/90"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
