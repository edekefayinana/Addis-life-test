import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 justify-center">
      <Image
        src="/logo.png"
        alt="Addis Life Logo"
        width={100}
        height={30}
        className="object-contain"
        priority
      />
    </Link>
  );
}
