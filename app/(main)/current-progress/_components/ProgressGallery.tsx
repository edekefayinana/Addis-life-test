'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProgressMedia {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  thumbnailUrl: string | null;
  caption: string | null;
}

interface Props {
  media: ProgressMedia[];
  title: string;
  onClose: () => void;
}

export default function ProgressGallery({ media, title, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMedia = media[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
      >
        ×
      </button>

      {/* Navigation */}
      {media.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 text-white text-4xl hover:text-gray-300"
          >
            ‹
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 text-white text-4xl hover:text-gray-300"
          >
            ›
          </button>
        </>
      )}

      {/* Media Display */}
      <div className="max-w-5xl max-h-[80vh] w-full mx-4">
        {currentMedia.type === 'IMAGE' ? (
          <div className="relative w-full h-[70vh]">
            <Image
              src={currentMedia.url}
              alt={currentMedia.caption || title}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <video
            src={currentMedia.url}
            controls
            className="w-full h-auto max-h-[70vh]"
          />
        )}

        {/* Caption */}
        {currentMedia.caption && (
          <div className="text-white text-center mt-4">
            {currentMedia.caption}
          </div>
        )}

        {/* Counter */}
        <div className="text-white text-center mt-2">
          {currentIndex + 1} / {media.length}
        </div>
      </div>
    </div>
  );
}
