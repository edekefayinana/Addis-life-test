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
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
      >
        {/* Cover Image */}
        <div
          className="relative h-48 bg-gray-200 cursor-pointer"
          onClick={handleImageClick}
        >
          {coverImage ? (
            <Image
              src={coverImage.url}
              alt={progress.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No image
            </div>
          )}
          {progress.media.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
              +{progress.media.length - 1} more
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-sm text-brand-dark font-medium mb-1">
            {progress.project.name}
          </div>
          <h3 className="text-xl font-semibold mb-2 hover:text-brand-dark transition-colors">
            {progress.title}
          </h3>
          {progress.description && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
              {progress.description}
            </p>
          )}
          <div className="flex items-center justify-between text-sm">
            <span
              className={`px-2 py-1 rounded ${
                progress.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {progress.status.replace('_', ' ')}
            </span>
            <span className="text-gray-500">
              {new Date(progress.publishedAt!).toLocaleDateString()}
            </span>
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
