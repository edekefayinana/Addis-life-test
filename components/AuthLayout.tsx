import Image from 'next/image';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  rightPanelContent: {
    title: string;
    description: string;
  };
}

export function AuthLayout({ children, rightPanelContent }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form Content */}
      <div className="flex w-full items-center justify-center bg-gray-50 px-4 py-8 lg:w-5/8">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right Panel - Promotional Content */}
      <div className="relative hidden lg:flex lg:w-3/8">
        <div className="relative w-full">
          <Image
            src="/side-img.jpg"
            alt="Cityscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-12 left-12 right-12">
            <div className="rounded-2xl bg-white p-8 shadow-2xl">
              <h2 className="mb-4 font-sans text-3xl font-bold text-gray-900 text-balance">
                {rightPanelContent.title}
              </h2>
              <p className="text-base leading-relaxed text-gray-700 text-pretty">
                {rightPanelContent.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
