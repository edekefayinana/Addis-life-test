'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProgressGallery from './ProgressGallery';

interface ProgressMedia {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  thumbnailUrl: string | null;
  caption: string | null;
  order: number;
}

interface SiteProgress {
  id: string;
  title: string;
  description: string | null;
  status: string;
  publishedAt: Date | null;
  project: { name: string };
  media: ProgressMedia[];
}

interface Props {
  progress: SiteProgress;
}

export default function ProgressCard({ progress }: Props) {
  const router = useRouter();
  const [showGallery, setShowGallery] = useState(false);
  const coverImage = progress.media.find((m) => m.type === 'IMAGE');

  const handleCardClick = () => {
    router.push(`/current-progress/${progress.id}`);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowGallery(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-gray-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
      >
        {/* Cover Image */}
        <div
          className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer overflow-hidden"
          onClick={handleImageClick}
        >
          {coverImage ? (
            <>
              <Image
                src={coverImage.url}
                alt={progress.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg
                className="w-16 h-16 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm">No image available</span>
            </div>
          )}
          {progress.media.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
              +{progress.media.length - 1} more
            </div>
          )}

          {/* Status Badge on Image */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg ${
                progress.status === 'COMPLETED'
                  ? 'bg-emerald-500/90 text-white'
                  : progress.status === 'IN_PROGRESS'
                    ? 'bg-amber-500/90 text-white'
                    : 'bg-blue-500/90 text-white'
              }`}
            >
              {progress.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Project Name */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-dark"></div>
            <span className="text-xs text-brand-dark font-semibold uppercase tracking-wider">
              {progress.project.name}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-brand-dark transition-colors line-clamp-2 leading-snug">
            {progress.title}
          </h3>

          {/* Description */}
          {progress.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
              {progress.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs font-medium">
                {new Date(progress.publishedAt!).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center gap-1 text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-semibold">View Details</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {showGallery && (
        <ProgressGallery
          media={progress.media}
          title={progress.title}
          onClose={() => setShowGallery(false)}
        />
      )}
    </>
  );
}
