/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Project {
  id: string;
  name: string;
}

interface MediaItem {
  id?: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  thumbnailUrl?: string | null;
  caption?: string | null;
  file?: File;
}

interface Props {
  projects: Project[];
  initialData?: any;
}

export default function ProgressForm({ projects, initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    projectId: initialData?.projectId || '',
    status: initialData?.status || 'DRAFT',
    publishedAt: initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().split('T')[0]
      : '',
  });
  const [media, setMedia] = useState<MediaItem[]>(initialData?.media || []);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadedMedia: MediaItem[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload/progress-media', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          uploadedMedia.push({
            url: data.url,
            type: file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE',
            caption: '',
          });
        }
      }

      setMedia([...media, ...uploadedMedia]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    const updated = [...media];
    updated[index].caption = caption;
    setMedia(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        publishedAt: formData.publishedAt || null,
        media: media.map((m) => ({
          url: m.url,
          type: m.type,
          thumbnailUrl: m.thumbnailUrl,
          caption: m.caption,
        })),
      };

      const url = initialData
        ? `/api/site-progress/${initialData.id}`
        : '/api/site-progress';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/site-progress');
        router.refresh();
      } else {
        alert('Failed to save');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow"
    >
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Project */}
        <div>
          <label className="block text-sm font-medium mb-2">Project *</label>
          <select
            required
            value={formData.projectId}
            onChange={(e) =>
              setFormData({ ...formData, projectId: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="DRAFT">Draft</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Published Date */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Published Date (leave empty for draft)
          </label>
          <input
            type="date"
            value={formData.publishedAt}
            onChange={(e) =>
              setFormData({ ...formData, publishedAt: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Media Files</label>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {uploading && (
            <p className="text-sm text-blue-600 mt-2">Uploading...</p>
          )}
        </div>

        {/* Media Preview */}
        {media.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Uploaded Media ({media.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {media.map((item, index) => (
                <div key={index} className="border rounded-lg p-2">
                  {item.type === 'IMAGE' ? (
                    <div className="relative h-32 bg-gray-100 rounded mb-2">
                      <Image
                        src={item.url}
                        alt=""
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="h-32 bg-gray-900 rounded mb-2 flex items-center justify-center text-white">
                      VIDEO
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Caption (optional)"
                    value={item.caption || ''}
                    onChange={(e) => updateCaption(index, e.target.value)}
                    className="w-full px-2 py-1 text-sm border rounded mb-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-dark text-white px-6 py-2 rounded-lg hover:bg-brand-dark/90 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
