'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Calendar, Building2 } from 'lucide-react';

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
  createdAt: Date;
  project: {
    id: string;
    name: string;
  };
  media: ProgressMedia[];
}

interface Props {
  id: string;
}

export default function ProgressDetail({ id }: Props) {
  const router = useRouter();
  const [progress, setProgress] = useState<SiteProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await fetch(`/api/site-progress/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProgress(data);
        } else {
          notFound();
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Back Button Skeleton */}
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse mb-8"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery Skeleton */}
          <div>
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="space-y-6">
            <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!progress) {
    notFound();
  }

  const images = progress.media.filter((m) => m.type === 'IMAGE');
  const videos = progress.media.filter((m) => m.type === 'VIDEO');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Progress Updates</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          {images.length > 0 ? (
            <>
              {/* Main Image */}
              <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden mb-4">
                <Image
                  src={images[selectedImage].url}
                  alt={images[selectedImage].caption || progress.title}
                  fill
                  className="object-contain"
                />
                {images[selectedImage].caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 text-sm">
                    {images[selectedImage].caption}
                  </div>
                )}
              </div>

              {/* Thumbnail Grid */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 rounded overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-blue-600 ring-2 ring-blue-200'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.caption || `Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
              No images available
            </div>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Videos</h3>
              {videos.map((video) => (
                <div key={video.id} className="rounded-lg overflow-hidden">
                  <video src={video.url} controls className="w-full" />
                  {video.caption && (
                    <p className="text-sm text-gray-600 mt-2">
                      {video.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Status Badge */}
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                progress.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-800'
                  : progress.status === 'IN_PROGRESS'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {progress.status.replace('_', ' ')}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {progress.title}
          </h1>

          {/* Project Info */}
          <div className="flex items-center gap-2 text-blue-600 mb-6">
            <Building2 className="w-5 h-5" />
            <span className="font-medium">{progress.project.name}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-gray-600 mb-6">
            <Calendar className="w-5 h-5" />
            <span>
              Published on{' '}
              {new Date(progress.publishedAt!).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          {/* Description */}
          {progress.description && (
            <div className="prose prose-gray max-w-none">
              <h2 className="text-xl font-semibold mb-3">About this Update</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {progress.description}
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Media</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progress.media.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(progress.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
