import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-muted/40 border-t-primary/80 motion-safe:animate-spin" />
          <Image
            src="/logo.svg"
            alt="Addis Life"
            width={88}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </div>
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
